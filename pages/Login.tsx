
import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, User as UserIcon, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-fade-in">
      <div className="w-full max-w-md dashboard-card p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#FF9F43]/10 text-[#FF9F43] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Benvenuto</h1>
          <p className="text-[#636E72] dark:text-gray-400">Accedi per iniziare il tuo cammino</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636E72] opacity-50" size={20} />
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Es. Mario Rossi"
                className="w-full pl-12 pr-4 py-4 bg-[#F2F5F8] dark:bg-black/20 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#FF9F43]/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636E72] opacity-50" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="mario@esempio.it"
                className="w-full pl-12 pr-4 py-4 bg-[#F2F5F8] dark:bg-black/20 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#FF9F43]/50 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 btn-orange font-bold text-lg flex items-center justify-center gap-3 mt-4"
          >
            Accedi <LogIn size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#636E72] opacity-60">
          I tuoi dati saranno salvati localmente sul tuo dispositivo.
        </p>
      </div>
    </div>
  );
};

export default Login;
