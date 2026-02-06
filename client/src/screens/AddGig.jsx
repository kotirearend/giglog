import { useState } from 'react';
import { VenuePicker } from '../components/VenuePicker';
import { ArtistInput } from '../components/ArtistInput';
import { SuccessSheet } from '../components/SuccessSheet';
import { deriveGigDate } from '../utils/nightDate';

export function AddGig({
  venues = [],
  artists = [],
  onSave,
  onCancel,
  stats = {},
}) {
  const [step, setStep] = useState(1);
  const [venue, setVenue] = useState(null);
  const [artist, setArtist] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedGig, setSavedGig] = useState(null);

  const uniqueArtists = [...new Set(
    artists.concat(
      (stats.topArtists || []).map((a) => a.name).filter(Boolean)
    )
  )];

  async function handleSave() {
    if (!venue || !artist) {
      alert('Please fill in venue and artist');
      return;
    }

    const gigData = {
      gig_date: deriveGigDate(new Date().toISOString()),
      venue_id: venue.id,
      venue_name_snapshot: venue.name,
      venue_city_snapshot: venue.city,
      artist_text: artist,
      photo_url: photo?.url,
      photo_small: photo?.small,
      mood: [],
      people: [],
      spend_items: [],
      notes: '',
      rating: 0,
    };

    const gig = await onSave(gigData);
    setSavedGig(gig);
    setShowSuccess(true);
  }

  if (showSuccess && savedGig) {
    return (
      <SuccessSheet
        gig={savedGig}
        stats={stats}
        onDismiss={() => {
          onCancel();
        }}
        onEnrich={() => {
          setShowSuccess(false);
          onCancel();
        }}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Add Gig</h1>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="bg-dark-700 rounded-lg h-1 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-accent-purple to-accent-pink h-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="mb-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">Step 1: Venue</h2>
            <VenuePicker venues={venues} onSelect={(v) => {
              setVenue(v);
              setStep(2);
            }} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">Step 2: Artist</h2>
            <ArtistInput
              value={artist}
              onChange={setArtist}
              artists={uniqueArtists}
            />
            <button
              onClick={() => setStep(3)}
              disabled={!artist}
              className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">Step 3: Photo (optional)</h2>
            {photo ? (
              <div className="space-y-3">
                <div className="bg-dark-700 rounded-lg p-4 text-center">
                  <p className="text-gray-300">Photo selected</p>
                </div>
                <button
                  onClick={() => setPhoto(null)}
                  className="w-full bg-dark-600 text-gray-100 font-semibold py-3 rounded-lg hover:bg-dark-500 transition-all duration-200"
                >
                  Change photo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Camera or file upload would go here
                    setPhoto({ url: 'data:image/placeholder', small: 'data:image/placeholder' });
                  }}
                  className="w-full bg-dark-700 border border-dark-600 text-gray-100 font-semibold py-4 rounded-lg hover:border-accent-purple transition-all duration-200"
                >
                  📸 Take photo
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-dark-600 text-gray-100 font-semibold py-3 rounded-lg hover:bg-dark-500 transition-all duration-200"
                >
                  Skip
                </button>
              </div>
            )}
            {photo && (
              <button
                onClick={() => setStep(4)}
                className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">Step 4: Confirm</h2>
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Artist</p>
                <p className="text-gray-100 font-medium">{artist}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Venue</p>
                <p className="text-gray-100 font-medium">
                  {venue?.name} {venue?.city && `• ${venue.city}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Save gig
            </button>
          </div>
        )}
      </div>

      {step === 1 && (
        <button
          onClick={onCancel}
          className="w-full bg-dark-600 text-gray-100 font-semibold py-3 rounded-lg hover:bg-dark-500 transition-all duration-200"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
