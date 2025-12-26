
import { ScoreEntry, Difficulty, GameMode } from '../types';
import { supabase } from './supabase';

const SCORES_KEY_PREFIX = 'detektif_bendera_scores';

// --- HELPER: DEDUPLICATE LOGIC ---
// Ini fungsi pembersih utama. Menghapus duplikat nama, menyisakan SKOR TERTINGGI saja.
const deduplicateScores = (scores: ScoreEntry[]): ScoreEntry[] => {
  const map = new Map<string, ScoreEntry>();
  
  scores.forEach(entry => {
    // Normalisasi kunci: trim spasi & lowercase
    const key = entry.name.trim().toLowerCase();
    
    const existing = map.get(key);
    
    if (!existing) {
      // Belum ada, masukkan
      map.set(key, { ...entry, name: entry.name.trim() });
    } else {
      // Sudah ada, bandingkan skor
      if (entry.score > existing.score) {
        // Jika skor entry ini lebih besar, gantikan yang lama
        map.set(key, { ...entry, name: entry.name.trim() });
      }
      // Jika skor lebih kecil, ABAIKAN (ini yang menghapus "Kayzan" skor kecil)
    }
  });

  // Kembalikan array urut skor tertinggi
  return Array.from(map.values()).sort((a, b) => b.score - a.score);
};

// --- LOCAL STORAGE HELPERS ---

const getStorageKey = (mode: GameMode, difficulty: Difficulty) => {
  return `${SCORES_KEY_PREFIX}_${mode}_${difficulty}`;
};

export const getLocalHighScores = (mode: GameMode, difficulty: Difficulty): ScoreEntry[] => {
  try {
    const raw = localStorage.getItem(getStorageKey(mode, difficulty));
    if (!raw) return [];

    let parsed: ScoreEntry[] = JSON.parse(raw);
    
    // CLEANUP: Jalankan deduplikasi setiap kali ambil data
    // Ini akan otomatis menghapus duplikat lama yang sudah terlanjur tersimpan
    const cleanData = deduplicateScores(parsed);
    
    // Jika data berubah (karena ada yang dihapus), simpan balik ke storage agar bersih permanen
    if (cleanData.length !== parsed.length) {
      localStorage.setItem(getStorageKey(mode, difficulty), JSON.stringify(cleanData));
    }

    return cleanData;
  } catch {
    return [];
  }
};

// Fungsi Cek Nama Tersedia (Untuk UI Input Nama)
export const checkLocalNameExists = (name: string): boolean => {
  const cleanName = name.trim().toLowerCase();
  if (!cleanName) return false;

  // Cek di semua key storage yang mungkin (karena nama user biasanya global di device)
  // Kita cek sample dari mode 'difference' difficulty 'easy' sebagai representasi profil
  // Atau lebih baik cek apakah nama ini pernah main game ini sebelumnya
  
  // Sederhananya, kita cek keys yang ada
  for (let i = 0; i < localStorage.length; i++) {
     const key = localStorage.key(i);
     if (key && key.startsWith(SCORES_KEY_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const data: ScoreEntry[] = JSON.parse(raw);
          if (data.some(d => d.name.trim().toLowerCase() === cleanName)) {
            return true;
          }
        }
     }
  }
  return false;
};

const saveToLocalStorage = (mode: GameMode, difficulty: Difficulty, entry: ScoreEntry) => {
  // Ambil data (yang sudah otomatis bersih karena getLocalHighScores memanggil deduplicate)
  const scores = getLocalHighScores(mode, difficulty);
  
  // Masukkan data baru
  scores.push(entry);

  // Bersihkan lagi (untuk merge skor baru dengan lama jika nama sama)
  // Limit 20 besar
  const updated = deduplicateScores(scores).slice(0, 20);
    
  localStorage.setItem(getStorageKey(mode, difficulty), JSON.stringify(updated));
};

// --- SUPABASE CLOUD LOGIC ---

export const getGlobalHighScores = async (mode: GameMode, difficulty: Difficulty): Promise<ScoreEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('name, score, created_at')
      .eq('mode', mode)
      .eq('difficulty', difficulty)
      .order('score', { ascending: false })
      .limit(50); // Ambil lebih banyak dulu untuk di-filter client side

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }

    if (data) {
      const formatted = data.map((row: any) => ({
        name: row.name,
        score: row.score,
        date: new Date(row.created_at).getTime()
      }));
      
      // Filter duplikat dari server juga (tampilan bersih)
      return deduplicateScores(formatted).slice(0, 20);
    }
    return [];
  } catch (err) {
    console.error("Network error:", err);
    return [];
  }
};

const saveToCloud = async (mode: GameMode, difficulty: Difficulty, name: string, score: number) => {
  const cleanName = name.trim();
  
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('leaderboard')
      .select('*')
      .ilike('name', cleanName)
      .eq('mode', mode)
      .eq('difficulty', difficulty)
      .maybeSingle(); 

    if (fetchError) {
       console.error("Error checking existing user:", fetchError);
       return;
    }

    if (existingData) {
      if (score > existingData.score) {
        await supabase
          .from('leaderboard')
          .update({ score: score, created_at: new Date().toISOString() }) 
          .eq('id', existingData.id);
      }
    } else {
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

  const cleanName = playerName && playerName.trim().length > 0 ? playerName.trim() : "Detektif Misterius";
  
  const entry: ScoreEntry = {
    name: cleanName,
    score,
    date: Date.now()
  };

  saveToLocalStorage(mode, difficulty, entry);

  if (navigator.onLine) {
    saveToCloud(mode, difficulty, cleanName, score);
  }
};
