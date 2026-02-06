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
      setEditData({ ...foundGig });
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
          onClick={onBack}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-100 flex-1 text-center">
          Gig Details
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-400 hover:text-accent-purple transition-colors"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-100">
            {editData.artist_text}
          </h2>
          <p className="text-gray-400 text-lg mt-1">
            {editData.venue_name_snapshot}
          </p>
          {editData.venue_city_snapshot && (
            <p className="text-gray-500 text-sm">{editData.venue_city_snapshot}</p>
          )}
          <p className="text-accent-purple font-semibold mt-3">
            {formatDate(editData.gig_date)}
          </p>
        </div>

        {/* Mood */}
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Mood</h3>
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
                  className="bg-accent-purple text-white px-3 py-1 rounded-full text-sm"
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
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Rating</h3>
          <StarRating
            value={editData.rating || 0}
            onChange={(rating) =>
              setEditData({ ...editData, rating })
            }
            readOnly={!isEditing}
            size="lg"
          />
        </div>

        {/* People */}
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-3">People</h3>
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
                  className="bg-dark-700 border border-dark-600 rounded-full px-3 py-1 text-sm text-gray-100"
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
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Spending</h3>
          {isEditing ? (
            <SpendEditor
              items={spendItems}
              total={totalSpend}
              onChange={handleSpendChange}
            />
          ) : (
            <div className="space-y-2">
              {spendItems.length > 0 ? (
                <>
                  <div className="bg-dark-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Total spend</p>
                    <p className="text-2xl font-bold text-accent-purple">
                      {formatCurrency(totalSpend)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {spendItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-dark-700 border border-dark-600 rounded-lg p-3 flex justify-between"
                      >
                        <div>
                          <p className="text-gray-100">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                        <p className="font-semibold text-gray-100">
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
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Notes</h3>
          {isEditing ? (
            <textarea
              value={editData.notes || ''}
              onChange={(e) =>
                setEditData({ ...editData, notes: e.target.value })
              }
              placeholder="Add notes about the gig..."
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-gray-100 focus:border-accent-purple focus:outline-none min-h-24"
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
              className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Save changes
            </button>
          )}

          <button
            onClick={() => setShowDelete(true)}
            className="w-full bg-red-900/20 border border-red-900/50 text-red-400 font-semibold py-3 rounded-lg hover:bg-red-900/30 transition-all duration-200"
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
