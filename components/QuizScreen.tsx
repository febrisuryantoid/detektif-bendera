
import React, { useState, useEffect, useRef } from 'react';
import { QuizLevelData } from '../types';
import { Home, Clock, Trophy, ImageOff, Brain, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';
import { getFlagName } from '../utils/flagData';

interface QuizScreenProps {
  level: QuizLevelData;
  currentTotalScore: number;
  onLevelComplete: (score: number, passed: boolean) => void;
  onGoHome: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ level, currentTotalScore, onLevelComplete, onGoHome }) => {
  const { t, lang } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<number>(level.timerSeconds);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [selectedOptionCode, setSelectedOptionCode] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const completeTriggered = useRef(false);

  useEffect(() => {
    // Reset state when level changes
    setTimeLeft(level.timerSeconds);
    setIsGameOver(false);
    setIsWon(false);
    setSelectedOptionCode(null);
    setImageError(false);
    completeTriggered.current = false;
  }, [level]);

  // Timer Logic
  useEffect(() => {
    if (isGameOver || isWon) return;

    if (timeLeft === 0 && !completeTriggered.current) {
      completeTriggered.current = true;
      setIsGameOver(true);
      playSound('wrong');
      setTimeout(() => {
        onLevelComplete(0, false);
      }, 1000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isWon]);

  const handleOptionClick = (code: string) => {
    if (isGameOver || isWon) return;
    
    setSelectedOptionCode(code);
    
    if (code === level.correctOption) {
      playSound('correct');
      setIsWon(true);
      completeTriggered.current = true;
      
      const timeBonus = timeLeft * 10;
      const score = 100 + timeBonus;
      
      setTimeout(() => {
        onLevelComplete(score, true);
      }, 1000);
    } else {
      playSound('wrong');
      setIsGameOver(true);
      completeTriggered.current = true;
      
      setTimeout(() => {
        onLevelComplete(0, false);
      }, 1200);
    }
  };

  const getBackgroundColor = () => {
    if (isWon) return 'bg-green-100';
    if (isGameOver) return 'bg-red-50';
    return 'bg-indigo-50';
  };

  return (
    <div className={`fixed inset-0 flex flex-col font-sans transition-colors duration-300 ${getBackgroundColor()}`}>
      
      {/* 
         TOP HEADER BAR 
         Compact, flex row. Contains Home, Level, Timer, Score.
      */}
      <div className="bg-white/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 shadow-sm border-b-2 border-indigo-100 flex items-center justify-between z-20 shrink-0 h-14 sm:h-16">
         <div className="flex items-center gap-2 sm:gap-4">
             <button 
                onClick={() => { playSound('click'); onGoHome(); }}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 rounded-lg sm:rounded-xl border-b-[3px] border-gray-300 active:border-b-0 active:translate-y-0.5 transition-all"
             >
                <Home size={16} className="text-gray-600 sm:w-5 sm:h-5" />
             </button>
             <div className="bg-indigo-500 text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 rounded-lg border-b-[3px] border-indigo-700">
                LEVEL {level.levelNumber}
             </div>
         </div>

         <div className="flex items-center gap-2 sm:gap-4">
            <div className={`
              flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg font-black text-xs sm:text-sm border-b-[3px]
              ${timeLeft <= 5 ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white border-gray-200 text-gray-700'}
            `}>
               <Clock size={14} className="sm:w-4 sm:h-4" /> {timeLeft}
            </div>
            <div className="bg-yellow-400 text-yellow-900 px-2 sm:px-3 py-1 rounded-lg border-b-[3px] border-yellow-600 flex items-center gap-1 text-xs sm:text-sm font-black">
               <Trophy size={14} className="sm:w-4 sm:h-4" /> {currentTotalScore}
            </div>
         </div>
      </div>

      {/* 
         MAIN CONTENT AREA
         Using flex-1 to occupy all remaining vertical space.
         Items centered. Flag scales to fit.
      */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative overflow-hidden p-2 sm:p-4">
         
         {/* Question Bubble - Floating minimal */}
         <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm animate-pop-in">
            <h2 className="text-indigo-600 font-bold text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
               <Brain size={14} /> {t.quiz.guess}
            </h2>
         </div>

         {/* FLAG CONTAINER - Dominant Element */}
         <div className="w-full h-full flex items-center justify-center p-2 sm:p-8">
            <div className={`
               relative w-full h-full flex items-center justify-center
               transition-all duration-500
               ${isWon ? 'scale-110 drop-shadow-xl' : ''}
               ${isGameOver ? 'opacity-50 grayscale blur-sm' : ''}
            `}>
               {imageError ? (
                  <div className="flex flex-col items-center text-gray-400 gap-2">
                     <ImageOff size={48} />
                     <span className="text-xs font-bold">{t.quiz.errorImg}</span>
                  </div>
               ) : (
                  <img 
                    src={`https://flagcdn.com/w640/${level.flagCode}.png`}
                    className="max-w-full max-h-full object-contain drop-shadow-lg rounded-md"
                    alt="Quiz Flag"
                    onError={() => setImageError(true)}
                  />
               )}

               {/* Result Overlays */}
               {isWon && (
                 <div className="absolute inset-0 flex items-center justify-center z-20 animate-pop-in">
                    <CheckCircle2 size={80} className="text-green-500 bg-white rounded-full drop-shadow-2xl" fill="white" />
                 </div>
               )}
               {isGameOver && (
                 <div className="absolute inset-0 flex items-center justify-center z-20 animate-pop-in">
                    <XCircle size={80} className="text-red-500 bg-white rounded-full drop-shadow-2xl" fill="white" />
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* 
         OPTIONS DOCK
         Fixed at bottom, compact grid.
      */}
      <div className="bg-white px-3 py-3 sm:px-6 sm:py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100 z-30 shrink-0 rounded-t-3xl">
         <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-3xl mx-auto">
            {level.options.map((optionCode) => {
               const isSelected = selectedOptionCode === optionCode;
               const isCorrect = optionCode === level.correctOption;
               
               // COLOR LOGIC UPDATED: Default is now Amber/Yellow, not White
               let btnClass = "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200";
               
               if (isWon && isCorrect) {
                  btnClass = "bg-green-500 border-green-700 text-white ring-2 ring-green-300";
               } else if (isGameOver && isCorrect) {
                  btnClass = "bg-green-500 border-green-700 text-white opacity-80";
               } else if (isSelected) {
                  if (isCorrect) {
                     btnClass = "bg-green-500 border-green-700 text-white";
                  } else {
                     btnClass = "bg-red-500 border-red-700 text-white shake";
                  }
               }

               return (
                  <button
                    key={optionCode}
                    onClick={() => handleOptionClick(optionCode)}
                    disabled={isWon || isGameOver}
                    className={`
                      relative py-3 sm:py-4 px-2 rounded-xl border-b-[4px] font-black text-xs sm:text-base uppercase tracking-wide
                      transition-all active:border-b-0 active:translate-y-1 shadow-sm flex items-center justify-center text-center leading-tight
                      ${btnClass}
                    `}
                  >
                     {getFlagName(optionCode, lang)}
                  </button>
               );
            })}
         </div>
      </div>

    </div>
  );
};
