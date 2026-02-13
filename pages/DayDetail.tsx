
import React, { useState, useEffect } from 'react';
import { DayContent } from '../types';
import { Play, Pause, Check, Headphones, Notebook, Quote, Bookmark, ArrowLeft } from 'lucide-react';
import { generatePrayerAudio } from '../geminiService';

interface DayDetailProps {
  day: DayContent;
  isCompleted: boolean;
  note: string;
  onComplete: () => void;
  onSaveNote: (id: number, text: string) => void;
  darkMode: boolean;
}

const DayDetail: React.FC<DayDetailProps> = ({ 
  day, 
  isCompleted, 
  note, 
  onComplete, 
  onSaveNote,
}) => {
  const [localNote, setLocalNote] = useState(note);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    setLocalNote(note);
  }, [note, day.id]);

  const handleAudioToggle = async () => {
    if (isPlaying) {
      audioSource?.stop();
      setIsPlaying(false);
      return;
    }

    setIsGeneratingAudio(true);
    const result = await generatePrayerAudio(day.prayer);
    setIsGeneratingAudio(false);

    if (result) {
      const { audioBuffer, audioCtx } = result;
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      setAudioSource(source);
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-16 px-2 sm:px-4">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        
        {/* Main Content Card */}
        <div className="lg:flex-1 space-y-6 sm:space-y-8">
          <section className="dashboard-card p-6 sm:p-12 relative overflow-hidden">
             <div className="flex justify-between items-start mb-8 sm:mb-12">
                <div className="px-4 py-1.5 bg-black/5 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-60">
                   Giorno {day.id}
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 opacity-40 hover:opacity-100 transition-opacity">
                  <Bookmark size={18} />
                </button>
             </div>
             
             <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-8 leading-tight">{day.title}</h2>
             
             <div className="relative mb-10 sm:mb-16">
                <div className="absolute -left-4 sm:-left-8 top-0 bottom-0 w-1 bg-[#FF9F43] rounded-full opacity-30"></div>
                <p className="text-lg sm:text-2xl font-medium leading-relaxed italic opacity-70">
                   "{day.reflection}"
                </p>
             </div>

             <div className="dashboard-card bg-black/[0.03] dark:bg-white/[0.03] p-6 sm:p-10 border-transparent">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                   <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-sm">
                      <Quote className="text-[#FF9F43]" size={24} />
                   </div>
                   <h5 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] opacity-30">La Parola di Dio</h5>
                </div>
                <blockquote className="text-xl sm:text-3xl font-extrabold tracking-tight mb-4 leading-snug">
                   {day.scripture}
                </blockquote>
                <p className="text-xs sm:text-base font-bold text-[#FF9F43] tracking-wider">— {day.scriptureRef}</p>
             </div>
          </section>

          <section className="dashboard-card p-8 sm:p-14 bg-gradient-to-br from-[#FF9F43] to-[#F39C12] text-white shadow-2xl shadow-orange-500/20">
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-70 mb-8 sm:mb-12">La Tua Preghiera</p>
             <p className="text-2xl sm:text-4xl font-extrabold tracking-tighter italic leading-snug mb-0 drop-shadow-md">
                {day.prayer}
             </p>
          </section>
        </div>

        {/* Interaction Column */}
        <div className="lg:w-80 space-y-6 sm:space-y-8">
           <section className="dashboard-card p-8 sm:p-10 flex flex-col items-center">
              <div className="relative mb-8">
                 <div className={`absolute inset-0 bg-[#FF9F43] rounded-[2.5rem] blur-3xl opacity-20 transition-all duration-1000 ${isPlaying ? 'scale-150 opacity-50' : 'scale-100'}`} />
                 <button 
                   onClick={handleAudioToggle}
                   disabled={isGeneratingAudio}
                   className={`relative w-28 h-28 flex items-center justify-center rounded-[2.5rem] text-white transition-all duration-700 bg-gradient-to-br from-[#FF9F43] to-[#F39C12] shadow-xl shadow-orange-500/30 ${isPlaying ? 'scale-105 rotate-3' : 'hover:scale-105 active:scale-95'}`}
                 >
                   {isGeneratingAudio ? (
                      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : isPlaying ? (
                      <Pause size={48} fill="white" />
                   ) : (
                      <Play size={48} fill="white" className="ml-2" />
                   )}
                 </button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 text-center">
                {isGeneratingAudio ? 'Sincronizzazione...' : isPlaying ? 'In Ascolto' : 'Riproduci Audio'}
              </p>
           </section>

           <section className="space-y-4">
              <div className="flex items-center gap-2 px-3">
                 <Notebook size={14} className="text-[#FF9F43]" />
                 <h5 className="font-bold text-[10px] uppercase tracking-widest opacity-40">Diario Spirituale</h5>
              </div>
              <textarea
                value={localNote}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalNote(val);
                  onSaveNote(day.id, val);
                }}
                placeholder="Scrivi qui i tuoi pensieri..."
                className="w-full dashboard-card p-6 bg-white/20 dark:bg-white/5 outline-none focus:ring-2 focus:ring-[#FF9F43]/30 min-h-[180px] text-base font-medium resize-none shadow-none border-white/20"
              />
           </section>

           <button
             onClick={onComplete}
             disabled={isCompleted}
             className={`w-full py-6 rounded-[2rem] font-extrabold text-lg sm:text-xl transition-all flex items-center justify-center gap-3 ${
               isCompleted 
               ? 'bg-black/10 dark:bg-white/5 text-gray-500 dark:text-gray-400 opacity-60 border border-transparent' 
               : 'btn-orange'
             }`}
           >
             {isCompleted ? <><Check size={24} /> Completato</> : 'Completa Sessione'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default DayDetail;
