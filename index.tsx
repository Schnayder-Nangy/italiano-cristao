
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ArrowRight, Cross, LogIn, Mail, User as UserIcon, 
  ChevronLeft, ChevronRight, Moon, Sun, Volume2, VolumeX, LogOut, 
  TrendingUp, Activity, Zap, Check, Bookmark, Quote, 
  Notebook, Star, Play, Pause 
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

// --- TYPES ---
export interface DayContent {
  id: number;
  title: string;
  reflection: string;
  prayer: string;
  scripture: string;
  scriptureRef: string;
}

export interface User {
  name: string;
  email: string;
}

export interface UserProgress {
  currentDay: number;
  completedDays: number[];
  onboarded: boolean;
  notes: Record<number, string>;
  ambientSound: boolean;
  user: User | null;
}

export type ViewState = 'landing' | 'login' | 'onboarding' | 'dashboard' | 'day-detail';

// --- DATA ---
const STORAGE_KEY = 'cammino_21_preghiere_premium_dark';

const DEVOTIONAL_DATA: DayContent[] = [
  { id: 1, title: "Quando l’ansia stringe il cuore", reflection: "Signore, a volte il peso del domani mi toglie il respiro. I pensieri si accavallano e non riesco a trovare riposo. Ti affido ogni preoccupazione, perché solo in Te trovo il vero rifugio.", prayer: "Padre misericordioso, che conosci ogni battito del mio cuore, prendi le mie ansie e trasformale in fiducia. Donami la grazia di vivere questo giorno senza anticipare i problemi di domani. Insegnami a riposare nella Tua provvidenza, sapendo che Tu vegli su di me anche quando io non riesco a vegliare su me stesso. Amen.", scripture: "«Getta sul Signore il tuo affanno ed egli ti sosterrà.»", scriptureRef: "Salmo 55:23" },
  { id: 2, title: "Per abbandonare il controllo", reflection: "Spesso credo di dover risolvere tutto da solo. Stringo forte i piani, le paure, le persone care. Oggi scelgo di aprire le mani e fidarmi di Te, che conosci la via meglio di me.", prayer: "Signore, le mie mani stringono troppo forte ciò che non posso controllare. Ti apro le mani e depongo ai Tuoi piedi ogni progetto, ogni timore, ogni persona che amo. Governami Tu, perché solo nelle Tue mani tutto è al sicuro. Amen.", scripture: "«Confida nel Signore con tutto il cuore e non appoggiarti sulla tua intelligenza.»", scriptureRef: "Proverbi 3:5" },
  { id: 3, title: "Pace nel mezzo della tempesta", reflection: "Anche quando tutto intorno sembra crollare, Tu sei la mia roccia stabile. Non sempre calmi la tempesta fuori di me, ma puoi sempre calmare la tempesta dentro di me.", prayer: "Gesù, che hai calmato il mare in tempesta, parla anche oggi al mio cuore agitato. Fa’ silenzio dentro di me e fammi sentire la Tua voce dolce che dice: «Sono io, non temete». Dona pace alla mia anima. Amen.", scripture: "«Vi lascio la pace, vi do la mia pace.»", scriptureRef: "Giovanni 14:27" },
  { id: 4, title: "Contro la paura del futuro", reflection: "Il futuro è sconosciuto e questo mi spaventa. Ma Tu lo conosci già fino all’ultimo dettaglio. Questo mi basta per camminare oggi con serenità.", prayer: "Padre, allontana da me lo spirito della paura. Ricordami che ogni giorno della mia vita è scritto nel Tuo libro d’amore. Fa’ che cammini con fiducia, sapendo che Tu sei già là ad aspettarmi. Amen.", scripture: "«Non temere, perché io sono con te; non smarrirti, perché io sono il tuo Dio.»", scriptureRef: "Isaia 41:10" },
  { id: 5, title: "Quando il coraggio viene meno", reflection: "Non ho sempre la forza che vorrei. Mi sento debole, fragile. Ma Tu sei la mia forza, e nella debolezza la Tua potenza si manifesta.", prayer: "Signore, in questo momento di debolezza, rivesto la Tua armatura. Dammi il coraggio di affrontare ciò che mi spaventa, sapendo che Tu combatti per me e con me. Amen.", scripture: "«Ti basta la mia grazia; la forza infatti si manifesta pienamente nella debolezza.»", scriptureRef: "2 Corinzi 12:9" },
  { id: 6, title: "Per la guarigione del corpo e dell’anima", reflection: "La malattia mi ricorda quanto sono fragile. Ma nelle Tue mani anche la fragilità diventa offerta preziosa.", prayer: "Gesù, medico divino, tocca il mio corpo e la mia anima con la Tua mano misericordiosa. Non Ti chiedo necessariamente la guarigione fisica, ma la certezza della Tua presenza che rende ogni sofferenza sopportabile e feconda. Amen.", scripture: "«Io sono il Signore, colui che ti guarisce.»", scriptureRef: "Esodo 15:26" },
  { id: 7, title: "Accettare i limiti della salute", reflection: "Anche nella malattia posso offrirTi qualcosa di prezioso: la mia fiducia e il mio abbandono.", prayer: "Padre, unisco le mie sofferenze a quelle di Cristo sulla croce. Trasforma questo tempo di prova in grazia per me e per chi amo. Fa’ che porti frutto eterno. Amen.", scripture: "«Tutto concorre al bene, per quelli che amano Dio.»", scriptureRef: "Romani 8:28" },
  { id: 8, title: "Per la protezione della famiglia", reflection: "La mia famiglia è il dono più grande, ma anche la mia preoccupazione più profonda. La affido a Te ogni giorno.", prayer: "Signore, stendi il Tuo manto di protezione sulla mia casa. Custodisci ciascuno di noi dal male visibile e invisibile. Fa’ che il nostro amore sia sempre radicato in Te. Amen.", scripture: "«Se il Signore non custodisce la casa, invano si affaticano i costruttori.»", scriptureRef: "Salmo 127:1" },
  { id: 9, title: "Per la riconciliazione familiare", reflection: "Le ferite familiari pesano sul cuore. Oggi scelgo il perdono, anche se fa male.", prayer: "Spirito Santo, guarisci le relazioni spezzate nella mia famiglia. Dammi umiltà per chiedere perdono e generosità per concederlo. Ricostruisci ciò che è rotto. Amen.", scripture: "«Siate benevoli gli uni verso gli altri, misericordiosi, perdonandovi a vicenda.»", scriptureRef: "Efesini 4:32" },
  { id: 10, title: "Per i figli che soffrono", reflection: "Vedere un figlio in difficoltà è il dolore più grande di un genitore. Lo affido a Te che sei Padre perfetto.", prayer: "Maria, Madre dolcissima, prendi tra le Tue braccia i miei figli. Proteggili quando io non posso raggiunturli. Guidali sempre verso il Cuore di Tuo Figlio. Amen.", scripture: "«Posso forse dimenticare una madre il suo bambino? Anche se lei si dimenticasse, io invece non ti dimenticherò mai.»", scriptureRef: "Isaia 49:15" },
  { id: 11, title: "Per i figli lontani dalla fede", reflection: "Non posso forzare la fede nei miei figli, ma posso pregare e affidarli a Te con fiducia infinita.", prayer: "Signore, Tu ami i miei figli più di quanto io possa mai fare. Semina nel loro cuore il desiderio di Te, anche se ora sembrano lontani. Attendi pazientemente il loro ritorno. Amen.", scripture: "«Educate il bambino secondo la sua via; perfino quando sarà vecchio non se ne allontanerà.»", scriptureRef: "Proverbi 22:6" },
  { id: 12, title: "Quando il lavoro opprime", reflection: "Il lavoro può rubarmi la pace e l’energia. Oggi lo offro a Te como preghiera.", prayer: "San Giuseppe, modello di lavoratore silenzioso e fedele, aiutami a svolgere il mio compito con dignità e serenità, anche quando è pesante. Rendilo gradito a Dio. Amen.", scripture: "«Qualsiasi cosa facciate, fatela di cuore, come per il Signore.»", scriptureRef: "Colossesi 3:23" },
  { id: 13, title: "Per la provvidenza economica", reflection: "Non vivo di solo pane, ma ho bisogno anche del pane quotidiano. Mi fido della Tua provvidenza.", prayer: "Padre, che nutri gli uccelli del cielo e vesti i gigli del campo, provvedi anche alle mie necessità materiali. Insegnami a fidarmi senza angustia e a condividere ciò che ho. Amen.", scripture: "«Non affannatevi dunque dicendo: “Che mangeremo? Che berremo?”… Il Padre vostro celeste sa che ne avete bisogno.»", scriptureRef: "Matteo 6:31-32" },
  { id: 14, title: "Davanti a una decisione difficile", reflection: "Non voglio sbagliare strada. Ma Tu conosci la via che porta alla vita.", prayer: "Spirito Santo, illumina la mia mente e calma il mio cuore. Mostrami chiaramente la strada che Dio ha preparato per me, e dammi il coraggio di seguirla. Amen.", scripture: "«Ti farò conoscere la via da seguire; con il mio occhio ti guiderò.»", scriptureRef: "Salmo 32:8" },
  { id: 15, title: "Accettare una decisione già presa", reflection: "A volte la Tua volontà non coincide con i miei desideri. Oggi dico il mio “sì”.", prayer: "Signore, aiutami ad accogliere con pace ciò che non posso cambiare. Trasforma il mio “perché” in un “fiat” come quello di Maria. Amen.", scripture: "«Ecco la serva del Signore: avvenga per me secondo la tua parola.»", scriptureRef: "Luca 1:38" },
  { id: 16, title: "Contro la solitudine", reflection: "Anche in mezzo alla gente posso sentirmi profondamente solo. Ma Tu sei sempre con me.", prayer: "Gesù, che hai conosciuto l’abbandono sulla croce, resta accanto a me nella mia solitudine. Fa’ che senta la Tua presenza reale nel silenzio e nella preghiera. Amen.", scripture: "«Io non ti lascerò né ti abbandonerò.»", scriptureRef: "Giosuè 1:5" },
  { id: 17, title: "Per trovare compagnia vera", reflection: "La solitudine può diventare occasione di incontro più profondo con Te, ma desidero anche relazioni autentiche.", prayer: "Padre, riempi il vuoto del mio cuore con il Tuo amore infinito. E, se è nella Tua volontà, mandami persone che mi amino veramente e con cui condividere il cammino. Amen.", scripture: "«Dov’è il tuo fratello?»", scriptureRef: "Genesi 4:9" },
  { id: 18, title: "Gratitudine nei momenti difficili", reflection: "Anche nel dolore ci sono benedizioni nascoste. Oggi scelgo di ringraziare.", prayer: "Signore, grazie per la vita, per la fede, per le persone che mi hai donato, per la Tua presenza costante. Insegnami a ringraziare anche quando non capisco il Tuo disegno. Amen.", scripture: "«In ogni cosa rendete grazie.»", scriptureRef: "1 Tessalonicesi 5:18" },
  { id: 19, title: "Riconoscere le grazie quotidiane", reflection: "I Tuoi doni sono sempre presenti, anche nelle giornate più grigie. Apri i miei occhi.", prayer: "Spirito Santo, apri i miei occhi per vedere le piccole meraviglie e le grazie che mi circondano ogni giorno. Trasforma il mio cuore in un cuore grato. Amen.", scripture: "«Ogni buon regalo e ogni dono perfetto vengono dall’alto.»", scriptureRef: "Giacomo 1:17" },
  { id: 20, title: "Totale abbandono a Dio", reflection: "Non voglio più portare tutto da solo. Mi abbandono completamente a Te.", prayer: "Padre, mi abbandono completamente a Te come un bambino tra le braccia della madre. Prendi la mia vita e fanne ciò que vuoi. Sia fatta la Tua volontà. Amen.", scripture: "«Padre, nelle tue mani consegno il mio spirito.»", scriptureRef: "Luca 23:46" },
  { id: 21, title: "Camminare nella Tua volontà", reflection: "Dopo questi 21 giorni, desidero continuare a camminare con Te ogni giorno della mia vita.", prayer: "Signore, grazie per avermi accompagnato in questo cammino. Fa’ che ogni giorno della mia vita sia una preghiera vissuta nella Tua presenza, nella gioia e nella prova. Amen.", scripture: "«Camminate mentre avete la luce.»", scriptureRef: "Giovanni 12:35" }
];

