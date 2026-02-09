export function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const sizeMap = { sm: 'text-sm', md: 'text-2xl', lg: 'text-3xl' };
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <button
          key={dot}
          onClick={() => !readOnly && onChange(dot)}
          disabled={readOnly}
          className={`${sizeClass} transition-colors duration-150 ${
            dot <= value
              ? 'text-accent-orange'
              : 'text-dark-600 hover:text-dark-500'
          }`}
        >
          ●
        </button>
      ))}
    </div>
  );
}
