import { formatDateCompact, formatDayName } from '../utils/format';

export function GigCard({ gig, onClick, showDivider = true }) {
  const moodMap = {
    electric: '🔥',
    goodvibes: '😊',
    musical: '🎵',
    messy: '🍺',
    meh: '😴',
    wild: '💀',
  };

  const moods = Array.isArray(gig.mood) ? gig.mood : gig.mood ? [gig.mood] : [];

  return (
    <div>
      <div
        onClick={onClick}
        className="bg-dark-800 py-4 px-3 cursor-pointer border-l-[3px] border-transparent hover:border-accent-orange transition-all duration-150 flex gap-3 items-start"
      >
        {/* Date block */}
        <div className="flex-shrink-0 w-11 text-center pt-0.5">
          <div className="font-mono text-[10px] text-accent-orange font-bold tracking-wide">
            {formatDayName(gig.gig_date)}
          </div>
          <div className="font-mono text-[11px] text-gray-600 mt-0.5 tracking-wide">
            {formatDateCompact(gig.gig_date)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-extrabold text-gray-100 tracking-tight truncate">
            {gig.artist_text || 'Unknown Artist'}
          </h3>
          <p className="text-[13px] text-gray-600 mt-1">
            {gig.venue_name_snapshot || 'Unknown Venue'}{gig.venue_city_snapshot ? `, ${gig.venue_city_snapshot}` : ''}
          </p>
        </div>

        {/* Right: moods + rating */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {moods.length > 0 && (
            <div className="flex gap-0.5">
              {moods.map((m) => (
                <span key={m} className="text-[15px]">{moodMap[m]}</span>
              ))}
            </div>
          )}
          {gig.rating > 0 && (
            <div className="flex gap-px">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`text-[10px] ${s <= gig.rating ? 'text-accent-orange' : 'text-dark-600'}`}
                >
                  ●
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {showDivider && (
        <div className="h-px bg-dark-700 ml-[74px]" />
      )}
    </div>
  );
}
