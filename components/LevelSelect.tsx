
import React from 'react';
import { Difficulty } from '../types';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';

interface LevelSelectProps {
  difficulty: Difficulty;
  unlockedCount: number;
  onSelectLevel: (levelIndex: number) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ difficulty, unlockedCount, onSelectLevel, onBack }) => {
  const { t } = useLanguage();
  
  const handleLevelClick = (index: number) => {
    if (index < unlockedCount) {
      playSound('click');
      onSelectLevel(index);
    } else {
      playSound('lock');
    }
  };

  const getTitleColor = () => {
    switch(difficulty) {
      case 'easy': return 'text-[#15803d]'; // Green
      case 'medium': return 'text-[#1d4ed8]'; // Blue
      case 'hard': return 'text-[#be185d]'; // Pink
      default: return 'text-[#15803d]';
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-b from-sky-300 via-sky-100 to-white flex flex-col overflow-hidden font-sans">
      
      {/* --- BACKGROUND DECORATION (Clouds) --- */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl opacity-60"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* --- HEADER --- */}
      <div className="
        relative z-20 shrink-0
        px-4 py-4 md:py-6 flex items-center justify-center
      ">
        {/* Back Button (Green Circle) */}
        <button 
          onClick={() => { playSound('click'); onBack(); }}
          className="
            absolute left-4 md:left-8
            w-12 h-12 md:w-14 md:h-14
            bg-[#4ade80] rounded-full border-b-[5px] border-[#15803d]
            shadow-lg active:border-b-0 active:translate-y-1 transition-all
            flex items-center justify-center text-white
          "
        >
          <i className="fi fi-rr-angle-small-left text-3xl mt-1"></i>
        </button>

        {/* Title */}
        <h1 className={`
          font-black uppercase tracking-wider font-titan drop-shadow-sm
          text-3xl md:text-4xl ${getTitleColor()}
        `}>
          {difficulty} {t.levelSelect.title}
        </h1>
      </div>

      {/* --- GRID CONTAINER --- */}
      <div className="
        flex-1 overflow-y-auto no-scrollbar relative z-10
        px-4 pb-32 flex flex-col items-center
      ">
        
        {/* White Glass Panel Backdrop (Optional, mimicking the container feel) */}
        <div className="
           w-full max-w-[500px] landscape:max-w-4xl
           bg-white/30 backdrop-blur-sm rounded-[2rem] p-4 md:p-6
           border-2 border-white/50 shadow-sm
        ">
           <div className="
             grid grid-cols-5 gap-3 md:gap-4
             landscape:grid-cols-8
           ">
            {Array.from({ length: 50 }).map((_, i) => {
              const levelNum = i + 1;
              const isUnlocked = i < unlockedCount;
              const isCompleted = i < unlockedCount - 1;
              const isCurrent = i === unlockedCount - 1;
              
              return (
                <button
                  key={i}
                  onClick={() => handleLevelClick(i)}
                  className={`
                    aspect-square rounded-xl md:rounded-2xl relative
                    flex items-center justify-center transition-all duration-200
                    ${isUnlocked 
                      ? 'bg-gradient-to-b from-[#bae6fd] to-[#7dd3fc] border-b-[5px] border-[#0ea5e9] shadow-md hover:-translate-y-1 active:border-b-0 active:translate-y-1' 
                      : 'bg-white/40 border-b-[5px] border-white/60 cursor-not-allowed'}
                  `}
                >
                  {/* Glossy Reflection Top */}
                  <div className="absolute top-1 left-1 right-1 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none"></div>

                  {isUnlocked ? (
                    <>
                      <span className={`
                         font-black font-titan text-[#0369a1] drop-shadow-sm
                         text-xl md:text-2xl z-10
                         ${isCurrent ? 'scale-110' : ''}
                      `}>
                        {levelNum}
                      </span>
                      
                      {/* Current Level Glow */}
                      {isCurrent && (
                         <div className="absolute inset-0 rounded-xl border-4 border-yellow-300 animate-pulse z-20"></div>
                      )}

                      {/* Completed Star */}
                      {isCompleted && (
                        <div className="absolute -top-1.5 -right-1.5 z-20 animate-pop-in">
                           <i className="fi fi-rr-star text-yellow-400 text-sm md:text-base drop-shadow-md"></i>
                        </div>
                      )}
                    </>
                  ) : (
                    <i className="fi fi-rr-lock text-gray-400/70 text-lg md:text-xl"></i>
                  )}
                </button>
              );
            })}
           </div>
        </div>
      </div>

      {/* --- FOOTER DECORATION (FLAG) --- */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none z-20">
         <div className="relative bottom-[-10px]">
            {/* Pole */}
            <div className="w-3 h-24 bg-yellow-500 mx-auto rounded-full border-2 border-yellow-700 shadow-lg relative z-10"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-green-500 rounded-full border-2 border-green-700"></div>
            
            {/* Flag Banner */}
            <div className="absolute top-2 left-1/2 ml-1 w-24 h-12 bg-yellow-400 rounded-r-lg border-y-2 border-r-2 border-yellow-600 flex items-center justify-center shadow-lg transform rotate-[-2deg] origin-left animate-pulse">
               <span className="font-black text-yellow-800 text-lg">1-50</span>
            </div>
         </div>
      </div>

    </div>
  );
};
