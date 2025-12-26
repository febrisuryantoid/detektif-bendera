
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

// Komponen Pita SVG yang lebih responsif
const RibbonSubtitle = ({ text }: { text: string }) => {
  return (
    <div className="relative flex items-center justify-center mt-2 landscape:mt-1 md:mt-4 filter drop-shadow-lg z-30 hover:scale-105 transition-transform duration-300">
      {/* Sayap Kiri */}
      <div className="relative h-8 md:h-12 lg:h-14 flex items-center">
        <svg className="h-full w-auto text-[#dc2626] -mr-[1px]" viewBox="0 0 40 60" preserveAspectRatio="none">
          <path d="M0 0 L40 10 L40 50 L0 60 L15 30 Z" fill="currentColor" />
          <path d="M40 10 L25 10 L40 25 Z" fill="#7f1d1d" /> 
        </svg>
      </div>

      {/* Tengah */}
      <div className="relative bg-[#dc2626] h-8 md:h-12 lg:h-14 flex items-center px-6 md:px-10 shadow-[inset_0_2px_0_rgba(255,255,255,0.2)]">
         <div className="absolute top-0 left-0 right-0 h-1 bg-[#ef4444]"></div>
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#991b1b]"></div>
         <h1 className="text-xl md:text-3xl lg:text-4xl font-titan text-white tracking-widest whitespace-nowrap drop-shadow-sm relative -top-[0.5px]">
           {text}
         </h1>
      </div>

      {/* Sayap Kanan */}
      <div className="relative h-8 md:h-12 lg:h-14 flex items-center">
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
      ${shadowColor}
      btn-3d
      flex flex-row items-center text-left
      gap-3
      relative z-20 group ring-2 ring-white/20
      min-h-[60px] md:min-h-[70px]
    `}
  >
    <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform shadow-inner shrink-0 border border-white/30">
      {icon}
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <h3 className="text-sm md:text-lg font-black tracking-wide uppercase drop-shadow-md font-titan truncate leading-none">
        {title}
      </h3>
      <p className="text-[10px] md:text-xs font-bold opacity-90 truncate leading-tight mt-0.5">
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

  const TopButton = ({ onClick, icon, badge, colorClass, borderColor }: any) => (
    <button onClick={onClick} className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ${colorClass} rounded-xl shadow-lg ${borderColor} btn-3d relative hover:scale-105 active:scale-95 transition-transform`}>
      {icon}
      {badge && <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow border border-white">{badge}</div>}
    </button>
  );

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

      {/* HEADER BAR (Actions) - Z-INDEX 50 (TOP) */}
      <div className="absolute top-0 left-0 w-full p-3 flex justify-end gap-2 z-50 pointer-events-none">
        <TopButton 
          onClick={() => { playSound('click'); setShowSettings(true); }} 
          icon={<Settings className="w-5 h-5 md:w-6 md:h-6 text-gray-700" strokeWidth={2.5} />}
          colorClass="bg-white"
          borderColor="border-gray-300"
        />
        <TopButton 
          onClick={() => { playSound('click'); setShowAbout(true); }} 
          icon={<Info className="w-5 h-5 md:w-6 md:h-6 text-sky-500" strokeWidth={3} />}
          colorClass="bg-white"
          borderColor="border-gray-200"
        />
        <TopButton 
          onClick={toggleLanguage} 
          icon={<Languages className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" strokeWidth={3} />}
          colorClass="bg-white"
          borderColor="border-gray-200"
          badge={lang.toUpperCase()}
        />
        {deferredPrompt && (
           <TopButton 
             onClick={() => { playSound('click'); handleInstallClick(); }} 
             icon={<Download className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={3} />}
             colorClass="bg-green-500 animate-bounce"
             borderColor="border-green-700"
           />
        )}
      </div>

      {/* MAIN CONTENT - Full Height, Centered */}
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 relative z-30 min-h-0 overflow-y-auto">
        
        {/* LOGO SECTION - Reduced Margins for Mobile Landscape */}
        <div className="flex flex-col items-center text-center mb-4 landscape:mb-1 md:mb-8 shrink-0 relative z-40">
           <div className="relative transform hover:scale-105 duration-300">
              <Star className="absolute -top-6 -left-8 md:-top-10 md:-left-12 text-yellow-300 w-12 h-12 md:w-20 md:h-20 animate-spin-slow drop-shadow-md z-0" fill="currentColor" stroke="orange" strokeWidth={1} />
              
              {/* Responsive Title Size: Smaller on Mobile Landscape */}
              <h1 className="text-5xl landscape:text-4xl sm:text-6xl md:text-8xl font-titan tracking-wider leading-none text-center relative z-40 text-[#fbbf24] drop-shadow-md text-stroke-lg">
                {t.mainMenu.title}
              </h1>
           </div>
           <RibbonSubtitle text={t.mainMenu.subtitle} />
           
           {/* TAGLINE: LURUS */}
           <div className="mt-3 landscape:mt-1 bg-white/90 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 rounded-full border-2 md:border-4 border-white shadow-lg z-30 relative">
              <p className="text-indigo-600 font-black text-[10px] md:text-sm tracking-widest uppercase">
                 {t.mainMenu.tagline}
              </p>
           </div>
        </div>

        {/* CONTROLS CARD */}
        <div className="w-full max-w-[320px] md:max-w-md landscape:max-w-4xl bg-white/40 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border-4 border-white/50 shrink-0 z-20 relative">
            
            {/* Mode Switcher */}
            <div className="flex bg-white/60 p-1 rounded-xl mb-4 relative shadow-inner border border-white/40">
              <button 
                onClick={() => { playSound('click'); setActiveMode('difference'); }} 
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-black text-[11px] md:text-sm transition-all z-10 
                  ${activeMode === 'difference' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-500 hover:bg-white/50'}
                `}
              >
                <Search className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} /> {t.mainMenu.modeDiff}
              </button>
              <button 
                onClick={() => { playSound('click'); setActiveMode('quiz'); }} 
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-black text-[11px] md:text-sm transition-all z-10 
                  ${activeMode === 'quiz' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-500 hover:bg-white/50'}
                `}
              >
                <Brain className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} /> {t.mainMenu.modeQuiz}
              </button>
            </div>

            {/* Difficulty Buttons - Landscape Grid Fixed */}
            <div className="grid grid-cols-1 landscape:grid-cols-3 gap-2 md:gap-4">
              <MenuButton 
                onClick={() => handleStart('easy')}
                gradient="bg-gradient-to-b from-green-400 to-emerald-500"
                shadowColor="border-emerald-700"
                icon={<Star className="w-4 h-4 md:w-6 md:h-6" fill="white" />}
                title={t.mainMenu.btnEasy}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subEasyQuiz : t.mainMenu.subEasy}
              />
              <MenuButton 
                onClick={() => handleStart('medium')}
                gradient="bg-gradient-to-b from-blue-400 to-indigo-500"
                shadowColor="border-indigo-700"
                icon={<Zap className="w-4 h-4 md:w-6 md:h-6" fill="white" />}
                title={t.mainMenu.btnMedium}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subMediumQuiz : t.mainMenu.subMedium}
              />
              <MenuButton 
                onClick={() => handleStart('hard')}
                gradient="bg-gradient-to-b from-purple-400 to-fuchsia-500"
                shadowColor="border-fuchsia-700"
                icon={<Crown className="w-4 h-4 md:w-6 md:h-6" fill="white" />}
                title={t.mainMenu.btnHard}
                subtitle={activeMode === 'quiz' ? t.mainMenu.subHardQuiz : t.mainMenu.subHard}
              />
            </div>

            {/* Leaderboard Button */}
            <button 
              onClick={() => { playSound('click'); onShowLeaderboard(); }}
              className="w-full mt-3 md:mt-4 bg-gradient-to-b from-orange-400 to-orange-500 text-white font-bold py-2.5 md:py-3.5 px-4 rounded-xl md:rounded-2xl border-orange-700 btn-3d flex items-center justify-center gap-2 shadow-lg hover:brightness-110 font-titan tracking-wide text-sm md:text-base group"
            >
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-100 group-hover:scale-110 transition-transform" /> {t.mainMenu.btnLeaderboard}
            </button>
        </div>
        
        <div className="w-full text-center mt-2 md:mt-4 shrink-0 pb-2">
             <p className="text-indigo-900 font-bold opacity-70 text-[9px] md:text-xs bg-white/30 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
                {t.mainMenu.footer}
             </p>
        </div>

      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
