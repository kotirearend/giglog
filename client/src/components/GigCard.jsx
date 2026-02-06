import { formatDate, hashColor } from '../utils/format';

export function GigCard({ gig, onClick }) {
  const moodMap = {
    electric: '🔥',
    goodvibes: '😊',
    musical: '🎵',
    messy: '🍺',
    meh: '😴',
    wild: '💀',
  };

  const moodLabel = {
    electric: 'Electric',
    goodvibes: 'Good vibes',
    musical: 'Musical',
    messy: 'Messy',
    meh: 'Meh',
    wild: 'Wild',
  };

  const artistColor = hashColor(gig.artist_text || '');

  return (
    <div
      onClick={onClick}
      className="bg-dark-700 border border-dark-600 rounded-lg p-4 mb-3 cursor-pointer hover:border-accent-purple hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]"
    >
      <div className="flex gap-4">
        <div
          className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: artistColor }}
        >
          {(gig.artist_text || '?').charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-100 truncate">
            {gig.artist_text || 'Unknown Artist'}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {gig.venue_name_snapshot || 'Unknown Venue'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(gig.gig_date)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {gig.mood && (
            <div className="bg-dark-600 rounded-full px-3 py-1 flex items-center gap-1">
              <span className="text-sm">{moodMap[gig.mood]}</span>
            </div>
          )}

          {gig.rating && (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= gig.rating
                      ? 'text-accent-amber'
                      : 'text-dark-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
