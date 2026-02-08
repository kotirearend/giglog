import { useState, useEffect } from 'react';
import { get, post, put, del } from '../api/client';
import {
  getLocalGigs,
  saveGigLocally,
  deleteLocalGig,
  getLocalGig,
  queueForSync,
} from '../db/local';

export function useGigs(token) {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGigs();
  }, [token]);

  async function loadGigs() {
    setLoading(true);
    try {
      if (token) {
        const response = await get('/gigs');
        const serverGigs = (response.gigs || []).map(toClientFields);

        // Merge: use server gigs as base, add any local-only gigs
        const localGigs = await getLocalGigs();
        const serverIds = new Set(serverGigs.map((g) => g.id));
        const localOnly = localGigs.filter(
          (g) => !serverIds.has(g.id) && g.id.startsWith('local-')
        );

        const merged = [...serverGigs, ...localOnly];
        setGigs(merged);

        // Cache server gigs locally
        for (const gig of serverGigs) {
          await saveGigLocally(gig);
        }
      } else {
        const localGigs = await getLocalGigs();
        setGigs(localGigs);
      }
    } catch (error) {
      const localGigs = await getLocalGigs();
      setGigs(localGigs);
    } finally {
      setLoading(false);
    }
  }

  // Clean venue_id if it's not a real UUID (client-generated IDs like "venue-Name")
  function cleanGigData(data) {
    const cleaned = { ...data };
    if (cleaned.venue_id && !cleaned.venue_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-/i)) {
      cleaned.venue_id = null;
    }
    return cleaned;
  }

  // Map client field names to server field names before sending
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

  // Map server field names to client field names after receiving
  function toClientFields(gig) {
    const mapped = { ...gig };
    if ('mood_tags' in mapped) {
      mapped.mood = mapped.mood_tags || [];
      delete mapped.mood_tags;
    }
    if ('purchases' in mapped) {
      mapped.spend_items = mapped.purchases || [];
      delete mapped.purchases;
    }
    return mapped;
  }

  async function addGig(data) {
    try {
      if (token) {
        // Online: post directly to server
        const serverGig = await post('/gigs', toServerFields(cleanGigData(data)));
        const clientGig = toClientFields(serverGig);
        await saveGigLocally(clientGig);
        setGigs([clientGig, ...gigs]);
        return clientGig;
      } else {
        // Offline: save locally and queue for later sync
        const gigData = {
          id: `local-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await saveGigLocally(gigData);
        setGigs([gigData, ...gigs]);
        await queueForSync('create_gig', gigData);
        return gigData;
      }
    } catch (error) {
      // If server post fails, fall back to local save
      const gigData = {
        id: `local-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await saveGigLocally(gigData);
      setGigs([gigData, ...gigs]);
      if (token) {
        await queueForSync('create_gig', gigData);
      }
      console.error('Error adding gig to server, saved locally:', error);
      return gigData;
    }
  }

  async function updateGig(id, data) {
    try {
      const updated = {
        ...gigs.find((g) => g.id === id),
        ...data,
        updated_at: new Date().toISOString(),
      };

      await saveGigLocally(updated);
      setGigs(gigs.map((g) => (g.id === id ? updated : g)));

      if (token && !id.startsWith('local-')) {
        await put(`/gigs/${id}`, toServerFields(updated));
      } else if (token) {
        await queueForSync('update_gig', updated);
      }

      return updated;
    } catch (error) {
      console.error('Error updating gig:', error);
      throw error;
    }
  }

  async function deleteGig(id) {
    try {
      await deleteLocalGig(id);
      setGigs(gigs.filter((g) => g.id !== id));

      if (token && !id.startsWith('local-')) {
        await del(`/gigs/${id}`);
      } else if (token) {
        await queueForSync('delete_gig', { id });
      }
    } catch (error) {
      console.error('Error deleting gig:', error);
      throw error;
    }
  }

  async function getGig(id) {
    return getLocalGig(id);
  }

  async function refreshGigs() {
    await loadGigs();
  }

  return {
    gigs,
    addGig,
    updateGig,
    deleteGig,
    getGig,
    refreshGigs,
    loading,
  };
}
