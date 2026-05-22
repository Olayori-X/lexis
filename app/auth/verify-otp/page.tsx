'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, user } = useAuth();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOtp(otp);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
            <p className="text-slate-400">
              Enter the OTP sent to{' '}
              <span className="text-blue-400">{user?.email ?? 'your email'}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                OTP Code
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 mt-6"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}