// --- SERVICES ---
const generatePrayerAudio = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Leggi con voce calma, lenta e spirituale questa preghiera: ${text}` }] }],
      config: { 
        responseModalities: [Modality.AUDIO], 
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } 
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;
    
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length;
    const buffer = audioCtx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
    
    return { buffer, audioCtx };
  } catch (error) { return null; }
};

// --- SUB-COMPONENTS ---

const Navigation = ({ user, onBack, ambientSound, onToggleAmbient, onSignOut }: any) => (
  <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between glass rounded-[2rem]">
    <div className="flex items-center gap-3 sm:gap-4">
      {onBack ? (
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"><ChevronLeft size={20} /></button>
      ) : user ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF9F43]/10 text-[#FF9F43] rounded-2xl flex items-center justify-center border border-orange-500/10">
            <UserIcon size={22} />
          </div>
          <div className="hidden xs:block">
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-none mb-1">Benvenuto</p>
            <p className="text-sm font-extrabold tracking-tight">Ciao, {user.name.split(' ')[0]}!</p>
          </div>
        </div>
      ) : null}
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onToggleAmbient} className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${ambientSound ? 'text-[#FF9F43] bg-[#FF9F43]/10' : 'opacity-30'}`}>
        {ambientSound ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      <div className="w-[1px] h-6 bg-white/10 mx-1" />
      <button onClick={onSignOut} className="w-10 h-10 flex items-center justify-center rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all">
        <LogOut size={20} />
      </button>
    </div>
  </nav>
);

