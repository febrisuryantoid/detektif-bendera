
import { ScoreEntry, Difficulty, GameMode } from '../types';
import { supabase } from './supabase';

const SCORES_KEY_PREFIX = 'detektif_bendera_scores';

// --- LOCAL STORAGE HELPERS (Backup / Offline) ---

const getStorageKey = (mode: GameMode, difficulty: Difficulty) => {
  return `${SCORES_KEY_PREFIX}_${mode}_${difficulty}`;
};

export const getLocalHighScores = (mode: GameMode, difficulty: Difficulty): ScoreEntry[] => {
  try {
    const raw = localStorage.getItem(getStorageKey(mode, difficulty));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (mode: GameMode, difficulty: Difficulty, entry: ScoreEntry) => {
  const scores = getLocalHighScores(mode, difficulty);
  const existingIndex = scores.findIndex(s => s.name.toLowerCase().trim() === entry.name.toLowerCase().trim());

  if (existingIndex !== -1) {
    if (entry.score > scores[existingIndex].score) {
      scores[existingIndex] = entry;
    }
  } else {
    scores.push(entry);
  }
  
  // Sort Local
  const updated = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
    
  localStorage.setItem(getStorageKey(mode, difficulty), JSON.stringify(updated));
};

// --- SUPABASE CLOUD LOGIC ---

// Mengambil Skor Tertinggi dari Cloud
export const getGlobalHighScores = async (mode: GameMode, difficulty: Difficulty): Promise<ScoreEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('name, score, created_at')
      .eq('mode', mode)
      .eq('difficulty', difficulty)
      .order('score', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }

    if (data) {
      return data.map((row: any) => ({
        name: row.name,
        score: row.score,
        date: new Date(row.created_at).getTime()
      }));
    }
    return [];
  } catch (err) {
    console.error("Network error:", err);
    return [];
  }
};

// Menyimpan Skor ke Cloud (Logika: Cek Duplikat -> Update jika Higher)
const saveToCloud = async (mode: GameMode, difficulty: Difficulty, name: string, score: number) => {
  const cleanName = name.trim();
  
  try {
    // 1. Cek apakah user dengan nama ini sudah ada di mode & diff ini?
    const { data: existingData, error: fetchError } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('name', cleanName)
      .eq('mode', mode)
      .eq('difficulty', difficulty)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found JSON info
       // Error beneran (koneksi dll)
       console.error("Error checking existing user:", fetchError);
       return;
    }

    if (existingData) {
      // 2a. Jika ada, cek skornya
      if (score > existingData.score) {
        // Update hanya jika skor baru lebih tinggi
        await supabase
          .from('leaderboard')
          .update({ score: score, created_at: new Date().toISOString() }) // Update date juga biar fresh
          .eq('id', existingData.id);
      } else {
        // Skor lebih rendah atau sama, abaikan
        console.log("Score not higher than existing record. Skipped.");
      }
    } else {
      // 2b. Jika belum ada, Insert baru
      await supabase
        .from('leaderboard')
        .insert([
          { 
            name: cleanName, 
            score: score, 
            difficulty: difficulty, 
            mode: mode 
          }
        ]);
    }
  } catch (err) {
    console.error("Failed to save to cloud:", err);
  }
};

// --- MAIN FUNCTION ---

export const saveScore = (mode: GameMode, difficulty: Difficulty, score: number, playerName: string) => {
  if (score <= 0) return;

  const finalName = playerName || "Detektif Misterius";
  const entry: ScoreEntry = {
    name: finalName,
    score,
    date: Date.now()
  };

  // 1. Simpan Lokal (Agar UI responsif / Offline support)
  saveToLocalStorage(mode, difficulty, entry);

  // 2. Simpan Cloud (Fire and forget, biar gak nge-block UI)
  if (navigator.onLine) {
    saveToCloud(mode, difficulty, finalName, score);
  }
};
