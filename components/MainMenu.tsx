
import React, { useMemo, useState, useEffect } from 'react';
import { Difficulty, GameMode } from '../types';
import { playSound } from '../utils/sound';
import { Star, Zap, Crown, Trophy, Search, Brain, Info, Languages, Download } from 'lucide-react';
import { AboutModal } from './AboutModal';
import { useLanguage } from '../utils/i18n';

interface MainMenuProps {
  onStart: (difficulty: Difficulty, mode: GameMode) => void;
  onShowLeaderboard: () => void;
}

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
      p-2 md:p-4 lg:p-5
      border-b-[4px] md:border-b-[6px] lg:border-b-[8px] ${shadowColor}
      active:border-b-0 active:translate-y-1
      transition-all duration-150 transform hover:-translate-y-0.5 hover:brightness-110
      flex flex-row landscape:flex-col items-center landscape:justify-center 
      gap-3 md:gap-4 landscape:gap-1 lg:landscape:gap-3
      shadow-md relative z-20 group ring-2 md:ring-4 ring-white/20 
      h-full min-h-[60px] md:min-h-[100px] lg:min-h-[140px] landscape:min-h-[110px]
    `}
  >
    <div className="bg-white/20 p-1.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform shadow-inner shrink-0">
      {icon}
    </div>
    <div className="text-left landscape:text-center flex-1 min-w-0 text-shadow-sm leading-none flex flex-col justify-center">
      <h3 className="text-sm md:text-xl lg:text-3xl font-black tracking-wide uppercase drop-shadow-md font-titan truncate">
        {title}
      </h3>
      <p className="text-[10px] md:text-sm lg:text-base font-bold opacity-90 truncate mt-0.5 md:mt-1.5">
        {subtitle}
      </p>
    </div>
  </button>
);

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, onShowLeaderboard }) => {
  const { t, lang, setLang } = useLanguage();
  const [activeMode, setActiveMode] = useState<GameMode>('difference');
  const [showAbout, setShowAbout] = useState(false);
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

  // Generate background flags
  const festiveFlags = useMemo(() => {
    const codes = ['id', 'jp', 'kr', 'us', 'gb', 'br', 'ar', 'de', 'fr', 'it', 'es', 'ca', 'au'];
    const items = [];
    for(let i=0; i<6; i++) {
      items.push({
        code: codes[i % codes.length],
        style: {
          top: `${Math.random() * 80}%`,
          left: `-${Math.random() * 20}%`,
          animation: `driftRight ${30 + Math.random() * 20}s linear infinite`,
          animationDelay: `-${Math.random() * 10}s`
        }
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300 flex items-center justify-center overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-300 rounded-full mix-blend-multiply filter blur-[50px] opacity-50"></div>
         <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[50px] opacity-50"></div>
         {festiveFlags.map((flag, idx) => (
          <div key={idx} className="absolute opacity-60 w-12 md:w-20 lg:w-32 drop-shadow-md z-0" style={flag.style}>
             <img src={`https://flagcdn.com/w160/${flag.code}.png`} alt="" className="w-full h-full object-contain rounded-sm" />
          </div>
        ))}
      </div>

      {/* TOP ACTIONS - Scaled for Tablet */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50 flex gap-2 md:gap-4">
        <button onClick={() => { playSound('click'); setShowAbout(true); }} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-white text-sky-500 rounded-full shadow-md border-b-2 md:border-b-4 border-gray-200 active:border-b-0 active:translate-y-0.5 transition-all">
          <Info className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
        </button>
         <button onClick={toggleLanguage} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-white text-indigo-500 rounded-full shadow-md border-b-2 md:border-b-4 border-gray-200 active:border-b-0 active:translate-y-0.5 transition-all relative">
          <Languages className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
          <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-indigo-600 text-white text-[8px] md:text-[10px] font-black px-1 md:px-2 py-0.5 rounded shadow-sm pointer-events-none">{lang.toUpperCase()}</div>
        </button>
        {deferredPrompt && (
           <button onClick={() => { playSound('click'); handleInstallClick(); }} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md border-b-2 md:border-b-4 border-green-700 active:border-b-0 active:translate-y-0.5 transition-all animate-bounce">
             <Download className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
           </button>
        )}
      </div>

      {/* RESPONSIVE LAYOUT CONTAINER */}
      {/* 
         DESIGN SYSTEM:
         - Mobile: gap-4
         - Tablet: gap-8 (md)
         - Desktop: gap-10 (lg)
         - Landscape Mobile: gap-2
      */}
      <div className="relative z-30 w-full h-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 flex flex-col items-center justify-center gap-4 md:gap-8 lg:gap-12 landscape:gap-2 md:landscape:gap-6">
        
        {/* TITLE SECTION - CENTERED ALWAYS */}
        <div className="flex-shrink-0 flex flex-col items-center text-center relative z-20">
           {/* Scale logic refined for Tablet/Desktop */}
           <div className="relative transform scale-90 md:scale-100 origin-center transition-transform">
              <Star className="absolute -top-4 -left-6 md:-top-8 md:-left-12 lg:-top-10 lg:-left-16 text-yellow-300 w-8 h-8 md:w-16 md:h-16 lg:w-20 lg:h-20 animate-bounce drop-shadow-md z-0" fill="currentColor" />
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-titan tracking-wider leading-none text-center relative z-20"
                  style={{ color: '#fbbf24', WebkitTextStroke: '3px #1e3a8a', paintOrder: 'stroke fill', textShadow: '0px 2px 0px #172554' }}
              >
                {t.mainMenu.title}
              </h1>
           </div>

           <div className="relative mt-1 md:mt-3 lg:mt-5 z-30 transform scale-90 md:scale-100 origin-center transition-transform">
              <div className="bg-[#dc2626] px-4 py-1 md:px-8 md:py-2 lg:px-10 lg:py-3 rounded-lg md:rounded-xl lg:rounded-2xl border-b-4 md:border-b-8 border-[#991b1b] shadow-lg rotate-[-2deg]">
                 <h1 className="text-2xl md:text-4xl lg:text-5xl font-titan text-white tracking-widest drop-shadow-sm whitespace-nowrap" style={{ textShadow: '0 1px 0 #7f1d1d' }}>
                   {t.mainMenu.subtitle}
                 </h1>
              </div>
           </div>

           <div className="mt-3 md:mt-5 lg:mt-8 bg-white/80 backdrop-blur-sm px-3 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3 rounded-full border border-white/50 shadow-sm inline-block transform scale-90 md:scale-100 origin-center transition-transform">
              <p className="text-indigo-600 font-bold text-[10px] md:text-sm lg:text-lg tracking-wide uppercase">
                 {t.mainMenu.tagline}
              </p>
           </div>
        </div>

        {/* MENU SECTION - Box Size System */}
        {/* 
           - Mobile Portrait: max-w-xs (Standard phone)
           - Tablet Portrait: max-w-md (iPad Mini/Air Portrait) -> INCREASED
           - Desktop/Tablet Landscape: max-w-4xl (To fit 3 huge buttons)
        */}
        <div className="w-full max-w-xs md:max-w-md lg:max-w-xl landscape:max-w-3xl md:landscape:max-w-5xl lg:landscape:max-w-6xl flex flex-col items-center transition-all duration-300">
          <div className="w-full bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-3 md:p-6 lg:p-8 shadow-xl border-2 md:border-4 border-white/60">
            
            {/* Mode Switcher */}
            <div className="flex bg-gray-100 p-1 md:p-2 rounded-lg md:rounded-xl mb-2 md:mb-4 relative shadow-inner">
              <button onClick={() => { playSound('click'); setActiveMode('difference'); }} className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-1.5 md:py-3 lg:py-4 rounded-md md:rounded-lg font-bold text-[10px] md:text-sm lg:text-lg transition-all z-10 ${activeMode === 'difference' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
                <Search className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {t.mainMenu.modeDiff}
              </button>
              <button onClick={() => { playSound('click'); setActiveMode('quiz'); }} className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-1.5 md:py-3 lg:py-4 rounded-md md:rounded-lg font-bold text-[10px] md:text-sm lg:text-lg transition-all z-10 ${activeMode === 'quiz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
                <Brain className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {t.mainMenu.modeQuiz}
              </button>
            </div>

            {/* 
               GRID SYSTEM:
               - Portrait: 1 Column
               - Landscape: 3 Columns
               - Gap scales with screen size
            */}
            <div className="grid grid-cols-1 landscape:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
              <MenuButton 
                onClick={() => handleStart('easy')}
                gradient="bg-gradient-to-r from-green-400 to-emerald-500"
                shadowColor="border-emerald-700"
                icon={<Star className="w-3.5 h-3.5 md:w-6 md:h-6 lg:w-8 lg:h-8" fill="white" />}
                title={t.mainMenu.btnEasy}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subEasyQuiz : t.mainMenu.subEasy}
              />
              <MenuButton 
                onClick={() => handleStart('medium')}
                gradient="bg-gradient-to-r from-blue-400 to-indigo-500"
                shadowColor="border-indigo-700"
                icon={<Zap className="w-3.5 h-3.5 md:w-6 md:h-6 lg:w-8 lg:h-8" fill="white" />}
                title={t.mainMenu.btnMedium}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subMediumQuiz : t.mainMenu.subMedium}
              />
              <MenuButton 
                onClick={() => handleStart('hard')}
                gradient="bg-gradient-to-r from-purple-400 to-fuchsia-500"
                shadowColor="border-fuchsia-700"
                icon={<Crown className="w-3.5 h-3.5 md:w-6 md:h-6 lg:w-8 lg:h-8" fill="white" />}
                title={t.mainMenu.btnHard}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subHardQuiz : t.mainMenu.subHard}
              />
            </div>

            <div className="h-2 md:h-4 lg:h-6"></div>

            <button 
              onClick={() => { playSound('click'); onShowLeaderboard(); }}
              className="w-full bg-orange-400 text-white font-bold py-2 md:py-4 lg:py-5 px-4 rounded-xl md:rounded-2xl border-b-[4px] md:border-b-[6px] lg:border-b-[8px] border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-md hover:bg-orange-500 font-titan tracking-wide text-xs md:text-lg lg:text-xl relative z-20"
            >
              <Trophy className="w-3.5 h-3.5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-yellow-100" /> {t.mainMenu.btnLeaderboard}
            </button>
          </div>
          
          <div className="w-full text-center mt-2 md:mt-4">
             <p className="text-indigo-900 font-bold opacity-60 text-[9px] md:text-xs lg:text-sm">
                {t.mainMenu.footer}
             </p>
          </div>
        </div>
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
