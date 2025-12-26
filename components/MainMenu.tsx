
import React, { useMemo, useState } from 'react';
import { Difficulty, GameMode } from '../types';
import { playSound } from '../utils/sound';
import { Star, Zap, Crown, Trophy, Search, Brain, Info } from 'lucide-react';
import { AboutModal } from './AboutModal';

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
  const [activeMode, setActiveMode] = useState<GameMode>('difference');
  const [showAbout, setShowAbout] = useState(false);
  
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

      {/* --- FLOATING INFO BUTTON (TOP RIGHT) --- */}
      <button
        onClick={() => { playSound('click'); setShowAbout(true); }}
        className="absolute top-4 right-4 z-40 bg-white text-sky-500 hover:bg-sky-50 p-3 rounded-full shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all group"
        aria-label="Tentang Game"
      >
        <Info size={28} className="group-hover:scale-110 transition-transform" strokeWidth={3} />
      </button>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="w-full max-w-lg z-30 relative flex flex-col items-center">
        
        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-500 relative w-full px-2">
           <Star className="absolute -top-4 sm:-top-8 left-4 sm:-left-8 text-yellow-300 w-10 sm:w-16 h-10 sm:h-16 animate-bounce drop-shadow-lg" fill="currentColor" />
           <Star className="absolute top-0 sm:top-4 right-4 sm:-right-8 text-yellow-300 w-8 sm:w-10 h-8 sm:h-10 animate-pulse delay-75 drop-shadow-lg" fill="currentColor" />
           
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-titan text-white tracking-wider text-stroke-3 drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] break-words leading-none">
            DETEKTIF
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-titan text-yellow-300 -mt-2 sm:-mt-4 tracking-wide text-stroke-3 drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] break-words leading-none">
            BENDERA
          </h1>

          {/* NEW TAGLINE - STRAIGHT, COMPACT & PLAYFUL */}
          <div className="mt-6 flex justify-center w-full">
            <div className="bg-white px-5 py-2.5 rounded-2xl border-b-4 border-indigo-100 shadow-lg inline-block hover:scale-105 transition-transform w-auto max-w-full">
               <p className="text-indigo-500 font-bold text-sm sm:text-lg tracking-normal leading-tight">
                  Belajar Mengenal Negara dengan Cara Seru
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
              <Search size={20} /> Cari Beda
            </button>
            <button
              onClick={() => { playSound('click'); setActiveMode('quiz'); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm sm:text-base transition-all z-10
                ${activeMode === 'quiz' 
                  ? 'bg-white text-indigo-600 shadow-md ring-2 ring-indigo-100 scale-100' 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              <Brain size={20} /> Tebak Nama
            </button>
          </div>

          <MenuButton 
            onClick={() => handleStart('easy')}
            gradient="bg-gradient-to-r from-green-400 to-emerald-500"
            shadowColor="border-emerald-700"
            icon={<Star size={24} className="sm:w-8 sm:h-8" fill="white" />}
            title="Mudah"
            subtitle={activeMode === 'difference' ? "Santai & Gampang" : "Bendera Terkenal"}
          />
          
          <MenuButton 
            onClick={() => handleStart('medium')}
            gradient="bg-gradient-to-r from-blue-400 to-indigo-500"
            shadowColor="border-indigo-700"
            icon={<Zap size={24} className="sm:w-8 sm:h-8" fill="white" />}
            title="Sedang"
            subtitle={activeMode === 'difference' ? "Tantangan Seru" : "Bendera Unik"}
          />
          
          <MenuButton 
            onClick={() => handleStart('hard')}
            gradient="bg-gradient-to-r from-purple-400 to-fuchsia-500"
            shadowColor="border-fuchsia-700"
            icon={<Crown size={24} className="sm:w-8 sm:h-8" fill="white" />}
            title="Sulit"
            subtitle={activeMode === 'difference' ? "Ahli Detektif!" : "Master Geografi"}
          />

          <div className="h-2 sm:h-4"></div>

          <button 
            onClick={handleLeaderboardClick}
            className="w-full bg-orange-400 text-white font-bold py-3 px-6 rounded-2xl border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-orange-500 font-titan tracking-wide text-lg sm:text-xl relative z-20 group"
          >
            <Trophy size={20} className="sm:w-6 sm:h-6 text-yellow-100 group-hover:scale-110 transition-transform" /> Papan Peringkat
          </button>
        </div>
        
        <p className="mt-6 text-indigo-900 font-bold text-center opacity-80 text-xs sm:text-sm bg-white/40 inline-block px-4 py-1.5 rounded-full backdrop-blur-md mx-auto shadow-sm">
          © 2025 Detektif Bendera
        </p>
      </div>

      {/* ABOUT MODAL POPUP */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
