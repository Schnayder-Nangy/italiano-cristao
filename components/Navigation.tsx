
import React from 'react';
import { User } from '../types';
import { ChevronLeft, Moon, Sun, Volume2, VolumeX, LogOut, User as UserIcon } from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onBack?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  ambientSound: boolean;
  onToggleAmbient: () => void;
  onSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  user,
  onBack, 
  isDarkMode, 
  onToggleTheme, 
  ambientSound, 
  onToggleAmbient,
  onSignOut
}) => {
  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between dashboard-card border-white/20">
      <div className="flex items-center gap-3 sm:gap-4">
        {onBack ? (
          <button 
            onClick={onBack}
            className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl sm:rounded-2xl hover:bg-black/10 transition-colors"
          >
            <ChevronLeft size={18} className="sm:size-5" />
          </button>
        ) : user ? (
          <div className="flex items-center gap-2 sm:gap-3">
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF9F43]/10 text-[#FF9F43] rounded-xl sm:rounded-2xl flex items-center justify-center border border-orange-500/10">
                <UserIcon size={20} className="sm:size-6" />
             </div>
             <div className="hidden xs:block">
                <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest leading-none mb-1">Benvenuto</p>
                <p className="text-xs sm:text-sm font-extrabold tracking-tight">Ciao, {user.name.split(' ')[0]}!</p>
             </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button 
          onClick={onToggleAmbient}
          className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl sm:rounded-2xl transition-all ${ambientSound ? 'text-[#FF9F43] bg-[#FF9F43]/10' : 'opacity-30'}`}
          title="Audio Ambiente"
        >
          {ambientSound ? <Volume2 size={18} className="sm:size-5" /> : <VolumeX size={18} className="sm:size-5" />}
        </button>
        <button 
          onClick={onToggleTheme}
          className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/5 transition-all"
          title="Tema"
        >
          {isDarkMode ? <Sun size={18} className="sm:size-5" /> : <Moon size={18} className="sm:size-5" />}
        </button>
        <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-1 sm:mx-2" />
        <button 
          onClick={onSignOut}
          className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl sm:rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
          title="Esci"
        >
          <LogOut size={18} className="sm:size-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
