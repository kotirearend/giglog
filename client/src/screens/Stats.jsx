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
      <div>
        <h1 className="text-2xl font-black text-white tracking-tighter">Statistics</h1>
        <div className="border-t-2 border-accent-orange w-[30px] mt-1.5 mb-6" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-800 border border-dark-700 p-4">
          <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-3">Total gigs</p>
          <p className="font-mono text-[30px] font-extrabold text-white">{totalGigs}</p>
        </div>

        <div className="bg-dark-800 border border-dark-700 p-4">
          <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-3">This year</p>
          <p className="font-mono text-[30px] font-extrabold text-white">{gigsThisYear}</p>
        </div>
      </div>

      {/* Top Venues */}
      {topVenues.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">Top Venues</p>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          <div className="bg-dark-800 border border-dark-700 p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVenues}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" />
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
                    backgroundColor: '#18181c',
                    border: '1px solid #2a2a2e',
                    borderRadius: '0px',
                  }}
                  cursor={{ fill: '#E85D3A', opacity: 0.1 }}
                />
                <Bar dataKey="count" fill="#E85D3A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Artists */}
      {topArtists.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">Top Artists</p>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          <div className="bg-dark-800 border border-dark-700 p-4">
            <div className="space-y-2">
              {topArtists.map((artist, index) => (
                <div key={artist.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] font-bold tracking-[2px] uppercase ${index === 0 ? 'text-accent-orange' : 'text-gray-600'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gray-200">{artist.name}</span>
                  </div>
                  <span className="font-mono text-[12px] font-bold text-gray-400">{artist.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pint Tracker */}
      {pintStats.totalPints > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">Pint Tracker</p>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          <div className="space-y-2">
            <div className="bg-dark-800 border border-dark-700 p-4">
              <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-3">Total pints</p>
              <p className="font-mono text-[30px] font-extrabold text-white">
                {pintStats.totalPints}
              </p>
            </div>

            {pintStats.average > 0 && (
              <div className="bg-dark-800 border border-dark-700 p-4">
                <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-3">Average price</p>
                <p className="font-mono text-2xl font-bold text-white">
                  {formatCurrency(pintStats.average)}
                </p>
              </div>
            )}

            {pintStats.mostExpensive && (
              <div className="bg-dark-800 border border-dark-700 p-4">
                <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-3">Most expensive</p>
                <p className="font-mono text-lg font-bold text-white">
                  {formatCurrency(pintStats.mostExpensive.price)}
                </p>
                <p className="font-mono text-xs text-gray-500 mt-2">
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
