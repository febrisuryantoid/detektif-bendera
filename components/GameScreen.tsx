
import React, { useState, useEffect, useRef } from 'react';
import { LevelData } from '../types';
import { getFlagName } from '../utils/flagData';
import { Lightbulb, Home, Clock, Check, X, Eye, ImageOff, Trophy } from 'lucide-react';
import { playSound } from '../utils/sound';

interface GameScreenProps {
  level: LevelData;
  currentTotalScore: number;
  onLevelComplete: (score: number, passed: boolean) => void;
  onGoHome: () => void;
  onRetry: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ level, currentTotalScore, onLevelComplete, onGoHome }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(level.timerSeconds || null);
  const [hintsLeft, setHintsLeft] = useState(level.maxHints);
  const [currentScore, setCurrentScore] = useState(0);
  
  const [wrongIndex, setWrongIndex] = useState<number | null>(null); 
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [shuffledFlags, setShuffledFlags] = useState<string[]>([]);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const completeTriggered = useRef(false);
  const targetName = getFlagName(level.targetFlag);

  useEffect(() => {
    const allFlags = [level.targetFlag, ...level.distractorFlags];
    const shuffled = allFlags.sort(() => Math.random() - 0.5);
    
    setShuffledFlags(shuffled);
    setCurrentScore(0);
    setWrongIndex(null);
    setCorrectId(null);
    setIsWon(false);
    setIsGameOver(false);
    setTimeLeft(level.timerSeconds || null);
    setHintsLeft(level.maxHints);
    setFailedImages({});
    completeTriggered.current = false;
  }, [level]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft === null || isGameOver || isWon) return;

    if (timeLeft === 0 && !completeTriggered.current) {
      completeTriggered.current = true;
      setIsGameOver(true);
      playSound('wrong');
      setTimeout(() => {
        onLevelComplete(0, false); // Gagal karena waktu habis
      }, 1000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isWon]);

  const handleCardClick = (flagCode: string, index: number) => {
    if (isGameOver || isWon) return;

    if (flagCode === level.targetFlag) {
      // JAWABAN BENAR
      playSound('correct');
      setCorrectId(flagCode);
      setIsWon(true);
      completeTriggered.current = true;
      
      const baseScore = 100;
      // Bonus waktu: Sisa waktu * 10.
      const timeBonus = timeLeft ? timeLeft * 10 : 0; 
      const finalScore = Math.max(0, currentScore + baseScore + timeBonus);
      
      setTimeout(() => {
        onLevelComplete(finalScore, true); 
      }, 1200);
    } else {
      // JAWABAN SALAH - GAME OVER
      playSound('wrong');
      setWrongIndex(index);
      setIsGameOver(true); 
      completeTriggered.current = true;

      setTimeout(() => {
        onLevelComplete(0, false); 
      }, 1000);
    }
  };

  const useHint = () => {
    if (hintsLeft <= 0 || isWon || isGameOver) return;
    playSound('hint');
    setHintsLeft(prev => prev - 1);
    const card = document.getElementById(`flag-${level.targetFlag}`);
    if (card) {
      card.classList.add('ring-8', 'ring-yellow-400', 'scale-105', 'z-20');
      setTimeout(() => card.classList.remove('ring-8', 'ring-yellow-400', 'scale-105', 'z-20'), 1500);
    }
  };

  const handleImageError = (index: number) => {
    setFailedImages(prev => ({ ...prev, [index]: true }));
  };

  const getBackgroundClass = () => {
    if (isGameOver) return 'bg-gray-200';
    switch(level.difficulty) {
      case 'easy': return 'bg-[#dcfce7]'; // Green tint
      case 'medium': return 'bg-[#dbeafe]'; // Blue tint
      case 'hard': return 'bg-[#f3e8ff]'; // Purple tint
      default: return 'bg-white';
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))`,
    gap: '0.75rem',
    width: '100%'
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-500 ${getBackgroundClass()}`}>
      
      {/* HEADER Playful */}
      <div className="bg-white px-4 pt-3 pb-4 rounded-b-[2rem] shadow-[0_8px_0_rgba(0,0,0,0.05)] border-b-4 border-gray-100 z-30 relative shrink-0">
        
        <div className="flex justify-between items-center mb-3">
           {/* Tombol Home */}
          <button 
            onClick={() => { playSound('click'); onGoHome(); }} 
            className="w-12 h-12 flex items-center justify-center bg-orange-400 rounded-2xl border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all shadow-sm group"
          >
            <Home className="text-white group-hover:scale-110 transition-transform" size={24} strokeWidth={3} />
          </button>

          {/* Level Badge */}
          <div className="flex flex-col items-center">
            <div className="bg-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest border-b-4 border-indigo-700">
              Level {level.levelNumber}
            </div>
          </div>

          {/* Total Score Display */}
          <div className="flex flex-col items-end">
             <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-xl border-b-4 border-yellow-600 flex items-center gap-1 shadow-sm">
                <Trophy size={16} strokeWidth={3} />
                <span className="font-black text-sm">{currentTotalScore}</span>
             </div>
          </div>
        </div>

        {/* Question Bubble */}
        <div className="bg-sky-100 rounded-2xl p-3 border-4 border-sky-300 relative text-center shadow-sm">
           {/* Timer Badge Floating */}
           {timeLeft !== null && (
              <div className={`absolute -top-4 -right-2 px-3 py-1 rounded-full border-4 font-black text-sm flex items-center gap-1 shadow-md transform rotate-3
                ${timeLeft <= 5 ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white border-gray-200 text-gray-700'}
              `}>
                <Clock size={14} strokeWidth={3} /> {timeLeft}s
              </div>
           )}

           <div className="flex items-center justify-center gap-2 mb-1">
             <Eye size={18} className="text-sky-600" />
             <span className="text-sky-700 font-bold text-xs uppercase tracking-wider">Misi Pencarian</span>
           </div>
           <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase leading-tight font-titan">
             Temukan <span className="text-pink-500 underline decoration-wavy decoration-2">{targetName}</span>
           </h1>
        </div>
      </div>

      {/* GAME AREA */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center w-full">
        <div className="w-full max-w-4xl py-2 flex-1 flex flex-col justify-center">
          
          <div style={gridStyle} className="p-2">
            {shuffledFlags.map((flagCode, index) => {
              const isWrong = wrongIndex === index;
              const isCorrect = correctId === flagCode;
              const isInteractable = !isWon && !isGameOver;
              const elementId = flagCode === level.targetFlag ? `flag-${flagCode}` : undefined;
              const hasError = failedImages[index];

              return (
                <button
                  key={`${flagCode}-${index}`}
                  id={elementId}
                  onClick={() => isInteractable && handleCardClick(flagCode, index)}
                  disabled={!isInteractable && !isCorrect}
                  className={`
                    relative bg-white rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 transform
                    flex items-center justify-center overflow-hidden border-4
                    ${isWrong 
                      ? 'border-red-500 bg-red-100 shake z-10' 
                      : isCorrect
                        ? 'border-green-500 bg-green-100 scale-105 ring-4 ring-green-300 z-20 shadow-[0_8px_0_rgba(34,197,94,0.4)]'
                        : isGameOver 
                          ? 'border-gray-200 grayscale opacity-50' 
                          : 'border-white hover:border-sky-300 hover:scale-105 active:scale-95 active:shadow-none active:translate-y-1'}
                  `}
                  style={{ aspectRatio: '4/3' }}
                >
                  {hasError ? (
                    <ImageOff size={24} className="text-gray-300" />
                  ) : (
                    <img 
                      src={`https://flagcdn.com/w320/${flagCode}.png`}
                      alt="flag"
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                      onError={() => handleImageError(index)}
                    />
                  )}
                  
                  {isWrong && (
                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center animate-pop-in backdrop-blur-[1px]">
                      <X size={40} className="text-white drop-shadow-lg" strokeWidth={5} />
                    </div>
                  )}
                  
                  {isCorrect && (
                     <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center animate-pop-in backdrop-blur-[1px]">
                      <Check size={40} className="text-white drop-shadow-lg" strokeWidth={5} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* HINT BUTTON */}
        <div className="w-full max-w-md pb-4 pt-2">
          <button
            onClick={useHint}
            disabled={hintsLeft <= 0 || isWon || isGameOver}
            className={`
              w-full flex items-center justify-center gap-3 py-3 rounded-2xl font-bold text-lg border-b-8 transition-all
              ${hintsLeft > 0 && !isGameOver
                ? 'bg-yellow-400 text-yellow-900 border-yellow-600 hover:bg-yellow-300 active:border-b-0 active:translate-y-2' 
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'}
            `}
          >
            <Lightbulb size={24} className={hintsLeft > 0 && !isGameOver ? "animate-pulse" : ""} fill={hintsLeft > 0 ? "currentColor" : "none"} />
            <span>Bantuan ({hintsLeft})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
