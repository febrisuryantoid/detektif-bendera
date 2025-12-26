
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Crown, Calendar, Medal, Search, Brain, Star, Globe, WifiOff, Loader2 } from 'lucide-react';
import { playSound } from '../utils/sound';
import { Difficulty, GameMode, ScoreEntry } from '../types';
import { getLocalHighScores, getGlobalHighScores } from '../utils/storage';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [mode, setMode] = useState<GameMode>('difference');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Effect untuk monitor koneksi internet
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

  // Effect Fetch Data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      
      // 1. Ambil data lokal dulu (Instant Load)
      const localData = getLocalHighScores(mode, difficulty);
      if (isMounted) setScores(localData);

      // 2. Jika online, ambil dari Supabase
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
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return {
      card: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 border-yellow-600 text-white transform scale-105 z-10 shadow-xl',
      badge: 'bg-white text-yellow-600 ring-4 ring-yellow-200',
      icon: <Crown size={24} className="fill-yellow-500 text-yellow-600" />,
      text: 'text-white drop-shadow-md',
      score: 'text-white drop-shadow-md'
    };
    if (index === 1) return {
      card: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-slate-500 text-slate-800 shadow-lg',
      badge: 'bg-white text-slate-600 ring-2 ring-slate-200',
      icon: <Medal size={24} className="fill-slate-400 text-slate-500" />,
      text: 'text-slate-900',
      score: 'text-slate-900'
    };
    if (index === 2) return {
      card: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 border-orange-500 text-orange-900 shadow-lg',
      badge: 'bg-white text-orange-700 ring-2 ring-orange-200',
      icon: <Medal size={24} className="fill-orange-400 text-orange-600" />,
      text: 'text-orange-900',
      score: 'text-orange-950'
    };
    return {
      card: 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01]',
      badge: 'bg-gray-100 text-gray-500',
      icon: <span className="font-black text-sm">{index + 1}</span>,
      text: 'text-gray-700',
      score: 'text-sky-500'
    };
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center p-0 sm:p-4 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-sky-400 to-sky-200 rounded-b-[3rem] z-0 shadow-lg"></div>
      <div className="absolute top-10 right-10 opacity-20 animate-spin-slow"><Star size={120} fill="white" className="text-white" /></div>
      <div className="absolute top-20 left-10 opacity-20 animate-pulse"><Crown size={80} fill="white" className="text-white" /></div>

      {/* Header Container */}
      <div className="w-full max-w-lg z-10 flex flex-col items-center pt-6 px-4">
        
        {/* Navigation Bar */}
        <div className="w-full flex items-center justify-between mb-6">
           <button 
            onClick={() => { playSound('click'); onBack(); }}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-md border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all"
           >
            <ChevronLeft size={28} className="text-gray-600" />
           </button>
           
           <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/40 shadow-sm flex items-center gap-2">
             {isLoading && <Loader2 size={16} className="text-white animate-spin" />}
             <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2 drop-shadow-md font-titan">
               <Globe size={24} className="text-white" /> Peringkat Dunia
             </h1>
           </div>
           
           <div className="w-12 h-12 flex items-center justify-center">
             {!isOnline && <WifiOff className="text-white/70" size={20} />}
           </div> 
        </div>

        {/* --- MAIN TABS (MODE) --- */}
        <div className="w-full bg-white p-1.5 rounded-2xl shadow-lg flex mb-4 border-b-4 border-gray-100">
           <button
             onClick={() => { playSound('click'); setMode('difference'); }}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all
               ${mode === 'difference' 
                 ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-200' 
                 : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
             `}
           >
             <Search size={18} /> Cari Beda
           </button>
           <button
             onClick={() => { playSound('click'); setMode('quiz'); }}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all
               ${mode === 'quiz' 
                 ? 'bg-indigo-500 text-white shadow-md ring-2 ring-indigo-200' 
                 : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
             `}
           >
             <Brain size={18} /> Tebak Nama
           </button>
        </div>

        {/* --- SUB TABS (DIFFICULTY) --- */}
        <div className="flex gap-2 mb-6 w-full overflow-x-auto pb-2 px-1">
           {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
             <button
               key={d}
               onClick={() => { playSound('click'); setDifficulty(d); }}
               className={`
                 flex-1 py-2 rounded-xl font-bold capitalize transition-all border-b-4 active:border-b-0 active:translate-y-1 text-sm sm:text-base whitespace-nowrap
                 ${difficulty === d && d === 'easy' ? 'bg-green-500 border-green-700 text-white shadow-lg' : ''}
                 ${difficulty === d && d === 'medium' ? 'bg-blue-500 border-blue-700 text-white shadow-lg' : ''}
                 ${difficulty === d && d === 'hard' ? 'bg-purple-500 border-purple-700 text-white shadow-lg' : ''}
                 ${difficulty !== d ? 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50' : ''}
               `}
             >
               {d === 'easy' ? 'Mudah' : d === 'medium' ? 'Sedang' : 'Sulit'}
             </button>
           ))}
        </div>

      </div>

      {/* --- LIST SCORES --- */}
      <div className="flex-1 w-full max-w-lg overflow-y-auto px-4 pb-20 z-10 custom-scrollbar">
        {scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[2rem] border-4 border-dashed border-gray-200 shadow-sm opacity-80 mt-4">
                {isLoading ? (
                  <>
                     <Loader2 size={48} className="text-sky-300 animate-spin mb-4" />
                     <h3 className="text-gray-400 font-bold">Sedang memuat skor...</h3>
                  </>
                ) : (
                  <>
                    <Trophy size={64} className="text-gray-200 mb-4" />
                    <h3 className="text-gray-400 font-bold text-lg">Belum ada juara.</h3>
                    <p className="text-gray-400 text-sm">Jadilah yang pertama!</p>
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
                          relative rounded-3xl p-4 flex items-center border-b-4 transition-all duration-300 animate-pop-in
                          ${style.card}
                        `}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                         {/* Confetti effect for Rank 1 */}
                         {i === 0 && (
                           <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-20 rounded-full blur-xl animate-pulse"></div>
                           </div>
                         )}

                         {/* Badge Rank */}
                         <div className={`
                            w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg mr-4 shadow-sm shrink-0
                            ${style.badge}
                         `}>
                            {style.icon}
                         </div>

                         {/* Info */}
                         <div className="flex-1 min-w-0 z-10">
                            <p className={`font-black text-lg truncate uppercase tracking-tight ${style.text}`}>
                              {entry.name}
                            </p>
                            <div className={`flex items-center gap-1 text-[10px] font-bold opacity-70 ${style.text}`}>
                                <Calendar size={10} />
                                <span>{formatDate(entry.date)}</span>
                            </div>
                         </div>

                         {/* Score */}
                         <div className={`text-2xl font-black font-titan tracking-tighter z-10 ${style.score}`}>
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
