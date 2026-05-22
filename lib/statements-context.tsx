'use client';

import { createContext, useContext, useState } from 'react';
import { Statement } from '@/lib/api-client';

interface StatementsContextType {
  statements: Statement[];
  setStatements: (statements: Statement[]) => void;
  getStatement: (id: string) => Statement | undefined;
}

const StatementsContext = createContext<StatementsContextType | undefined>(undefined);

export function StatementsProvider({ children }: { children: React.ReactNode }) {
  const [statements, setStatements] = useState<Statement[]>([]);

  const getStatement = (id: string) =>
    statements.find((s) => s.statement_id === id);

  return (
    <StatementsContext.Provider value={{ statements, setStatements, getStatement }}>
      {children}
    </StatementsContext.Provider>
  );
}

export function useStatements() {
  const context = useContext(StatementsContext);
  if (!context) throw new Error('useStatements must be used within StatementsProvider');
  return context;
}