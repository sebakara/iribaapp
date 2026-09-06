'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      setAuth(res.user, res.access_token);
      toast.success(`Welcome back, ${res.user.first_name}!`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Sign in</h1>
        <p className="text-ink/50 text-sm mt-1.5">Welcome back to your workspace</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">Email</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-sand-300 rounded-xl bg-sand-50 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-ink/80">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary-700 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3.5 py-2.5 pr-10 border border-sand-300 rounded-xl bg-sand-50 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-ink/35 hover:text-ink/70">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-ink/50 mt-6">
        New company?{' '}
        <Link href="/register" className="text-primary-700 font-medium hover:underline">Create workspace</Link>
      </p>
    </>
  );
}
