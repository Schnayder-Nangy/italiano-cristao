
import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, ViewState, User } from './types';
import { DEVOTIONAL_DATA } from './constants';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DayDetail from './pages/DayDetail';
import Navigation from './components/Navigation';

const STORAGE_KEY = 'cammino_21_preghiere_dashboard_progress';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    currentDay: 1,
    completedDays: [],
    onboarded: false,
    notes: {},
    darkMode: false,
    ambientSound: true,
    user: null
  });

  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProgress(parsed);
      if (parsed.user && parsed.onboarded) setView('dashboard');
      else if (parsed.user) setView('onboarding');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    if (progress.darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [progress.darkMode]);

  useEffect(() => {
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-spirit-of-the-wood-139.mp3'); 
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.08;
    }

    if (progress.ambientSound && view !== 'landing' && view !== 'login') {
      ambientAudioRef.current.play().catch(() => console.log("Audio play blocked"));
    } else {
      ambientAudioRef.current.pause();
    }
  }, [progress.ambientSound, view]);

  const handleStart = () => {
    if (progress.user) {
      if (progress.onboarded) setView('dashboard');
      else setView('onboarding');
    } else {
      setView('login');
    }
  };

  const handleLogin = (user: User) => {
    setProgress(prev => ({ ...prev, user }));
    if (progress.onboarded) setView('dashboard');
    else setView('onboarding');
  };

  const handleFinishOnboarding = () => {
    setProgress(prev => ({ ...prev, onboarded: true }));
    setView('dashboard');
  };

  const handleSelectDay = (id: number) => {
    setSelectedDay(id);
    setView('day-detail');
  };

  const handleCompleteDay = (id: number) => {
    setProgress(prev => {
      const completed = Array.from(new Set([...prev.completedDays, id]));
      const nextDay = Math.min(21, Math.max(prev.currentDay, id + 1));
      return { ...prev, completedDays: completed, currentDay: nextDay };
    });
    setView('dashboard');
  };

  const handleSignOut = () => {
    setProgress(prev => ({ ...prev, user: null }));
    setView('landing');
  };

  return (
    <div className={`min-h-screen transition-all duration-700 font-sans`}>
      {view !== 'landing' && view !== 'login' && (
        <Navigation 
          user={progress.user}
          onBack={view === 'day-detail' ? () => setView('dashboard') : undefined}
          isDarkMode={progress.darkMode}
          onToggleTheme={() => setProgress(p => ({ ...p, darkMode: !p.darkMode }))}
          ambientSound={progress.ambientSound}
          onToggleAmbient={() => setProgress(p => ({ ...p, ambientSound: !p.ambientSound }))}
          onSignOut={handleSignOut}
        />
      )}

      <main className={`${view === 'landing' || view === 'login' ? '' : 'pt-24 pb-12 px-4'}`}>
        {view === 'landing' && <Landing onStart={handleStart} isDarkMode={progress.darkMode} />}
        {view === 'login' && <Login onLogin={handleLogin} />}
        {view === 'onboarding' && <Onboarding onComplete={handleFinishOnboarding} />}
        {view === 'dashboard' && (
          <Dashboard 
            progress={progress} 
            onSelectDay={handleSelectDay} 
          />
        )}
        {view === 'day-detail' && selectedDay && (
          <DayDetail 
            day={DEVOTIONAL_DATA.find(d => d.id === selectedDay)!} 
            isCompleted={progress.completedDays.includes(selectedDay)}
            note={progress.notes[selectedDay] || ''}
            onComplete={() => handleCompleteDay(selectedDay)}
            onSaveNote={(id, text) => setProgress(prev => ({...prev, notes: {...prev.notes, [id]: text}}))}
            darkMode={progress.darkMode}
          />
        )}
      </main>
    </div>
  );
};

export default App;
