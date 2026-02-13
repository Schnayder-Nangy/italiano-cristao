
import React from 'react';
import { UserProgress } from '../types';
import { DEVOTIONAL_DATA } from '../constants';
import { Check, Lock, ChevronRight, Activity, Zap, TrendingUp } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onSelectDay: (id: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, onSelectDay }) => {
  const percent = Math.round((progress.completedDays.length / 21) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12 px-2 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Progress Stats Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
          <section className="dashboard-card p-6 sm:p-8 bg-gradient-to-br from-[#FF9F43] to-[#F39C12] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8 sm:mb-12">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                  Progressando...
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 opacity-80 uppercase tracking-widest text-[11px]">Progresso Totale</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter">{percent}%</span>
                <span className="text-xs sm:text-sm font-bold opacity-60">completato</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </section>

          <section className="dashboard-card p-6 sm:p-8 hidden sm:block">
             <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-6">Attività Recente</h4>
             <div className="space-y-6">
               {[0.7, 0.4, 0.9].map((val, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/50 dark:bg-black/20 rounded-xl flex items-center justify-center text-[#FF9F43] shadow-sm">
                       <Activity size={18} />
                    </div>
                    <div className="flex-1">
                       <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FF9F43] rounded-full" style={{width: `${val * 100}%`}} />
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        </div>

        {/* Days List Column */}
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6 order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
             <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Il Tuo Programma</h3>
             <div className="flex gap-2 p-1 bg-white/30 backdrop-blur-md rounded-2xl self-start">
                <button className="px-4 py-1.5 bg-white dark:bg-white/10 rounded-xl text-[10px] font-bold shadow-sm uppercase tracking-wider">Oggi</button>
                <button className="px-4 py-1.5 text-[10px] font-bold opacity-40 uppercase tracking-wider">Tutti</button>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEVOTIONAL_DATA.map((day) => {
              const isCompleted = progress.completedDays.includes(day.id);
              const isLocked = day.id > progress.currentDay;
              const isActive = day.id === progress.currentDay;

              return (
                <button
                  key={day.id}
                  disabled={isLocked}
                  onClick={() => onSelectDay(day.id)}
                  className={`flex flex-col p-5 sm:p-6 dashboard-card text-left transition-all duration-500 group border-transparent ${
                    isActive ? 'ring-2 ring-[#FF9F43] shadow-xl shadow-orange-500/10' : ''
                  } ${isLocked ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]'}`}
                >
                  <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'bg-[#FF9F43] text-white shadow-lg shadow-orange-500/30' : 
                      isCompleted ? 'bg-[#FF9F43]/15 text-[#FF9F43]' : 'bg-black/5 dark:bg-white/5'
                    }`}>
                       {isCompleted ? <Check size={20} className="sm:size-6" /> : <Zap size={18} className="sm:size-5" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Day 0{day.id}</span>
                  </div>
                  
                  <h4 className="font-extrabold tracking-tight text-base sm:text-lg mb-2 line-clamp-1">{day.title}</h4>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                       <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FF9F43] animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                         {isActive ? 'In Corso' : isCompleted ? 'Completato' : 'Bloccato'}
                       </span>
                    </div>
                    <ChevronRight size={16} className="opacity-20 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
