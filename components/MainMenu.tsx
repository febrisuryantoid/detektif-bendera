
import React, { useMemo, useState, useEffect } from 'react';
import { Difficulty, GameMode } from '../types';
import { playSound } from '../utils/sound';
import { Star, Zap, Crown, Trophy, Search, Brain, Info, Languages, Download, Settings } from 'lucide-react';
import { AboutModal } from './AboutModal';
import { SettingsModal } from './SettingsModal';
import { useLanguage } from '../utils/i18n';
import { FLAG_NAMES_ID } from '../utils/flagData';

interface MainMenuProps {
  onStart: (difficulty: Difficulty, mode: GameMode) => void;
  onShowLeaderboard: () => void;
}

// --- DESIGN SYSTEM: 5-DEVICE CATEGORY RULES ---
// 1. Desktop: Massive scale, huge gaps, 3-col grid.
// 2. Tablet Landscape: Large scale, moderate gaps, 3-col grid.
// 3. Tablet Portrait: High vertical stack, 1-col grid (wide buttons).
// 4. Mobile Landscape: COMPACT vertical elements, 3-col grid (to save height), tight gaps.
// 5. Mobile Portrait: Standard vertical stack, 1-col grid.

// COMPONENT 1: Ribbon Subtitle
// Rule: Must always be significantly smaller than the main "DETEKTIF" title.
const RibbonSubtitle = ({ text, containerClass }: { text: string, containerClass?: string }) => {
  return (
    <div className={`relative flex items-center justify-center filter drop-shadow-lg z-30 transition-transform duration-300 ${containerClass}`}>
      {/* Sayap Kiri */}
      <div className="relative h-full flex items-center">
        <svg className="h-full w-auto text-[#dc2626] -mr-[1px]" viewBox="0 0 40 60" preserveAspectRatio="none">
          <path d="M0 0 L40 10 L40 50 L0 60 L15 30 Z" fill="currentColor" />
          <path d="M40 10 L25 10 L40 25 Z" fill="#7f1d1d" /> 
        </svg>
      </div>

      {/* Tengah */}
      <div className="relative bg-[#dc2626] h-full flex items-center px-4 sm:px-6 md:px-10 shadow-[inset_0_2px_0_rgba(255,255,255,0.2)]">
         <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ef4444]"></div>
         <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#991b1b]"></div>
         {/* Typography System: Subtitle */}
         <h2 className="
           font-titan text-white tracking-widest whitespace-nowrap drop-shadow-sm relative -top-[1px]
           text-base              /* 5. Mobile Portrait */
           landscape:text-sm      /* 4. Mobile Landscape (Shrink to fit height) */
           md:text-2xl            /* 3. Tablet Portrait */
           md:landscape:text-2xl  /* 2. Tablet Landscape */
           lg:text-4xl            /* 1. Desktop */
         ">
           {text}
         </h2>
      </div>

      {/* Sayap Kanan */}
      <div className="relative h-full flex items-center">
         <svg className="h-full w-auto text-[#dc2626] -ml-[1px]" viewBox="0 0 40 60" preserveAspectRatio="none">
          <path d="M40 0 L0 10 L0 50 L40 60 L25 30 Z" fill="currentColor" />
          <path d="M0 10 L15 10 L0 25 Z" fill="#7f1d1d" />
        </svg>
      </div>
    </div>
  );
};

