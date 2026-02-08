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
        setGigs(response.gigs || []);
        for (const gig of response.gigs || []) {
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

  async function addGig(data) {
    try {
      if (token) {
        // Online: post directly to server, use server response as source of truth
        const serverGig = await post('/gigs', data);
        await saveGigLocally(serverGig);
        setGigs([serverGig, ...gigs]);
        return serverGig;
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
        await put(`/gigs/${id}`, updated);
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
