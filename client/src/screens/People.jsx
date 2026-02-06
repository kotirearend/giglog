import { useState } from 'react';

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
      <h1 className="text-2xl font-bold text-gray-100">People</h1>

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
          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
        />
        <button
          onClick={handleAddPerson}
          disabled={!newPerson.trim()}
          className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add person
        </button>
      </div>

      {/* People list */}
      {sortedPeople.length > 0 ? (
        <div className="space-y-2">
          {sortedPeople.map((person) => (
            <button
              key={person.id}
              onClick={() => onSelect(person.id)}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg p-4 text-left hover:border-accent-purple transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-100">
                    {person.nickname}
                  </p>
                  <p className="text-sm text-gray-400">
                    {personGigCounts[person.id]} gig
                    {personGigCounts[person.id] !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-lg">👤</span>
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