// COMPONENT 2: Menu Button
// Rule: Height and padding must adapt to touch targets vs mouse pointers.
const MenuButton = ({ 
  onClick, 
  gradient, 
  shadowColor, 
  icon, 
  title, 
  subtitle 
}: { 
  onClick: () => void, 
  gradient: string, 
  shadowColor: string, 
  icon: React.ReactNode, 
  title: string, 
  subtitle: string 
}) => (
  <button 
    onClick={onClick}
    className={`
      w-full ${gradient} text-white rounded-xl md:rounded-2xl lg:rounded-3xl
      ${shadowColor} btn-3d flex flex-row items-center text-left gap-2 md:gap-3
      relative z-20 group ring-2 ring-white/20
      
      /* SPACING & SIZING SYSTEM */
      /* 5. Mobile Portrait: Standard Touch Target */
      p-3 min-h-[70px]

      /* 4. Mobile Landscape: Compact Height (Critical) */
      landscape:p-2 landscape:min-h-[55px]

      /* 3. Tablet Portrait: Large Touch Target, More Padding */
      md:p-4 md:min-h-[90px]

      /* 2. Tablet Landscape: Balanced */
      md:landscape:p-4 md:landscape:min-h-[80px]

      /* 1. Desktop: Massive Click Area */
      lg:p-5 lg:min-h-[110px]
    `}
  >
    <div className="
      bg-white/20 rounded-lg md:rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform shrink-0
      p-2 landscape:p-1.5 md:p-3
    ">
      <div className="
        flex items-center justify-center
        w-5 h-5 
        landscape:w-4 landscape:h-4 
        md:w-8 md:h-8 
        lg:w-10 lg:h-10
      ">
        {icon}
      </div>
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      {/* Button Typography */}
      <h3 className="
        font-black tracking-wide uppercase drop-shadow-md font-titan truncate leading-none
        text-base               /* Mobile P */
        landscape:text-sm       /* Mobile L */
        md:text-xl              /* Tablet P */
        md:landscape:text-lg    /* Tablet L */
        lg:text-3xl             /* Desktop */
      ">
        {title}
      </h3>
      <p className="
        font-bold opacity-90 truncate leading-tight
        text-[10px]             /* Mobile P */
        landscape:text-[9px]    /* Mobile L */
        md:text-sm              /* Tablet P */
        lg:text-base            /* Desktop */
      ">
        {subtitle}
      </p>
    </div>
  </button>
);

