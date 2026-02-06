import Dexie from 'dexie';

export const db = new Dexie('giglog');
db.version(1).stores({
  gigs: 'id, gig_date, updated_at',
  venues: 'id, user_id',
  people: 'id, user_id',
  syncQueue: '++autoId, created_at'
});

export async function saveGigLocally(gig) {
  return db.gigs.put(gig);
}

export async function getLocalGigs() {
  return db.gigs.toArray();
}

export async function getLocalGig(id) {
  return db.gigs.get(id);
}

export async function deleteLocalGig(id) {
  return db.gigs.delete(id);
}

export async function getLocalVenues() {
  return db.venues.toArray();
}

export async function saveLocalVenue(venue) {
  return db.venues.put(venue);
}

export async function getLocalPeople() {
  return db.people.toArray();
}

export async function saveLocalPerson(person) {
  return db.people.put(person);
}

export async function queueForSync(type, data) {
  return db.syncQueue.add({
    type,
    data,
    created_at: new Date().toISOString(),
  });
}

export async function getSyncQueue() {
  return db.syncQueue.toArray();
}

export async function clearSyncQueue() {
  return db.syncQueue.clear();
}

export async function removeSyncQueueItem(id) {
  return db.syncQueue.delete(id);
}
