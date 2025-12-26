
import React, { useMemo, useState, useEffect } from 'react';
import { Difficulty, GameMode } from '../types';
import { playSound } from '../utils/sound';
import { Star, Search, Brain, Info, Languages, Download, Settings, Cloud, Zap, Flame, Globe } from 'lucide-react';
import { AboutModal } from './AboutModal';
import { SettingsModal } from './SettingsModal';
import { useLanguage } from '../utils/i18n';
import { FLAG_NAMES_ID } from '../utils/flagData';

interface MainMenuProps {
  onStart: (difficulty: Difficulty, mode: GameMode) => void;
  onShowLeaderboard: () => void;
}

// --- VISUAL COMPONENTS ---

// 1. RIBBON COMPONENT (Red Banner)
const RibbonTitle = ({ text }: { text: string }) => {
  return (
    <div className="relative flex items-center justify-center z-30 mt-[-8px] md:mt-[-12px]">
       {/* Left Tail */}
       <div className="h-8 md:h-12 w-8 md:w-12 bg-[#b91c1c] absolute left-2 md:left-0 top-2 -z-10 transform -skew-y-6 rotate-12 rounded-sm"></div>
       
       {/* Main Banner */}
       <div className="
          bg-[#ef4444] text-white px-8 md:px-14 py-1 md:py-2 
          relative shadow-lg transform -rotate-2
          border-t-2 border-[#f87171] border-b-4 border-[#b91c1c]
          before:content-[''] before:absolute before:left-[-10px] before:top-[10px] before:border-r-[10px] before:border-t-[10px] before:border-r-[#7f1d1d] before:border-t-transparent
          after:content-[''] after:absolute after:right-[-10px] after:top-[10px] after:border-l-[10px] after:border-t-[10px] after:border-l-[#7f1d1d] after:border-t-transparent
       ">
          <h2 className="font-display font-bold text-lg md:text-3xl tracking-widest drop-shadow-md">{text}</h2>
       </div>

       {/* Right Tail */}
       <div className="h-8 md:h-12 w-8 md:w-12 bg-[#b91c1c] absolute right-2 md:right-0 top-2 -z-10 transform skew-y-6 -rotate-12 rounded-sm"></div>
    </div>
  );
};

// 2. MENU BUTTON COMPONENT
const MenuButton = ({ 
  onClick, 
  gradient, 
  borderColor, 
  icon, 
  title, 
  subtitle,
  className = "",
  shineDelay = 0,
  decorIcon
}: { 
  onClick: () => void, 
  gradient: string, 
  borderColor: string, 
  icon: React.ReactNode, 
  title: string, 
  subtitle: string,
  className?: string,
  shineDelay?: number,
  decorIcon?: React.ReactNode
}) => (
  <button 
    onClick={onClick}
    className={`
      w-full group relative overflow-visible
      ${gradient} ${borderColor} 
      border-b-[5px] md:border-b-[6px] active:border-b-0 active:translate-y-[5px]
      rounded-2xl md:rounded-3xl p-3 md:p-4 
      flex items-center gap-3 md:gap-6 lg:gap-8 
      transition-all duration-200 shadow-lg hover:brightness-110
      ${className}
    `}
  >
    {/* SHINE EFFECT OVERLAY (Clipped inside) */}
    <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden pointer-events-none z-0">
        <div 
        className="absolute inset-0 w-full h-full"
        style={{
            background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
            transform: 'translateX(-100%)',
            animation: `shine-sweep 4s infinite ease-in-out`,
            animationDelay: `${shineDelay}s`
        }}
        />
    </div>

    {/* Decorative Contextual Icons (Replaces Generic Sparkles) */}
    <div className="absolute top-2 right-4 opacity-20 rotate-12 z-10 transition-transform group-hover:scale-110">
      {decorIcon}
    </div>
    <div className="absolute bottom-2 left-24 opacity-10 z-10">
       <Star size={12} color="white" fill="white" />
    </div>

    {/* Icon Container (Background Circle) */}
    <div className="
        relative
        w-12 h-12 landscape:w-10 landscape:h-10 md:w-20 md:h-20 
        bg-white/20 rounded-xl md:rounded-2xl 
        flex items-center justify-center shrink-0 
        backdrop-blur-sm shadow-inner border border-white/30 z-20 
        overflow-visible
    ">
       {/* The Icon Itself (Allowed to overflow) */}
       <div className="absolute flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 drop-shadow-xl z-30">
         {icon}
       </div>
    </div>

    {/* Text Content */}
    <div className="flex-1 text-left flex flex-col justify-center min-w-0 z-20">
       <h3 className="
         font-display font-bold text-white uppercase tracking-wide leading-none drop-shadow-md truncate
         text-lg landscape:text-xs md:landscape:text-lg md:text-2xl lg:text-3xl
       ">
         {title}
       </h3>
       <p className="
         text-white/90 font-medium tracking-wide mt-0.5 md:mt-1 truncate
         text-[10px] landscape:text-[8px] md:landscape:text-[10px] md:text-sm
       ">
         {subtitle}
       </p>
    </div>
  </button>
);

// 3. TOP ICON BUTTON
const TopButton = ({ onClick, icon, badge, colorClass }: any) => (
  <button 
    onClick={onClick} 
    className={`
      w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 
      rounded-xl md:rounded-2xl flex items-center justify-center 
      shadow-md hover:scale-110 active:scale-95 transition-all relative
      border-b-4 active:border-b-0 active:translate-y-1
      ${colorClass}
    `}
  >
    {icon}
    {badge && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white shadow-sm font-sans">
        {badge}
      </span>
    )}
  </button>
);

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, onShowLeaderboard }) => {
  const { t, lang, setLang } = useLanguage();
  const [activeMode, setActiveMode] = useState<GameMode>('difference');
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') setDeferredPrompt(null);
      });
    }
  };
  
  const triggerFullScreen = () => {
    try {
      const elem = document.documentElement;
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
        else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
      }
    } catch (err) { console.log(err); }
  };

  const handleStart = (diff: Difficulty) => {
    triggerFullScreen();
    playSound('click');
    onStart(diff, activeMode);
  };

  const toggleLanguage = () => {
    playSound('click');
    setLang(lang === 'id' ? 'en' : 'id');
  };

  // Background Flags Animation
  const festiveFlags = useMemo(() => {
    const allCodes = Object.keys(FLAG_NAMES_ID);
    const shuffled = [...allCodes].sort(() => 0.5 - Math.random()).slice(30, 60); 
    return shuffled.map((code, i) => ({
      code,
      style: {
        top: `${Math.random() * 90}%`,
        left: `-${10 + Math.random() * 20}%`,
        animation: `driftRight ${25 + Math.random() * 15}s linear infinite`,
        animationDelay: `-${Math.random() * 20}s`,
        opacity: 0.6,
        transform: `scale(${0.3 + Math.random() * 0.4}) rotate(${Math.random() * 20 - 10}deg)`, 
        zIndex: 0,
      }
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-200 flex flex-col overflow-hidden font-sans">
      
      {/* GLOBAL STYLES FOR SHINE ANIMATION */}
      <style>{`
        @keyframes shine-sweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          20% { transform: translateX(200%) skewX(-20deg); } /* Sweep Duration */
          100% { transform: translateX(200%) skewX(-20deg); } /* Wait Duration */
        }
      `}</style>

      {/* 0. BACKGROUND DECORATION */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {festiveFlags.map((flag, idx) => (
          <div key={`${flag.code}-${idx}`} className="absolute z-0 w-12 md:w-20 drop-shadow-sm" style={flag.style}>
             <div className="bg-white p-0.5 rounded-sm shadow-sm">
               <img src={`https://flagcdn.com/w160/${flag.code}.png`} alt="" className="w-full h-full object-contain rounded-sm" />
             </div>
          </div>
        ))}
      </div>

      {/* 1. HEADER ICONS (Top Right) */}
      <div className="absolute top-0 right-0 p-4 md:p-6 flex gap-3 z-50">
        <TopButton 
          onClick={() => { playSound('click'); setShowSettings(true); }} 
          icon={<Settings className="w-6 h-6" />}
          colorClass="bg-white text-gray-600 border-gray-300"
        />
        <TopButton 
          onClick={() => { playSound('click'); setShowAbout(true); }} 
          icon={<Info className="w-6 h-6" strokeWidth={2.5} />}
          colorClass="bg-white text-sky-500 border-gray-300"
        />
        <TopButton 
          onClick={toggleLanguage} 
          icon={<Languages className="w-6 h-6" />}
          badge={lang.toUpperCase()}
          colorClass="bg-white text-indigo-500 border-gray-300"
        />
        {deferredPrompt && (
           <TopButton 
             onClick={() => { playSound('click'); handleInstallClick(); }} 
             icon={<Download className="w-6 h-6" />}
             colorClass="bg-green-500 text-white border-green-700 animate-bounce"
           />
        )}
      </div>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 w-full relative z-30 overflow-y-auto no-scrollbar flex flex-col items-center">
        
        {/* CONTAINER UTAMA - MODIFIED MAX-WIDTH FOR TABLET LANDSCAPE */}
        <div className="w-full max-w-md landscape:max-w-4xl md:max-w-3xl md:landscape:max-w-5xl lg:max-w-4xl xl:max-w-5xl px-4 landscape:px-12 py-4 md:py-12 flex flex-col items-center min-h-full justify-center">
          
          {/* SECTION A: TITLE AREA */}
          <div className="flex flex-col items-center mb-4 landscape:mb-2 md:mb-8 relative z-40 transform scale-90 landscape:scale-75 md:scale-100 w-full">
            {/* Main Title "DETEKTIF" */}
            <h1 className="
              font-display font-extrabold text-[3.5rem] md:text-[5rem] lg:text-[6rem] leading-none 
              text-[#fbbf24] drop-shadow-[0_4px_0_rgba(180,83,9,0.5)] 
              text-stroke-lg md:text-stroke-xl tracking-wide relative z-20
            ">
              {t.mainMenu.mainTitle1}
            </h1>
            
            {/* Ribbon "BENDERA" */}
            <RibbonTitle text={t.mainMenu.mainTitle2} />

            {/* Subtitle Pill - UPDATED FOR MOBILE PORTRAIT FIT */}
            <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow-md mt-4 border-2 border-white/50 max-w-[95vw] mx-auto flex justify-center">
              <p className="text-indigo-600 font-medium text-[8px] min-[360px]:text-[9px] min-[400px]:text-[10px] md:text-xs tracking-widest md:tracking-[0.2em] uppercase font-sans whitespace-nowrap">
                {t.mainMenu.tagline}
              </p>
            </div>
          </div>

          {/* SECTION B: GLASS CARD CONTAINER */}
          <div className="
            w-full bg-white/40 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] 
            p-3 md:p-6 border-[3px] border-white/60 shadow-2xl relative
          ">
            {/* Inner Glow/Highlight */}
            <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] border border-white/50 pointer-events-none"></div>

            {/* MODE SWITCHER TABS */}
            <div className="bg-indigo-50/80 p-1.5 rounded-2xl flex relative mb-3 md:mb-6 shadow-inner">
               <button 
                  onClick={() => { playSound('click'); setActiveMode('difference'); }}
                  className={`
                    flex-1 py-2 md:py-3 rounded-xl font-semibold text-xs landscape:text-[10px] md:text-base uppercase tracking-tight flex items-center justify-center gap-2 transition-all duration-300
                    ${activeMode === 'difference' 
                       ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md' 
                       : 'text-gray-400 hover:bg-white/50'}
                  `}
               >
                  <Search size={16} strokeWidth={3} className="md:w-[18px] md:h-[18px]" /> {t.mainMenu.modeDiff}
               </button>
               <button 
                  onClick={() => { playSound('click'); setActiveMode('quiz'); }}
                  className={`
                    flex-1 py-2 md:py-3 rounded-xl font-semibold text-xs landscape:text-[10px] md:text-base uppercase tracking-tight flex items-center justify-center gap-2 transition-all duration-300
                    ${activeMode === 'quiz' 
                       ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-md' 
                       : 'text-gray-400 hover:bg-white/50'}
                  `}
               >
                  <Brain size={16} strokeWidth={3} className="md:w-[18px] md:h-[18px]" /> {t.mainMenu.modeQuiz}
               </button>
            </div>

            {/* DIFFICULTY BUTTONS */}
            <div className="w-full flex flex-col landscape:grid landscape:grid-cols-3 gap-2 landscape:gap-3 md:gap-4 mb-0 landscape:mb-4">
              <MenuButton 
                onClick={() => handleStart('easy')}
                gradient="bg-gradient-to-r from-green-400 to-emerald-500"
                borderColor="border-emerald-700"
                icon={<img src="https://cdn-icons-png.flaticon.com/512/2280/2280503.png" alt="Easy" className="w-16 h-16 landscape:w-12 landscape:h-12 md:w-28 md:h-28 object-contain drop-shadow-md filter" />}
                title={t.mainMenu.btnEasy}
                subtitle={activeMode === 'difference' ? t.mainMenu.subEasy : t.mainMenu.subEasyQuiz}
                shineDelay={0}
                decorIcon={<Cloud size={28} className="text-white" />}
              />
              <MenuButton 
                onClick={() => handleStart('medium')}
                gradient="bg-gradient-to-r from-indigo-400 to-violet-500"
                borderColor="border-indigo-700"
                icon={<img src="https://cdn-icons-png.flaticon.com/512/2278/2278929.png" alt="Medium" className="w-16 h-16 landscape:w-12 landscape:h-12 md:w-28 md:h-28 object-contain drop-shadow-md filter" />}
                title={t.mainMenu.btnMedium}
                subtitle={activeMode === 'difference' ? t.mainMenu.subMedium : t.mainMenu.subMediumQuiz}
                shineDelay={1}
                decorIcon={<Zap size={28} className="text-white" fill="currentColor" />}
              />
              <MenuButton 
                onClick={() => handleStart('hard')}
                gradient="bg-gradient-to-r from-fuchsia-400 to-pink-500"
                borderColor="border-fuchsia-700"
                icon={<img src="https://cdn-icons-png.flaticon.com/512/6452/6452258.png" alt="Hard" className="w-16 h-16 landscape:w-12 landscape:h-12 md:w-28 md:h-28 object-contain drop-shadow-md filter" />}
                title={t.mainMenu.btnHard}
                subtitle={activeMode === 'difference' ? t.mainMenu.subHard : t.mainMenu.subHardQuiz}
                shineDelay={2}
                decorIcon={<Flame size={28} className="text-white" fill="currentColor" />}
              />
            </div>

            {/* SEPARATOR (Portrait Only) - Reduced Spacing */}
            <div className="w-full py-4 landscape:hidden flex items-center justify-center opacity-60">
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
            </div>

            {/* LEADERBOARD BUTTON */}
            <div className="w-full">
               <MenuButton 
                 onClick={() => { playSound('click'); onShowLeaderboard(); }}
                 gradient="bg-gradient-to-r from-amber-400 to-orange-500"
                 borderColor="border-orange-700"
                 icon={<img src="https://cdn-icons-png.flaticon.com/512/7645/7645279.png" alt="Leaderboard" className="w-16 h-16 landscape:w-12 landscape:h-12 md:w-28 md:h-28 object-contain drop-shadow-md filter" />}
                 title={t.mainMenu.btnLeaderboard}
                 subtitle={t.leaderboard.emptyDesc}
                 shineDelay={3}
                 decorIcon={<Globe size={28} className="text-white" />}
               />
            </div>
            
          </div>

          {/* FOOTER */}
          <div className="mt-4 md:mt-8 text-center">
             <p className="text-indigo-800/60 font-medium text-[10px] md:text-xs tracking-wider">
               {t.mainMenu.footer}
             </p>
          </div>

        </div>
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
