
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

// --- SYSTEMATIC DESIGN COMPONENTS ---

// 1. Ribbon Subtitle (Responsive & Proportional)
const RibbonSubtitle = ({ text, className }: { text: string, className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center filter drop-shadow-lg z-30 hover:scale-105 transition-transform duration-300 ${className}`}>
      {/* Sayap Kiri */}
      <div className="relative h-full flex items-center">
        <svg className="h-full w-auto text-[#dc2626] -mr-[1px]" viewBox="0 0 40 60" preserveAspectRatio="none">
          <path d="M0 0 L40 10 L40 50 L0 60 L15 30 Z" fill="currentColor" />
          <path d="M40 10 L25 10 L40 25 Z" fill="#7f1d1d" /> 
        </svg>
      </div>

      {/* Tengah */}
      <div className="relative bg-[#dc2626] h-full flex items-center px-4 sm:px-8 md:px-12 shadow-[inset_0_2px_0_rgba(255,255,255,0.2)]">
         <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ef4444]"></div>
         <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#991b1b]"></div>
         {/* Teks Ribbon */}
         <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-titan text-white tracking-widest whitespace-nowrap drop-shadow-sm relative -top-[1px]">
           {text}
         </h1>
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

// 2. Menu Button (Standardized Sizes & Compact Landscape)
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
      ${shadowColor}
      btn-3d
      flex flex-row items-center text-left
      gap-2 md:gap-4
      relative z-20 group ring-2 ring-white/20
      
      /* SIZING OPTIMIZATION */
      /* Portrait Mobile: Standard */
      p-3 min-h-[64px]
      /* Landscape Mobile: COMPACT */
      landscape:p-2 landscape:min-h-[50px]
      /* Desktop/Tablet: LARGE */
      lg:p-5 lg:min-h-[100px]
    `}
  >
    <div className="
      bg-white/20 rounded-lg md:rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform shadow-inner shrink-0 border border-white/30
      p-2 md:p-3 landscape:p-1.5 lg:p-3
    ">
      {/* Icon Wrapper Scaling */}
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
      <h3 className="
        font-black tracking-wide uppercase drop-shadow-md font-titan truncate leading-none mb-0.5 md:mb-1
        text-base 
        landscape:text-sm 
        md:text-xl 
        lg:text-3xl
      ">
        {title}
      </h3>
      <p className="
        font-bold opacity-90 truncate leading-tight
        text-[10px] 
        landscape:text-[9px] 
        md:text-xs 
        lg:text-base
      ">
        {subtitle}
      </p>
    </div>
  </button>
);

