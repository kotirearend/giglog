import { formatDate } from '../utils/format';

export function SuccessSheet({ gig, stats, onDismiss, onEnrich }) {
  const venueCount = stats.topVenues.find((v) => v.name === gig.venue_name_snapshot)
    ?.count || 1;

  const artistCount = stats.topArtists.find((a) => a.name === gig.artist_text)
    ?.count || 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="w-full bg-dark-800 border border-dark-600 rounded-2xl p-6 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✓</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Gig saved!</h2>
          <p className="text-gray-400">{formatDate(gig.gig_date)}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent-purple">
              {stats.totalGigs}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total gigs</p>
          </div>

          <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent-purple">
              {venueCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              @ {gig.venue_name_snapshot || 'venue'}
            </p>
          </div>

          <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent-purple">
              {artistCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {gig.artist_text || 'artist'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 bg-dark-700 border border-dark-600 text-gray-100 font-semibold py-3 rounded-lg hover:border-accent-purple transition-all duration-200"
          >
            Done
          </button>
          <button
            onClick={onEnrich}
            className="flex-1 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Add details
          </button>
        </div>
      </div>
    </div>
  );
}
