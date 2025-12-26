
import React, { useEffect } from 'react';
import { Star, ArrowRight, Home, RotateCcw, Trophy, Frown, Smile, Globe, Share2, HeartCrack, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';
import { saveScore } from '../utils/storage';
import { Difficulty, GameMode } from '../types';
import { useLanguage } from '../utils/i18n';

interface ResultModalProps {
  score: number;
  difficulty: Difficulty;
  mode: GameMode; 
  playerName: string;
  isLastLevel: boolean;
  isWin: boolean; 
  onNext: () => void;
  onHome: () => void;
  onReplay: () => void;
  onLeaderboard: () => void;
}

// Custom SVG Assets for Premium Look
const GoldCoin = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
    <circle cx="50" cy="50" r="45" fill="#fbbf24" stroke="#d97706" strokeWidth="5" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="6 6" opacity="0.5" />
    <text x="50" y="68" fontSize="55" fontWeight="900" fill="#b45309" textAnchor="middle" fontFamily="sans-serif">★</text>
    {/* Shine */}
    <ellipse cx="30" cy="30" rx="10" ry="5" fill="white" opacity="0.6" transform="rotate(-45 30 30)" />
  </svg>
);

const RibbonBack = ({ colorClass }: { colorClass: string }) => (
  <div className={`absolute top-6 landscape:top-3 left-1/2 -translate-x-1/2 w-48 landscape:w-36 h-12 landscape:h-8 ${colorClass} rounded-full -z-10 shadow-md transition-all`}>
    <div className={`absolute -left-2 top-2 landscape:top-1 w-6 landscape:w-4 h-8 landscape:h-6 ${colorClass} brightness-75 rounded-l-lg -z-20 transform -rotate-12`}></div>
    <div className={`absolute -right-2 top-2 landscape:top-1 w-6 landscape:w-4 h-8 landscape:h-6 ${colorClass} brightness-75 rounded-r-lg -z-20 transform rotate-12`}></div>
  </div>
);

