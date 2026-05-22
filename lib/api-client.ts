import { enqueueRequest } from './offline-queue';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Statement {
  id: string;
  statement_id: string;
  user_id: string;
  content: string;
  associations: string;
  created_at: string;
  updated_at: string;
}

async function fetchWithAuth(url: string, userID: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = token;
  if (userID) headers['userid'] = userID;

  const fullUrl = `${API_BASE}${url}`;

  // If offline and it's a write, queue it
  if (!navigator.onLine && options.method && options.method !== 'GET') {
    await enqueueRequest({
      url: fullUrl,
      method: options.method,
      body: (options.body as string) ?? '',
      headers,
      createdAt: new Date().toISOString(),
    });
    throw new Error('You are offline. Your changes have been saved and will sync when you reconnect.');
  }

  const response = await fetch(fullUrl, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

export const apiClient = {
  getStatements: (userID: string) =>
    fetchWithAuth('/statements/', userID),

  getStatement: (userID: string, id: string) =>
    fetchWithAuth(`/statements/${id}`, userID),

  searchStatements: (userID: string, query: string) =>
    fetchWithAuth(`/statements/findstatements?q=${encodeURIComponent(query)}`, userID),

  createStatement: (userID: string, data: { statement: string; association: string }) =>
    fetchWithAuth('/statements/addstatement', userID, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userID,
        statement: data.statement,
        association: data.association,
      }),
    }),

  updateStatement: (userID: string, id: string, data: { statement: string; association: string }) =>
    fetchWithAuth(`/statements/editstatement/${id}`, userID, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteStatement: (userID: string, id: string) =>
    fetchWithAuth(`/statements/deletestatement/${id}`, userID, {
      method: 'DELETE',
    }),
};