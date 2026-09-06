'use client';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const BREADCRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/hr': 'HR Management',
  '/notifications': 'Notifications',
};

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { data: count } = useQuery({
    queryKey: ['notif-count'],
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 30_000,
  });

  const title = pathname === '/hr' && user?.role === 'admin'
    ? 'People'
    : BREADCRUMBS[pathname] || pathname.split('/').filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' › ');

  return (
    <header className="h-14 bg-sand-50/80 backdrop-blur border-b border-sand-200 flex items-center justify-between px-6 shrink-0">
      <h2 className="text-sm font-semibold text-ink/70">{title}</h2>
      <Link href="/notifications" className="relative p-2 text-ink/45 hover:text-ink hover:bg-sand-200 rounded-xl transition-colors">
        <Bell size={20} />
        {Number(count?.count) > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {Number(count.count) > 9 ? '9+' : count.count}
          </span>
        )}
      </Link>
    </header>
  );
}
