import { getQueue, dequeueRequest } from './offline-queue';

export async function syncQueue(): Promise<void> {
  if (!navigator.onLine) return;

  const queue = await getQueue();
  if (queue.length === 0) return;

  console.log(`Syncing ${queue.length} queued requests...`);

  for (const item of queue) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
      });

      if (response.ok) {
        await dequeueRequest(item.id!);
        console.log(`Synced queued request ${item.id}`);
      }
    } catch (err) {
      console.error(`Failed to sync request ${item.id}:`, err);
    }
  }
}

export function registerSyncListener(): void {
  window.addEventListener('online', () => {
    console.log('Back online — syncing queue...');
    syncQueue();
  });
}