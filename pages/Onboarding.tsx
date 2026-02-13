
import React, { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Benvenuto, Fratello",
    content: "Questo cammino è stato pensato per te che stai attraversando un momento difficile.",
    quote: "«Non sei solo»"
  },
  {
    title: "Un Passo alla Volta",
    content: "Non cerchiamo miracoli istantanei, ma la presenza costante di Dio nel tuo quotidiano.",
    quote: "Bastano pochi minuti al giorno."
  },
  {
    title: "Come Camminare",
    content: "Leggi la riflessione, prega con il cuore, ascolta la Parola e annota i tuoi pensieri.",
    quote: "Luce per i tuoi passi."
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else onComplete();
  };

  return (
    <div className="max-w-2xl px-6 py-12 mx-auto animate-fade-in">
      <div className="dashboard-card p-10 sm:p-16">
        <div className="flex justify-center mb-12 gap-3">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-[#FF9F43]' : 'w-4 bg-gray-100 dark:bg-white/10'}`} 
            />
          ))}
        </div>

        <div className="min-h-[350px] flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-[#FF9F43]/10 text-[#FF9F43] rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Star size={32} />
          </div>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">
            {steps[currentStep].title}
          </h2>
          <p className="mb-8 text-xl font-medium leading-relaxed opacity-60">
            {steps[currentStep].content}
          </p>
          <p className="text-lg italic font-bold text-[#FF9F43]">
            {steps[currentStep].quote}
          </p>
        </div>

        <div className="flex justify-center mt-12">
          <button 
            onClick={next}
            className="w-full max-w-xs py-5 btn-orange font-bold text-lg flex items-center justify-center gap-3 group"
          >
            {currentStep === steps.length - 1 ? 'Inizia il Cammino' : 'Continua'}
            <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
