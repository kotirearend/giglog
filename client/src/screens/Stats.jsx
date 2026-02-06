import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/format';

export function Stats({ stats = {} }) {
  const {
    totalGigs = 0,
    gigsThisYear = 0,
    topVenues = [],
    topArtists = [],
    pintStats = {},
  } = stats;

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Total gigs</p>
          <p className="text-3xl font-bold text-accent-purple">{totalGigs}</p>
        </div>

        <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">This year</p>
          <p className="text-3xl font-bold text-accent-pink">{gigsThisYear}</p>
        </div>
      </div>

      {/* Top Venues */}
      {topVenues.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-100">Top Venues</h2>
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVenues}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#888', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2d2d44',
                    borderRadius: '8px',
                  }}
                  cursor={{ fill: '#8B5CF6', opacity: 0.1 }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Artists */}
      {topArtists.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-100">Top Artists</h2>
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topArtists}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#888', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2d2d44',
                    borderRadius: '8px',
                  }}
                  cursor={{ fill: '#EC4899', opacity: 0.1 }}
                />
                <Bar dataKey="count" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pint Tracker */}
      {pintStats.totalPints > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-100">Pint Tracker</h2>
          <div className="space-y-2">
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Total pints</p>
              <p className="text-3xl font-bold text-accent-amber">
                {pintStats.totalPints}
              </p>
            </div>

            {pintStats.average > 0 && (
              <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Average price</p>
                <p className="text-2xl font-bold text-gray-100">
                  {formatCurrency(pintStats.average)}
                </p>
              </div>
            )}

            {pintStats.mostExpensive && (
              <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Most expensive</p>
                <p className="text-lg font-bold text-gray-100">
                  {formatCurrency(pintStats.mostExpensive.price)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {pintStats.mostExpensive.label} @ {pintStats.mostExpensive.venue}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {totalGigs === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No statistics yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Add some gigs to see your stats
          </p>
        </div>
      )}
    </div>
  );
}
