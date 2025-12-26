import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Crown, Calendar, Medal, Search, Brain, Star, Globe, WifiOff, Loader2 } from 'lucide-react';
import { playSound } from '../utils/sound';
import { Difficulty, GameMode, ScoreEntry } from '../types';
import { getLocalHighScores, getGlobalHighScores } from '../utils/storage';
import { useLanguage } from '../utils/i18n';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
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

  const getRankStyle = (index: number) => {
    // RANK 1 (GOLD) - Pure White Number 1
    if (index === 0) return {
      card: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white transform scale-105 z-10 shadow-xl',
      badge: 'bg-white/20 text-white ring-2 ring-white/50',
      icon: <span className="font-titan text-2xl drop-shadow-md">1</span>, // Pure White "1"
      text: 'text-white drop-shadow-sm',
      score: 'text-white font-titan drop-shadow-md'
    };
    // RANK 2 (SILVER)
    if (index === 1) return {
      card: 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 shadow-md',
      badge: 'bg-white text-slate-600 ring-2 ring-slate-200',
      icon: <span className="font-black text-lg">2</span>,
      text: 'text-slate-800',
      score: 'text-slate-900 font-titan'
    };
    // RANK 3 (BRONZE)
    if (index === 2) return {
      card: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-900 shadow-md',
      badge: 'bg-white text-orange-700 ring-2 ring-orange-200',
      icon: <span className="font-black text-lg">3</span>,
      text: 'text-orange-900',
      score: 'text-orange-950 font-titan'
    };
    // RANK 4+
    return {
      card: 'bg-white shadow-sm hover:shadow-md border border-gray-100',
      badge: 'bg-gray-100 text-gray-500',
      icon: <span className="font-black text-sm">{index + 1}</span>,
      text: 'text-gray-700',
      score: 'text-sky-500 font-titan'
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
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-2xl shadow-md active:scale-95 transition-all"
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
        <div className="w-full bg-white p-1 rounded-2xl shadow-md flex mb-4">
           <button
             onClick={() => { playSound('click'); setMode('difference'); }}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all
               ${mode === 'difference' 
                 ? 'bg-sky-500 text-white shadow-sm' 
                 : 'text-gray-400 hover:bg-gray-50'}
             `}
           >
             <Search size={16} /> {t.leaderboard.modeDiff}
           </button>
           <button
             onClick={() => { playSound('click'); setMode('quiz'); }}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all
               ${mode === 'quiz' 
                 ? 'bg-indigo-500 text-white shadow-sm' 
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
                 flex-1 py-2 rounded-xl font-bold capitalize transition-all text-xs sm:text-sm whitespace-nowrap shadow-sm
                 ${difficulty === d && d === 'easy' ? 'bg-green-500 text-white' : ''}
                 ${difficulty === d && d === 'medium' ? 'bg-blue-500 text-white' : ''}
                 ${difficulty === d && d === 'hard' ? 'bg-purple-500 text-white' : ''}
                 ${difficulty !== d ? 'bg-white text-gray-400 border border-gray-100' : ''}
               `}
             >
               {d === 'easy' ? t.leaderboard.diffEasy : d === 'medium' ? t.leaderboard.diffMedium : t.leaderboard.diffHard}
             </button>
           ))}
        </div>

      </div>

      {/* --- LIST SCORES --- */}
      <div className="flex-1 w-full max-w-lg overflow-y-auto px-4 pb-20 z-10 custom-scrollbar">
        {scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-200 shadow-sm opacity-80 mt-2">
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
            <div className="flex flex-col gap-3 pb-8">
                {scores.map((entry, i) => {
                    const style = getRankStyle(i);
                    return (
                      <div 
                        key={i} 
                        className={`
                          relative rounded-2xl p-3 sm:p-4 flex items-center transition-all duration-300 animate-pop-in
                          ${style.card}
                        `}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                         {/* Badge Rank */}
                         <div className={`
                            w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-sm shrink-0
                            ${style.badge}
                         `}>
                            {style.icon}
                         </div>

                         {/* Info */}
                         <div className="flex-1 min-w-0 z-10">
                            <p className={`font-black text-base sm:text-lg truncate uppercase tracking-tight ${style.text}`}>
                              {entry.name}
                            </p>
                            <div className={`flex items-center gap-1 text-[10px] font-bold opacity-80 ${style.text}`}>
                                <Calendar size={10} />
                                <span>{formatDate(entry.date)}</span>
                            </div>
                         </div>

                         {/* Score */}
                         <div 
                            className={`text-xl sm:text-2xl font-black z-10 ${style.score}`}
                         >
                            {entry.score}
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