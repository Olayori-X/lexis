'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useStatements } from '@/lib/statements-context';
import { apiClient, Statement } from '@/lib/api-client';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';

export default function StatementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { getStatement } = useStatements();
  const [statement, setStatement] = useState<Statement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedAssociation, setEditedAssociation] = useState('');
  const [error, setError] = useState('');

  const statementId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const found = getStatement(statementId);
    if (found) {
      setStatement(found);
      setEditedContent(found.content);
      setEditedAssociation(found.associations);
    } else {
      setError('Statement not found');
    }
    setIsLoading(false);
  }, [user, statementId]);

  const handleSave = async () => {
    if (!user) return;
    try {
      setError('');
      await apiClient.updateStatement(user.user_id, statementId, {
        statement: editedContent,
        association: editedAssociation,
      });
      setStatement({
        ...statement!,
        content: editedContent,
        associations: editedAssociation,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update statement');
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this statement?')) return;

    try {
      await apiClient.deleteStatement(user.user_id, statementId);
      router.push('/dashboard');
    } catch {
      setError('Failed to delete statement');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <DashboardHeader />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Statement not found</p>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Statement
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Association
                </label>
                <textarea
                  value={editedAssociation}
                  onChange={(e) => setEditedAssociation(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(statement.content);
                    setEditedAssociation(statement.associations);
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold h-10 border border-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">{statement.content}</h1>

                {statement.associations && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Association</h2>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                      <p className="text-slate-200">{statement.associations}</p>
                    </div>
                  </div>
                )}

                {!statement.associations && (
                  <p className="text-slate-400">No association yet.</p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold h-10 border border-red-600/30"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}