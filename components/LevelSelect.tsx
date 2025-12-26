
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
    <div className="fixed inset-0 bg-[#f0f9ff] flex flex-col overflow-hidden">
      {/* HEADER: Super 3D */}
      <div className="bg-white p-2 shadow-lg border-b-[6px] border-gray-200 flex items-center gap-3 z-20 shrink-0 h-20">
        <button 
          onClick={() => { playSound('click'); onBack(); }}
          className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl border-b-[5px] border-gray-300 active:border-b-0 active:translate-y-1 transition-all btn-glossy"
        >
          <ChevronLeft size={24} className="text-gray-600" strokeWidth={3} />
        </button>
        <h1 className={`text-xl sm:text-2xl font-black uppercase tracking-wide ${getColor()} drop-shadow-sm font-titan`}>
          {difficulty} {t.levelSelect.title}
        </h1>
      </div>

      {/* GRID CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar bg-sky-50">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4 max-w-6xl mx-auto pb-24">
          {Array.from({ length: 50 }).map((_, i) => {
            const isUnlocked = i < unlockedCount;
            const isCompleted = i < unlockedCount - 1; 
            
            return (
              <button
                key={i}
                onClick={() => handleLevelClick(i)}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-black relative
                  transition-all duration-200 shadow-md btn-glossy
                  ${isUnlocked 
                    ? 'bg-white text-sky-600 border-b-[6px] border-sky-200 hover:-translate-y-1 hover:border-b-sky-300 active:border-b-0 active:translate-y-2 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 border-b-[6px] border-gray-300 cursor-not-allowed opacity-70'}
                `}
              >
                {isUnlocked ? (
                  <>
                    <span className="drop-shadow-sm">{i + 1}</span>
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 animate-pop-in">
                         <Star size={20} className="fill-yellow-400 text-yellow-600 drop-shadow-md" />
                      </div>
                    )}
                  </>
                ) : (
                  <Lock size={20} className="opacity-50" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
