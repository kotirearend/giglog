import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { GigCard } from '../components/GigCard';

export function Timeline({
  gigs,
  onAddGig,
  onSelectGig,
  searchQuery = '',
  onSearch,
}) {
  const filteredGigs = gigs.filter(
    (gig) =>
      (gig.artist_text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gig.venue_name_snapshot || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Sort by gig_date descending
  const sortedGigs = [...filteredGigs].sort(
    (a, b) => new Date(b.gig_date) - new Date(a.gig_date)
  );

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      <div className="pt-6 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={onSearch}
          placeholder="Search by artist or venue..."
        />
      </div>

      <button
        onClick={onAddGig}
        className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-4 rounded-xl mb-6 hover:shadow-lg transition-all duration-200 text-lg"
      >
        + Add Gig
      </button>

      {sortedGigs.length > 0 ? (
        <div className="space-y-2">
          {sortedGigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              onClick={() => onSelectGig(gig.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {gigs.length === 0 ? 'No gigs yet' : 'No results'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {gigs.length === 0 && 'Add your first gig to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
