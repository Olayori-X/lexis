'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useStatements } from '@/lib/statements-context';
import { apiClient } from '@/lib/api-client';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatementList } from '@/components/statement-list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { statements, setStatements } = useStatements();
  const [displayedStatements, setDisplayedStatements] = useState(statements);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchStatements = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getStatements(user.user_id);
        const list = data.statements ?? [];
        setStatements(list);
        setDisplayedStatements(list);
      } catch (error) {
        console.error('Failed to fetch statements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatements();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this statement?')) return;

    try {
      await apiClient.deleteStatement(user.user_id, id);
      const updated = statements.filter((s) => s.statement_id !== id);
      setStatements(updated);
      setDisplayedStatements(updated);
    } catch (error) {
      console.error('Failed to delete statement:', error);
      alert('Failed to delete statement');
    }
  };

  const handleSearch = async (query: string) => {
    if (!user) return;
    setSearchQuery(query);

    try {
      if (!query.trim()) {
        setDisplayedStatements(statements);
      } else {
        const data = await apiClient.searchStatements(user.user_id, query);
        setDisplayedStatements(data.statements ?? []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
              Your Statements
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage your statements and their associations
            </p>
          </div>
          <Link href="/dashboard/new" className="flex-shrink-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm h-9 px-3 sm:h-10 sm:px-4">
              <span className="hidden sm:inline">New Statement</span>
              <span className="sm:hidden">+ New</span>
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search statements..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 sm:pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-600 text-sm sm:text-base h-10 sm:h-11"
            />
          </div>
        </div>

        {/* Statement count */}
        {!isLoading && (
          <p className="text-slate-500 text-xs sm:text-sm mb-4">
            {displayedStatements.length} {displayedStatements.length === 1 ? 'statement' : 'statements'}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}

        <StatementList
          statements={displayedStatements}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}