import { useState } from 'react';
import { hashColor } from '../utils/format';

export function People({ people = [], gigs = [], onSelect, onAdd }) {
  const [newPerson, setNewPerson] = useState('');

  const personGigCounts = {};
  people.forEach((person) => {
    const count = gigs.filter((gig) =>
      (gig.people || []).includes(person.nickname)
    ).length;
    personGigCounts[person.id] = count;
  });

  function handleAddPerson() {
    if (!newPerson.trim()) return;

    onAdd({
      nickname: newPerson,
    });

    setNewPerson('');
  }

  const sortedPeople = [...people].sort(
    (a, b) => personGigCounts[b.id] - personGigCounts[a.id]
  );

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tighter">People</h1>
        <div className="border-t-2 border-accent-orange w-[30px] mt-1.5 mb-6" />
      </div>

      {/* Add person */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Add new person..."
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddPerson();
            }
          }}
          className="w-full bg-dark-800 border border-dark-700 px-4 py-3 font-mono text-gray-100 focus:border-accent-orange focus:outline-none"
        />
        <button
          onClick={handleAddPerson}
          disabled={!newPerson.trim()}
          className="w-full bg-accent-orange text-white font-mono font-bold py-3 tracking-wide uppercase hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add person
        </button>
      </div>

      {/* People list */}
      {sortedPeople.length > 0 ? (
        <div className="space-y-0">
          {sortedPeople.map((person, index) => (
            <button
              key={person.id}
              onClick={() => onSelect(person.id)}
              className={`w-full bg-dark-800 px-4 py-4 text-left hover:bg-dark-700 transition-colors duration-200 ${
                index !== sortedPeople.length - 1 ? 'border-b border-dark-700' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: hashColor(person.nickname) }}
                  >
                    {(person.nickname || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-100">
                      {person.nickname}
                    </p>
                    <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">
                      {personGigCounts[person.id]} gig{personGigCounts[person.id] !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className="text-gray-700">→</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No people yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Add people you go to gigs with
          </p>
        </div>
      )}
    </div>
  );
}
