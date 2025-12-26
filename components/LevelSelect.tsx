
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
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-blue-500';
      case 'hard': return 'text-purple-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-sky-100 flex flex-col overflow-hidden">
      {/* HEADER: Force top, compact */}
      <div className="bg-white p-2 shadow-md border-b-[3px] border-sky-200 flex items-center gap-3 z-20 shrink-0 h-14 sm:h-16">
        <button 
          onClick={() => { playSound('click'); onBack(); }}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg border-b-[3px] border-gray-300 active:border-b-0 active:translate-y-0.5 transition-all"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h1 className={`text-lg sm:text-xl font-black uppercase tracking-wide ${getColor()}`}>
          {difficulty} {t.levelSelect.title}
        </h1>
      </div>

      {/* GRID CONTAINER: Fill remaining space, handle scrolling internally */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 no-scrollbar">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3 max-w-5xl mx-auto pb-8">
          {Array.from({ length: 50 }).map((_, i) => {
            const isUnlocked = i < unlockedCount;
            const isCompleted = i < unlockedCount - 1; 
            
            return (
              <button
                key={i}
                onClick={() => handleLevelClick(i)}
                className={`
                  aspect-square rounded-xl flex items-center justify-center text-sm sm:text-lg font-black relative
                  transition-all duration-200 shadow-sm
                  ${isUnlocked 
                    ? 'bg-white text-sky-600 border-b-[3px] border-sky-200 hover:-translate-y-0.5 hover:shadow-md active:border-b-0 active:translate-y-0.5 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 border-b-[3px] border-gray-300 cursor-not-allowed'}
                `}
              >
                {isUnlocked ? (
                  <>
                    {i + 1}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1">
                         <Star size={10} className="fill-yellow-400 text-yellow-500" />
                      </div>
                    )}
                  </>
                ) : (
                  <Lock size={14} className="opacity-50" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
