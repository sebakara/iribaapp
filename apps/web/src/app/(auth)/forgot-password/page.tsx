'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Forgot password?</h1>
        <p className="text-ink/50 text-sm mt-1.5">Enter your email and we&apos;ll send a reset link.</p>
      </div>

      {sent ? (
        <div className="text-center space-y-3">
          <p className="text-ink font-medium">Check your inbox</p>
          <p className="text-ink/50 text-sm">
            If <strong>{email}</strong> is registered, you&apos;ll receive a password reset link shortly.
          </p>
          <Link href="/login" className="block mt-4 text-primary-700 font-medium text-sm hover:underline">
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">Email address</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-sand-300 rounded-xl bg-sand-50 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              placeholder="you@company.com"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
          <p className="text-center text-sm text-ink/50">
            <Link href="/login" className="text-primary-700 font-medium hover:underline">← Back to sign in</Link>
          </p>
        </form>
      )}
    </>
  );
}
