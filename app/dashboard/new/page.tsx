'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import { saveDraft } from '@/lib/offline-queue';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatementEditor } from '@/components/statement-editor';
import { useEffect, useState } from 'react';

export default function NewStatementPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleSave = async (statement: string, association: string) => {
    if (!user) return;
    try {
      setIsLoading(true);
      if (!isOnline) {
        await saveDraft({ content: statement, associations: association });
        router.push('/dashboard');
        return;
      }
      await apiClient.createStatement(user.user_id, { statement, association });
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Statement</h1>
          <p className="text-slate-400">
            {!isOnline
              ? 'You are offline — statement will be saved as draft'
              : 'Add a statement and its association'}
          </p>
          {!isOnline && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-yellow-400 text-xs font-medium">Offline</span>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8">
          <StatementEditor
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}