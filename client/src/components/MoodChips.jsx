export function MoodChips({ selected, onChange }) {
  const moods = [
    { id: 'electric', emoji: '🔥', label: 'Electric' },
    { id: 'goodvibes', emoji: '😊', label: 'Good vibes' },
    { id: 'musical', emoji: '🎵', label: 'Musical' },
    { id: 'messy', emoji: '🍺', label: 'Messy' },
    { id: 'meh', emoji: '😴', label: 'Meh' },
    { id: 'wild', emoji: '💀', label: 'Wild' },
  ];

  function handleClick(moodId) {
    const updated = selected.includes(moodId)
      ? selected.filter((id) => id !== moodId)
      : [...selected, moodId];
    onChange(updated);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => handleClick(mood.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
            selected.includes(mood.id)
              ? 'bg-accent-purple text-white'
              : 'bg-dark-700 border border-dark-600 text-gray-300 hover:border-accent-purple'
          }`}
        >
          <span className="text-lg">{mood.emoji}</span>
          <span className="text-sm">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}
