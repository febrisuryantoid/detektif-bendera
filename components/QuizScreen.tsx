
import React, { useState, useEffect, useRef } from 'react';
import { QuizLevelData } from '../types';
import { Home, Clock, Trophy, ImageOff, Brain, CheckCircle2, XCircle } from 'lucide-react';
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
    setTimeLeft(level.timerSeconds);
    setIsGameOver(false);
    setIsWon(false);
    setSelectedOptionCode(null);
    setImageError(false);
    completeTriggered.current = false;
  }, [level]);

  useEffect(() => {
    if (isGameOver || isWon) return;
    if (timeLeft === 0 && !completeTriggered.current) {
      completeTriggered.current = true;
      setIsGameOver(true);
      playSound('wrong');
      setTimeout(() => onLevelComplete(0, false), 1000);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
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
      setTimeout(() => onLevelComplete(score, true), 1000);
    } else {
      playSound('wrong');
      setIsGameOver(true);
      completeTriggered.current = true;
      setTimeout(() => onLevelComplete(0, false), 1200);
    }
  };

  const getBackgroundColor = () => {
    if (isWon) return 'bg-green-100';
    if (isGameOver) return 'bg-red-50';
    return 'bg-indigo-50';
  };

  return (
    <div className={`fixed inset-0 flex flex-col font-sans transition-colors duration-300 h-[100dvh] overflow-hidden ${getBackgroundColor()}`}>
      
      {/* HEADER: Compact */}
      <div className="bg-white/90 backdrop-blur-md px-3 py-2 shadow-sm border-b-2 border-indigo-100 flex items-center justify-between z-20 shrink-0 h-14 md:h-16">
         <div className="flex items-center gap-2">
             <button 
                onClick={() => { playSound('click'); onGoHome(); }}
                className="w-9 h-9 flex items-center justify-center bg-white rounded-lg border-b-2 border-gray-300 active:border-b-0 active:translate-y-0.5 transition-all shadow-sm hover:bg-gray-50"
             >
                <Home size={18} className="text-gray-600" strokeWidth={3} />
             </button>
             <div className="bg-indigo-500 text-white text-[10px] font-black px-2 py-1.5 rounded-lg border-b-2 border-indigo-700 shadow-sm">
                LVL {level.levelNumber}
             </div>
         </div>

         <div className="flex items-center gap-2">
            <div className={`
              flex items-center gap-1 px-2 py-1.5 rounded-lg font-black text-xs border-b-2 shadow-sm
              ${timeLeft <= 5 ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white border-gray-300 text-gray-700'}
            `}>
               <Clock size={14} strokeWidth={3} /> {timeLeft}
            </div>
            <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 text-yellow-900 px-2 py-1.5 rounded-lg border-b-2 border-yellow-700 flex items-center gap-1 text-xs font-black shadow-sm">
               <Trophy size={14} className="text-white drop-shadow-sm" strokeWidth={3} /> <span className="text-white drop-shadow-md">{currentTotalScore}</span>
            </div>
         </div>
      </div>

      {/* QUESTION AREA */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative overflow-hidden p-2 min-h-0">
         
         <div className="bg-white px-4 py-1.5 rounded-full border-2 border-indigo-200 shadow-sm mb-2 md:mb-4 animate-pop-in">
            <h2 className="text-indigo-600 font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
               <Brain size={16} /> {t.quiz.guess}
            </h2>
         </div>

         {/* FLAG CARD - Responsive Height */}
         <div className="w-full flex items-center justify-center p-2 flex-1 min-h-0">
            <div className={`
               relative p-2 bg-white rounded-2xl shadow-lg border-4 border-white
               transition-all duration-500 transform
               max-h-full w-auto aspect-[4/3] flex items-center justify-center
               ${isWon ? 'scale-105 rotate-2' : ''}
               ${isGameOver ? 'opacity-70 grayscale rotate-1' : ''}
            `}>
               {imageError ? (
                  <div className="flex flex-col items-center text-gray-400 gap-1 p-4">
                     <ImageOff size={32} />
                     <span className="text-[10px] font-bold">{t.quiz.errorImg}</span>
                  </div>
               ) : (
                  <img 
                    src={`https://flagcdn.com/w640/${level.flagCode}.png`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-inner border border-gray-100"
                    alt="Quiz Flag"
                    onError={() => setImageError(true)}
                  />
               )}

               {/* Result Overlays */}
               {isWon && (
                 <div className="absolute -top-4 -right-4 z-20 animate-pop-in">
                    <CheckCircle2 size={64} className="text-green-500 bg-white rounded-full shadow-lg border-2 border-white" fill="white" />
                 </div>
               )}
               {isGameOver && (
                 <div className="absolute -top-4 -right-4 z-20 animate-pop-in">
                    <XCircle size={64} className="text-red-500 bg-white rounded-full shadow-lg border-2 border-white" fill="white" />
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* OPTIONS AREA */}
      <div className="bg-white/50 backdrop-blur-md px-3 py-3 md:px-6 md:py-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-white/50 z-30 shrink-0 rounded-t-2xl">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-3xl mx-auto w-full">
            {level.options.map((optionCode) => {
               const isSelected = selectedOptionCode === optionCode;
               const isCorrect = optionCode === level.correctOption;
               
               let btnClass = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
               
               if (isWon && isCorrect) {
                  btnClass = "bg-green-500 border-green-700 text-white ring-2 ring-green-300";
               } else if (isGameOver && isCorrect) {
                  btnClass = "bg-green-500 border-green-700 text-white opacity-90";
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
                      relative py-3 px-2 rounded-xl border-b-4 font-black text-sm md:text-base uppercase tracking-tight
                      transition-all active:border-b-0 active:translate-y-1 shadow-sm flex items-center justify-center text-center leading-tight
                      btn-3d
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
