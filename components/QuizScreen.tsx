
import React, { useState, useEffect, useRef } from 'react';
import { QuizLevelData } from '../types';
import { playSound } from '../utils/sound';
import { useLanguage } from '../utils/i18n';
import { getFlagName } from '../utils/flagData';
import { Star, Clock, Trophy, Search, Home, Sparkles, Cloud } from 'lucide-react';

interface QuizScreenProps {
  level: QuizLevelData;
  currentTotalScore: number;
  onLevelComplete: (score: number, passed: boolean) => void;
  onGoHome: () => void;
}

// --- VISUAL COMPONENTS ---

const CloudDecor = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <div className={`absolute text-white/40 pointer-events-none animate-pulse ${className}`} style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}>
    <Cloud fill="currentColor" size={64} strokeWidth={0} />
  </div>
);

const SparkleDecor: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute animate-pulse text-yellow-200" style={style}>
    <Sparkles size={12} fill="currentColor" />
  </div>
);

const FlagDecor = ({ code, side }: { code: string, side: 'left' | 'right' }) => (
  <div className={`
    absolute bottom-[-20px] ${side === 'left' ? 'left-[-10px] rotate-12' : 'right-[-10px] -rotate-12'} 
    w-16 h-24 z-10 pointer-events-none opacity-80 filter drop-shadow-lg
  `}>
    <div className="w-1 h-24 bg-gray-300 mx-auto absolute top-0 left-1/2 -translate-x-1/2 rounded-full"></div>
    <img 
      src={`https://flagcdn.com/w160/${code}.png`} 
      className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-auto rounded shadow-sm"
      alt="decor"
    />
  </div>
);

