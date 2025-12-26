
import { QuizLevelData, Difficulty } from '../types';
import { FLAG_NAMES } from '../utils/flagData';

// Generate Options: Returns CODES instead of Names
const generateOptions = (correctCode: string): string[] => {
  const allCodes = Object.keys(FLAG_NAMES).filter(c => c !== correctCode);
  const shuffled = allCodes.sort(() => 0.5 - Math.random());
  const wrongCodes = shuffled.slice(0, 3);
  
  const options = [correctCode, ...wrongCodes];
  return options.sort(() => 0.5 - Math.random());
};

const createQuizLevel = (
  index: number,
  difficulty: Difficulty,
  flagCode: string,
  time: number
): QuizLevelData => {
  return {
    id: index,
    levelNumber: index + 1,
    difficulty,
    flagCode,
    options: generateOptions(flagCode), // This now contains CODES
    correctOption: flagCode, // Correct answer code
    timerSeconds: time
  };
};

// 1. EASY (30 Levels)
const EASY_FLAGS = [
  'id', 'jp', 'cn', 'in', 'sa', 'th', 'my', 'sg', 'gb', 'us',
  'fr', 'de', 'it', 'es', 'nl', 'br', 'ar', 'au', 'ca', 'ru',
  'kr', 'vn', 'ph', 'eg', 'tr', 'pt', 'be', 'ch', 'se', 'ps'
];

// 2. MEDIUM (30 Levels)
const MEDIUM_FLAGS = [
  'fi', 'no', 'dk', 'gr', 'mx', 'co', 've', 'cl', 'pe', 'uy',
  'nz', 'ie', 'pl', 'ua', 'hu', 'cz', 'ro', 'bg', 'hr', 'rs',
  'ng', 'ke', 'gh', 'ma', 'dz', 'tn', 'pk', 'bd', 'lk', 'qa'
];

// 3. HARD (30 Levels)
const HARD_FLAGS = [
  'is', 'ee', 'lt', 'lv', 'md', 'by', 'al', 'mk', 'ba', 'cy',
  'ad', 'li', 'sm', 'mc', 'mt', 'kz', 'uz', 'kg', 'tj', 'tm',
  'mn', 'np', 'bt', 'la', 'kh', 'mm', 'mv', 'fj', 'to', 'ws'
];

export const QUIZ_LEVELS: Record<Difficulty, QuizLevelData[]> = {
  easy: EASY_FLAGS.map((code, i) => createQuizLevel(i, 'easy', code, 30)),
  medium: MEDIUM_FLAGS.map((code, i) => createQuizLevel(i, 'medium', code, 20)),
  hard: HARD_FLAGS.map((code, i) => createQuizLevel(i, 'hard', code, 10))
};
