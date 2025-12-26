
import React from 'react';
import { Difficulty } from '../types';
import { playSound } from '../utils/sound';
import { Lock, ChevronLeft, Star } from 'lucide-react';

interface LevelSelectProps {
  difficulty: Difficulty;
  unlockedCount: number; // How many levels are unlocked (1 to 50)
  onSelectLevel: (levelIndex: number) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ difficulty, unlockedCount, onSelectLevel, onBack }) => {
  
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
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-lg border-b-4 border-sky-200 flex items-center gap-4 z-10">
        <button 
          onClick={() => { playSound('click'); onBack(); }}
          className="p-2 bg-gray-100 rounded-xl border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all"
        >
          <ChevronLeft size={28} className="text-gray-600" />
        </button>
        <h1 className={`text-2xl font-black uppercase tracking-wide ${getColor()}`}>
          {difficulty} Levels
        </h1>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-4xl mx-auto pb-8">
          {Array.from({ length: 50 }).map((_, i) => {
            const isUnlocked = i < unlockedCount;
            const isCompleted = i < unlockedCount - 1; // Simplify: previous ones are "done"
            
            return (
              <button
                key={i}
                onClick={() => handleLevelClick(i)}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center text-xl font-black relative
                  transition-all duration-200 shadow-sm
                  ${isUnlocked 
                    ? 'bg-white text-sky-600 border-b-4 border-sky-200 hover:-translate-y-1 hover:shadow-md active:border-b-0 active:translate-y-1 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 border-b-4 border-gray-300 cursor-not-allowed'}
                `}
              >
                {isUnlocked ? (
                  <>
                    {i + 1}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2">
                         <Star size={16} className="fill-yellow-400 text-yellow-500" />
                      </div>
                    )}
                  </>
                ) : (
                  <Lock size={20} className="opacity-50" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
