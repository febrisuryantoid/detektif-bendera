
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
      // BENAR
      playSound('correct');
      setIsWon(true);
      completeTriggered.current = true;
      
      const baseScore = 100;
      const timeBonus = timeLeft * 10;
      const finalScore = baseScore + timeBonus;

      setTimeout(() => {
        onLevelComplete(finalScore, true);
      }, 1200);
    } else {
      // SALAH - GAME OVER
      playSound('wrong');
      setIsGameOver(true);
      completeTriggered.current = true;
      
      setTimeout(() => {
        onLevelComplete(0, false);
      }, 1000);
    }
  };

  const getBgColor = () => {
    if (isGameOver) return 'bg-gray-200';
    if (isWon) return 'bg-green-100';
    switch (level.difficulty) {
      case 'easy': return 'bg-yellow-50';
      case 'medium': return 'bg-blue-50';
      case 'hard': return 'bg-purple-50';
      default: return 'bg-white';
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-500 ${getBgColor()}`}>
      
      {/* HEADER */}
      <div className="bg-white px-4 pt-3 pb-4 rounded-b-[2rem] shadow-[0_8px_0_rgba(0,0,0,0.05)] border-b-4 border-gray-100 z-30 relative shrink-0">
        <div className="flex justify-between items-center mb-3">
          <button 
            onClick={() => { playSound('click'); onGoHome(); }} 
            className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-2xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all shadow-sm group"
          >
            <Home className="text-gray-600 group-hover:scale-110 transition-transform" size={24} strokeWidth={3} />
          </button>
          
          {/* Level Badge */}
          <div className="flex flex-col items-center">
            <div className="bg-sky-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest border-b-4 border-sky-700">
              {t.quiz.question} {level.levelNumber}
            </div>
          </div>

          <div className="flex flex-col items-end">
             <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-xl border-b-4 border-yellow-600 flex items-center gap-1 shadow-sm">
                <Trophy size={16} strokeWidth={3} />
                <span className="font-black text-sm">{currentTotalScore}</span>
             </div>
          </div>
        </div>

        {/* Timer Bar & Header Bubble */}
        <div className="w-full max-w-lg mx-auto">
           {/* Header Title Bubble (Pengganti teks di atas gambar) */}
           <div className="bg-indigo-100 rounded-2xl p-2 border-4 border-indigo-300 relative text-center shadow-sm mb-3">
               {/* Timer Badge Floating */}
               <div className={`absolute -top-3 -right-2 px-3 py-1 rounded-full border-4 font-black text-xs flex items-center gap-1 shadow-md transform rotate-2 z-10
                  ${timeLeft <= 5 ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white border-gray-200 text-gray-700'}
               `}>
                  <Clock size={12} strokeWidth={3} /> {timeLeft}s
               </div>

               <div className="flex items-center justify-center gap-2">
                 <Brain size={20} className="text-indigo-600" />
                 <h1 className="text-lg sm:text-xl font-black text-indigo-900 uppercase leading-tight font-titan">
                   {t.quiz.guess}
                 </h1>
               </div>
           </div>
        </div>
      </div>

      {/* GAME CONTENT - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-2 w-full flex flex-col items-center custom-scrollbar">
        <div className="w-full max-w-lg flex flex-col items-center justify-start h-full">
          
          {/* Flag Image Card */}
          {/* Menggunakan max-height dinamis agar di landscape tidak memakan semua layar */}
          <div className="w-full bg-white rounded-3xl shadow-lg border-8 border-white mb-4 flex items-center justify-center relative overflow-hidden group shrink-0" 
               style={{ minHeight: '180px', maxHeight: '35vh', aspectRatio: '4/3' }}>
             
             {imageError ? (
                <div className="flex flex-col items-center text-gray-300">
                   <ImageOff size={48} />
                   <span className="text-xs font-bold mt-2">{t.quiz.errorImg}</span>
                </div>
             ) : (
                <img 
                  src={`https://flagcdn.com/w640/${level.flagCode}.png`}
                  alt="Guess this flag"
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
             )}
          </div>

          {/* Options Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6">
             {level.options.map((code, idx) => {
                const isSelected = selectedOptionCode === code;
                const isCorrect = code === level.correctOption;
                const countryName = getFlagName(code, lang);
                
                // Status Styling
                let btnClass = "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"; // Default
                
                if (isSelected) {
                   if (isCorrect) {
                      btnClass = "bg-green-100 border-green-500 text-green-700 ring-4 ring-green-200";
                   } else {
                      btnClass = "bg-red-100 border-red-500 text-red-700 ring-4 ring-red-200 shake";
                   }
                } else if (isGameOver && isCorrect) {
                   // Show correct answer when failed
                   btnClass = "bg-green-50 border-green-300 text-green-600 opacity-60";
                }

                return (
                   <button
                      key={idx}
                      onClick={() => handleOptionClick(code)}
                      disabled={isWon || isGameOver}
                      className={`
                         w-full py-3 px-4 rounded-xl font-bold text-sm sm:text-base border-b-4 transition-all flex items-center justify-between
                         active:border-b-0 active:translate-y-1 shadow-sm min-h-[60px]
                         ${btnClass}
                      `}
                   >
                      <span className="text-left leading-tight">{countryName}</span>
                      {isSelected && isCorrect && <CheckCircle2 className="text-green-600 shrink-0 ml-2" />}
                      {isSelected && !isCorrect && <XCircle className="text-red-600 shrink-0 ml-2" />}
                   </button>
                );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};
