import { useState } from 'react';
import { hashColor } from '../utils/format';

export function Account({ user, onLogout, onUpdateProfile }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleEditOpen() {
    setDisplayName(user?.display_name || '');
    setEmail(user?.email || '');
    setError(null);
    setSuccess(false);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setError(null);
    setSuccess(false);
  }

  async function handleSave() {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await onUpdateProfile({
        display_name: displayName.trim(),
        email: email.trim(),
      });
      if (result.success) {
        setSuccess(true);
        setEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to save');
      }
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

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

      {success && (
        <div className="bg-dark-800 border border-accent-orange p-3">
          <p className="font-mono text-sm text-accent-orange">Details updated</p>
        </div>
      )}

      {!editing ? (
        <div className="space-y-3">
          {user && (
            <button
              onClick={handleEditOpen}
              className="w-full bg-accent-orange text-white font-mono font-bold py-3 uppercase tracking-wide hover:bg-opacity-90 transition-all duration-200"
            >
              Account details
            </button>
          )}
          <button
            onClick={onLogout}
            className="w-full border border-dark-600 text-gray-600 font-mono font-bold py-3 uppercase tracking-wide hover:bg-dark-800 transition-all duration-200"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="bg-dark-800 border border-dark-700 p-5 space-y-4">
          <p className="font-mono text-[10px] text-gray-500 font-bold tracking-[2px] uppercase">Edit details</p>

          <div className="space-y-1">
            <label className="font-mono text-[10px] text-gray-500 font-bold tracking-[2px] uppercase">Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="w-full bg-dark-900 border border-dark-600 px-4 py-3 font-mono text-gray-100 focus:border-accent-orange focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] text-gray-500 font-bold tracking-[2px] uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-dark-900 border border-dark-600 px-4 py-3 font-mono text-gray-100 focus:border-accent-orange focus:outline-none"
            />
          </div>

          {error && (
            <p className="font-mono text-sm text-red-400">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 border border-dark-600 text-gray-400 font-mono font-bold py-3 uppercase tracking-wide hover:bg-dark-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-accent-orange text-white font-mono font-bold py-3 uppercase tracking-wide hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <p className="text-gray-500 text-xs">GigLog v0.2</p>
      </div>
    </div>
  );
}
