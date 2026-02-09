import { useState, useEffect } from 'react';
import { MoodChips } from '../components/MoodChips';
import { PeopleEditor } from '../components/PeopleEditor';
import { SpendEditor } from '../components/SpendEditor';
import { StarRating } from '../components/StarRating';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatDate, formatCurrency } from '../utils/format';

export function GigDetail({
  gigId,
  onBack,
  gigs = [],
  people = [],
  onUpdate,
  onDelete,
}) {
  const [gig, setGig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const foundGig = gigs.find((g) => g.id === gigId);
    if (foundGig) {
      setGig(foundGig);
      // Only reset editData if we're not currently editing
      // (avoids wiping in-progress edits when gigs array updates)
      if (!isEditing) {
        setEditData({ ...foundGig });
      }
    }
  }, [gigId, gigs]);

  if (!gig || !editData) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>;
  }

  const spendItems = editData.spend_items || [];
  const totalSpend = spendItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  async function handleSave() {
    await onUpdate(gigId, editData);
    setIsEditing(false);
  }

  async function handleDeleteConfirm() {
    await onDelete(gigId);
    onBack();
  }

  function handleSpendChange(items) {
    setEditData({ ...editData, spend_items: items });
  }

  function handlePeopleChange(names) {
    setEditData({ ...editData, people: names });
  }

  function handleMoodChange(moods) {
    setEditData({ ...editData, mood: moods });
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={isEditing ? () => setIsEditing(false) : onBack}
          className="text-accent-orange hover:text-accent-orange/80 transition-colors font-mono uppercase tracking-wide text-xs"
        >
          {isEditing ? '← Cancel' : '← Back'}
        </button>
        <h1 className="text-2xl font-black text-gray-100 flex-1 text-center tracking-tight">
          Gig Details
        </h1>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="text-accent-orange hover:text-accent-orange/80 transition-colors font-mono uppercase tracking-wide text-xs font-bold"
        >
          {isEditing ? 'SAVE' : 'Edit'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Ticket-stub Hero Card */}
        <div className="bg-dark-800 border-2 border-dashed border-dark-700 p-6 relative">
          {/* Tear marks */}
          <div className="absolute -left-2 top-1/2 w-4 h-4 bg-dark-900 rounded-full" />
          <div className="absolute -right-2 top-1/2 w-4 h-4 bg-dark-900 rounded-full" />

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase block mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  value={editData.artist_text || ''}
                  onChange={(e) => setEditData({ ...editData, artist_text: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 px-3 py-2 text-gray-100 focus:border-accent-orange focus:outline-none text-lg font-black"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase block mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={editData.venue_name_snapshot || ''}
                  onChange={(e) => setEditData({ ...editData, venue_name_snapshot: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 px-3 py-2 text-gray-100 focus:border-accent-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase block mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={editData.venue_city_snapshot || ''}
                  onChange={(e) => setEditData({ ...editData, venue_city_snapshot: e.target.value })}
                  placeholder="City (optional)"
                  className="w-full bg-dark-700 border border-dark-600 px-3 py-2 text-gray-100 focus:border-accent-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase block mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={String(editData.gig_date || '').split('T')[0]}
                  onChange={(e) => setEditData({ ...editData, gig_date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-dark-700 border border-dark-600 px-3 py-2 text-gray-100 focus:border-accent-orange focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black text-gray-100 tracking-tight">
                {editData.artist_text}
              </h2>
              <p className="text-gray-400 text-lg mt-2">
                {editData.venue_name_snapshot}
              </p>
              {editData.venue_city_snapshot && (
                <p className="text-gray-500 text-sm font-mono tracking-wide mt-1">
                  {editData.venue_city_snapshot}
                </p>
              )}
              <div className="border-t-2 border-dashed border-dark-700 my-4" />
              <p className="text-accent-orange font-mono font-bold tracking-[1px] mt-3">
                {formatDate(editData.gig_date)}
              </p>
            </>
          )}
        </div>

        {/* Mood */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">
              Mood
            </h3>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          {isEditing ? (
            <MoodChips
              selected={editData.mood || []}
              onChange={handleMoodChange}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(editData.mood || []).map((mood) => (
                <div
                  key={mood}
                  className="bg-accent-orange text-gray-100 px-3 py-1 text-sm font-mono font-bold"
                >
                  {mood}
                </div>
              ))}
              {(!editData.mood || editData.mood.length === 0) && (
                <p className="text-gray-400">No mood recorded</p>
              )}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">
              Rating
            </h3>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          {isEditing ? (
            <div className="text-2xl">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setEditData({ ...editData, rating: i })}
                  className={`text-3xl transition-opacity ${
                    i <= (editData.rating || 0) ? 'text-accent-orange' : 'text-gray-600'
                  }`}
                >
                  ●
                </button>
              ))}
            </div>
          ) : (
            <div className="text-2xl">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-3xl ${
                    i <= (editData.rating || 0) ? 'text-accent-orange' : 'text-gray-600'
                  }`}
                >
                  ●
                </span>
              ))}
            </div>
          )}
        </div>

        {/* People */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">
              People
            </h3>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          {isEditing ? (
            <PeopleEditor
              selected={editData.people || []}
              availablePeople={people}
              onChange={handlePeopleChange}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(editData.people || []).map((person) => (
                <div
                  key={person}
                  className="bg-dark-700 px-3 py-1 text-sm text-gray-100 font-mono rounded-sm"
                >
                  {person}
                </div>
              ))}
              {(!editData.people || editData.people.length === 0) && (
                <p className="text-gray-400">No people recorded</p>
              )}
            </div>
          )}
        </div>

        {/* Spend */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">
              Spending
            </h3>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          {isEditing ? (
            <SpendEditor
              items={spendItems}
              total={totalSpend}
              onChange={handleSpendChange}
            />
          ) : (
            <div className="space-y-3">
              {spendItems.length > 0 ? (
                <>
                  <div className="bg-dark-800 border border-dark-700 p-4">
                    <p className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase mb-2">
                      Total spend
                    </p>
                    <p className="text-2xl font-black text-accent-orange">
                      {formatCurrency(totalSpend)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {spendItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-dark-800 border border-dark-700 p-3 flex justify-between"
                      >
                        <div>
                          <p className="text-gray-100 font-mono text-sm">{item.label}</p>
                          <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                            {item.category}
                          </p>
                        </div>
                        <p className="font-black text-gray-100">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-400">No spending recorded</p>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-mono text-[10px] text-gray-600 font-bold tracking-[2px] uppercase">
              Notes
            </h3>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          {isEditing ? (
            <textarea
              value={editData.notes || ''}
              onChange={(e) =>
                setEditData({ ...editData, notes: e.target.value })
              }
              placeholder="Add notes about the gig..."
              className="w-full bg-dark-700 border border-dark-600 px-4 py-3 text-gray-100 focus:border-accent-orange focus:outline-none min-h-24"
            />
          ) : (
            <p className="text-gray-300">
              {editData.notes || 'No notes'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full bg-accent-orange text-gray-900 font-black py-3 hover:bg-accent-orange/90 transition-all duration-200"
            >
              Save changes
            </button>
          )}

          <button
            onClick={() => setShowDelete(true)}
            className="w-full bg-transparent border border-red-900/70 text-red-400 font-black py-3 hover:bg-red-900/10 transition-all duration-200"
          >
            Delete gig
          </button>
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          message="Delete this gig? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDelete(false)}
          confirmLabel="Delete"
          confirmColor="red"
        />
      )}
    </div>
  );
}
