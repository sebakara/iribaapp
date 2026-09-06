'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      setDone(true);
      toast.success('Password updated!');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired link.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-3">
        <p className="text-ink font-medium">Invalid reset link</p>
        <Link href="/forgot-password" className="text-primary-700 text-sm font-medium hover:underline">
          Request a new one →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center space-y-3">
        <p className="text-ink font-medium">Password updated!</p>
        <p className="text-ink/50 text-sm">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink/80 mb-1.5">New password</label>
        <input
          type="password" required minLength={8} value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-sand-300 rounded-xl bg-sand-50 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink/80 mb-1.5">Confirm new password</label>
        <input
          type="password" required minLength={8} value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-sand-300 rounded-xl bg-sand-50 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
          placeholder="Repeat password"
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Saving…' : 'Set new password'}
      </button>
      <p className="text-center text-sm text-ink/50">
        <Link href="/login" className="text-primary-700 font-medium hover:underline">← Back to sign in</Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Set new password</h1>
        <p className="text-ink/50 text-sm mt-1.5">Choose a strong password for your account.</p>
      </div>
      <Suspense fallback={<div className="text-center text-ink/40 text-sm">Loading…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
