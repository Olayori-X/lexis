'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface StatementEditorProps {
  initialStatement?: string;
  initialAssociation?: string;
  onSave: (statement: string, association: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function StatementEditor({
  initialStatement = '',
  initialAssociation = '',
  onSave,
  onCancel,
  isLoading = false,
}: StatementEditorProps) {
  const [statement, setStatement] = useState(initialStatement);
  const [association, setAssociation] = useState(initialAssociation);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!statement.trim()) {
      setError('Statement cannot be empty');
      return;
    }

    if (!association.trim()) {
      setError('Association cannot be empty');
      return;
    }

    try {
      await onSave(statement.trim(), association.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save statement');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Statement
        </label>
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Write your statement or word..."
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-600 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Association (Meaning/Definition)
        </label>
        <textarea
          value={association}
          onChange={(e) => setAssociation(e.target.value)}
          placeholder="Write the meaning or association..."
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-600 focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !statement.trim() || !association.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10"
        >
          {isLoading ? 'Saving...' : 'Save Statement'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold h-10 border border-slate-700"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}