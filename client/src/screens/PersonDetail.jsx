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
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-100">{person.nickname}</h1>
        <div className="w-6" />
      </div>

      <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-400 mb-2">Total gigs together</p>
        <p className="text-3xl font-bold text-accent-purple">
          {personGigs.length}
        </p>
      </div>

      {personGigs.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            Gigs together
          </h2>
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
