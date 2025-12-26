
import React, { useEffect } from 'react';
import { Star, ArrowRight, Home, RotateCcw, Trophy, Frown, Globe, Share2 } from 'lucide-react';
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
      alert("Link copied!");
    }
  };

  const theme = isWin ? {
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-400',
    icon: <Star size={48} className="text-yellow-300 fill-yellow-300 animate-spin-slow drop-shadow-md" strokeWidth={2.5} />,
    title: t.result.winTitle,
    titleColor: 'text-green-600',
    msg: t.result.winMsg,
  } : {
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-400',
    icon: <Frown size={48} className="text-white animate-bounce drop-shadow-md" strokeWidth={2.5} />,
    title: t.result.loseTitle,
    titleColor: 'text-red-500',
    msg: t.result.loseMsg,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`
         relative w-[90%] max-w-sm rounded-[2rem] p-6 text-center shadow-2xl 
         border-[6px] ${theme.borderColor} bg-white transform scale-100 animate-pop-in 
         overflow-visible my-auto
      `}>
        
        <div className={`absolute inset-0 rounded-[1.5rem] opacity-10 bg-[radial-gradient(circle,currentColor_2px,transparent_2px)] bg-[length:16px_16px] pointer-events-none ${theme.titleColor}`}></div>

        {/* Floating Icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
           <div className={`p-4 rounded-full border-6 border-white shadow-xl ${theme.iconBg}`}>
              {theme.icon}
           </div>
        </div>

        <div className="mt-8 relative z-10">
          <h2 className={`text-2xl sm:text-3xl font-black ${theme.titleColor} font-titan tracking-wide drop-shadow-sm mb-1`}>
            {theme.title}
          </h2>
          <p className="text-gray-500 font-bold mb-4 text-xs sm:text-sm">{theme.msg}</p>

          {/* Score Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-3 border-4 border-yellow-300 mb-4 shadow-inner relative overflow-hidden">
             <div className="flex justify-center items-center gap-2 mb-0.5 opacity-70">
                <Trophy size={14} className="text-yellow-600" />
                <span className="text-[10px] font-black uppercase text-yellow-700 tracking-widest">{t.result.totalScore}</span>
             </div>
             <div className="text-4xl sm:text-5xl font-black text-yellow-500 font-titan tracking-tighter drop-shadow-sm text-stroke-md">
                {score}
             </div>
             {isWin && (
                <button 
                  onClick={handleShare}
                  className="absolute bottom-2 right-2 p-1.5 bg-yellow-400 rounded-lg shadow-md hover:scale-110 transition-transform text-white border-b-2 border-yellow-600 active:border-b-0 active:translate-y-0.5"
                >
                   <Share2 size={14} />
                </button>
             )}
          </div>

          <div className="flex flex-col gap-2">
             {isWin ? (
                !isLastLevel ? (
                   <button 
                     onClick={() => handleClick(onNext)}
                     className="w-full bg-gradient-to-b from-green-400 to-green-500 text-white text-base sm:text-lg font-black py-3 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md btn-3d"
                   >
                     {t.result.btnNext} <ArrowRight strokeWidth={3} size={20} />
                   </button>
                ) : (
                   <div className="flex flex-col gap-2">
                     <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black p-3 rounded-xl border-b-4 border-orange-700 shadow-md text-sm animate-pulse">
                        {t.result.btnChampion}
                     </div>
                     <button
                       onClick={() => handleClick(onLeaderboard)}
                       className="w-full bg-indigo-500 text-white text-base font-black py-3 rounded-xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md btn-3d"
                     >
                       <Globe size={18} strokeWidth={3} /> {t.mainMenu.btnLeaderboard}
                     </button>
                   </div>
                )
             ) : (
                <button 
                  onClick={() => handleClick(onReplay)}
                  className="w-full bg-gradient-to-b from-sky-400 to-sky-500 text-white text-base sm:text-lg font-black py-3 rounded-xl border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md btn-3d"
                >
                  <RotateCcw strokeWidth={3} size={20} /> {t.result.btnReplay}
                </button>
             )}

             <button 
                onClick={() => handleClick(onHome)}
                className="w-full bg-gray-100 text-gray-500 font-bold py-2.5 rounded-xl border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm btn-3d"
             >
                <Home size={16} strokeWidth={2.5} /> {t.result.btnHome}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
