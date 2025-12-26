
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
      w-full ${gradient} text-white rounded-3xl p-3 sm:p-4
      border-b-8 ${shadowColor}
      active:border-b-0 active:translate-y-2
      transition-all duration-150 transform hover:-translate-y-1 hover:brightness-110
      flex items-center gap-3 sm:gap-4 shadow-xl mb-3 sm:mb-4 relative z-20 group
    `}
  >
    <div className="bg-white/20 p-2 sm:p-3 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-left flex-1 min-w-0">
      <h3 className="text-xl sm:text-2xl font-black tracking-wide uppercase drop-shadow-md font-titan truncate">{title}</h3>
      <p className="text-xs sm:text-sm font-bold opacity-90 truncate">{subtitle}</p>
    </div>
  </button>
);

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, onShowLeaderboard }) => {
  const { t, lang, setLang } = useLanguage();
  const [activeMode, setActiveMode] = useState<GameMode>('difference');
  const [showAbout, setShowAbout] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // PWA Install Prompt Listener
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
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };
  
  const triggerFullScreen = () => {
    try {
      const elem = document.documentElement;
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(err => console.log("Fullscreen blocked:", err));
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          (elem as any).msRequestFullscreen();
        }
      }
    } catch (err) {
      console.log("Error attempting fullscreen", err);
    }
  };

  const handleStart = (diff: Difficulty) => {
    triggerFullScreen();
    playSound('click');
    onStart(diff, activeMode);
  };

  const handleLeaderboardClick = () => {
    triggerFullScreen();
    playSound('click');
    onShowLeaderboard();
  };

  const toggleLanguage = () => {
    playSound('click');
    setLang(lang === 'id' ? 'en' : 'id');
  };

  // Generate background flags - FULL OPACITY, NO ROTATION
  const festiveFlags = useMemo(() => {
    const codes = [
      'id', 'jp', 'kr', 'us', 'gb', 'br', 'ar', 'de', 'fr', 'it', 
      'es', 'ca', 'au', 'in', 'cn', 'sa', 'tr', 'za', 'mx', 'se',
      'my', 'sg', 'th', 'vn', 'ph', 'ru', 'pt', 'nl', 'be', 'ch'
    ];
    
    const items = [];
    
    // 1. Horizontal Drifters
    for(let i=0; i<10; i++) {
      items.push({
        code: codes[i % codes.length],
        // Full Opacity (opacity-100), No Grayscale
        className: 'absolute opacity-100 w-12 sm:w-16 drop-shadow-md',
        style: {
          top: `${Math.random() * 95}%`,
          left: `-${Math.random() * 10}%`,
          animation: `${i % 2 === 0 ? 'driftRight' : 'driftLeft'} ${25 + Math.random() * 20}s linear infinite`,
          animationDelay: `-${Math.random() * 20}s`,
          zIndex: 0
        }
      });
    }

    // 2. Vertical Floaters
    for(let i=0; i<10; i++) {
      items.push({
        code: codes[(i + 10) % codes.length],
        className: 'absolute opacity-100 w-10 sm:w-14 drop-shadow-md',
        style: {
          left: `${Math.random() * 95}%`,
          animation: `floatUp ${15 + Math.random() * 15}s linear infinite`,
          animationDelay: `-${Math.random() * 15}s`,
          zIndex: 0
        }
      });
    }

    // 3. Orbiters
    for(let i=0; i<6; i++) {
      const isCW = i % 2 === 0;
      items.push({
        code: codes[(i + 20) % codes.length],
        className: 'absolute w-12 sm:w-16 opacity-100 drop-shadow-lg',
        style: {
          top: '50%',
          left: '50%',
          marginTop: '-20px', 
          marginLeft: '-20px',
          animation: `${isCW ? 'orbitCW' : 'orbitCCW'} ${20 + Math.random() * 10}s linear infinite`,
          animationDelay: `-${Math.random() * 20}s`,
          zIndex: 0
        }
      });
    }
    
    return items;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <div className="relative w-full h-full opacity-60">
           <div className="absolute top-0 left-0 w-[50vh] h-[50vh] bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px]"></div>
           <div className="absolute bottom-0 right-0 w-[50vh] h-[50vh] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[80px]"></div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {festiveFlags.map((flag, idx) => (
          <div 
            key={idx}
            className={flag.className}
            style={flag.style}
          >
             <img 
                src={`https://flagcdn.com/w160/${flag.code}.png`} 
                alt="" 
                className="w-full h-full object-contain rounded-sm shadow-sm"
             />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-10 pointer-events-none"></div>

      {/* --- TOP ACTIONS (RIGHT) --- */}
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-3">
         {/* About Button */}
        <button
          onClick={() => { playSound('click'); setShowAbout(true); }}
          className="w-12 h-12 flex items-center justify-center bg-white text-sky-500 hover:bg-sky-50 rounded-full shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all group"
          aria-label={t.about.title}
        >
          <Info size={24} className="group-hover:scale-110 transition-transform" strokeWidth={3} />
        </button>

         {/* Lang Toggle - FIXED: Layout agar tidak terpotong */}
         <button
          onClick={toggleLanguage}
          className="w-12 h-12 flex items-center justify-center bg-white text-indigo-500 hover:bg-indigo-50 rounded-full shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all group relative"
          aria-label="Change Language"
        >
          <Languages size={24} className="group-hover:scale-110 transition-transform" strokeWidth={3} />
          {/* Label ditempatkan di dalam dengan offset yang aman atau di luar */}
          <div className="absolute -bottom-2 -right-1 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm pointer-events-none">
            {lang.toUpperCase()}
          </div>
        </button>

        {/* PWA Install Button (Only if prompt available) */}
        {deferredPrompt && (
           <button
           onClick={() => { playSound('click'); handleInstallClick(); }}
           className="w-12 h-12 flex items-center justify-center bg-green-500 text-white hover:bg-green-400 rounded-full shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all group animate-bounce"
           aria-label={t.mainMenu.btnInstall}
         >
           <Download size={24} className="group-hover:scale-110 transition-transform" strokeWidth={3} />
         </button>
        )}
      </div>


      {/* --- FOREGROUND CONTENT --- */}
      <div className="w-full max-w-lg z-30 relative flex flex-col items-center">
        
        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8 relative w-full px-2 pt-2">
           <Star className="absolute -top-4 sm:-top-8 left-4 sm:-left-8 text-yellow-300 w-10 sm:w-16 h-10 sm:h-16 animate-bounce drop-shadow-lg z-0" fill="currentColor" />
           <Star className="absolute top-0 sm:top-4 right-4 sm:-right-8 text-yellow-300 w-8 sm:w-10 h-8 sm:h-10 animate-pulse delay-75 drop-shadow-lg z-0" fill="currentColor" />
           
           {/* MAIN TITLE STYLE: Matches Reference Image */}
           <div className="relative z-20 transform hover:scale-105 transition-transform duration-300 pt-6">
              
              {/* DETEKTIF: Yellow with Thick Blue Stroke */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-titan tracking-wider leading-none text-center relative z-20"
                  style={{ 
                    color: '#fbbf24', // Yellow-400
                    WebkitTextStroke: '8px #1e3a8a', // Blue-900 Stroke
                    paintOrder: 'stroke fill',
                    textShadow: '0px 6px 0px #172554' // Deep Blue Shadow
                  }}
              >
                {t.mainMenu.title}
              </h1>

              {/* BENDERA: White on Red Ribbon - FIXED: Responsive Ribbon */}
              <div className="relative -mt-2 sm:-mt-3 z-30 flex justify-center items-center w-full">
                 
                 {/* Ribbon Body Container with min-width for stability */}
                 <div className="relative transform -rotate-1 z-20">
                     {/* Ribbon Tails (Absolute to text container) */}
                     <div className="w-8 sm:w-12 h-10 sm:h-14 bg-red-700 absolute -left-4 sm:-left-8 top-1 sm:top-2 transform -skew-y-12 -z-10 rounded-l-md border-2 border-red-900 shadow-md"></div>
                     <div className="w-8 sm:w-12 h-10 sm:h-14 bg-red-700 absolute -right-4 sm:-right-8 top-1 sm:top-2 transform skew-y-12 -z-10 rounded-r-md border-2 border-red-900 shadow-md"></div>

                     {/* Main Ribbon Text Box */}
                     <div className="bg-[#dc2626] px-8 sm:px-14 py-1 sm:py-2 rounded-xl border-b-4 border-[#991b1b] shadow-xl flex items-center justify-center min-w-[220px] sm:min-w-[280px]">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-titan text-white tracking-widest drop-shadow-sm"
                            style={{ textShadow: '0 2px 0 #7f1d1d' }}
                        >
                          {t.mainMenu.subtitle}
                        </h1>
                        
                        {/* Gloss/Shine Effect on Ribbon */}
                        <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-lg pointer-events-none"></div>
                     </div>
                 </div>
              </div>
           </div>

           {/* Tagline */}
           <div className="mt-5 flex justify-center w-full relative z-10">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border-2 border-white/50 shadow-sm inline-block">
               <p className="text-indigo-600 font-bold text-xs sm:text-sm tracking-wide">
                  {t.mainMenu.tagline}
               </p>
            </div>
          </div>
        </div>

        {/* Menu Container */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/60 relative overflow-hidden">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 relative">
            <button
              onClick={() => { playSound('click'); setActiveMode('difference'); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm sm:text-base transition-all z-10
                ${activeMode === 'difference' 
                  ? 'bg-white text-indigo-600 shadow-md ring-2 ring-indigo-100 scale-100' 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              <Search size={20} /> {t.mainMenu.modeDiff}
            </button>
            <button
              onClick={() => { playSound('click'); setActiveMode('quiz'); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm sm:text-base transition-all z-10
                ${activeMode === 'quiz' 
                  ? 'bg-white text-indigo-600 shadow-md ring-2 ring-indigo-100 scale-100' 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              <Brain size={20} /> {t.mainMenu.modeQuiz}
            </button>
          </div>

          <MenuButton 
            onClick={() => handleStart('easy')}
            gradient="bg-gradient-to-r from-green-400 to-emerald-500"
            shadowColor="border-emerald-700"
            icon={<Star size={24} className="sm:w-8 sm:h-8" fill="white" />}
            title={t.mainMenu.btnEasy}
            subtitle={t.mainMenu.subEasy}
          />
          
          <MenuButton 
            onClick={() => handleStart('medium')}
            gradient="bg-gradient-to-r from-blue-400 to-indigo-500"
            shadowColor="border-indigo-700"
            icon={<Zap size={24} className="sm:w-8 sm:h-8" fill="white" />}
            title={t.mainMenu.btnMedium}
            subtitle={t.mainMenu.subMedium}
          />
          
          <MenuButton 
            onClick={() => handleStart('hard')}
            gradient="bg-gradient-to-r from-purple-400 to-fuchsia-500"
            shadowColor="border-fuchsia-700"
            icon={<Crown size={24} className="sm:w-8 sm:h-8" fill="white" />}
            title={t.mainMenu.btnHard}
            subtitle={t.mainMenu.subHard}
          />

          <div className="h-2 sm:h-4"></div>

          <button 
            onClick={handleLeaderboardClick}
            className="w-full bg-orange-400 text-white font-bold py-3 px-6 rounded-2xl border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-orange-500 font-titan tracking-wide text-lg sm:text-xl relative z-20 group"
          >
            <Trophy size={20} className="sm:w-6 sm:h-6 text-yellow-100 group-hover:scale-110 transition-transform" /> {t.mainMenu.btnLeaderboard}
          </button>
        </div>
        
        <p className="mt-6 text-indigo-900 font-bold text-center opacity-80 text-xs sm:text-sm bg-white/40 inline-block px-4 py-1.5 rounded-full backdrop-blur-md mx-auto shadow-sm">
          {t.mainMenu.footer}
        </p>
      </div>

      {/* ABOUT MODAL POPUP */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