export const QuizScreen: React.FC<QuizScreenProps> = ({ level, currentTotalScore, onLevelComplete, onGoHome }) => {
  const { t, lang } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<number>(level.timerSeconds);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [selectedOptionCode, setSelectedOptionCode] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const completeTriggered = useRef(false);

  // Generate random decorative sparkles
  const sparkles = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      transform: `scale(${0.5 + Math.random() * 0.5})`,
    }));
  }, []);

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
      setTimeout(() => onLevelComplete(score, true), 1500);
    } else {
      playSound('wrong');
      setIsGameOver(true);
      completeTriggered.current = true;
      setTimeout(() => onLevelComplete(0, false), 1500);
    }
  };

  // Helper to determine button style
  const getButtonStyle = (code: string) => {
    const isSelected = selectedOptionCode === code;
    const isCorrect = code === level.correctOption;

    // Base Style (White/Blue Glossy)
    let base = "bg-gradient-to-b from-white to-blue-50 border-blue-100 text-[#475569] hover:brightness-95";
    let icon = null;
    let ring = "";
    
    // States
    if (isWon && isCorrect) {
      // CORRECT (Cyan/Blue + Gold Border + Glow)
      base = "bg-gradient-to-r from-cyan-400 to-blue-500 border-yellow-400 text-white scale-[1.02] z-10 shadow-[0_0_25px_rgba(34,211,238,0.6)]";
      ring = "ring-2 ring-yellow-200 ring-offset-2 ring-offset-blue-200";
      icon = <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-300 animate-spin-slow" size={20} />;
    } else if (isGameOver && isCorrect) {
      // REVEAL CORRECT WHEN LOST
      base = "bg-green-500 border-green-600 text-white";
    } else if (isSelected && !isCorrect) {
      // WRONG (Red/Pink Festive)
      base = "bg-gradient-to-r from-red-400 to-rose-500 border-red-600 text-white shake";
    }

    return { className: `${base} ${ring}`, icon };
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col font-sans overflow-hidden bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#dcfce7]">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Clouds */}
         <CloudDecor className="top-[10%] -left-10 opacity-60 scale-150" delay={0} />
         <CloudDecor className="top-[20%] -right-10 opacity-40 scale-125" delay={1.5} />
         <CloudDecor className="bottom-[15%] left-10 opacity-50" delay={0.5} />
         
         {/* Sparkles */}
         {sparkles.map((style, i) => <SparkleDecor key={i} style={style} />)}
         
         {/* Bottom Gradient Overlay (Ground feel) */}
         <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/30 to-transparent"></div>

         {/* Corner Flags (Decorative) */}
         <div className="landscape:hidden">
            <FlagDecor code="us" side="left" />
            <FlagDecor code="gb" side="right" />
         </div>
      </div>

      {/* --- TOP BAR (HEADER) --- */}
      <div className="relative z-30 px-3 pt-3 md:pt-4 pb-2 flex items-center justify-between gap-2 max-w-4xl mx-auto w-full shrink-0">
         
         {/* Left: Home & Level */}
         <div className="flex items-center gap-2">
            <button 
              onClick={() => { playSound('click'); onGoHome(); }}
              className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl md:rounded-2xl border-b-[4px] border-orange-700 shadow-lg text-white flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all"
            >
               <Home size={20} strokeWidth={3} />
            </button>
            <div className="bg-[#6366f1] text-white px-3 md:px-4 py-2 rounded-xl md:rounded-2xl border-b-[4px] border-[#4338ca] shadow-md font-display font-bold text-xs md:text-sm">
               {t.game.lvl} {level.levelNumber}
            </div>
         </div>

         {/* Center: Title Pill */}
         <div className="bg-white/90 backdrop-blur-sm border-2 border-white/50 px-4 md:px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Search size={16} className="text-blue-500" strokeWidth={3} />
            <span className="text-[#3b82f6] font-display font-bold text-xs md:text-sm tracking-widest uppercase">
               {t.quiz.guess}
            </span>
         </div>

         {/* Right: Stats */}
         <div className="bg-white/90 backdrop-blur-sm border-2 border-white/50 px-3 md:px-4 py-2 rounded-full shadow-lg flex items-center gap-3 text-[#64748b] font-display font-bold text-xs md:text-sm">
             <div className={`flex items-center gap-1 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
                <Clock size={16} /> {timeLeft}
             </div>
             <div className="w-px h-4 bg-gray-300"></div>
             <div className="flex items-center gap-1 text-yellow-500">
                <Trophy size={16} fill="currentColor" /> {currentTotalScore}
             </div>
         </div>

      </div>

      {/* --- CONTENT WRAPPER (Responsive Layout) --- */}
      <div className="
        flex-1 w-full max-w-6xl mx-auto 
        flex flex-col landscape:flex-row items-center justify-center 
        p-4 landscape:px-8 landscape:py-2 
        relative z-20 min-h-0 
        gap-4 landscape:gap-8
      ">
         
         {/* 1. FLAG AREA */}
         <div className="w-full landscape:flex-1 landscape:h-full flex flex-col items-center justify-center relative min-h-0">
             
             {/* Side Decor (Portrait Only) */}
             <div className="absolute left-2 md:-left-8 top-1/2 -translate-y-1/2 -rotate-[15deg] z-0 hidden sm:block landscape:hidden pointer-events-none opacity-60 grayscale-[30%] blur-[1px]">
                <div className="bg-white/30 p-2 rounded-xl border border-white/40 shadow-sm">
                  <img src={`https://flagcdn.com/w160/${level.flagCode}.png`} className="w-20 md:w-28 h-auto rounded opacity-80" alt="" />
                </div>
             </div>
             <div className="absolute right-2 md:-right-8 top-1/2 -translate-y-1/2 rotate-[15deg] z-0 hidden sm:block landscape:hidden pointer-events-none opacity-60 grayscale-[30%] blur-[1px]">
                <div className="bg-white/30 p-2 rounded-xl border border-white/40 shadow-sm">
                  <img src={`https://flagcdn.com/w160/${level.flagCode}.png`} className="w-20 md:w-28 h-auto rounded opacity-80" alt="" />
                </div>
             </div>

             {/* FLAG CARD FRAME */}
             <div className={`
                 relative 
                 w-full aspect-[4/3] md:aspect-video 
                 landscape:aspect-auto landscape:h-full landscape:w-auto landscape:max-w-full
                 bg-white rounded-[2rem] md:rounded-[2.5rem]
                 shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
                 border-[8px] border-white
                 flex items-center justify-center overflow-hidden
                 ring-4 ring-white/50
                 transition-transform duration-500
                 z-10
                 ${isWon ? 'scale-105' : ''}
             `}>
                 {/* Inner Shadow / Depth */}
                 <div className="absolute inset-0 rounded-[1.5rem] shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] pointer-events-none z-10 border border-gray-100"></div>
                 
                 {/* Glossy Reflection */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 pointer-events-none z-20 rounded-[1.5rem]"></div>
                 
                 {/* The Flag Image */}
                 {imageError ? (
                    <div className="text-gray-300 flex flex-col items-center gap-2">
                       <Cloud size={48} />
                       <span className="text-xs font-bold">{t.quiz.errorImg}</span>
                    </div>
                 ) : (
                   <img 
                      src={`https://flagcdn.com/w640/${level.flagCode}.png`}
                      className="w-[75%] h-[75%] landscape:w-auto landscape:h-[85%] object-contain drop-shadow-md z-0"
                      alt="Flag"
                      onError={() => setImageError(true)}
                   />
                 )}

                 {/* Win Particle Overlay */}
                 {isWon && (
                    <div className="absolute inset-0 z-30 pointer-events-none">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-pulse bg-yellow-400/20 mix-blend-overlay"></div>
                       <Sparkles className="absolute top-4 right-4 text-yellow-400 animate-bounce" size={32} fill="currentColor" />
                       <Star className="absolute bottom-4 left-4 text-yellow-300 animate-spin-slow" size={24} fill="currentColor" />
                    </div>
                 )}
             </div>

         </div>

         {/* 2. OPTIONS AREA */}
         <div className="
            relative z-30 
            w-full max-w-md landscape:max-w-lg landscape:w-[45%]
            px-6 landscape:px-0 
            pb-8 md:pb-12 landscape:pb-0
            flex flex-col landscape:grid landscape:grid-cols-2 gap-3
            shrink-0
         ">
            {level.options.map((optionCode) => {
               const style = getButtonStyle(optionCode);
               
               return (
                  <button
                    key={optionCode}
                    onClick={() => handleOptionClick(optionCode)}
                    disabled={isWon || isGameOver}
                    className={`
                       relative w-full py-3.5 md:py-4 landscape:py-3 rounded-2xl
                       border-b-[5px] active:border-b-0 active:translate-y-[5px]
                       font-sans font-semibold text-sm md:text-base landscape:text-xs xl:landscape:text-sm tracking-wider uppercase
                       shadow-sm transition-all duration-200
                       flex items-center justify-center
                       ${style.className}
                    `}
                  >
                     <span className="drop-shadow-sm truncate px-1">{getFlagName(optionCode, lang)}</span>
                     {style.icon}
                  </button>
               );
            })}
         </div>

      </div>

    </div>
  );
};
