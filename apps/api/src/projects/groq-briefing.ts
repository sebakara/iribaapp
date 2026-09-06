import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('GroqBriefing');
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const TIMEOUT_MS = 15_000;
const DEFAULT_MODEL = 'openai/gpt-oss-20b';

export type OverviewSnapshot = {
  project: string;
  sprint: { name: string; goal?: string; done: number; total: number; percent: number } | null;
  status: {
    total: number;
    backlog: number;
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
  };
  attention: { urgent: number; bugs: number; unassigned: number };
  stale: { title: string; assignee: string | null; daysQuiet: number }[];
  people: { name: string; open: number }[];
  recentlyDone: { title: string; assignee: string | null }[];
  standup: { person: string; date: string; note: string }[];
};

export type GroqBriefingResult = {
  briefing: string | null;
  debug: 'ok' | 'no_key' | 'http_error' | 'empty' | 'timeout' | 'error';
};

const cache = new Map<string, { hash: string; briefing: string }>();
let missingKeyLogged = false;

const SYSTEM_PROMPT = `You write an internal project status for a CEO or engineering manager.

Write 2 short paragraphs, at most 150 words. Plain sentences only. No bullets, headings, markdown, or preamble.

Rules:
- Use only the JSON facts. Do not invent people, tickets, dates, blockers, or numbers.
- Mention the sprint only if one is present.
- You may use standup notes to explain what people are doing or waiting on, but do not add blockers that are not in the JSON.
- Prefer what needs attention over repeating every status count.
- Do not say you are an AI.`;

export async function draftGroqBriefing(
  projectId: string,
  snapshot: OverviewSnapshot,
): Promise<GroqBriefingResult> {
  const apiKey = groqApiKey();
  if (!apiKey) {
    if (!missingKeyLogged) {
      logger.warn('GROQ_API_KEY is not set; Overview will use the template briefing.');
      missingKeyLogged = true;
    }
    return { briefing: null, debug: 'no_key' };
  }

  const hash = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  const cached = cache.get(projectId);
  if (cached?.hash === hash) return { briefing: cached.briefing, debug: 'ok' };

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_completion_tokens: 512,
        reasoning_effort: 'low',
        include_reasoning: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(snapshot) },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      logger.warn(`Groq briefing failed (${res.status}): ${detail.slice(0, 240)}`);
      return { briefing: null, debug: 'http_error' };
    }

    const payload = await res.json() as {
      choices?: { finish_reason?: string; message?: { content?: unknown; reasoning?: unknown } }[];
    };
    const message = payload.choices?.[0]?.message;
    const briefing = cleanBriefing(extractContent(message?.content));
    if (!briefing) {
      logger.warn(
        `Groq briefing empty (finish=${payload.choices?.[0]?.finish_reason ?? 'unknown'}, contentType=${typeof message?.content})`,
      );
      return { briefing: null, debug: 'empty' };
    }

    cache.set(projectId, { hash, briefing });
    if (cache.size > 80) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    return { briefing, debug: 'ok' };
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    const message = err instanceof Error ? err.message : 'unknown error';
    logger.warn(`Groq briefing skipped: ${message}`);
    return { briefing: null, debug: aborted ? 'timeout' : 'error' };
  } finally {
    clearTimeout(timer);
  }
}

function groqApiKey(): string {
  const fromEnv = (process.env.GROQ_API_KEY ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (fromEnv) return fromEnv;

  const files = [
    resolve(__dirname, '../../.env'),
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), 'apps/api/.env'),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, 'utf8').match(/^GROQ_API_KEY=(.*)$/m);
    const value = (match?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
    if (value) return value;
  }
  return '';
}

function extractContent(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : (part?.text ?? '')))
      .join('');
  }
  return '';
}

function cleanBriefing(text: string): string {
  let t = text.trim();
  t = t.replace(/^```(?:\w+)?\s*/, '').replace(/\s*```$/, '').trim();
  t = t.replace(/^\s*(here(?:'s| is) (?:the )?(?:briefing|status|overview)[:\s]*)/i, '');
  t = t.replace(/\*\*/g, '');
  t = t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (t.length < 40 || t.length > 1_200) return '';
  if (/\bas an ai\b/i.test(t)) return '';
  return t;
}
