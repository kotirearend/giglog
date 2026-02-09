import { formatDate } from '../utils/format';

export function SuccessSheet({ gig, stats, onDismiss, onEnrich }) {
  const venueCount = stats.topVenues.find((v) => v.name === gig.venue_name_snapshot)
    ?.count || 1;

  const artistCount = stats.topArtists.find((a) => a.name === gig.artist_text)
    ?.count || 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-4 pt-12">
      <div className="w-full bg-dark-800 border border-dark-700 p-6 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✓</div>
          <h2 className="text-2xl font-black text-gray-100 mb-2 tracking-tight">Gig saved!</h2>
          <p className="text-gray-400 font-mono text-sm">{formatDate(gig.gig_date)}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-dark-700 border-l-2 border-accent-orange p-3 text-center">
            <p className="text-2xl font-black text-accent-orange font-mono">
              {stats.totalGigs}
            </p>
            <p className="font-mono text-[9px] text-gray-600 font-semibold mt-1 tracking-[1.5px] uppercase">Total gigs</p>
          </div>

          <div className="bg-dark-700 border-l-2 border-accent-orange/80 p-3 text-center">
            <p className="text-2xl font-black text-accent-orange font-mono">
              {venueCount}
            </p>
            <p className="font-mono text-[9px] text-gray-600 font-semibold mt-1 tracking-[1.5px] uppercase">
              @ {gig.venue_name_snapshot || 'venue'}
            </p>
          </div>

          <div className="bg-dark-700 border-l-2 border-accent-orange/50 p-3 text-center">
            <p className="text-2xl font-black text-accent-orange font-mono">
              {artistCount}
            </p>
            <p className="font-mono text-[9px] text-gray-600 font-semibold mt-1 tracking-[1.5px] uppercase">
              {gig.artist_text || 'artist'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 bg-dark-700 border border-dark-600 text-gray-100 font-black py-3 hover:border-accent-orange transition-all duration-150"
          >
            Done
          </button>
          <button
            onClick={onEnrich}
            className="flex-1 bg-accent-orange text-gray-900 font-black py-3 hover:bg-accent-orange/90 transition-all duration-150"
          >
            Add details
          </button>
        </div>
      </div>
    </div>
  );
}