const Landing = ({ onStart }: any) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center max-w-3xl mx-auto px-6 animate-fade">
    <div className="mb-14 relative">
      <div className="w-48 h-64 glass relative z-10 flex items-center justify-center rounded-[3rem]">
        <div className="relative">
          <Cross className="text-[#FF9F43] drop-shadow-lg" size={80} />
          <div className="absolute inset-0 blur-3xl bg-[#FF9F43] opacity-30 animate-pulse"></div>
        </div>
      </div>
    </div>
    <div className="z-20">
      <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight">Il Cammino <br /> <span className="text-[#FF9F43]">della Preghiera</span></h1>
      <p className="text-xl font-medium opacity-60 mb-12 max-w-md mx-auto leading-relaxed">Un percorso di 21 giorni nella luce e nella speranza. Risveglia la tua forza interiore.</p>
      <button onClick={onStart} className="w-full max-w-xs py-5 px-8 btn-premium font-bold text-lg flex items-center justify-center gap-3">
        Inizia il Viaggio <ArrowRight size={22} />
      </button>
    </div>
    <div className="mt-20 flex justify-center items-center gap-8 opacity-30 text-[10px] font-bold uppercase tracking-[0.4em]">
      <span>Speranza</span><div className="w-1 h-1 bg-white rounded-full"></div><span>Fede</span><div className="w-1 h-1 bg-white rounded-full"></div><span>Pace</span>
    </div>
  </div>
);

