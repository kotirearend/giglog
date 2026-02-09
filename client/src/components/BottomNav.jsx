export function BottomNav({ activeTab, onNavigate }) {
  const tabs = [
    { id: 'timeline', label: 'GIGS' },
    { id: 'stats', label: 'STATS' },
    { id: 'people', label: 'CREW' },
    { id: 'account', label: 'YOU' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-900/95 border-t border-dark-700">
      <div className="max-w-lg mx-auto flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`py-4 px-4 font-mono text-[10px] font-bold tracking-[2px] transition-all duration-150 border-b-2 ${
              activeTab === tab.id
                ? 'text-accent-orange border-accent-orange'
                : 'text-gray-600 border-transparent hover:text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
