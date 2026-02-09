import { useState } from 'react';
import { post, put, del, get } from '../api/client';
import { getSyncQueue, removeSyncQueueItem } from '../db/local';

// Map client field names to server field names before syncing
function toServerFields(data) {
  const mapped = { ...data };
  if ('mood' in mapped) {
    mapped.mood_tags = mapped.mood;
    delete mapped.mood;
  }
  if ('spend_items' in mapped) {
    mapped.purchases = mapped.spend_items;
    delete mapped.spend_items;
  }
  return mapped;
}

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
            await post('/gigs', toServerFields(item.data));
          } else if (item.type === 'update_gig') {
            await put(`/gigs/${item.data.id}`, toServerFields(item.data));
          } else if (item.type === 'delete_gig') {
            await del(`/gigs/${item.data.id}`);
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
      const response = await get(`/sync/pull?since=${since}`);

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
