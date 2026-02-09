import { useState } from 'react';

export function VenuePicker({ venues = [], onSelect }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  function handleAddNew() {
    if (!name || !city) return;

    onSelect({
      id: `venue-${Date.now()}`,
      name,
      city,
      user_id: null,
    });

    setName('');
    setCity('');
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-gray-100 tracking-tight">Where are you?</h2>

      <div className="space-y-2">
        {venues.length > 0 && (
          <div className="space-y-2">
            {venues.slice(0, 5).map((venue) => (
              <button
                key={venue.id}
                onClick={() => onSelect(venue)}
                className="w-full bg-dark-700 border border-dark-600 p-4 text-left hover:border-accent-orange transition-all duration-150"
              >
                <p className="font-bold text-gray-100">{venue.name}</p>
                <p className="text-sm text-gray-400 font-mono">{venue.city}</p>
              </button>
            ))}
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full border border-dashed border-dark-600 p-4 text-center text-gray-400 font-mono text-sm uppercase tracking-wide hover:text-accent-orange hover:border-accent-orange transition-all duration-150"
          >
            + Venue not listed
          </button>
        ) : (
          <div className="space-y-3 bg-dark-700 border border-dark-600 p-4">
            <input
              type="text"
              placeholder="Venue name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-800 border border-dark-600 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-dark-800 border border-dark-600 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddNew}
                className="flex-1 bg-accent-orange text-gray-900 font-black py-3 hover:bg-accent-orange/90 transition-all duration-150"
              >
                Add
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-dark-600 text-gray-100 font-black py-3 hover:bg-dark-600/80 transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
