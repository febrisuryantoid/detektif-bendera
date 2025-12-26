
import React from 'react';
import { Difficulty, GameMode } from '../types';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';
import { Search, Brain, ChevronLeft, Lock } from 'lucide-react';

interface SharedLevelGridProps {
  mode: GameMode;
  difficulty: Difficulty;
  unlockedCount: number;
  totalLevels: number;
  onSelectLevel: (index: number) => void;
  onBack: () => void;
}

export const SharedLevelGrid: React.FC<SharedLevelGridProps> = ({
  mode,
  difficulty,
  unlockedCount,
  totalLevels,
  onSelectLevel,
  onBack
}) => {
  const { t } = useLanguage();

  const handleLevelClick = (index: number) => {
    if (index < unlockedCount) {
      playSound('click');
      onSelectLevel(index);
    } else {
      playSound('lock');
    }
  };

  const getThemeColors = () => {
    switch (difficulty) {
      case 'easy': return { text: 'text-green-600', border: 'border-green-600', bg: 'from-green-400 to-emerald-500' };
      case 'medium': return { text: 'text-blue-600', border: 'border-blue-600', bg: 'from-blue-400 to-indigo-500' };
      case 'hard': return { text: 'text-pink-600', border: 'border-pink-600', bg: 'from-pink-400 to-rose-500' };
      default: return { text: 'text-gray-600', border: 'border-gray-600', bg: 'from-gray-400 to-gray-500' };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-br from-sky-200 via-blue-100 to-white flex flex-col overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-48 h-48 bg-blue-300 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      {/* --- HEADER --- */}
      <div className="relative z-20 shrink-0 px-4 py-3 md:py-5 flex items-center justify-between shadow-sm bg-white/40 backdrop-blur-md border-b border-white/50">
        <button 
          onClick={() => { playSound('click'); onBack(); }}
          className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-2 border-gray-200 shadow-md flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-gray-600" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center">
           <div className="flex items-center gap-2 mb-0.5">
             {mode === 'difference' 
               ? <Search size={16} className={theme.text} strokeWidth={3} /> 
               : <Brain size={16} className={theme.text} strokeWidth={3} />
             }
             <span className={`text-xs font-display font-bold uppercase tracking-widest ${theme.text}`}>
               {mode === 'difference' ? t.mainMenu.modeDiff : t.mainMenu.modeQuiz}
             </span>
           </div>
           <h1 className={`font-display font-extrabold text-2xl md:text-4xl uppercase tracking-wide leading-none drop-shadow-sm ${theme.text}`}>
             {difficulty} {t.levelSelect.title}
           </h1>
        </div>

        {/* Placeholder for symmetry */}
        <div className="w-10 md:w-12"></div>
      </div>

      {/* --- GRID CONTAINER --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-4 pb-20 flex flex-col items-center">
        
        <div className="w-full max-w-5xl mx-auto">
          {/* 
            PERFECT GRID RULES for 50 ITEMS:
            - Portrait: 5 Columns (50 / 5 = 10 Rows).
            - Landscape: 10 Columns (50 / 10 = 5 Rows).
            - No empty cells.
          */}
          <div className="
            grid 
            grid-cols-5 
            landscape:grid-cols-10 
            gap-2 md:gap-3 landscape:gap-3
          ">
            {Array.from({ length: totalLevels }).map((_, i) => {
              const levelNum = i + 1;
              const isUnlocked = i < unlockedCount;
              const isCurrent = i === unlockedCount - 1;
              const isCompleted = i < unlockedCount - 1;
              
              return (
                <button
                  key={i}
                  onClick={() => handleLevelClick(i)}
                  className={`
                    group relative aspect-square rounded-xl md:rounded-2xl
                    flex items-center justify-center transition-all duration-200
                    ${isUnlocked 
                      ? `bg-gradient-to-b ${theme.bg} border-b-[4px] border-black/20 shadow-lg active:border-b-0 active:translate-y-1` 
                      : 'bg-white/50 border-2 border-white/60 shadow-inner cursor-not-allowed'}
                  `}
                >
                  {isUnlocked ? (
                    <>
                      {/* Shine Effect */}
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-xl pointer-events-none"></div>
                      
                      <span className={`
                         font-display font-bold text-white drop-shadow-md text-lg md:text-2xl landscape:text-xl
                         ${isCurrent ? 'scale-125 animate-pulse' : ''}
                      `}>
                        {levelNum}
                      </span>
                      
                      {isCompleted && (
                        <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm">
                           <i className="fi fi-rr-star text-yellow-400 text-[10px] md:text-xs"></i>
                        </div>
                      )}
                    </>
                  ) : (
                    <Lock size={16} className="text-gray-400/60" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- FOOTER DECORATION --- */}
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-20"></div>

    </div>
  );
};
