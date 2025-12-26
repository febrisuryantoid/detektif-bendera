
import { createClient } from '@supabase/supabase-js';
import { GameMode, Difficulty } from '../types';

const SUPABASE_URL = 'https://yzpezhqxhmkgyskvklge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_h5aYtHt-cUt9Gp9FDfWqhg_Go2nSYgL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- REALTIME FEATURES ---

export const subscribeToGlobalRecords = (
  currentTopScore: number,
  onNewRecord: (name: string, score: number, mode: string) => void
) => {
  // Listen to ALL inserts on leaderboard
  const subscription = supabase
    .channel('leaderboard-updates')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'leaderboard' },
      (payload) => {
        const newScore = payload.new;
        if (newScore.score > currentTopScore) {
          // Seseorang baru saja memecahkan rekor!
          onNewRecord(newScore.name, newScore.score, newScore.mode);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'leaderboard' },
      (payload) => {
        const newScore = payload.new;
        if (newScore.score > currentTopScore) {
          onNewRecord(newScore.name, newScore.score, newScore.mode);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const fetchCurrentTopScore = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('score')
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return 0;
    return data.score;
  } catch {
    return 0;
  }
};
