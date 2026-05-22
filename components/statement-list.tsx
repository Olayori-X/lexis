'use client';

import Link from 'next/link';
import { Statement } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

interface StatementListProps {
  statements: Statement[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function StatementList({ statements, isLoading, onDelete }: StatementListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-slate-800 border border-slate-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-slate-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No statements yet</h3>
        <p className="text-slate-400 text-center max-w-sm mb-6">
          Start creating statements and add associations to organize your thoughts
        </p>
        <Link href="/dashboard/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Create Your First Statement
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {statements.map((statement) => (
        <Link key={statement.id} href={`/dashboard/statement/${statement.id}`}>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-600 hover:bg-slate-700/50 transition-all cursor-pointer group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors truncate">
                  {statement.statement}
                </h3>
                {statement.associations && statement.associations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {statement.associations.slice(0, 3).map((assoc, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-md border border-blue-600/30"
                      >
                        {assoc}
                      </span>
                    ))}
                    {statement.associations.length > 3 && (
                      <span className="inline-block px-2 py-1 text-slate-400 text-xs">
                        +{statement.associations.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(statement.id);
                }}
                className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
