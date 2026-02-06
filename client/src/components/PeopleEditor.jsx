import { useState } from 'react';

export function PeopleEditor({
  selected = [],
  availablePeople = [],
  onChange,
}) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = availablePeople
    .filter(
      (person) =>
        person.nickname.toLowerCase().includes(input.toLowerCase()) &&
        !selected.includes(person.nickname)
    )
    .slice(0, 5);

  function handleAdd(nickname) {
    onChange([...selected, nickname]);
    setInput('');
    setShowSuggestions(false);
  }

  function handleRemove(nickname) {
    onChange(selected.filter((n) => n !== nickname));
  }

  function handleInput(value) {
    setInput(value);
    setShowSuggestions(value.length > 0);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selected.map((nickname) => (
          <div
            key={nickname}
            className="bg-accent-purple text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
          >
            <span>{nickname}</span>
            <button
              onClick={() => handleRemove(nickname)}
              className="hover:opacity-70 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Add person..."
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setShowSuggestions(input.length > 0)}
          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-600 rounded-lg overflow-hidden z-10">
            {suggestions.map((person) => (
              <button
                key={person.id}
                onClick={() => handleAdd(person.nickname)}
                className="w-full text-left px-4 py-2 hover:bg-dark-600 transition-colors text-gray-100"
              >
                {person.nickname}
              </button>
            ))}
          </div>
        )}

        {input && suggestions.length === 0 && (
          <button
            onClick={() => handleAdd(input)}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 hover:bg-dark-600 transition-colors text-gray-100 text-left z-10"
          >
            Add "{input}" as new person
          </button>
        )}
      </div>
    </div>
  );
}
