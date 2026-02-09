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

  const sortedGigs = [...filteredGigs].sort(
    (a, b) => new Date(b.gig_date) - new Date(a.gig_date)
  );

  const totalGigs = gigs.length;
  const currentYear = new Date().getFullYear();
  const thisYearGigs = gigs.filter((g) => {
    const d = new Date(g.gig_date);
    return d.getFullYear() === currentYear;
  }).length;
  const uniqueArtists = new Set(gigs.map((g) => g.artist_text).filter(Boolean)).size;

  return (
    <div className="max-w-lg mx-auto px-5 pb-24">
      {/* Header */}
      <div className="pt-6 mb-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none italic">
              GIGLOG
            </h1>
            <div className="border-t-2 border-accent-orange w-10 mt-2" />
          </div>
          <div className="w-9 h-9 rounded-[10px] border-2 border-dark-600 flex items-center justify-center text-sm font-bold text-gray-500">
            L
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex gap-1.5 mb-4">
        {[
          { label: 'Total gigs', value: totalGigs, opacity: '' },
          { label: 'This year', value: thisYearGigs, opacity: '/80' },
          { label: 'Artists', value: uniqueArtists, opacity: '/50' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`flex-1 bg-dark-800 border-l-2 border-accent-orange${stat.opacity} py-2.5 px-3`}
          >
            <div className="font-mono text-xl font-extrabold text-white tracking-tight">
              {stat.value}
            </div>
            <div className="font-mono text-[9px] text-gray-600 font-semibold mt-0.5 tracking-[1.5px] uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={onSearch}
          placeholder="Search gigs..."
        />
      </div>

      {/* Add button */}
      <button
        onClick={onAddGig}
        className="w-full py-3.5 px-5 border border-dashed border-dark-600 bg-transparent text-accent-orange font-mono text-sm font-bold tracking-[1.5px] uppercase cursor-pointer mb-5 hover:border-accent-orange transition-colors"
      >
        + LOG A GIG
      </button>

      {/* Year marker */}
      {sortedGigs.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] text-accent-orange font-bold tracking-[3px]">
            {currentYear}
          </span>
          <div className="flex-1 h-px bg-dark-700" />
          <span className="text-gray-600 text-xs font-medium">
            {thisYearGigs} gig{thisYearGigs !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Gig list */}
      {sortedGigs.length > 0 ? (
        <div>
          {sortedGigs.map((gig, i) => (
            <GigCard
              key={gig.id}
              gig={gig}
              onClick={() => onSelectGig(gig.id)}
              showDivider={i < sortedGigs.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 font-mono text-sm tracking-wide">
            {gigs.length === 0 ? 'No gigs yet' : 'No results'}
          </p>
          {gigs.length === 0 && (
            <p className="text-gray-700 text-xs mt-2">
              Add your first gig to get started
            </p>
          )}
        </div>
      )}
    </div>
  );
}