// 3. Top Action Button
const TopButton = ({ onClick, icon, badge, colorClass, borderColor }: any) => (
  <button 
    onClick={onClick} 
    className={`
      pointer-events-auto 
      flex items-center justify-center 
      ${colorClass} rounded-xl sm:rounded-2xl shadow-lg ${borderColor} 
      btn-3d relative hover:scale-105 active:scale-95 transition-transform
      
      w-10 h-10 
      landscape:w-8 landscape:h-8 
      sm:w-12 sm:h-12 
      lg:w-14 lg:h-14 
    `}
  >
    <div className="w-5 h-5 landscape:w-4 landscape:h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-current">
        {icon}
    </div>
    {badge && (
      <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[9px] sm:text-[10px] lg:text-xs font-black px-1.5 py-0.5 rounded-md shadow border border-white">
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
    const shuffled = [...allCodes].sort(() => 0.5 - Math.random()).slice(30, 60); 
    return shuffled.map((code, i) => ({
      code,
      style: {
        top: `${Math.random() * 90}%`,
        left: `-${10 + Math.random() * 20}%`,
        animation: `driftRight ${20 + Math.random() * 20}s linear infinite`,
        animationDelay: `-${Math.random() * 20}s`,
        opacity: 1, 
        transform: `scale(${0.5 + Math.random() * 0.3})`, 
        zIndex: 0,
        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
      }
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300 flex flex-col overflow-hidden">
      
      {/* BACKGROUND FLAGS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-300 rounded-full mix-blend-multiply filter blur-[60px] opacity-40"></div>
         <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[60px] opacity-40"></div>
         {festiveFlags.map((flag, idx) => (
          <div key={`${flag.code}-${idx}`} className="absolute z-0 w-12 md:w-16 lg:w-20" style={flag.style}>
             <div className="bg-white p-0.5 rounded-sm shadow-sm rotate-6">
               <img src={`https://flagcdn.com/w160/${flag.code}.png`} alt="" className="w-full h-full object-contain rounded-sm" />
             </div>
          </div>
        ))}
      </div>

      {/* HEADER BAR (Actions) */}
      <div className="absolute top-0 left-0 w-full p-2 lg:p-6 flex justify-end gap-2 lg:gap-3 z-50 pointer-events-none">
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

      {/* MAIN CONTENT - Full Height, Centered, Scrollable if short height */}
      {/* landscape:p-2 (Very tight padding on mobile landscape) */}
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 landscape:p-2 lg:p-8 relative z-30 min-h-0 overflow-y-auto custom-scrollbar">
        
        {/* LOGO SECTION - COMPACT ON LANDSCAPE */}
        <div className="
           flex flex-col items-center text-center shrink-0 relative z-40
           mb-6 landscape:mb-2 lg:mb-12
        ">
           <div className="relative transform hover:scale-105 duration-300">
              <Star className="
                absolute text-yellow-300 animate-spin-slow drop-shadow-md z-0
                -top-6 -left-6 w-12 h-12
                landscape:-top-4 landscape:-left-4 landscape:w-8 landscape:h-8
                md:-top-10 md:-left-12 md:w-24 md:h-24
              " fill="currentColor" stroke="orange" strokeWidth={1} />
              
              {/* TITLE: Drastically smaller in landscape mobile to save space */}
              <h1 className="
                font-titan tracking-wider leading-none text-center relative z-40 text-[#fbbf24] drop-shadow-md text-stroke-lg
                text-5xl        
                landscape:text-4xl
                sm:text-6xl     
                md:text-7xl     
                lg:text-8xl     
                xl:text-9xl     
              ">
                {t.mainMenu.title}
              </h1>
           </div>
           
           {/* RIBBON: Compact on landscape */}
           <RibbonSubtitle 
             text={t.mainMenu.subtitle} 
             className="
               mt-1 md:mt-2 lg:mt-4
               h-8        
               landscape:h-6
               sm:h-10    
               md:h-14    
               lg:h-20    
             " 
           />
           
           {/* TAGLINE */}
           <div className="
             bg-white/90 backdrop-blur-md rounded-full border-2 md:border-4 border-white shadow-lg z-30 relative
             mt-3 px-4 py-1.5 
             landscape:mt-1 landscape:py-0.5
             md:mt-5 md:px-8 md:py-2.5
           ">
              <p className="text-indigo-600 font-black text-[10px] sm:text-xs md:text-sm lg:text-base tracking-widest uppercase">
                 {t.mainMenu.tagline}
              </p>
           </div>
        </div>

        {/* CONTROLS CARD - Responsive Width */}
        <div className="
          w-full z-20 relative
          bg-white/40 backdrop-blur-xl rounded-3xl 
          shadow-2xl border-4 border-white/50 
          
          /* WIDTH */
          max-w-[320px]       
          sm:max-w-[400px]    
          md:max-w-[500px]    
          landscape:max-w-4xl 
          lg:max-w-5xl        

          /* PADDING */
          p-4 
          landscape:p-2 
          md:p-6 lg:p-8 
        ">
            
            {/* Mode Switcher - Thinner on landscape */}
            <div className="
              flex bg-white/60 p-1.5 rounded-xl md:rounded-2xl relative shadow-inner border border-white/40
              mb-4 landscape:mb-2 md:mb-6
            ">
              <button 
                onClick={() => { playSound('click'); setActiveMode('difference'); }} 
                className={`
                  flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl font-black transition-all z-10 
                  text-xs sm:text-sm md:text-base lg:text-lg
                  py-3 landscape:py-1.5
                  ${activeMode === 'difference' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-500 hover:bg-white/50'}
                `}
              >
                <Search size={18} strokeWidth={3} className="w-4 h-4 landscape:w-3 landscape:h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {t.mainMenu.modeDiff}
              </button>
              <button 
                onClick={() => { playSound('click'); setActiveMode('quiz'); }} 
                className={`
                  flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl font-black transition-all z-10 
                  text-xs sm:text-sm md:text-base lg:text-lg
                  py-3 landscape:py-1.5
                  ${activeMode === 'quiz' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-500 hover:bg-white/50'}
                `}
              >
                <Brain size={18} strokeWidth={3} className="w-4 h-4 landscape:w-3 landscape:h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {t.mainMenu.modeQuiz}
              </button>
            </div>

            {/* Difficulty Buttons - Responsive Grid */}
            <div className="grid grid-cols-1 landscape:grid-cols-3 lg:grid-cols-3 gap-3 landscape:gap-2 md:gap-4 lg:gap-6">
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

            {/* Leaderboard Button - Compact on landscape */}
            <button 
              onClick={() => { playSound('click'); onShowLeaderboard(); }}
              className="
                w-full bg-gradient-to-b from-orange-400 to-orange-500 text-white 
                font-bold rounded-xl md:rounded-2xl lg:rounded-3xl border-orange-700 btn-3d 
                flex items-center justify-center gap-2 md:gap-3
                shadow-lg hover:brightness-110 group
                font-titan tracking-wide
                
                mt-4 landscape:mt-2 md:mt-6 
                py-3 landscape:py-1.5 md:py-4 
                text-sm md:text-base lg:text-xl
              "
            >
              <Trophy className="w-4 h-4 landscape:w-3 landscape:h-3 md:w-6 md:h-6 text-yellow-100 group-hover:scale-110 transition-transform" /> {t.mainMenu.btnLeaderboard}
            </button>
        </div>
        
        <div className="w-full text-center mt-4 landscape:mt-1 md:mt-8 shrink-0 pb-2">
             <p className="text-indigo-900 font-bold opacity-70 text-[9px] sm:text-xs md:text-sm bg-white/30 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm">
                {t.mainMenu.footer}
             </p>
        </div>

      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
