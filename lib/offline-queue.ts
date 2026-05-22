const DB_NAME = 'lexis-offline';
const STORE_NAME = 'queue';
const DRAFTS_STORE = 'drafts';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        db.createObjectStore(DRAFTS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface QueuedRequest {
  id?: number;
  url: string;
  method: string;
  body: string;
  headers: Record<string, string>;
  createdAt: string;
}

export interface Draft {
  id?: number;
  content: string;
  associations: string;
  createdAt: string;
}

// Add a failed request to the sync queue
export async function enqueueRequest(req: QueuedRequest): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add({ ...req, createdAt: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Get all queued requests
export async function getQueue(): Promise<QueuedRequest[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Remove a request from the queue after successful sync
export async function dequeueRequest(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Save a draft
export async function saveDraft(draft: Omit<Draft, 'id' | 'createdAt'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFTS_STORE, 'readwrite');
    const request = tx.objectStore(DRAFTS_STORE).add({
      ...draft,
      createdAt: new Date().toISOString(),
    });
    request.onsuccess = () => resolve(request.result as number);
    tx.onerror = () => reject(tx.error);
  });
}

// Get all drafts
export async function getDrafts(): Promise<Draft[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFTS_STORE, 'readonly');
    const request = tx.objectStore(DRAFTS_STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Delete a draft
export async function deleteDraft(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFTS_STORE, 'readwrite');
    tx.objectStore(DRAFTS_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}