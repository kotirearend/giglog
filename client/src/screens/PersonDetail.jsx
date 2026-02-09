import { formatDate } from '../utils/format';
import { GigCard } from '../components/GigCard';

export function PersonDetail({ person, gigs = [], onBack, onSelectGig }) {
  const personGigs = gigs
    .filter((gig) => (gig.people || []).includes(person.nickname))
    .sort((a, b) => new Date(b.gig_date) - new Date(a.gig_date));

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-black text-white tracking-tighter">{person.nickname}</h1>
        <div className="w-6" />
      </div>

      <div className="bg-dark-800 border border-dark-700 p-4 mb-6">
        <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-3">Total gigs together</p>
        <p className="font-mono text-3xl font-extrabold text-accent-orange">
          {personGigs.length}
        </p>
      </div>

      {personGigs.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
            <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">Gigs together</p>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          {personGigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              onClick={() => onSelectGig(gig.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No gigs together yet</p>
        </div>
      )}
    </div>
  );
}
