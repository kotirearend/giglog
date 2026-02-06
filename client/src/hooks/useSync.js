import { useState } from 'react';
import { post, get } from '../api/client';
import { getSyncQueue, removeSyncQueueItem } from '../db/local';

export function useSync(token) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(
    localStorage.getItem('lastSync') || null
  );

  async function syncPush() {
    if (!token || syncing) return;

    setSyncing(true);
    try {
      const queue = await getSyncQueue();

      for (const item of queue) {
        try {
          if (item.type === 'create_gig') {
            await post('/gigs', item.data);
          } else if (item.type === 'update_gig') {
            await post(`/gigs/${item.data.id}`, item.data);
          } else if (item.type === 'delete_gig') {
            await post(`/gigs/${item.data.id}/delete`, {});
          }

          await removeSyncQueueItem(item.autoId);
        } catch (error) {
          console.error('Sync error:', error);
        }
      }

      const now = new Date().toISOString();
      setLastSync(now);
      localStorage.setItem('lastSync', now);
    } catch (error) {
      console.error('Sync push failed:', error);
    } finally {
      setSyncing(false);
    }
  }

  async function syncPull() {
    if (!token) return;

    setSyncing(true);
    try {
      const since = lastSync || '2020-01-01T00:00:00Z';
      const response = await get(`/gigs/sync?since=${since}`);

      const now = new Date().toISOString();
      setLastSync(now);
      localStorage.setItem('lastSync', now);

      return response.gigs || [];
    } catch (error) {
      console.error('Sync pull failed:', error);
      return [];
    } finally {
      setSyncing(false);
    }
  }

  return { syncPush, syncPull, syncing, lastSync };
}
