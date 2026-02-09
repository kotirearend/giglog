import { useState } from 'react';

export function Login({ onLogin, onRegister, onOffline }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onLogin(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 h-screen flex flex-col items-center justify-center">
      <div className="w-full space-y-6">
        <div className="text-center mb-8">
          <div className="mb-2">
            <h1 className="text-4xl font-black text-white italic inline-block border-b-4 border-accent-orange pb-1">
              GIGLOG
            </h1>
          </div>
          <p className="text-gray-600">Gig diary for musicians</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
            className="w-full bg-dark-800 border border-dark-700 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-accent-orange text-white font-bold py-3 hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-900 text-gray-400">or</span>
          </div>
        </div>

        <button
          onClick={() => onRegister()}
          className="w-full border border-dark-600 text-gray-400 font-semibold py-3 hover:border-accent-orange transition-all duration-200"
        >
          Create account
        </button>

        <button
          onClick={onOffline}
          className="w-full text-gray-400 hover:text-gray-200 transition-colors py-3"
        >
          Use offline
        </button>
      </div>
    </div>
  );
}