export const ResultModal: React.FC<ResultModalProps> = ({ score, difficulty, mode, playerName, isLastLevel, isWin, onNext, onHome, onReplay, onLeaderboard }) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (score > 0) saveScore(mode, difficulty, score, playerName);
    if (isWin) playSound('win'); else playSound('lose');
  }, [isWin, score, difficulty, mode, playerName]);

  const handleClick = (action: () => void) => {
    playSound('click');
    action();
  }

  const handleShare = async () => {
    playSound('click');
    const msg = t.result.shareMsgScore.replace('{score}', score.toString()).replace('{mode}', mode.toUpperCase()).replace('{diff}', difficulty.toUpperCase());
    const url = "https://detektifbendera.vercel.app/";
    if (navigator.share) {
      try { await navigator.share({ title: 'Detektif Bendera', text: msg, url: url }); } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(`${msg} ${url}`);
      alert(t.result.linkCopied);
    }
  };

  // THEME CONFIGURATION
  const theme = isWin ? {
    // WIN THEME
    borderColor: 'border-[#4ade80]', // Green Border
    bgColor: 'bg-[#f0fdf4]', // Light Green BG
    ribbonColor: 'bg-[#22c55e]',
    titleColor: 'text-[#15803d]',
    iconBg: 'bg-[#4ade80]',
    iconShadow: 'shadow-[#166534]',
    icon: <Smile size={48} className="text-white drop-shadow-md" strokeWidth={3} />,
    title: t.result.winTitle,
    msg: t.result.winMsg,
    dots: 'text-green-200',
    decor: (
      <>
        <div className="absolute -left-6 top-1/4 animate-bounce delay-75 landscape:scale-50"><Star size={32} className="fill-yellow-400 text-yellow-600" /></div>
        <div className="absolute -right-4 bottom-1/3 animate-bounce delay-150 landscape:scale-50"><GoldCoin size={40} /></div>
        <div className="absolute left-4 -bottom-4 animate-pulse landscape:scale-50"><Sparkles size={24} className="text-green-500" /></div>
      </>
    )
  } : {
    // LOSE THEME (MATCHING REFERENCE IMAGE)
    borderColor: 'border-[#f43f5e]', // Red/Pink Border
    bgColor: 'bg-[#fff1f2]', // Pinkish BG
    ribbonColor: 'bg-[#f43f5e]', // Red Ribbon
    titleColor: 'text-[#e11d48]', // Red Title
    iconBg: 'bg-[#f43f5e]', // Red Circle
    iconShadow: 'shadow-[#9f1239]', // Dark Red Shadow
    icon: <Frown size={48} className="text-white drop-shadow-md" strokeWidth={3} />,
    title: t.result.loseTitle,
    msg: t.result.loseMsg,
    dots: 'text-red-200',
    decor: (
      <>
        <div className="absolute -left-4 top-20 animate-spin-slow landscape:scale-50"><HeartCrack size={32} className="fill-red-400 text-red-600" /></div>
        <div className="absolute -right-6 top-1/3 animate-bounce delay-100 landscape:scale-50"><GoldCoin size={36} /></div>
        <div className="absolute right-0 -bottom-4 animate-bounce delay-300 landscape:scale-50"><GoldCoin size={28} /></div>
        <div className="absolute left-0 bottom-10 animate-pulse landscape:scale-50"><HeartCrack size={24} className="text-rose-400 rotate-12" /></div>
        {/* Confetti bits for fail (broken pieces) */}
        <div className="absolute top-10 right-4 w-2 h-2 bg-red-400 rounded-sm rotate-45"></div>
        <div className="absolute top-40 left-2 w-2 h-3 bg-rose-500 rounded-full rotate-12"></div>
      </>
    )
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm perspective-1000 overflow-y-auto">
      
      {/* CARD CONTAINER - Responsive adjustments for landscape */}
      <div className={`
         relative w-[90%] max-w-sm landscape:max-w-[480px]
         rounded-[2.5rem] landscape:rounded-3xl
         p-6 pb-8 landscape:p-4 landscape:pb-4
         text-center 
         border-[6px] md:border-[8px] landscape:border-[4px]
         ${theme.borderColor} ${theme.bgColor} 
         shadow-2xl overflow-visible transform animate-pop-in transition-all duration-300
      `}>
        
        {/* DECORATIVE BACKGROUND PATTERN (DOTS) */}
        <div className={`absolute inset-0 opacity-40 ${theme.dots}`} 
             style={{ backgroundImage: 'radial-gradient(currentColor 2px, transparent 2px)', backgroundSize: '16px 16px' }}>
        </div>

        {/* FLOATING DECORATIONS (Coins, Hearts, Stars) */}
        {theme.decor}

        {/* HEADER ICON (FLOATING) - Adjusted for landscape */}
        <div className="absolute -top-12 landscape:-top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-300">
           {/* Ribbon behind */}
           <RibbonBack colorClass={theme.ribbonColor} />
           
           {/* Icon Circle */}
           <div className={`
              w-24 h-24 landscape:w-16 landscape:h-16
              rounded-full border-[5px] landscape:border-[3px] border-white 
              flex items-center justify-center 
              ${theme.iconBg} shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-all duration-300
           `}>
              <div className="transform landscape:scale-75 origin-center transition-transform">
                {theme.icon}
              </div>
           </div>
        </div>

        {/* CONTENT AREA */}
        <div className="mt-10 landscape:mt-6 relative z-10 flex flex-col items-center transition-all">
          
          {/* TITLE */}
          <h2 className={`text-3xl md:text-4xl landscape:text-2xl font-extrabold ${theme.titleColor} font-display tracking-wide drop-shadow-sm mb-1 landscape:mb-0 uppercase transition-all`}>
            {theme.title}
          </h2>
          
          {/* SUBTITLE */}
          <p className="text-gray-500 font-medium mb-5 landscape:mb-2 text-xs md:text-sm landscape:text-[10px] px-4 leading-tight transition-all font-sans">
            {theme.msg}
          </p>

          {/* SCORE CARD (GOLDEN BOX) */}
          <div className="w-full mb-6 landscape:mb-3 relative group transition-all">
             {/* Yellow Outer Box */}
             <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-2xl p-1.5 landscape:p-1 shadow-[0_4px_0_#d97706] border border-yellow-300">
                {/* Inner Light Box */}
                <div className="bg-[#fffbeb] rounded-xl py-3 landscape:py-1.5 border border-yellow-200/50 flex flex-col items-center transition-all">
                   
                   <div className="flex items-center gap-1.5 mb-1 opacity-70">
                      <Trophy size={12} className="text-yellow-700 landscape:w-2.5 landscape:h-2.5" />
                      <span className="text-[10px] landscape:text-[8px] font-bold uppercase text-yellow-700 tracking-[0.2em] font-sans">{t.result.totalScore}</span>
                   </div>
                   
                   <div className="flex items-center justify-center gap-3 landscape:gap-2">
                      <div className="transform landscape:scale-75 origin-center transition-transform"><GoldCoin size={32} /></div>
                      <span className="text-4xl landscape:text-3xl font-extrabold text-[#d97706] font-display tracking-tighter drop-shadow-sm leading-none transition-all">
                         {score}
                      </span>
                   </div>

                </div>
             </div>
             {/* Share Button (small absolute) */}
             {isWin && (
                <button 
                  onClick={handleShare}
                  className="absolute -right-2 -top-2 bg-blue-500 text-white p-2 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform active:scale-90"
                >
                   <Share2 size={14} strokeWidth={3} />
                </button>
             )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="w-full flex flex-col gap-3 landscape:gap-2">
             {isWin ? (
                // WIN BUTTONS
                !isLastLevel ? (
                   <button 
                     onClick={() => handleClick(onNext)}
                     className="w-full bg-gradient-to-b from-[#4ade80] to-[#22c55e] text-white text-lg landscape:text-sm font-semibold py-3.5 landscape:py-2 rounded-2xl landscape:rounded-xl border-b-[6px] landscape:border-b-[4px] border-[#15803d] active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-2 shadow-lg group hover:brightness-110 font-sans"
                   >
                     {t.result.btnNext} <ArrowRight strokeWidth={4} size={20} className="group-hover:translate-x-1 transition-transform landscape:w-4 landscape:h-4" />
                   </button>
                ) : (
                   <div className="space-y-3 landscape:space-y-2">
                     <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold p-3 landscape:p-2 rounded-xl border-b-4 border-orange-700 shadow-md text-sm landscape:text-xs animate-pulse font-sans">
                        {t.result.btnChampion}
                     </div>
                     <button
                       onClick={() => handleClick(onLeaderboard)}
                       className="w-full bg-[#6366f1] text-white text-lg landscape:text-sm font-semibold py-3.5 landscape:py-2 rounded-2xl landscape:rounded-xl border-b-[6px] landscape:border-b-[4px] border-[#4338ca] active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-2 shadow-lg font-sans"
                     >
                       <Globe size={20} strokeWidth={3} className="landscape:w-4 landscape:h-4" /> {t.mainMenu.btnLeaderboard}
                     </button>
                   </div>
                )
             ) : (
                // LOSE BUTTONS (BLUE PRIMARY)
                <button 
                  onClick={() => handleClick(onReplay)}
                  className="w-full bg-gradient-to-b from-[#38bdf8] to-[#0ea5e9] text-white text-lg landscape:text-sm font-semibold py-3.5 landscape:py-2 rounded-2xl landscape:rounded-xl border-b-[6px] landscape:border-b-[4px] border-[#0369a1] active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-2 shadow-lg group hover:brightness-110 font-sans"
                >
                  <RotateCcw strokeWidth={4} size={20} className="group-hover:-rotate-90 transition-transform landscape:w-4 landscape:h-4" /> {t.result.btnReplay}
                </button>
             )}

             {/* SECONDARY BUTTON (WHITE/GRAY) */}
             <button 
                onClick={() => handleClick(onHome)}
                className="w-full bg-gray-100 text-[#64748b] font-semibold py-3 landscape:py-2 rounded-2xl landscape:rounded-xl border-b-[5px] landscape:border-b-[3px] border-[#cbd5e1] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm landscape:text-xs shadow hover:bg-white font-sans"
             >
                <Home size={18} strokeWidth={3} className="landscape:w-3.5 landscape:h-3.5" /> {t.result.btnHome}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
