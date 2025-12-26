
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'difference' | 'quiz';

export interface LevelData {
  id: number;
  levelNumber: number;
  difficulty: Difficulty;
  targetFlag: string; // Kode bendera yang benar
  distractorFlags: string[]; // Array bendera pengalih
  gridCols: number;
  gridRows: number; // Menambahkan baris untuk kalkulasi jumlah total
  timerSeconds?: number | null; // Null/Undefined berarti tanpa timer
  maxHints: number;
}

export interface QuizLevelData {
  id: number;
  levelNumber: number;
  difficulty: Difficulty;
  flagCode: string; // Bendera soal
  options: string[]; // 4 Opsi Jawaban (Nama Negara)
  correctOption: string; // Jawaban benar
  timerSeconds: number;
}

export interface ScoreEntry {
  name: string;
  score: number;
  date: number;
}

export interface GameState {
  currentLevelId: number;
  score: number;
  unlockedLevels: {
    easy: number;
    medium: number;
    hard: number;
  };
}
