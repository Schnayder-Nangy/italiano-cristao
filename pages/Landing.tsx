
import React from 'react';
import { ArrowRight, Cross } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
  isDarkMode: boolean;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center max-w-2xl mx-auto px-6 animate-fade-in">
      <div className="mb-14 relative">
        <div className="w-48 h-64 dashboard-card relative z-10 flex items-center justify-center bg-white dark:bg-[#1C1F26]">
           <div className="relative">
              <Cross className="text-[#FF9F43] drop-shadow-lg" size={80} />
              <div className="absolute inset-0 blur-2xl bg-[#FF9F43] opacity-20 animate-pulse"></div>
           </div>
        </div>
      </div>

      <div className="z-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
          Il Cammino <br /> <span className="text-[#FF9F43]">della Preghiera</span>
        </h1>
        <p className="text-lg font-medium opacity-60 mb-12 max-w-sm mx-auto leading-relaxed">
          Un percorso di 21 giorni nella luce e nella speranza. Benvenuto nella tua nuova dimensione spirituale.
        </p>

        <button 
          onClick={onStart}
          className="w-full max-w-xs py-5 px-8 btn-orange font-bold text-lg flex items-center justify-center gap-3"
        >
          Inizia Ora
          <ArrowRight size={22} />
        </button>
      </div>

      <div className="mt-20 flex justify-center items-center gap-8 opacity-40 text-[10px] font-bold uppercase tracking-[0.3em]">
        <span>21 Giorni</span>
        <div className="w-1.5 h-1.5 bg-[#FF9F43] rounded-full"></div>
        <span>Qualità Premium</span>
      </div>
    </div>
  );
};

export default Landing;
