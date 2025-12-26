
import React from 'react';
import { Difficulty } from '../types';
import { playSound } from '../utils/sound';
import { Lock, ChevronLeft, Star } from 'lucide-react';
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

  const getColor = () => {
    switch(difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-blue-600';
      case 'hard': return 'text-purple-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f0f9ff] flex flex-col overflow-hidden font-sans">
      {/* HEADER: Standardized */}
      <div className="bg-white p-2 md:p-4 shadow-lg border-b-[4px] md:border-b-[6px] border-gray-200 flex items-center gap-3 z-20 shrink-0 h-16 md:h-24">
        <button 
          onClick={() => { playSound('click'); onBack(); }}
          className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-gray-100 rounded-xl md:rounded-2xl border-b-[4px] md:border-b-[5px] border-gray-300 active:border-b-0 active:translate-y-1 transition-all btn-glossy"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-gray-600" strokeWidth={3} />
        </button>
        <h1 className={`text-lg md:text-3xl font-black uppercase tracking-wide ${getColor()} drop-shadow-sm font-titan`}>
          {difficulty} {t.levelSelect.title}
        </h1>
      </div>

      {/* GRID CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-sky-50">
        <div className="
          grid gap-3 md:gap-4 lg:gap-6 max-w-7xl mx-auto pb-24
          grid-cols-4         /* Mobile */
          sm:grid-cols-5      /* Large Phone */
          md:grid-cols-6      /* Tablet Portrait */
          lg:grid-cols-8      /* Tablet Landscape */
          xl:grid-cols-10     /* Desktop */
        ">
          {Array.from({ length: 50 }).map((_, i) => {
            const isUnlocked = i < unlockedCount;
            const isCompleted = i < unlockedCount - 1; 
            
            return (
              <button
                key={i}
                onClick={() => handleLevelClick(i)}
                className={`
                  aspect-square rounded-xl md:rounded-2xl lg:rounded-3xl 
                  flex items-center justify-center text-lg md:text-2xl lg:text-3xl font-black relative
                  transition-all duration-200 shadow-md btn-glossy
                  ${isUnlocked 
                    ? 'bg-white text-sky-600 border-b-[4px] md:border-b-[6px] border-sky-200 hover:-translate-y-1 hover:border-b-sky-300 active:border-b-0 active:translate-y-2 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 border-b-[4px] md:border-b-[6px] border-gray-300 cursor-not-allowed opacity-70'}
                `}
              >
                {isUnlocked ? (
                  <>
                    <span className="drop-shadow-sm">{i + 1}</span>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 animate-pop-in">
                         <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-600 drop-shadow-md" />
                      </div>
                    )}
                  </>
                ) : (
                  <Lock className="w-5 h-5 md:w-8 md:h-8 opacity-50" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