// COMPONENT 3: Top Action Button
const TopButton = ({ onClick, icon, badge, colorClass, borderColor }: any) => (
  <button 
    onClick={onClick} 
    className={`
      pointer-events-auto flex items-center justify-center 
      ${colorClass} rounded-xl sm:rounded-2xl shadow-lg ${borderColor} 
      btn-3d relative hover:scale-105 active:scale-95 transition-transform
      
      /* SIZING */
      w-10 h-10 
      landscape:w-8 landscape:h-8 
      sm:w-12 sm:h-12 
      lg:w-16 lg:h-16 
    `}
  >
    <div className="w-5 h-5 landscape:w-4 landscape:h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-current">
        {icon}
    </div>
    {badge && (
      <div className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white text-[8px] sm:text-[10px] lg:text-xs font-black px-1.5 py-0.5 rounded-md shadow border border-white">
        {badge}
      </div>
    )}
  </button>
);

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, onShowLeaderboard }) => {
  const { t, lang, setLang } = useLanguage();
  const [activeMode, setActiveMode] = useState<GameMode>('difference');
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
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

  const festiveFlags = useMemo(() => {
    const allCodes = Object.keys(FLAG_NAMES_ID);
    const shuffled = [...allCodes].sort(() => 0.5 - Math.random()).slice(0, 40); 
    return shuffled.map((code, i) => ({
      code,
      style: {
        top: `${Math.random() * 90}%`,
        left: `-${10 + Math.random() * 20}%`,
        animation: `driftRight ${25 + Math.random() * 15}s linear infinite`,
        animationDelay: `-${Math.random() * 20}s`,
        opacity: 0.8,
        transform: `scale(${0.4 + Math.random() * 0.4})`, 
        zIndex: 0,
      }
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300 flex flex-col overflow-hidden">
      
      {/* 0. BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {festiveFlags.map((flag, idx) => (
          <div key={`${flag.code}-${idx}`} className="absolute z-0 w-12 md:w-20" style={flag.style}>
             <div className="bg-white p-0.5 rounded-sm shadow-sm rotate-6">
               <img src={`https://flagcdn.com/w160/${flag.code}.png`} alt="" className="w-full h-full object-contain rounded-sm" />
             </div>
          </div>
        ))}
      </div>

      {/* 1. HEADER BAR */}
      <div className="absolute top-0 left-0 w-full p-3 lg:p-6 flex justify-end gap-2 lg:gap-3 z-50 pointer-events-none">
        <TopButton 
          onClick={() => { playSound('click'); setShowSettings(true); }} 
          icon={<Settings className="w-full h-full" strokeWidth={2.5} />}
          colorClass="bg-white text-gray-700"
          borderColor="border-gray-300"
        />
        <TopButton 
          onClick={() => { playSound('click'); setShowAbout(true); }} 
          icon={<Info className="w-full h-full" strokeWidth={3} />}
          colorClass="bg-white text-sky-500"
          borderColor="border-gray-200"
        />
        <TopButton 
          onClick={toggleLanguage} 
          icon={<Languages className="w-full h-full" strokeWidth={3} />}
          colorClass="bg-white text-indigo-500"
          borderColor="border-gray-200"
          badge={lang.toUpperCase()}
        />
        {deferredPrompt && (
           <TopButton 
             onClick={() => { playSound('click'); handleInstallClick(); }} 
             icon={<Download className="w-full h-full" strokeWidth={3} />}
             colorClass="bg-green-500 text-white animate-bounce"
             borderColor="border-green-700"
           />
        )}
      </div>

      {/* 2. MAIN LAYOUT SYSTEM */}
      <div className="flex-1 w-full relative z-30 overflow-y-auto custom-scrollbar">
        
        {/* SPACING SYSTEM (The "Gap" Logic) */}
        <div className="
          min-h-full flex flex-col items-center justify-center 
          
          /* PADDING */
          p-4                   /* Mobile P */
          landscape:p-2         /* Mobile L */
          md:p-8                /* Tablet */
          lg:p-12               /* Desktop */

          /* VERTICAL GAP BETWEEN SECTIONS */
          gap-6                 /* Mobile P: Standard breathing room */
          landscape:gap-3       /* Mobile L: TIGHT breathing room */
          md:gap-10             /* Tablet P: Very spacious */
          md:landscape:gap-8    /* Tablet L: Spacious */
          lg:gap-14             /* Desktop: Cinematic spacing */
        ">
          
          {/* SECTION A: HERO / TITLE */}
          <div className="flex flex-col items-center text-center shrink-0 relative z-40">
            <div className="relative transform hover:scale-105 duration-300">
                <Star className="
                  absolute text-yellow-300 animate-spin-slow drop-shadow-md z-0
                  -top-6 -left-6 w-12 h-12
                  landscape:-top-3 landscape:-left-3 landscape:w-8 landscape:h-8
                  md:-top-8 md:-left-8 md:w-20 md:h-20
                  lg:-top-12 lg:-left-12 lg:w-32 lg:h-32
                " fill="currentColor" stroke="orange" strokeWidth={1} />
                
                {/* TITLE TYPOGRAPHY: HIERARCHY KING */}
                <h1 className="
                  font-titan tracking-wider leading-none text-center relative z-40 text-[#fbbf24] drop-shadow-md text-stroke-lg
                  text-6xl              /* 5. Mobile Portrait */
                  landscape:text-5xl    /* 4. Mobile Landscape */
                  md:text-8xl           /* 3. Tablet Portrait */
                  md:landscape:text-7xl /* 2. Tablet Landscape */
                  lg:text-9xl           /* 1. Desktop */
                ">
                  {t.mainMenu.title}
                </h1>
            </div>
            
            {/* RIBBON: Scaled Relative to Title */}
            <RibbonSubtitle 
              text={t.mainMenu.subtitle} 
              containerClass="
                mt-1 landscape:mt-0 md:mt-4
                h-8                 /* Mobile P */
                landscape:h-7       /* Mobile L */
                md:h-14             /* Tablet P */
                md:landscape:h-12   /* Tablet L */
                lg:h-24             /* Desktop */
              " 
            />
            
            {/* TAGLINE: Subdued */}
            <div className="
              bg-white/90 backdrop-blur-md rounded-full border-2 md:border-4 border-white shadow-lg z-30 relative
              px-4 py-1.5 landscape:px-3 landscape:py-0.5 md:px-6 md:py-2 lg:px-8 lg:py-2.5
              mt-4 landscape:mt-2 md:mt-6 lg:mt-8
            ">
                <p className="
                  text-indigo-600 font-black tracking-widest uppercase
                  text-[10px]           /* Mobile P */
                  landscape:text-[9px]  /* Mobile L */
                  md:text-sm            /* Tablet P */
                  lg:text-lg            /* Desktop */
                ">
                  {t.mainMenu.tagline}
                </p>
            </div>
          </div>

          {/* SECTION B: CONTROLS CONTAINER */}
          <div className="
            w-full z-20 relative transition-all duration-500
            bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/50 
            
            /* CONTAINER WIDTH LIMITS */
            max-w-[340px]               /* Mobile P */
            landscape:max-w-2xl         /* Mobile L (Wider to fit 3 cols) */
            md:max-w-[500px]            /* Tablet P */
            md:landscape:max-w-4xl      /* Tablet L */
            lg:max-w-6xl                /* Desktop */

            /* INNER PADDING */
            p-4 landscape:p-3 md:p-6 lg:p-10
          ">
              
              {/* MODE SWITCHER */}
              <div className="
                flex bg-white/60 p-1 rounded-xl md:rounded-2xl relative shadow-inner border border-white/40
                mb-4 landscape:mb-2 md:mb-6
              ">
                <button 
                  onClick={() => { playSound('click'); setActiveMode('difference'); }} 
                  className={`
                    flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl font-black transition-all z-10 
                    text-xs md:text-base lg:text-xl py-2.5 landscape:py-1.5 lg:py-4
                    ${activeMode === 'difference' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-500 hover:bg-white/50'}
                  `}
                >
                  <Search size={18} strokeWidth={3} className="w-4 h-4 landscape:w-3 landscape:h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {t.mainMenu.modeDiff}
                </button>
                <button 
                  onClick={() => { playSound('click'); setActiveMode('quiz'); }} 
                  className={`
                    flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl font-black transition-all z-10 
                    text-xs md:text-base lg:text-xl py-2.5 landscape:py-1.5 lg:py-4
                    ${activeMode === 'quiz' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-500 hover:bg-white/50'}
                  `}
                >
                  <Brain size={18} strokeWidth={3} className="w-4 h-4 landscape:w-3 landscape:h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {t.mainMenu.modeQuiz}
                </button>
              </div>

              {/* DIFFICULTY GRID SYSTEM */}
              <div className="
                grid 
                gap-3 landscape:gap-3 md:gap-5 lg:gap-8
                
                /* GRID LAYOUT RULES */
                grid-cols-1               /* Mobile P: Stacked */
                landscape:grid-cols-3     /* Mobile L: Horizontal (Save vertical space!) */
                md:grid-cols-1            /* Tablet P: Stacked (Wide buttons) */
                md:landscape:grid-cols-3  /* Tablet L: Horizontal */
                lg:grid-cols-3            /* Desktop: Horizontal */
              ">
                <MenuButton 
                  onClick={() => handleStart('easy')}
                  gradient="bg-gradient-to-b from-green-400 to-emerald-500"
                  shadowColor="border-emerald-700"
                  icon={<Star fill="white" className="w-full h-full" />}
                  title={t.mainMenu.btnEasy}
                  subtitle={activeMode === 'quiz' ? t.mainMenu.subEasyQuiz : t.mainMenu.subEasy}
                />
                <MenuButton 
                  onClick={() => handleStart('medium')}
                  gradient="bg-gradient-to-b from-blue-400 to-indigo-500"
                  shadowColor="border-indigo-700"
                  icon={<Zap fill="white" className="w-full h-full" />}
                  title={t.mainMenu.btnMedium}
                  subtitle={activeMode === 'quiz' ? t.mainMenu.subMediumQuiz : t.mainMenu.subMedium}
                />
                <MenuButton 
                  onClick={() => handleStart('hard')}
                  gradient="bg-gradient-to-b from-purple-400 to-fuchsia-500"
                  shadowColor="border-fuchsia-700"
                  icon={<Crown fill="white" className="w-full h-full" />}
                  title={t.mainMenu.btnHard}
                  subtitle={activeMode === 'quiz' ? t.mainMenu.subHardQuiz : t.mainMenu.subHard}
                />
              </div>

              {/* LEADERBOARD BUTTON */}
              <button 
                onClick={() => { playSound('click'); onShowLeaderboard(); }}
                className="
                  w-full bg-gradient-to-b from-orange-400 to-orange-500 text-white 
                  font-bold rounded-xl md:rounded-2xl lg:rounded-3xl border-orange-700 btn-3d 
                  flex items-center justify-center gap-2 md:gap-3
                  shadow-lg hover:brightness-110 group font-titan tracking-wide
                  
                  mt-4 landscape:mt-3 md:mt-6 lg:mt-8
                  py-3 landscape:py-2 md:py-4 lg:py-6
                  text-sm landscape:text-xs md:text-lg lg:text-2xl
                "
              >
                <Trophy className="w-4 h-4 landscape:w-3 landscape:h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-yellow-100 group-hover:scale-110 transition-transform" /> {t.mainMenu.btnLeaderboard}
              </button>
          </div>
          
          {/* SECTION C: FOOTER */}
          <div className="w-full text-center shrink-0">
              <p className="
                text-indigo-900 font-bold opacity-70 bg-white/30 px-4 py-1 rounded-full inline-block backdrop-blur-sm
                text-[10px] landscape:text-[9px] md:text-sm lg:text-base
              ">
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
