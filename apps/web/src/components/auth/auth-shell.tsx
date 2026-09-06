import Link from 'next/link';
import { BrandMark } from '@/components/brand/brand-mark';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-canvas">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-12 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-primary-600/20 blur-2xl" />
        <div className="absolute -left-10 bottom-20 w-64 h-64 rounded-full bg-primary-400/10 blur-2xl" />
        <BrandMark light size="lg" />
        <div className="relative max-w-md space-y-5">
          <p className="text-primary-200 text-sm font-medium tracking-wide uppercase">A well for the work</p>
          <h1 className="font-serif text-4xl leading-tight">
            Projects, people, and conversations — drawn from one place.
          </h1>
          <p className="text-white/60 leading-relaxed">
            Iriba is the internal workspace for sprints, leave, chat, and client follow-up.
          </p>
        </div>
        <p className="relative text-xs text-white/35">Iriba · internal operations</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-12">
        <div className="lg:hidden mb-8">
          <Link href="/"><BrandMark /></Link>
        </div>
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-sand-200 shadow-card p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
