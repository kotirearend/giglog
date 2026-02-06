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
      <h2 className="text-lg font-semibold text-gray-100">Where are you?</h2>

      <div className="space-y-2">
        {venues.length > 0 && (
          <div className="space-y-2">
            {venues.slice(0, 5).map((venue) => (
              <button
                key={venue.id}
                onClick={() => onSelect(venue)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg p-4 text-left hover:border-accent-purple transition-all duration-200"
              >
                <p className="font-medium text-gray-100">{venue.name}</p>
                <p className="text-sm text-gray-400">{venue.city}</p>
              </button>
            ))}
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg p-4 text-center text-gray-400 hover:text-gray-200 hover:border-accent-purple transition-all duration-200"
          >
            Venue not listed
          </button>
        ) : (
          <div className="space-y-3 bg-dark-700 border border-dark-600 rounded-lg p-4">
            <input
              type="text"
              placeholder="Venue name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddNew}
                className="flex-1 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Add
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-dark-600 text-gray-100 font-semibold py-3 rounded-lg hover:bg-dark-500 transition-all duration-200"
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
