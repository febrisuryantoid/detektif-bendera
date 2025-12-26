
import React, { useState, useEffect, useRef } from 'react';
import { LevelData } from '../types';
import { getFlagName } from '../utils/flagData';
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

  // --- RESPONSIVE GRID LOGIC (AUTO-FIT NO SCROLL) ---
  const totalItems = shuffledFlags.length;
  let pCols = 2; // Portrait Columns
  let lCols = 3; // Landscape Columns

  if (totalItems <= 4) { pCols = 2; lCols = 2; }
  else if (totalItems <= 6) { pCols = 2; lCols = 3; }
  else if (totalItems <= 9) { pCols = 3; lCols = 3; }
  else if (totalItems <= 12) { pCols = 3; lCols = 4; }
  else if (totalItems <= 16) { pCols = 4; lCols = 4; }
  else if (totalItems <= 20) { pCols = 4; lCols = 5; }
  else if (totalItems <= 30) { pCols = 5; lCols = 6; }
  else { pCols = 6; lCols = 8; }

  const pRows = Math.ceil(totalItems / pCols);
  const lRows = Math.ceil(totalItems / lCols);

  const gridStyle = {
    '--p-cols': pCols,
    '--p-rows': pRows,
    '--l-cols': lCols,
    '--l-rows': lRows,
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col font-sans overflow-hidden bg-gradient-to-b from-[#a5f3fc] via-[#cffafe] to-[#ecfeff]">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-0 w-full h-64 bg-gradient-to-b from-[#22d3ee]/20 to-transparent blur-3xl"></div>
          <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded animate-spin"></div>
      </div>

      {/* --- HEADER --- */}
      <div className="
         relative z-30 flex items-center justify-between w-full max-w-5xl mx-auto gap-2
         pt-3 px-3 pb-2 
         landscape:pt-2 landscape:pb-1 landscape:px-6
         shrink-0 bg-white/30 backdrop-blur-sm border-b border-white/40 shadow-sm
      ">
        {/* Home & Level Badge */}
        <div className="flex items-center gap-2">
           <button 
             onClick={() => { playSound('click'); onGoHome(); }}
             className="w-10 h-10 landscape:w-9 landscape:h-9 rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 border-b-4 border-orange-800 text-white shadow active:border-b-0 active:translate-y-1 flex items-center justify-center transition-all"
           >
              <i className="fi fi-rr-home text-lg landscape:text-sm"></i>
           </button>
           <div className="bg-yellow-400 text-yellow-900 border-b-4 border-yellow-700 rounded-xl px-3 py-1.5 font-display font-bold text-xs shadow">
              {t.game.lvl} {level.levelNumber}
           </div>
        </div>

        {/* MISSION PILL */}
        <div className="flex-1 flex justify-center px-2 min-w-0">
            <div className="bg-white/90 backdrop-blur rounded-2xl border-2 border-white px-4 py-1 flex flex-col items-center shadow-lg relative min-w-[120px] max-w-full">
                <span className="text-sky-500 font-display font-bold text-[9px] landscape:text-[8px] uppercase tracking-widest leading-none mb-0.5">
                   {t.game.find}
                </span>
                <h1 className="text-red-500 font-display font-extrabold text-base landscape:text-sm md:text-xl uppercase leading-none truncate max-w-[150px] md:max-w-xs text-center">
                   {targetName}
                </h1>
            </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
            {timeLeft !== null && (
               <div className="bg-white/80 backdrop-blur rounded-xl px-2 py-1 flex items-center gap-1.5 shadow border-2 border-white/50">
                  <i className="fi fi-rr-clock-three text-gray-400 text-sm"></i>
                  <span className={`font-display font-bold text-sm ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                    {timeLeft}{t.game.timeSuffix}
                  </span>
               </div>
            )}
            <button 
              onClick={useHint} 
              disabled={hintsLeft <= 0}
              className={`
                w-10 h-10 landscape:w-9 landscape:h-9 rounded-full border-b-4 shadow active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center relative
                ${hintsLeft > 0 ? 'bg-yellow-400 border-yellow-700 text-yellow-900' : 'bg-gray-200 border-gray-400 text-gray-400'}
              `}
            >
               <i className="fi fi-rr-bulb text-lg landscape:text-sm"></i>
               {hintsLeft > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white font-sans">
                   {hintsLeft}
                 </span>
               )}
            </button>
        </div>
      </div>

      {/* --- GRID CONTAINER --- */}
      <div className="flex-1 min-h-0 w-full relative z-20 flex flex-col p-4 landscape:px-12 landscape:py-2">
         
         <div 
            className="
              w-full h-full 
              grid gap-2 landscape:gap-3 
              grid-cols-[repeat(var(--p-cols),minmax(0,1fr))] grid-rows-[repeat(var(--p-rows),minmax(0,1fr))]
              landscape:grid-cols-[repeat(var(--l-cols),minmax(0,1fr))] landscape:grid-rows-[repeat(var(--l-rows),minmax(0,1fr))]
            "
            style={gridStyle}
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
                      relative w-full h-full
                      rounded-xl landscape:rounded-lg
                      bg-white shadow-sm hover:shadow-md
                      transition-all duration-200
                      flex items-center justify-center overflow-visible
                      group
                      border-b-[3px] landscape:border-b-[3px] border-gray-200 active:border-b-0 active:translate-y-[2px]
                      ${isCorrect ? 'ring-4 ring-yellow-400 z-30 scale-[1.02] border-yellow-500' : ''}
                      ${isWrong ? 'ring-4 ring-red-500 z-20 shake grayscale border-red-500' : ''}
                      ${!isCorrect && !isWrong && isGameOver ? 'opacity-40 blur-[0.5px]' : ''}
                    `}
                  >
                     {failedImages[index] ? (
                       <i className="fi fi-rr-picture text-gray-300 text-xl"></i>
                     ) : (
                       <img 
                         src={`https://flagcdn.com/w640/${flagCode}.png`} 
                         alt="flag" 
                         className="max-w-[85%] max-h-[85%] w-auto h-auto object-contain drop-shadow-sm select-none pointer-events-none"
                         onError={() => setFailedImages(p => ({...p, [index]: true}))} 
                         loading="lazy"
                       />
                     )}

                     {isCorrect && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-1 shadow-sm animate-pop-in z-40">
                           <i className="fi fi-rr-star text-xs"></i>
                        </div>
                     )}
                  </button>
               );
            })}
         </div>
      </div>

    </div>
  );
};
