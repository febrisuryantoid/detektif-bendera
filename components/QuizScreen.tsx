
import React, { useState, useEffect, useRef } from 'react';
import { QuizLevelData } from '../types';
import { Home, Clock, Trophy, ImageOff, Brain, CheckCircle2, XCircle } from 'lucide-react';
import { playSound } from '../utils/sound';

interface QuizScreenProps {
  level: QuizLevelData;
  currentTotalScore: number;
  onLevelComplete: (score: number, passed: boolean) => void;
  onGoHome: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ level, currentTotalScore, onLevelComplete, onGoHome }) => {
  const [timeLeft, setTimeLeft] = useState<number>(level.timerSeconds);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const completeTriggered = useRef(false);

  useEffect(() => {
    // Reset state when level changes
    setTimeLeft(level.timerSeconds);
    setIsGameOver(false);
    setIsWon(false);
    setSelectedOption(null);
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

  const handleOptionClick = (option: string) => {
    if (isGameOver || isWon) return;
    
    setSelectedOption(option);

    if (option === level.correctOption) {
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
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => { playSound('click'); onGoHome(); }} 
            className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-2xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all shadow-sm group"
          >
            <Home className="text-gray-600 group-hover:scale-110 transition-transform" size={24} strokeWidth={3} />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="bg-sky-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest border-b-4 border-sky-700">
              Soal {level.levelNumber}
            </div>
          </div>

          <div className="flex flex-col items-end">
             <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-xl border-b-4 border-yellow-600 flex items-center gap-1 shadow-sm">
                <Trophy size={16} strokeWidth={3} />
                <span className="font-black text-sm">{currentTotalScore}</span>
             </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border-2 border-gray-300 relative mt-2">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${(timeLeft / level.timerSeconds) * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-[10px] font-black text-black/50 tracking-widest flex items-center gap-1">
                <Clock size={10} /> {timeLeft} DETIK
             </span>
          </div>
        </div>
      </div>

      {/* GAME CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-lg mx-auto overflow-y-auto">
        
        {/* Flag Image Card */}
        <div className="w-full aspect-[4/3] bg-white rounded-3xl shadow-xl border-8 border-white mb-8 flex items-center justify-center relative overflow-hidden group">
           {imageError ? (
              <div className="flex flex-col items-center text-gray-300">
                 <ImageOff size={48} />
                 <span className="text-xs font-bold mt-2">Gambar Error</span>
              </div>
           ) : (
              <img 
                src={`https://flagcdn.com/w640/${level.flagCode}.png`}
                alt="Guess this flag"
                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
           )}
           <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              <Brain size={14} className="text-pink-300" /> Tebak Aku!
           </div>
        </div>

        {/* Options Grid */}
        <div className="w-full grid grid-cols-1 gap-3">
           {level.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === level.correctOption;
              
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
                    onClick={() => handleOptionClick(option)}
                    disabled={isWon || isGameOver}
                    className={`
                       w-full py-4 px-6 rounded-2xl font-bold text-lg border-b-4 transition-all flex items-center justify-between
                       active:border-b-0 active:translate-y-1 shadow-sm
                       ${btnClass}
                    `}
                 >
                    <span>{option}</span>
                    {isSelected && isCorrect && <CheckCircle2 className="text-green-600" />}
                    {isSelected && !isCorrect && <XCircle className="text-red-600" />}
                 </button>
              );
           })}
        </div>

      </div>
    </div>
  );
};
