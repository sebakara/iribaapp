import Link from 'next/link';
import { RedirectIfAuthed } from '@/components/auth/redirect-if-authed';
import { BrandMark } from '@/components/brand/brand-mark';

const FEATURES = [
  {
    title: 'Projects & sprints',
    body: 'Issues, kanban, backlog, docs, and analytics in one workspace.',
  },
  {
    title: 'HR & leave',
    body: 'Requests, packages, performance reviews, and department heads.',
  },
  {
    title: 'Team chat',
    body: 'DMs, department and project rooms, mentions, and slash commands.',
  },
  {
    title: 'Clients & newsletters',
    body: 'Keep customer work linked to projects and send updates from the same app.',
  },
  {
    title: 'Live notifications',
    body: 'Assignments, leave decisions, and mentions land as they happen.',
  },
  {
    title: 'Role-based access',
    body: 'Admins, managers, and employees see only what they should.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <RedirectIfAuthed />
      <header className="border-b border-sand-200 bg-sand-50/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-ink/60 hover:text-ink px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700"
            >
              Create workspace
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <p className="text-primary-700 text-sm font-medium tracking-wide uppercase mb-4">
            Internal operations, in one place
          </p>
          <h1 className="font-serif text-5xl max-w-3xl leading-[1.15] tracking-tight">
            Run projects, people, and conversations from a single well.
          </h1>
          <p className="mt-5 text-lg text-ink/55 max-w-xl leading-relaxed">
            Iriba is the workspace for sprints and issues, HR leave, live chat,
            and client follow-up — on one login.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center bg-primary-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary-700"
            >
              Sign in →
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center text-ink font-medium px-5 py-2.5 rounded-xl border border-sand-300 hover:bg-white"
            >
              Start a new company
            </Link>
          </div>
        </section>

        <section className="border-t border-sand-200 bg-white/50">
          <div className="max-w-6xl mx-auto px-6 py-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, body }, i) => (
              <div
                key={title}
                className="rounded-2xl p-5 border border-sand-200 bg-white shadow-card"
              >
                <div className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center text-primary-700 bg-primary-50 font-serif">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h2 className="font-serif text-lg mb-1.5">{title}</h2>
                <p className="text-sm text-ink/55 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-sand-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/40">
          <span>Iriba · internal use</span>
          <Link href="/login" className="hover:text-ink">Employee sign in</Link>
        </div>
      </footer>
    </div>
  );
}
