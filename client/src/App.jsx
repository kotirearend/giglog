import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useGigs } from './hooks/useGigs';
import { useStats } from './hooks/useStats';
import { useSync } from './hooks/useSync';
import { saveLocalPerson, getLocalPeople } from './db/local';
import { get, post } from './api/client';

import { Timeline } from './screens/Timeline';
import { AddGig } from './screens/AddGig';
import { GigDetail } from './screens/GigDetail';
import { Stats } from './screens/Stats';
import { People } from './screens/People';
import { PersonDetail } from './screens/PersonDetail';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { Account } from './screens/Account';

import { BottomNav } from './components/BottomNav';

export default function App() {
  const auth = useAuth();
  const gigs = useGigs(auth.token);
  const stats = useStats(gigs.gigs);
  const sync = useSync(auth.token);

  const [screen, setScreen] = useState('timeline');
  const [screenParams, setScreenParams] = useState({});
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPeople();
  }, [auth.token]);

  useEffect(() => {
    if (auth.token && !auth.isOfflineMode) {
      sync.syncPull();
      sync.syncPush();
    }
  }, [auth.token, auth.isOfflineMode]);

  async function loadPeople() {
    try {
      if (auth.token) {
        // Online: fetch from server, cache locally
        const response = await get('/people');
        const serverPeople = Array.isArray(response) ? response : (response.people || []);
        for (const p of serverPeople) {
          await saveLocalPerson(p);
        }
        // Merge with any local-only people not yet on server
        const localPeople = await getLocalPeople();
        const serverIds = new Set(serverPeople.map((p) => p.id));
        const localOnly = localPeople.filter(
          (p) => !serverIds.has(p.id) && p.id.startsWith('person-')
        );
        setPeople([...serverPeople, ...localOnly]);
      } else {
        const localPeople = await getLocalPeople();
        setPeople(localPeople);
      }
    } catch (error) {
      console.error('Error loading people:', error);
      const localPeople = await getLocalPeople();
      setPeople(localPeople);
    }
  }

  // Derive artists and venues from gigs
  const artists = [...new Set(gigs.gigs.map((g) => g.artist_text).filter(Boolean))];
  const venues = stats.topVenues.map((v) => ({
    id: `venue-${v.name}`,
    name: v.name,
    city: '',
  }));

  // Screen navigation
  function goToTimeline() {
    setScreen('timeline');
    setScreenParams({});
  }

  function goToAddGig() {
    setScreen('addGig');
    setScreenParams({});
  }

  function goToGigDetail(gigId) {
    setScreen('gigDetail');
    setScreenParams({ gigId });
  }

  function goToStats() {
    setScreen('stats');
    setScreenParams({});
  }

  function goPeople() {
    setScreen('people');
    setScreenParams({});
  }

  function goToPersonDetail(personId) {
    setScreen('personDetail');
    setScreenParams({ personId });
  }

  function goToAccount() {
    setScreen('account');
    setScreenParams({});
  }

  function goToLogin() {
    setScreen('login');
    setScreenParams({});
  }

  function goToRegister() {
    setScreen('register');
    setScreenParams({});
  }

  // Handlers
  async function handleAddGig(gigData) {
    const gig = await gigs.addGig(gigData);
    return gig;
  }

  async function handleUpdateGig(gigId, data) {
    await gigs.updateGig(gigId, data);

    // Auto-create person records for any new names added to this gig
    try {
      if (data.people && data.people.length > 0) {
        const existingNicknames = people.map((p) => (p.nickname || '').toLowerCase());
        for (const name of data.people) {
          if (!existingNicknames.includes(name.toLowerCase())) {
            await handleAddPerson({ nickname: name });
            existingNicknames.push(name.toLowerCase());
          }
        }
      }
    } catch (err) {
      console.error('Error auto-creating people:', err);
    }
  }

  async function handleDeleteGig(gigId) {
    await gigs.deleteGig(gigId);
  }

  async function handleAddPerson(personData) {
    try {
      if (auth.token) {
        // Online: create on server, use server-generated ID
        const serverPerson = await post('/people', { nickname: personData.nickname, emoji: personData.emoji || null });
        await saveLocalPerson(serverPerson);
        setPeople((prev) => [...prev, serverPerson]);
        return serverPerson;
      }
    } catch (err) {
      console.error('Error creating person on server, saving locally:', err);
    }
    // Offline or server failed: save locally
    const person = {
      id: `person-${Date.now()}`,
      nickname: personData.nickname,
      user_id: auth.user?.id,
      ...personData,
    };
    await saveLocalPerson(person);
    setPeople((prev) => [...prev, person]);
    return person;
  }

  async function handleLogin(email, password) {
    const result = await auth.login(email, password);
    if (result.success) {
      goToTimeline();
    }
    return result;
  }

  async function handleRegister(email, password, displayName) {
    const result = await auth.register(email, password, displayName);
    if (result.success) {
      goToTimeline();
    }
    return result;
  }

  // Auth check
  if (!auth.isAuthenticated) {
    if (screen === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onLogin={goToLogin}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={goToRegister}
        onOffline={() => {
          auth.setOfflineMode(true);
          goToTimeline();
        }}
      />
    );
  }

  // Main app screen routing
  return (
    <>
      {screen === 'timeline' && (
        <Timeline
          gigs={gigs.gigs}
          onAddGig={goToAddGig}
          onSelectGig={goToGigDetail}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
      )}

      {screen === 'addGig' && (
        <AddGig
          venues={venues}
          artists={artists}
          onSave={handleAddGig}
          onCancel={goToTimeline}
          stats={stats}
        />
      )}

      {screen === 'gigDetail' && (
        <GigDetail
          gigId={screenParams.gigId}
          onBack={goToTimeline}
          gigs={gigs.gigs}
          people={people}
          onUpdate={handleUpdateGig}
          onDelete={handleDeleteGig}
        />
      )}

      {screen === 'stats' && <Stats stats={stats} />}

      {screen === 'people' && (
        <People
          people={people}
          gigs={gigs.gigs}
          onSelect={goToPersonDetail}
          onAdd={handleAddPerson}
        />
      )}

      {screen === 'personDetail' && (
        <PersonDetail
          person={people.find((p) => p.id === screenParams.personId)}
          gigs={gigs.gigs}
          onBack={goPeople}
          onSelectGig={goToGigDetail}
        />
      )}

      {screen === 'account' && (
        <Account
          user={auth.user}
          onLogout={() => {
            auth.logout();
            goToLogin();
          }}
          onUpdateProfile={auth.updateProfile}
        />
      )}

      {['timeline', 'stats', 'people', 'account'].includes(screen) && (
        <BottomNav
          activeTab={screen}
          onNavigate={(tab) => {
            if (tab === 'timeline') goToTimeline();
            if (tab === 'stats') goToStats();
            if (tab === 'people') goPeople();
            if (tab === 'account') goToAccount();
          }}
        />
      )}
    </>
  );
}
