
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Crown, Calendar, Medal, Search, Brain, Star, Globe, WifiOff, Loader2, Share2 } from 'lucide-react';
import { playSound } from '../utils/sound';
import { Difficulty, GameMode, ScoreEntry } from '../types';
import { getLocalHighScores, getGlobalHighScores } from '../utils/storage';
import { useLanguage } from '../utils/i18n';

interface LeaderboardProps {
  onBack: () => void;
  playerName: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack, playerName }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<GameMode>('difference');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const localData = getLocalHighScores(mode, difficulty);
      if (isMounted) setScores(localData);

      if (navigator.onLine) {
        const globalData = await getGlobalHighScores(mode, difficulty);
        if (isMounted && globalData.length > 0) {
          setScores(globalData);
        }
      }
      if (isMounted) setIsLoading(false);
    };
    fetchData();
    return () => { isMounted = false; };
  }, [mode, difficulty, isOnline]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace('.', ':');
  };

  const handleShareRank = async (entry: ScoreEntry, index: number) => {
    playSound('click');
    const msg = t.leaderboard.shareRankMsg
      .replace('{rank}', (index + 1).toString())
      .replace('{mode}', mode.toUpperCase())
      .replace('{diff}', difficulty.toUpperCase());

    const url = "https://detektifbendera.vercel.app/";
    const fullText = `${msg} ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Detektif Bendera Ranking',
          text: msg,
          url: url
        });
      } catch (e) { console.log(e); }
    } else {
      navigator.clipboard.writeText(fullText);
      alert("Text copied!");
    }
  };

  const getRankConfig = (index: number) => {
    if (index === 0) return {
      card: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 border-b-4 border-yellow-600 text-yellow-900 shadow-xl transform scale-105 z-20',
      crownColor: 'text-yellow-100',
      textColor: 'text-yellow-950',
      scoreColor: 'text-yellow-900 drop-shadow-sm',
      rankText: 'text-yellow-700',
      isTop3: true
    };
    if (index === 1) return {
      card: 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 border-b-4 border-slate-500 text-slate-800 shadow-lg z-10',
      crownColor: 'text-slate-100',
      textColor: 'text-slate-900',
      scoreColor: 'text-slate-900',
      rankText: 'text-slate-600',
      isTop3: true
    };
    if (index === 2) return {
      card: 'bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 border-b-4 border-orange-500 text-orange-900 shadow-lg z-10',
      crownColor: 'text-orange-100',
      textColor: 'text-orange-950',
      scoreColor: 'text-orange-950',
      rankText: 'text-orange-800',
      isTop3: true
    };
    return {
      card: 'bg-white border-b-2 border-gray-100 text-gray-700 shadow-sm hover:shadow-md hover:scale-[1.01]',
      crownColor: '', 
      textColor: 'text-gray-700',
      scoreColor: 'text-sky-600',
      rankText: 'text-gray-500',
      isTop3: false
    };
  };

  return (
    <div className="min-h-[100dvh] bg-[#f0f9ff] flex flex-col items-center p-0 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-sky-400 to-sky-200 rounded-b-[3rem] z-0 shadow-lg"></div>
      <div className="absolute top-10 right-10 opacity-20 animate-spin-slow"><Star size={120} fill="white" className="text-white" /></div>
      <div className="absolute top-20 left-10 opacity-20 animate-pulse"><Crown size={80} fill="white" className="text-white" /></div>

      {/* Header Container */}
      <div className="w-full max-w-lg z-10 flex flex-col items-center pt-4 sm:pt-6 px-4">
        
        {/* Navigation Bar */}
        <div className="w-full flex items-center justify-between mb-4 sm:mb-6">
           <button 
            onClick={() => { playSound('click'); onBack(); }}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-2xl shadow-md active:scale-95 transition-all border-b-4 border-gray-200 active:border-b-0 active:translate-y-1"
           >
            <ChevronLeft size={24} className="text-gray-600" />
           </button>
           
           <div className="bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full border border-white/40 shadow-sm flex items-center gap-2">
             {isLoading && <Loader2 size={16} className="text-white animate-spin" />}
             <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 drop-shadow-md font-titan">
               <Globe size={20} className="text-white" /> {t.leaderboard.title}
             </h1>
           </div>
           
           <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
             {!isOnline && <WifiOff className="text-white/70" size={20} />}
           </div> 
        </div>

        {/* --- MAIN TABS (MODE) --- */}
        <div className="w-full bg-white p-1 rounded-2xl shadow-md flex mb-4 border-b-4 border-gray-200">
           <button
             onClick={() => { playSound('click'); setMode('difference'); }}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95
               ${mode === 'difference' 
                 ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-200' 
                 : 'text-gray-400 hover:bg-gray-50'}
             `}
           >
             <Search size={16} /> {t.leaderboard.modeDiff}
           </button>
           <button
             onClick={() => { playSound('click'); setMode('quiz'); }}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95
               ${mode === 'quiz' 
                 ? 'bg-indigo-500 text-white shadow-sm ring-2 ring-indigo-200' 
                 : 'text-gray-400 hover:bg-gray-50'}
             `}
           >
             <Brain size={16} /> {t.leaderboard.modeQuiz}
           </button>
        </div>

        {/* --- SUB TABS (DIFFICULTY) --- */}
        <div className="flex gap-2 mb-4 w-full overflow-x-auto pb-2 px-1 no-scrollbar">
           {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
             <button
               key={d}
               onClick={() => { playSound('click'); setDifficulty(d); }}
               className={`
                 flex-1 py-2 rounded-xl font-bold capitalize transition-all text-xs sm:text-sm whitespace-nowrap shadow-sm border-b-4 active:border-b-0 active:translate-y-1
                 ${difficulty === d && d === 'easy' ? 'bg-green-500 text-white border-green-700' : ''}
                 ${difficulty === d && d === 'medium' ? 'bg-blue-500 text-white border-blue-700' : ''}
                 ${difficulty === d && d === 'hard' ? 'bg-purple-500 text-white border-purple-700' : ''}
                 ${difficulty !== d ? 'bg-white text-gray-400 border-gray-200' : ''}
               `}
             >
               {d === 'easy' ? t.leaderboard.diffEasy : d === 'medium' ? t.leaderboard.diffMedium : t.leaderboard.diffHard}
             </button>
           ))}
        </div>

      </div>

      {/* --- LIST SCORES --- */}
      {/* Changed custom-scrollbar to no-scrollbar */}
      <div className="flex-1 w-full max-w-lg overflow-y-auto px-4 pb-20 z-10 no-scrollbar">
        {scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[2rem] border-4 border-dashed border-gray-200 shadow-sm opacity-80 mt-2">
                {isLoading ? (
                  <>
                     <Loader2 size={48} className="text-sky-300 animate-spin mb-4" />
                     <h3 className="text-gray-400 font-bold">{t.leaderboard.loading}</h3>
                  </>
                ) : (
                  <>
                    <Trophy size={64} className="text-gray-200 mb-4" />
                    <h3 className="text-gray-400 font-bold text-lg">{t.leaderboard.emptyTitle}</h3>
                    <p className="text-gray-400 text-sm">{t.leaderboard.emptyDesc}</p>
                  </>
                )}
            </div>
        ) : (
            <div className="flex flex-col gap-3 pb-8 pt-2">
                {scores.map((entry, i) => {
                    const style = getRankConfig(i);
                    const isCurrentUser = entry.name.trim().toLowerCase() === playerName.trim().toLowerCase();
                    
                    return (
                      <div 
                        key={i} 
                        className={`
                          relative rounded-2xl p-3 sm:p-4 flex items-center transition-all duration-300 animate-pop-in group
                          ${style.card}
                        `}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                         {/* Rank Indicator */}
                         <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                            {style.isTop3 ? (
                              <>
                                <Crown 
                                  size={56} 
                                  className={`absolute -top-2 ${style.crownColor} drop-shadow-sm`} 
                                  fill="currentColor" 
                                />
                                <span className={`relative top-1 z-10 font-black text-lg sm:text-xl ${style.rankText}`}>
                                  {i + 1}
                                </span>
                              </>
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 font-black text-gray-500 text-sm sm:text-base">
                                {i + 1}
                              </div>
                            )}
                         </div>

                         {/* User Info */}
                         <div className="flex-1 min-w-0 z-10">
                            <p className={`font-black text-base sm:text-lg truncate uppercase tracking-tight ${style.textColor}`}>
                              {entry.name}
                            </p>
                            <div className={`flex items-center gap-1 text-[10px] font-bold opacity-80 ${style.textColor}`}>
                                <Calendar size={10} />
                                <span>{formatDate(entry.date)}</span>
                            </div>
                         </div>

                         {/* Score & Share */}
                         <div className="flex flex-col items-end gap-1">
                            <div 
                                className={`text-xl sm:text-3xl font-black z-10 font-titan tracking-wide ${style.scoreColor}`}
                            >
                                {entry.score}
                            </div>
                            {isCurrentUser && (
                              <button 
                                onClick={() => handleShareRank(entry, i)}
                                className="text-gray-400 hover:text-indigo-500 p-1 bg-white/50 rounded-full active:scale-95 transition-all"
                                title={t.leaderboard.btnShare}
                              >
                                <Share2 size={16} />
                              </button>
                            )}
                         </div>
                      </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};
