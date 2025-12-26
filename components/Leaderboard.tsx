
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Globe, Calendar, Loader2, WifiOff, Trophy, Cloud, Sun, Flower2, Trees } from 'lucide-react';
import { playSound } from '../utils/sound';
import { Difficulty, GameMode, ScoreEntry } from '../types';
import { getLocalHighScores, getGlobalHighScores } from '../utils/storage';
import { useLanguage } from '../utils/i18n';

interface LeaderboardProps {
  onBack: () => void;
  playerName: string;
}

// --- DECORATION COMPONENTS ---
const CloudDecor = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <div 
    className={`absolute text-white/60 pointer-events-none animate-pulse ${className}`} 
    style={{ animationDelay: `${delay}s`, animationDuration: '6s' }}
  >
    <Cloud fill="currentColor" size={64} strokeWidth={0} className="filter drop-shadow-sm" />
  </div>
);

const NatureDecor = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
     {/* Sun */}
     <div className="absolute top-[-20px] right-[-20px] text-yellow-300 animate-spin-slow opacity-80">
        <Sun size={120} fill="currentColor" strokeWidth={0} />
     </div>
     
     {/* Clouds */}
     <CloudDecor className="top-[5%] -left-10 opacity-70 scale-125" delay={0} />
     <CloudDecor className="top-[15%] right-[-30px] opacity-50 scale-110" delay={2} />
     
     {/* Ground Elements (Bottom) */}
     <div className="absolute bottom-0 w-full flex justify-between px-4 opacity-40 text-emerald-600">
        <div className="transform -translate-x-4 translate-y-4">
           <Trees size={80} fill="currentColor" strokeWidth={0} />
        </div>
        <div className="transform translate-x-4 translate-y-2">
           <Flower2 size={60} fill="#f472b6" strokeWidth={0} className="text-pink-500" />
        </div>
     </div>
  </div>
);

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
      // Reset scores visual to show loading properly
      setScores([]); 
      
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

  // ASSETS DARI REFERENSI
  const RANK_ICONS = [
    "https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/pertama.svg",
    "https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/kedua.svg",
    "https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/ketiga.svg"
  ];

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-200 flex flex-col font-sans overflow-hidden">
      
      {/* Background Decorations */}
      <NatureDecor />

      {/* --- HEADER SECTION (FIXED) --- */}
      <div className="relative pt-4 px-4 pb-2 z-20 shrink-0 flex flex-col gap-3 max-w-xl mx-auto w-full">
        
        {/* Top Bar */}
        <div className="relative flex items-center justify-center mb-1">
            <button 
                onClick={() => { playSound('click'); onBack(); }}
                className="absolute left-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl border-b-4 border-gray-200 flex items-center justify-center shadow-lg active:border-b-0 active:translate-y-1 transition-all z-10 text-sky-500"
            >
                <ChevronLeft size={28} strokeWidth={4} />
            </button>
            
            <div className="bg-[#ef4444] text-white px-6 md:px-8 py-2 rounded-xl border-b-4 border-[#b91c1c] shadow-lg flex items-center gap-3">
                <Globe size={24} className="text-yellow-300 animate-spin-slow" strokeWidth={3} />
                <h1 className="font-display font-extrabold text-xl md:text-2xl uppercase tracking-wider drop-shadow-sm">
                    {t.leaderboard.title}
                </h1>
            </div>

            <div className="absolute right-0 w-12 h-12 flex items-center justify-center">
                {!isOnline && <WifiOff className="text-white/80 drop-shadow-md" />}
            </div>
        </div>

        {/* CONTROLS CONTAINER (Glassmorphism) */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-2 border-2 border-white/50 shadow-lg">
            
            {/* Mode Selector */}
            <div className="flex bg-black/5 rounded-2xl p-1 mb-2 relative">
                <button
                    onClick={() => { playSound('click'); setMode('difference'); }}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-xs md:text-sm uppercase tracking-wide transition-all duration-300 ${
                        mode === 'difference' 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md scale-[1.02]' 
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                    <Search size={16} strokeWidth={3} /> {t.leaderboard.modeDiff}
                </button>
                <button
                    onClick={() => { playSound('click'); setMode('quiz'); }}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-xs md:text-sm uppercase tracking-wide transition-all duration-300 ${
                        mode === 'quiz' 
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-md scale-[1.02]' 
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                    <Globe size={16} strokeWidth={3} /> {t.leaderboard.modeQuiz}
                </button>
            </div>

            {/* Difficulty Selector */}
            <div className="flex gap-2">
                 {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                        key={d}
                        onClick={() => { playSound('click'); setDifficulty(d); }}
                        className={`
                            flex-1 py-2 rounded-xl font-display font-bold text-xs uppercase tracking-wider shadow-sm border-b-[3px] active:border-b-0 active:translate-y-[3px] transition-all
                            ${difficulty === d 
                                ? d === 'easy' 
                                    ? 'bg-gradient-to-b from-green-400 to-emerald-500 border-emerald-700 text-white ring-2 ring-white' 
                                    : d === 'medium'
                                        ? 'bg-gradient-to-b from-blue-400 to-indigo-500 border-indigo-700 text-white ring-2 ring-white'
                                        : 'bg-gradient-to-b from-pink-400 to-rose-500 border-rose-700 text-white ring-2 ring-white'
                                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'}
                        `}
                    >
                        {d === 'easy' ? t.leaderboard.diffEasy : d === 'medium' ? t.leaderboard.diffMedium : t.leaderboard.diffHard}
                    </button>
                 ))}
            </div>
        </div>

      </div>

      {/* --- SCROLLABLE LIST AREA --- */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar relative z-10">
        <div className="max-w-xl mx-auto px-4 py-2 pb-40 flex flex-col gap-3 min-h-[300px]">
            
            {isLoading ? (
               <div className="flex flex-col items-center justify-center mt-20 gap-4 bg-white/20 backdrop-blur-sm p-8 rounded-3xl border-2 border-white/30">
                  <Loader2 size={48} className="text-white animate-spin" />
                  <p className="text-white font-display font-bold tracking-widest animate-pulse text-lg shadow-black/10 drop-shadow-md">{t.leaderboard.loading}</p>
               </div>
            ) : scores.length === 0 ? (
               <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 text-center border-4 border-white shadow-xl mt-4 mx-4">
                  <Trophy size={64} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-600 font-display font-black text-xl mb-1">{t.leaderboard.emptyTitle}</h3>
                  <p className="text-gray-400 text-sm font-sans font-medium">{t.leaderboard.emptyDesc}</p>
               </div>
            ) : (
                scores.map((entry, i) => {
                    const isRank1 = i === 0;
                    const isRank2 = i === 1;
                    const isRank3 = i === 2;
                    const isTop3 = i < 3;
                    
                    // Card Styling Configuration
                    let bgClass = "bg-white/95";
                    let borderClass = "border-b-[4px] border-gray-200";
                    let nameClass = "text-gray-700";
                    let scoreClass = "text-sky-600";
                    let rankBadge = (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center font-display font-bold text-gray-400 text-lg shadow-inner">
                            {i + 1}
                        </div>
                    );

                    if (isRank1) {
                        bgClass = "bg-gradient-to-r from-yellow-100 to-amber-50 border-2 border-yellow-300";
                        borderClass = "border-b-[4px] border-yellow-500 shadow-lg scale-[1.02] z-10";
                        nameClass = "text-yellow-900";
                        scoreClass = "text-amber-600";
                        rankBadge = <img src={RANK_ICONS[0]} alt="1st" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md relative -top-3 scale-125" />;
                    } else if (isRank2) {
                        bgClass = "bg-gradient-to-r from-slate-100 to-gray-50 border-2 border-slate-300";
                        borderClass = "border-b-[4px] border-slate-400 shadow-md";
                        nameClass = "text-slate-800";
                        scoreClass = "text-slate-600";
                        rankBadge = <img src={RANK_ICONS[1]} alt="2nd" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-md relative -top-1" />;
                    } else if (isRank3) {
                        bgClass = "bg-gradient-to-r from-orange-100 to-red-50 border-2 border-orange-200";
                        borderClass = "border-b-[4px] border-orange-400 shadow-md";
                        nameClass = "text-orange-900";
                        scoreClass = "text-orange-700";
                        rankBadge = <img src={RANK_ICONS[2]} alt="3rd" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-md relative -top-1" />;
                    }

                    return (
                        <div 
                            key={`${entry.name}-${i}`}
                            className={`
                                relative w-full rounded-2xl p-3 flex items-center transform transition-all duration-300 animate-slide-down
                                ${bgClass} ${borderClass}
                            `}
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            {/* Rank Badge */}
                            <div className={`shrink-0 flex items-center justify-center mr-3 ${isRank1 ? 'w-14' : 'w-10'}`}>
                                {rankBadge}
                            </div>

                            {/* Player Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-display font-bold text-base md:text-lg uppercase truncate leading-tight ${nameClass}`}>
                                    {entry.name}
                                </h3>
                                <div className="flex items-center gap-1 text-[10px] font-bold font-sans text-gray-400/80">
                                    <Calendar size={10} /> {formatDate(entry.date)}
                                </div>
                            </div>

                            {/* Score */}
                            <div className={`text-lg md:text-2xl font-black font-display ${scoreClass} drop-shadow-sm`}>
                                {entry.score}
                            </div>
                        </div>
                    );
                })
            )}

            {/* Bottom Decoration: Achievement Icon */}
            <div className="mt-8 flex flex-col items-center justify-center relative z-20">
                 <div className="relative hover:scale-110 transition-transform duration-300 group cursor-pointer">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-yellow-300 blur-2xl opacity-40 rounded-full animate-pulse group-hover:opacity-60"></div>
                    
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/12282/12282314.png" 
                        alt="Achievement"
                        className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] relative z-10"
                    />
                    
                    {/* Particle hints */}
                    <div className="absolute -top-2 -right-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-0 -left-2 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse"></div>
                 </div>
                 <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
                    <p className="text-white font-bold text-[10px] font-sans tracking-widest uppercase text-shadow-sm">
                        {t.mainMenu.footer}
                    </p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
