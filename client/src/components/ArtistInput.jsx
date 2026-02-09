import { useState } from 'react';

export function ArtistInput({ value, onChange, artists = [] }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = artists
    .filter(
      (artist) =>
        artist.toLowerCase().includes(value.toLowerCase()) && artist !== value
    )
    .slice(0, 5);

  function handleSelect(artist) {
    onChange(artist);
    setShowSuggestions(false);
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Artist or band name"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(e.target.value.length > 0);
        }}
        onFocus={() => setShowSuggestions(value.length > 0)}
        className="w-full bg-dark-700 border border-dark-600 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-600 overflow-hidden z-10">
          {suggestions.map((artist, index) => (
            <button
              key={index}
              onClick={() => handleSelect(artist)}
              className="w-full text-left px-4 py-2 hover:bg-dark-600 transition-colors text-gray-100 font-mono text-sm"
            >
              {artist}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
