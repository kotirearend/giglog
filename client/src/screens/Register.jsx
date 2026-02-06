import { useState } from 'react';

export function Register({ onRegister, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password || !displayName) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onRegister(email, password, displayName);
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 h-screen flex flex-col items-center justify-center">
      <div className="w-full space-y-6">
        <div className="text-center mb-8">
          <button
            onClick={onLogin}
            className="text-gray-400 hover:text-gray-200 transition-colors mb-6"
          >
            ← Back to login
          </button>
          <h1 className="text-3xl font-bold text-gray-100">Create account</h1>
          <p className="text-gray-400 mt-2">Join GigLog today</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleRegister();
              }
            }}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <button
          onClick={onLogin}
          className="w-full text-gray-400 hover:text-gray-200 transition-colors py-3"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}
