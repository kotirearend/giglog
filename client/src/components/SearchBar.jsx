export function SearchBar({ value, onChange, placeholder = 'Search gigs...' }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
      />
    </div>
  );
}
