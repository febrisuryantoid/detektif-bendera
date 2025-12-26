
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
      card.classList.add('ring-4', 'ring-yellow-400', 'scale-105', 'z-20', 'shadow-2xl');
      setTimeout(() => card.classList.remove('ring-4', 'ring-yellow-400', 'scale-105', 'z-20', 'shadow-2xl'), 1500);
    }
  };

  const getBackgroundClass = () => {
    if (isGameOver) return 'bg-gray-200';
    switch(level.difficulty) {
      case 'easy': return 'bg-[#ecfccb]';
      case 'medium': return 'bg-[#dbeafe]';
      case 'hard': return 'bg-[#f3e8ff]';
      default: return 'bg-white';
    }
  };

  // Compact Header Button Component
  const HeaderBtn = ({ onClick, icon, colorClass, borderClass, text }: any) => (
    <button onClick={onClick} className={`h-10 px-3 flex items-center justify-center gap-2 rounded-xl ${colorClass} ${borderClass} btn-3d`}>
      {icon}
      {text && <span className="text-xs font-black">{text}</span>}
    </button>
  );

  return (
    <div className={`fixed inset-0 w-full h-[100dvh] flex flex-col landscape:flex-row font-sans transition-colors duration-500 overflow-hidden ${getBackgroundClass()}`}>
      
      {/* 
        HEADER / SIDEBAR 
        Portrait: Fixed Height Top Bar.
        Landscape: Fixed Width Sidebar.
      */}
      <div className="
         bg-white shadow-md border-b-4 landscape:border-b-0 landscape:border-r-4 border-gray-200 z-30 shrink-0
         p-2 md:p-4
         flex flex-row landscape:flex-col items-center justify-between
         h-16 landscape:h-full landscape:w-48 xl:landscape:w-64
         landscape:justify-start landscape:gap-4
      ">
        
        {/* Navigation & Score Group */}
        <div className="flex landscape:flex-col gap-2 items-center landscape:w-full">
           <div className="flex items-center gap-2 landscape:w-full landscape:justify-between">
              <HeaderBtn 
                 onClick={() => { playSound('click'); onGoHome(); }} 
                 icon={<Home className="text-white w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />}
                 colorClass="bg-orange-400"
                 borderClass="border-orange-600"
              />
              <div className="bg-indigo-500 text-white text-[10px] md:text-xs font-black px-2 py-1 md:px-3 md:py-2 rounded-lg shadow-sm border-b-2 border-indigo-700">
                LVL {level.levelNumber}
              </div>
           </div>
           
           {/* Score (Hidden on small mobile portrait to save space, visible in landscape) */}
           <div className="hidden landscape:flex bg-gradient-to-b from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-2 rounded-xl border-b-4 border-yellow-700 w-full items-center justify-between shadow-sm">
                <span className="text-[10px] font-black uppercase opacity-70">SCORE</span>
                <div className="flex items-center gap-1">
                   <Trophy size={16} strokeWidth={3} className="text-white" />
                   <span className="font-titan text-lg text-white">{currentTotalScore}</span>
                </div>
           </div>
        </div>

        {/* TARGET MISSION (Center Piece) */}
        <div className="flex-1 landscape:flex-none landscape:w-full mx-2 landscape:mx-0 bg-sky-50 rounded-xl p-1.5 border-2 border-sky-200 text-center flex flex-col justify-center min-w-0">
             <span className="text-sky-500 font-black text-[8px] uppercase tracking-widest">{t.game.find}</span>
             <h1 className="text-sm md:text-lg font-black text-gray-800 uppercase leading-none font-titan truncate w-full">
                {targetName}
             </h1>
        </div>

        {/* CONTROLS (Timer & Hint) */}
        <div className="flex landscape:flex-col gap-2 landscape:w-full landscape:mt-auto">
            {timeLeft !== null && (
               <div className={`px-2 py-1.5 md:px-3 md:py-2 rounded-xl border-b-4 font-black text-xs md:text-sm flex items-center justify-center gap-1 shadow-sm ${timeLeft <= 5 ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white border-gray-300 text-gray-700'}`}>
                 <Clock size={16} strokeWidth={3} /> {timeLeft}s
               </div>
            )}
            <button 
              onClick={useHint} 
              disabled={hintsLeft <= 0 || isWon || isGameOver} 
              className={`
                 px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-xs border-b-4 flex items-center justify-center gap-1 transition-all btn-3d
                 ${hintsLeft > 0 && !isGameOver 
                    ? 'bg-yellow-300 text-yellow-900 border-yellow-600' 
                    : 'bg-gray-200 text-gray-400 border-gray-300'}
              `}
            >
              <Lightbulb size={16} fill={hintsLeft > 0 ? "currentColor" : "none"} />
              <span className="hidden landscape:inline font-black">{t.game.hint} ({hintsLeft})</span>
              <span className="landscape:hidden font-black">({hintsLeft})</span>
            </button>
        </div>
      </div>

      {/* 
        GAME GRID AREA 
        Uses flex to center, but overflow hidden to contain grid.
      */}
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-2 md:p-4">
        <div className="w-full h-full max-w-5xl flex items-center justify-center">
          
          <div 
             className="grid gap-2 w-full max-h-full"
             style={{ 
               // Smart Grid Calculation:
               // Ensure flags don't get too stretched or too squashed.
               gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))`,
               // Limit height to fit within container using aspect ratio logic or max-content
               alignContent: 'center',
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
                    relative bg-white rounded-lg md:rounded-xl shadow-sm transition-all duration-200
                    flex items-center justify-center overflow-hidden 
                    border-2 md:border-[3px] border-white
                    btn-3d
                    ${isWrong 
                      ? 'border-red-500 bg-red-100 shake z-10' 
                      : isCorrect 
                        ? 'border-green-500 bg-green-100 scale-105 z-20' 
                        : isGameOver 
                          ? 'grayscale opacity-50' 
                          : 'border-b-4 border-b-gray-200 hover:border-b-sky-300 hover:border-sky-300'}
                  `}
                  style={{ 
                     // Force aspect ratio to prevent squashing
                     aspectRatio: '4/3' 
                  }}
                >
                  {failedImages[index] ? (
                    <ImageOff size={24} className="text-gray-300" />
                  ) : (
                    <img src={`https://flagcdn.com/w320/${flagCode}.png`} alt="flag" className="w-full h-full object-contain p-1" onError={() => setFailedImages(p => ({...p, [index]: true}))} />
                  )}
                  
                  {/* Overlay Icons */}
                  {(isWrong || isCorrect) && (
                    <div className={`absolute inset-0 flex items-center justify-center ${isCorrect ? 'bg-green-500/40' : 'bg-red-500/40'}`}>
                      {isCorrect ? <Check size={32} className="text-white drop-shadow-md" strokeWidth={5} /> : <X size={32} className="text-white drop-shadow-md" strokeWidth={5} />}
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