const LoginPage = ({ onLogin }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-fade">
      <div className="w-full max-w-md glass p-10 rounded-[3rem]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#FF9F43]/10 text-[#FF9F43] rounded-[2rem] flex items-center justify-center mx-auto mb-6"><LogIn size={38} /></div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Benvenuto</h2>
          <p className="opacity-40 text-sm">Inserisci i tuoi dati per iniziare</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if(name && email) onLogin({ name, email }); }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={20} />
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Es. Mario Rossi" className="w-full pl-12 pr-4 py-4 bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#FF9F43]/50 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={20} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="mario@esempio.it" className="w-full pl-12 pr-4 py-4 bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#FF9F43]/50 transition-all" />
            </div>
          </div>
          <button type="submit" className="w-full py-5 btn-premium font-bold text-lg flex items-center justify-center gap-3 mt-4">Accedi <LogIn size={20} /></button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ progress, onSelectDay }: any) => {
  const percent = Math.round((progress.completedDays.length / 21) * 100);
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade pb-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="glass p-8 bg-gradient-to-br from-[#FF9F43] to-[#F39C12] text-white rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={120} /></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"><TrendingUp size={24} /></div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Progressando</div>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Percorso Attuale</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-extrabold tracking-tighter">{percent}%</span>
                <span className="text-sm font-bold opacity-60">completato</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </section>
          <section className="glass p-8 rounded-[2.5rem] hidden sm:block">
             <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-6">Attività Recente</h4>
             <div className="space-y-6">
               {[0.8, 0.5, 0.95].map((v, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#FF9F43]"><Activity size={18} /></div>
                    <div className="flex-1"><div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#FF9F43] opacity-60" style={{width: `${v*100}%`}} /></div></div>
                 </div>
               ))}
             </div>
          </section>
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-2xl font-extrabold tracking-tight">I 21 Giorni</h3>
             <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
                <button className="px-4 py-1.5 bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest">Oggi</button>
                <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest opacity-30">Cronologia</button>
             </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEVOTIONAL_DATA.map((day) => {
              const isCompleted = progress.completedDays.includes(day.id);
              const isLocked = day.id > progress.currentDay;
              const isActive = day.id === progress.currentDay;
              return (
                <button key={day.id} disabled={isLocked} onClick={() => onSelectDay(day.id)} className={`flex flex-col p-6 glass text-left transition-all duration-500 rounded-[2.2rem] group border-transparent ${isActive ? 'ring-2 ring-[#FF9F43] scale-[1.02]' : ''} ${isLocked ? 'opacity-30 grayscale pointer-events-none' : 'hover:-translate-y-1'}`}>
                  <div className="flex items-center justify-between mb-12">
                    <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center ${isActive ? 'bg-[#FF9F43] text-white shadow-lg' : isCompleted ? 'bg-[#FF9F43]/15 text-[#FF9F43]' : 'bg-white/5'}`}>
                       {isCompleted ? <Check size={24} /> : <Zap size={20} />}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-20">Giorno 0{day.id}</span>
                  </div>
                  <h4 className="font-extrabold tracking-tight text-lg mb-2 line-clamp-1">{day.title}</h4>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                       <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FF9F43] animate-pulse' : 'bg-gray-600'}`} />
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{isActive ? 'In Corso' : isCompleted ? 'Completato' : 'Bloccato'}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-10 group-hover:translate-x-1 transition-transform" />
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

const DayDetail = ({ day, isCompleted, note, onComplete, onSaveNote }: any) => {
  const [localNote, setLocalNote] = useState(note);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSource, setAudioSource] = useState<any>(null);

  const toggleAudio = async () => {
    if (isPlaying) { audioSource?.stop(); setIsPlaying(false); return; }
    setIsGenerating(true);
    const res = await generatePrayerAudio(day.prayer);
    setIsGenerating(false);
    if (res) {
      const source = res.audioCtx.createBufferSource();
      source.buffer = res.buffer;
      source.connect(res.audioCtx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      setAudioSource(source);
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade pb-16 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:flex-1 space-y-8">
          <section className="glass p-8 sm:p-14 rounded-[3rem] relative overflow-hidden">
             <div className="flex justify-between items-start mb-12">
                <div className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-40">Giorno {day.id}</div>
                <Bookmark size={20} className="opacity-20" />
             </div>
             <h2 className="text-3xl sm:text-6xl font-extrabold tracking-tighter mb-10 leading-tight">{day.title}</h2>
             <div className="relative mb-16">
                <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-[#FF9F43] rounded-full opacity-30"></div>
                <p className="text-xl sm:text-3xl font-medium leading-relaxed italic opacity-70">"{day.reflection}"</p>
             </div>
             <div className="glass bg-white/[0.03] p-8 sm:p-12 rounded-[2.5rem] border-transparent">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center"><Quote className="text-[#FF9F43]" size={32} /></div>
                   <h5 className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-30">La Parola di Dio</h5>
                </div>
                <blockquote className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-snug">{day.scripture}</blockquote>
                <p className="text-lg font-bold text-[#FF9F43] tracking-widest">— {day.scriptureRef}</p>
             </div>
          </section>
          <section className="glass p-10 sm:p-14 bg-gradient-to-br from-[#FF9F43] to-[#F39C12] text-white rounded-[3rem] shadow-2xl shadow-orange-500/30">
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 mb-12 text-center sm:text-left">La Tua Preghiera</p>
             <p className="text-2xl sm:text-5xl font-extrabold tracking-tighter italic leading-snug drop-shadow-lg">{day.prayer}</p>
          </section>
        </div>
        <div className="lg:w-80 space-y-8">
           <section className="glass p-10 flex flex-col items-center rounded-[3rem]">
              <div className="relative mb-8">
                 <div className={`absolute inset-0 bg-[#FF9F43] rounded-[2.5rem] blur-3xl opacity-20 transition-all duration-1000 ${isPlaying ? 'scale-150 opacity-50' : 'scale-100'}`} />
                 <button onClick={toggleAudio} disabled={isGenerating} className={`relative w-28 h-28 flex items-center justify-center rounded-[2.5rem] text-white bg-gradient-to-br from-[#FF9F43] to-[#F39C12] shadow-2xl ${isPlaying ? 'scale-105 rotate-3' : 'hover:scale-105 active:scale-95'}`}>
                   {isGenerating ? <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : isPlaying ? <Pause size={50} fill="white" /> : <Play size={50} fill="white" className="ml-2" />}
                 </button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Ascolta Voce</p>
           </section>
           <section className="space-y-4">
              <div className="flex items-center gap-2 px-3"><Notebook size={14} className="text-[#FF9F43] opacity-50" /><h5 className="font-bold text-[10px] uppercase tracking-widest opacity-30">Diario Personale</h5></div>
              <textarea value={localNote} onChange={e => { setLocalNote(e.target.value); onSaveNote(day.id, e.target.value); }} placeholder="Cosa senti oggi?..." className="w-full glass p-6 bg-white/[0.03] outline-none rounded-[2rem] min-h-[180px] text-base font-medium resize-none shadow-none border-white/10 focus:border-[#FF9F43]/30" />
           </section>
           <button onClick={onComplete} className="w-full py-6 rounded-[2rem] font-extrabold text-xl btn-premium disabled:opacity-40" disabled={isCompleted}>{isCompleted ? 'Sessione Conclusa' : 'Concludi Oggi'}</button>
        </div>
      </div>
    </div>
  );
};

const Onboarding = ({ onComplete }: any) => {
  const [step, setStep] = useState(0);
  const data = [
    { title: "Benvenuto, Fratello", content: "Questo cammino è stato pensato per te che stai attraversando un momento difficile.", quote: "«Non sei solo»" },
    { title: "Un Passo alla Volta", content: "Non cerchiamo miracoli istantanei, ma la presenza costante di Dio nel tuo quotidiano.", quote: "Bastano pochi minuti al giorno." },
    { title: "Luce Interiore", content: "Leggi la riflessione, prega con il cuore e annota i tuoi pensieri spirituali.", quote: "Luce per i tuoi passi." }
  ];
  return (
    <div className="max-w-2xl px-6 py-12 mx-auto animate-fade">
      <div className="glass p-12 sm:p-20 rounded-[3.5rem] text-center">
        <div className="flex justify-center mb-12 gap-3">{data.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-12 bg-[#FF9F43]' : 'w-4 bg-white/10'}`} />))}</div>
        <div className="min-h-[350px] flex flex-col justify-center">
          <div className="w-20 h-20 bg-[#FF9F43]/10 text-[#FF9F43] rounded-[2rem] flex items-center justify-center mx-auto mb-10"><Star size={38} /></div>
          <h2 className="mb-6 text-4xl sm:text-5xl font-extrabold tracking-tight">{data[step].title}</h2>
          <p className="mb-10 text-xl font-medium opacity-60 leading-relaxed">{data[step].content}</p>
          <p className="text-xl italic font-bold text-[#FF9F43]">{data[step].quote}</p>
        </div>
        <div className="flex justify-center mt-12"><button onClick={() => step < 2 ? setStep(step+1) : onComplete()} className="w-full max-w-xs py-5 btn-premium font-bold text-lg flex items-center justify-center gap-3">Continua <ArrowRight size={22} /></button></div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [progress, setProgress] = useState<UserProgress>({ currentDay: 1, completedDays: [], onboarded: false, notes: {}, ambientSound: true, user: null });
  const ambientAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const p = JSON.parse(saved); setProgress(p);
      if (p.user && p.onboarded) setView('dashboard'); else if (p.user) setView('onboarding');
    }
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }, [progress]);

  useEffect(() => {
    if (!ambientAudio.current) { 
      ambientAudio.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-spirit-of-the-wood-139.mp3'); 
      ambientAudio.current.loop = true; 
      ambientAudio.current.volume = 0.08; 
    }
    if (progress.ambientSound && !['landing', 'login'].includes(view)) ambientAudio.current.play().catch(() => {}); else ambientAudio.current.pause();
  }, [progress.ambientSound, view]);

  const signOut = () => { setProgress(p => ({...p, user: null, onboarded: false})); setView('landing'); localStorage.removeItem(STORAGE_KEY); };

  return (
    <div className="min-h-screen">
      {!['landing', 'login'].includes(view) && (
        <Navigation 
          user={progress.user} 
          onBack={view === 'day-detail' ? () => setView('dashboard') : undefined} 
          ambientSound={progress.ambientSound} 
          onToggleAmbient={() => setProgress(p => ({...p, ambientSound: !p.ambientSound}))} 
          onSignOut={signOut} 
        />
      )}
      <main className={`${['landing', 'login'].includes(view) ? '' : 'pt-24 sm:pt-32'}`}>
        {view === 'landing' && <Landing onStart={() => progress.user ? setView(progress.onboarded ? 'dashboard' : 'onboarding') : setView('login')} />}
        {view === 'login' && <LoginPage onLogin={(u: any) => { setProgress(p => ({...p, user: u})); setView('onboarding'); }} />}
        {view === 'onboarding' && <Onboarding onComplete={() => { setProgress(p => ({...p, onboarded: true})); setView('dashboard'); }} />}
        {view === 'dashboard' && <Dashboard progress={progress} onSelectDay={(id: number) => { setSelectedDay(id); setView('day-detail'); }} />}
        {view === 'day-detail' && selectedDay && (
          <DayDetail 
            day={DEVOTIONAL_DATA.find(d => d.id === selectedDay)!} 
            isCompleted={progress.completedDays.includes(selectedDay)} 
            note={progress.notes[selectedDay] || ''} 
            onComplete={() => {
              setProgress(p => {
                const completed = Array.from(new Set([...p.completedDays, selectedDay]));
                const next = Math.min(21, Math.max(p.currentDay, selectedDay + 1));
                return { ...p, completedDays: completed, currentDay: next };
              });
              setView('dashboard');
            }} 
            onSaveNote={(id: any, text: any) => setProgress(p => ({...p, notes: {...p.notes, [id]: text}}))} 
          />
        )}
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
