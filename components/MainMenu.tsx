
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

// Komponen Pita SVG yang Rapi & Proporsional
const RibbonSubtitle = ({ text }: { text: string }) => {
  return (
    <div className="relative flex items-center justify-center mt-2 md:mt-3 lg:mt-4 filter drop-shadow-xl z-30">
      
      {/* Sayap Kiri Pita */}
      <div className="relative h-10 md:h-12 lg:h-14 flex items-center">
        <svg className="h-full w-auto text-[#dc2626] -mr-[1px]" viewBox="0 0 40 60" preserveAspectRatio="none">
          <path d="M0 0 L40 10 L40 50 L0 60 L15 30 Z" fill="currentColor" />
          <path d="M40 10 L25 10 L40 25 Z" fill="#7f1d1d" /> 
        </svg>
      </div>

      {/* Bagian Tengah */}
      <div className="relative bg-[#dc2626] h-10 md:h-12 lg:h-14 flex items-center px-6 md:px-8 lg:px-10">
         <div className="absolute top-0 left-0 right-0 h-1 md:h-1.5 bg-[#ef4444]"></div>
         <div className="absolute bottom-0 left-0 right-0 h-1 md:h-1.5 bg-[#991b1b]"></div>
         <h1 className="text-xl md:text-3xl lg:text-4xl font-titan text-white tracking-widest whitespace-nowrap drop-shadow-md relative -top-[1px]">
           {text}
         </h1>
      </div>

      {/* Sayap Kanan Pita */}
      <div className="relative h-10 md:h-12 lg:h-14 flex items-center">
         <svg className="h-full w-auto text-[#dc2626] -ml-[1px]" viewBox="0 0 40 60" preserveAspectRatio="none">
          <path d="M40 0 L0 10 L0 50 L40 60 L25 30 Z" fill="currentColor" />
          <path d="M0 10 L15 10 L0 25 Z" fill="#7f1d1d" />
        </svg>
      </div>

    </div>
  );
};

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
      w-full ${gradient} text-white rounded-xl md:rounded-2xl
      p-2 md:p-3
      border-b-[4px] md:border-b-[6px] ${shadowColor}
      active:border-b-0 active:translate-y-1
      transition-all duration-150 transform hover:-translate-y-0.5 hover:brightness-110
      flex flex-row landscape:flex-col items-center landscape:justify-center 
      gap-3 landscape:gap-1 lg:landscape:gap-2
      shadow-md relative z-20 group ring-2 ring-white/20 
      h-full 
      min-h-[64px]
      md:min-h-[80px]
      landscape:min-h-[100px]
    `}
  >
    <div className="bg-white/20 p-1.5 md:p-2.5 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform shadow-inner shrink-0">
      {icon}
    </div>
    <div className="text-left landscape:text-center flex-1 min-w-0 text-shadow-sm leading-none flex flex-col justify-center">
      <h3 className="text-sm md:text-lg lg:text-xl font-black tracking-wide uppercase drop-shadow-md font-titan truncate">
        {title}
      </h3>
      <p className="text-[10px] md:text-xs lg:text-sm font-bold opacity-90 truncate mt-0.5 md:mt-1">
        {subtitle}
      </p>
    </div>
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
    const shuffled = [...allCodes].sort(() => 0.5 - Math.random()).slice(0, 50);
    return shuffled.map((code, i) => ({
      code,
      style: {
        top: `${Math.random() * 90}%`,
        left: `-${10 + Math.random() * 20}%`,
        animation: `driftRight ${25 + Math.random() * 30}s linear infinite`,
        animationDelay: `-${Math.random() * 40}s`,
        opacity: 0.4 + Math.random() * 0.4,
        transform: `scale(${0.5 + Math.random() * 0.5})`,
        zIndex: 0
      }
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300 flex items-center justify-center overflow-hidden">
      
      {/* PRELOADER */}
      <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
         {Object.keys(FLAG_NAMES_ID).map(code => (
            <img key={code} src={`https://flagcdn.com/w160/${code}.png`} alt="" loading="eager" />
         ))}
      </div>

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-300 rounded-full mix-blend-multiply filter blur-[50px] opacity-50"></div>
         <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[50px] opacity-50"></div>
         {festiveFlags.map((flag, idx) => (
          <div key={`${flag.code}-${idx}`} className="absolute drop-shadow-md z-0 w-12 md:w-16 lg:w-20" style={flag.style}>
             <img src={`https://flagcdn.com/w160/${flag.code}.png`} alt="" className="w-full h-full object-contain rounded-sm shadow-sm" />
          </div>
        ))}
      </div>

      {/* TOP ACTIONS */}
      <div className="absolute top-2 right-2 md:top-6 md:right-6 z-50 flex gap-2 md:gap-3">
        <button onClick={() => { playSound('click'); setShowSettings(true); }} className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-md border-b-2 md:border-b-4 border-gray-300 active:border-b-0 active:translate-y-0.5 transition-all hover:scale-105">
          <Settings className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
        <button onClick={() => { playSound('click'); setShowAbout(true); }} className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-white text-sky-500 rounded-full shadow-md border-b-2 md:border-b-4 border-gray-200 active:border-b-0 active:translate-y-0.5 transition-all hover:scale-105">
          <Info className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </button>
         <button onClick={toggleLanguage} className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-white text-indigo-500 rounded-full shadow-md border-b-2 md:border-b-4 border-gray-200 active:border-b-0 active:translate-y-0.5 transition-all relative hover:scale-105">
          <Languages className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-indigo-600 text-white text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm pointer-events-none">{lang.toUpperCase()}</div>
        </button>
        {deferredPrompt && (
           <button onClick={() => { playSound('click'); handleInstallClick(); }} className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md border-b-2 md:border-b-4 border-green-700 active:border-b-0 active:translate-y-0.5 transition-all animate-bounce">
             <Download className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
           </button>
        )}
      </div>

      {/* RESPONSIVE LAYOUT CONTAINER */}
      <div className="relative z-30 w-full h-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col items-center justify-center gap-3 md:gap-6 landscape:gap-2">
        
        {/* TITLE SECTION */}
        <div className="flex-shrink-0 flex flex-col items-center text-center relative z-20">
           <div className="relative transform scale-90 md:scale-100 origin-center transition-transform">
              <Star className="absolute -top-6 -left-8 md:-top-8 md:-left-12 lg:-top-10 lg:-left-14 text-yellow-300 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 animate-bounce drop-shadow-lg z-0" fill="currentColor" />
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-titan tracking-wider leading-none text-center relative z-20 text-[#fbbf24] drop-shadow-xl"
                  style={{ 
                    WebkitTextStroke: window.innerWidth < 768 ? '4px #1e3a8a' : '6px #1e3a8a', 
                    paintOrder: 'stroke fill',
                    filter: 'drop-shadow(0px 4px 0px #172554)'
                  }}
              >
                {t.mainMenu.title}
              </h1>
           </div>
           <div className="relative z-30 transform scale-90 md:scale-100 origin-center transition-transform">
              <RibbonSubtitle text={t.mainMenu.subtitle} />
           </div>
           <div className="mt-3 md:mt-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 md:px-5 md:py-2 rounded-full border-2 border-white/60 shadow-lg inline-block transform scale-90 md:scale-100 origin-center transition-transform">
              <p className="text-indigo-600 font-black text-[10px] md:text-xs lg:text-sm tracking-widest uppercase">
                 {t.mainMenu.tagline}
              </p>
           </div>
        </div>

        {/* MENU BOX SECTION */}
        <div className="w-full max-w-sm md:max-w-md landscape:max-w-4xl flex flex-col items-center transition-all duration-300">
          <div className="w-full bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl border-2 md:border-4 border-white/60">
            
            <div className="flex bg-gray-100 p-1 md:p-1.5 rounded-xl mb-3 md:mb-5 relative shadow-inner">
              <button onClick={() => { playSound('click'); setActiveMode('difference'); }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 rounded-lg font-bold text-[10px] md:text-xs lg:text-sm transition-all z-10 ${activeMode === 'difference' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
                <Search className="w-3 h-3 md:w-4 md:h-4" /> {t.mainMenu.modeDiff}
              </button>
              <button onClick={() => { playSound('click'); setActiveMode('quiz'); }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 rounded-lg font-bold text-[10px] md:text-xs lg:text-sm transition-all z-10 ${activeMode === 'quiz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
                <Brain className="w-3 h-3 md:w-4 md:h-4" /> {t.mainMenu.modeQuiz}
              </button>
            </div>

            <div className="grid grid-cols-1 landscape:grid-cols-3 gap-2.5 md:gap-4">
              <MenuButton 
                onClick={() => handleStart('easy')}
                gradient="bg-gradient-to-r from-green-400 to-emerald-500"
                shadowColor="border-emerald-700"
                icon={<Star className="w-4 h-4 md:w-6 md:h-6" fill="white" />}
                title={t.mainMenu.btnEasy}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subEasyQuiz : t.mainMenu.subEasy}
              />
              <MenuButton 
                onClick={() => handleStart('medium')}
                gradient="bg-gradient-to-r from-blue-400 to-indigo-500"
                shadowColor="border-indigo-700"
                icon={<Zap className="w-4 h-4 md:w-6 md:h-6" fill="white" />}
                title={t.mainMenu.btnMedium}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subMediumQuiz : t.mainMenu.subMedium}
              />
              <MenuButton 
                onClick={() => handleStart('hard')}
                gradient="bg-gradient-to-r from-purple-400 to-fuchsia-500"
                shadowColor="border-fuchsia-700"
                icon={<Crown className="w-4 h-4 md:w-6 md:h-6" fill="white" />}
                title={t.mainMenu.btnHard}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subHardQuiz : t.mainMenu.subHard}
              />
            </div>

            <div className="h-3 md:h-5"></div>

            <button 
              onClick={() => { playSound('click'); onShowLeaderboard(); }}
              className="w-full bg-orange-400 text-white font-bold py-2.5 md:py-3.5 px-4 rounded-xl md:rounded-2xl border-b-[4px] md:border-b-[5px] border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-md hover:bg-orange-500 font-titan tracking-wide text-xs md:text-sm lg:text-base relative z-20"
            >
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-100" /> {t.mainMenu.btnLeaderboard}
            </button>
          </div>
          
          <div className="w-full text-center mt-2 md:mt-4">
             <p className="text-indigo-900 font-bold opacity-60 text-[9px] md:text-[10px] lg:text-xs">
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
