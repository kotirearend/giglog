export function Account({ user, onLogout }) {
  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Account</h1>

      <div className="bg-dark-700 border border-dark-600 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-xl font-bold">
            {(user?.display_name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            {user?.display_name && (
              <p className="text-lg font-semibold text-gray-100">
                {user.display_name}
              </p>
            )}
            <p className="text-gray-400 text-sm">{user?.email || 'Offline mode'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onLogout}
          className="w-full bg-red-900/20 border border-red-900/50 text-red-400 font-semibold py-3 rounded-lg hover:bg-red-900/30 transition-all duration-200"
        >
          Log out
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-gray-500 text-xs">GigLog v0.2</p>
      </div>
    </div>
  );
}
