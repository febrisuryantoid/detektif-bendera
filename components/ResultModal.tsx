
import React, { useEffect } from 'react';
import { Star, ArrowRight, Home, RotateCcw, Trophy, Frown, UploadCloud } from 'lucide-react';
import { playSound } from '../utils/sound';
import { saveScore } from '../utils/storage';
import { Difficulty, GameMode } from '../types';
import { useLanguage } from '../utils/i18n';

interface ResultModalProps {
  score: number; // Ini sekarang adalah CUMULATIVE SCORE
  difficulty: Difficulty;
  mode: GameMode; // Ditambahkan
  playerName: string;
  isLastLevel: boolean;
  isWin: boolean; 
  onNext: () => void;
  onHome: () => void;
  onReplay: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ score, difficulty, mode, playerName, isLastLevel, isWin, onNext, onHome, onReplay }) => {
  const { t } = useLanguage();

  useEffect(() => {
    // Simpan skor dengan Mode yang sesuai
    if (score > 0) {
        // saveScore sekarang handle LocalStorage + Supabase Sync otomatis
        saveScore(mode, difficulty, score, playerName);
    }
    
    if (isWin) {
      playSound('win');
    }
  }, [isWin, score, difficulty, mode, playerName]);

  const handleClick = (action: () => void) => {
    playSound('click');
    action();
  }

  // Theme configuration
  const theme = isWin ? {
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-400',
    icon: <Star size={64} className="text-yellow-300 fill-yellow-300 animate-spin-slow" strokeWidth={2.5} />,
    title: t.result.winTitle,
    titleColor: 'text-green-600',
    msg: t.result.winMsg,
    btnMain: 'bg-green-500 border-green-700 hover:bg-green-400',
  } : {
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-400',
    icon: <Frown size={64} className="text-white animate-bounce" strokeWidth={2.5} />,
    title: t.result.loseTitle,
    titleColor: 'text-red-500',
    msg: t.result.loseMsg,
    btnMain: 'bg-red-500 border-red-700 hover:bg-red-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`
         relative w-full max-w-sm rounded-[3rem] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
         border-[8px] ${theme.borderColor} bg-white transform scale-100 animate-bounce-in
      `}>
        
        {/* Confetti / Decor Background inside card */}
        <div className={`absolute inset-0 rounded-[2.5rem] opacity-10 bg-[radial-gradient(circle,currentColor_2px,transparent_2px)] bg-[length:24px_24px] pointer-events-none ${theme.titleColor}`}></div>

        {/* Floating Header Icon */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
           <div className={`p-6 rounded-full border-8 border-white shadow-xl ${theme.iconBg}`}>
              {theme.icon}
           </div>
        </div>

        <div className="mt-12 relative z-10">
          <h2 className={`text-4xl font-black ${theme.titleColor} font-titan tracking-wide drop-shadow-sm mb-2`}>
            {theme.title}
          </h2>
          <p className="text-gray-500 font-bold mb-6">{theme.msg}</p>

          {/* Score Card */}
          <div className="bg-yellow-50 rounded-3xl p-4 border-4 border-yellow-200 mb-6 shadow-inner relative overflow-hidden">
             <div className="flex justify-center items-center gap-2 mb-1 opacity-70">
                <Trophy size={18} className="text-yellow-600" />
                <span className="text-xs font-black uppercase text-yellow-700 tracking-widest">{t.result.totalScore}</span>
             </div>
             <div className="text-6xl font-black text-yellow-500 font-titan tracking-tighter drop-shadow-sm">
                {score}
             </div>
             {navigator.onLine && (
               <div className="absolute bottom-2 right-2 opacity-30">
                 <UploadCloud size={16} className="text-yellow-600" />
               </div>
             )}
          </div>

          <div className="flex flex-col gap-3">
             {/* Main Action Button */}
             {isWin ? (
                // JIKA MENANG
                !isLastLevel ? (
                   <button 
                     onClick={() => handleClick(onNext)}
                     className="w-full bg-green-500 hover:bg-green-400 text-white text-xl font-black py-4 rounded-2xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3 shadow-lg group"
                   >
                     {t.result.btnNext} <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                   </button>
                ) : (
                   <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black p-4 rounded-2xl border-b-8 border-orange-700 shadow-lg text-lg animate-pulse">
                      {t.result.btnChampion}
                   </div>
                )
             ) : (
                // JIKA KALAH (GAME OVER)
                <button 
                  onClick={() => handleClick(onReplay)}
                  className="w-full bg-sky-400 hover:bg-sky-300 text-white text-xl font-black py-4 rounded-2xl border-b-8 border-sky-600 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <RotateCcw strokeWidth={3} /> {t.result.btnReplay}
                </button>
             )}

             {/* Secondary Button */}
             <button 
                onClick={() => handleClick(onHome)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 rounded-2xl border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-2"
             >
                <Home size={20} strokeWidth={2.5} /> {t.result.btnHome}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
