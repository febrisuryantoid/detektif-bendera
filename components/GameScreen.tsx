
import React, { useState, useEffect, useRef } from 'react';
import { LevelData } from '../types';
import { getFlagName } from '../utils/flagData';
import { Lightbulb, Home, Clock, Check, X, ImageOff, Trophy } from 'lucide-react';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';

interface GameScreenProps {
  level: LevelData;
  currentTotalScore: number;
  onLevelComplete: (score: number, passed: boolean) => void;
  onGoHome: () => void;
  onRetry: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ level, currentTotalScore, onLevelComplete, onGoHome }) => {
  const { t, lang } = useLanguage();
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
  const targetName = getFlagName(level.targetFlag, lang);

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

  useEffect(() => {
    if (timeLeft === null || isGameOver || isWon) return;
    if (timeLeft === 0 && !completeTriggered.current) {
      completeTriggered.current = true;
      setIsGameOver(true);
      playSound('wrong');
      setTimeout(() => onLevelComplete(0, false), 1000);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isWon]);

  const handleCardClick = (flagCode: string, index: number) => {
    if (isGameOver || isWon) return;
    if (flagCode === level.targetFlag) {
      playSound('correct');
      setCorrectId(flagCode);
      setIsWon(true);
      completeTriggered.current = true;
      const baseScore = 100;
      const timeBonus = timeLeft ? timeLeft * 10 : 0; 
      setTimeout(() => onLevelComplete(currentScore + baseScore + timeBonus, true), 1200);
    } else {
      playSound('wrong');
      setWrongIndex(index);
      setIsGameOver(true); 
      completeTriggered.current = true;
      setTimeout(() => onLevelComplete(0, false), 1000);
    }
  };

  const useHint = () => {
    if (hintsLeft <= 0 || isWon || isGameOver) return;
    playSound('hint');
    setHintsLeft(prev => prev - 1);
    const card = document.getElementById(`flag-${level.targetFlag}`);
    if (card) {
      card.classList.add('ring-4', 'ring-yellow-400', 'scale-105', 'z-20');
      setTimeout(() => card.classList.remove('ring-4', 'ring-yellow-400', 'scale-105', 'z-20'), 1500);
    }
  };

  const getBackgroundClass = () => {
    if (isGameOver) return 'bg-gray-200';
    switch(level.difficulty) {
      case 'easy': return 'bg-[#dcfce7]';
      case 'medium': return 'bg-[#dbeafe]';
      case 'hard': return 'bg-[#f3e8ff]';
      default: return 'bg-white';
    }
  };

  return (
    // USE FIXED INSET-0 TO PREVENT BLANK SCREEN
    <div className={`fixed inset-0 flex flex-col landscape:flex-row font-sans transition-colors duration-500 ${getBackgroundClass()}`}>
      
      {/* SIDEBAR / HEADER */}
      <div className="
         bg-white shadow-sm border-b-[3px] landscape:border-b-0 landscape:border-r-[3px] border-gray-200 z-30 shrink-0
         p-2 landscape:p-3
         flex flex-row landscape:flex-col items-center justify-between landscape:justify-start 
         landscape:w-48 landscape:h-full landscape:gap-4
      ">
        
        {/* Top Controls */}
        <div className="flex landscape:flex-col items-center gap-2 landscape:w-full">
           <div className="flex items-center gap-2 landscape:w-full landscape:justify-between">
              <button onClick={() => { playSound('click'); onGoHome(); }} className="w-9 h-9 flex items-center justify-center bg-orange-400 rounded-lg border-b-[3px] border-orange-600 active:border-b-0 active:translate-y-0.5 transition-all shadow-sm">
                <Home className="text-white" size={18} strokeWidth={3} />
              </button>
              <div className="bg-indigo-500 text-white text-[10px] font-black px-2 py-1.5 rounded-md shadow-sm uppercase tracking-widest border-b-[3px] border-indigo-700">
                LVL {level.levelNumber}
              </div>
           </div>
           
           {/* Score Box */}
           <div className="hidden landscape:flex bg-yellow-400 text-yellow-900 px-2 py-1.5 rounded-lg border-b-[3px] border-yellow-600 w-full items-center justify-between shadow-sm">
                <span className="text-[9px] font-bold uppercase opacity-80">SCORE</span>
                <div className="flex items-center gap-1">
                   <Trophy size={14} strokeWidth={3} />
                   <span className="font-black text-sm">{currentTotalScore}</span>
                </div>
           </div>
        </div>

        {/* Target Info */}
        <div className="flex flex-col landscape:w-full bg-sky-50 rounded-xl p-2 border border-sky-100 text-center flex-1 justify-center relative min-h-0">
             <span className="text-sky-600 font-bold text-[8px] uppercase tracking-wider">{t.game.find}</span>
             <h1 className="text-base font-black text-gray-800 uppercase leading-tight font-titan text-stroke-sm truncate w-full">
                {targetName}
             </h1>
             <img src={`https://flagcdn.com/w160/${level.targetFlag}.png`} className="h-8 w-auto mx-auto mt-1 rounded shadow-sm opacity-60 grayscale" alt="Target" />
        </div>

        {/* Bottom Controls */}
        <div className="flex landscape:flex-col gap-2 landscape:w-full landscape:mt-auto">
            {timeLeft !== null && (
               <div className={`px-2 py-1.5 rounded-lg border-b-[3px] font-black text-xs flex items-center justify-center gap-1 shadow-sm ${timeLeft <= 5 ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white border-gray-200 text-gray-700'}`}>
                 <Clock size={14} strokeWidth={3} /> {timeLeft}s
               </div>
            )}
            <button onClick={useHint} disabled={hintsLeft <= 0 || isWon || isGameOver} className={`px-3 py-1.5 rounded-lg font-bold text-xs border-b-[3px] flex items-center justify-center gap-1 ${hintsLeft > 0 && !isGameOver ? 'bg-yellow-400 text-yellow-900 border-yellow-600 active:border-b-0 active:translate-y-0.5' : 'bg-gray-200 text-gray-400 border-gray-300'}`}>
              <Lightbulb size={14} fill={hintsLeft > 0 ? "currentColor" : "none"} />
              <span className="hidden landscape:inline">{t.game.hint} ({hintsLeft})</span>
              <span className="landscape:hidden">({hintsLeft})</span>
            </button>
        </div>
      </div>

      {/* GAME GRID */}
      <div className="flex-1 overflow-hidden p-2 flex flex-col items-center justify-center relative w-full h-full">
        <div className="w-full max-w-4xl h-full flex items-center justify-center">
          <div 
             className="grid gap-1.5 w-full max-h-full aspect-auto justify-center content-center"
             style={{ 
               gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))` 
             }}
          >
            {shuffledFlags.map((flagCode, index) => {
              const isWrong = wrongIndex === index;
              const isCorrect = correctId === flagCode;
              return (
                <button
                  key={`${flagCode}-${index}`}
                  id={flagCode === level.targetFlag ? `flag-${flagCode}` : undefined}
                  onClick={() => !isWon && !isGameOver && handleCardClick(flagCode, index)}
                  disabled={isWon || isGameOver}
                  className={`
                    relative bg-white rounded-lg shadow-sm transition-all duration-200
                    flex items-center justify-center overflow-hidden border-[2px]
                    ${isWrong ? 'border-red-500 bg-red-100 shake z-10' : isCorrect ? 'border-green-500 bg-green-100 scale-105 z-20' : isGameOver ? 'grayscale opacity-50' : 'border-white hover:border-sky-300 hover:scale-[1.02]'}
                  `}
                  style={{ aspectRatio: '4/3' }}
                >
                  {failedImages[index] ? (
                    <ImageOff size={16} className="text-gray-300" />
                  ) : (
                    <img src={`https://flagcdn.com/w160/${flagCode}.png`} alt="flag" className="w-full h-full object-contain p-0.5" onError={() => setFailedImages(p => ({...p, [index]: true}))} />
                  )}
                  {(isWrong || isCorrect) && (
                    <div className={`absolute inset-0 flex items-center justify-center ${isCorrect ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                      {isCorrect ? <Check size={24} className="text-white drop-shadow-md" strokeWidth={4} /> : <X size={24} className="text-white drop-shadow-md" strokeWidth={4} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
