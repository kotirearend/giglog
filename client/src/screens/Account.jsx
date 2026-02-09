import { hashColor } from '../utils/format';

export function Account({ user, onLogout }) {
  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tighter">Account</h1>
        <div className="border-t-2 border-accent-orange w-[30px] mt-1.5 mb-6" />
      </div>

      <div className="bg-dark-800 border border-dark-700 p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 border-2 border-accent-orange flex items-center justify-center text-accent-orange text-xl font-bold"
          >
            {(user?.display_name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            {user?.display_name && (
              <p className="font-bold text-white">
                {user.display_name}
              </p>
            )}
            <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">{user?.email || 'Offline mode'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onLogout}
          className="w-full border border-dark-600 text-gray-600 font-mono font-bold py-3 uppercase tracking-wide hover:bg-dark-800 transition-all duration-200"
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
