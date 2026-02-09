export function SearchBar({ value, onChange, placeholder = 'Search gigs...' }) {
  return (
    <div className="bg-dark-800 border-l-2 border-dark-600 flex items-center gap-3 px-3 py-3">
      <span className="text-gray-600 text-sm">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-none font-mono text-xs text-gray-100 focus:outline-none tracking-wide placeholder:text-gray-600"
      />
    </div>
  );
}
