
import { LevelData, Difficulty } from '../types';

// DATA PASANGAN (Target vs Pengalih)
// Format: [Target, Pengalih]

const EASY_PAIRS = [
  ['id', 'mc'], ['mc', 'id'], ['pl', 'id'], ['id', 'pl'], ['ro', 'td'], 
  ['td', 'ro'], ['ie', 'ci'], ['ci', 'ie'], ['nl', 'lu'], ['lu', 'nl'],
  ['at', 'lv'], ['lv', 'at'], ['ml', 'gn'], ['gn', 'ml'], ['ng', 'nf'],
  ['be', 'de'], ['de', 'be'], ['fr', 'it'], ['it', 'fr'], ['ru', 'bg'],
  ['hu', 'it'], ['it', 'hu'], ['co', 'ec'], ['ec', 'co'], ['ye', 'sy'],
  ['jp', 'bd'], ['bd', 'jp'], ['ch', 'to'], ['to', 'ch'], ['dk', 'no'],
  ['fi', 'se'], ['se', 'fi'], ['is', 'no'], ['no', 'dk'], ['gr', 'uy'],
  ['ar', 'uy'], ['uy', 'ar'], ['cl', 'cz'], ['cu', 'pr'], ['pr', 'cu'],
  ['th', 'cr'], ['cr', 'th'], ['gb', 'au'], ['au', 'gb'], ['us', 'lr'],
  ['lr', 'us'], ['my', 'us'], ['us', 'my'], ['so', 'vn'], ['vn', 'cn']
]; // NOTE: cl paired with cz (Chile vs Czech) instead of tx to fix image issue

const MEDIUM_PAIRS = [
  ['fr', 'nl'], ['nl', 'fr'], ['no', 'is'], ['is', 'no'], ['fi', 'se'],
  ['se', 'fi'], ['eg', 'ye'], ['ye', 'eg'], ['sy', 'iq'], ['iq', 'sy'],
  ['sl', 'sk'], ['sk', 'sl'], ['hr', 'py'], ['py', 'hr'], ['rs', 'ru'],
  ['ru', 'rs'], ['bg', 'hu'], ['hu', 'bg'], ['mx', 'it'], ['it', 'mx'],
  ['in', 'ne'], ['ne', 'in'], ['pk', 'tr'], ['tr', 'pk'], ['my', 'us'],
  ['us', 'my'], ['cl', 'cu'], ['cu', 'cl'], ['do', 'pa'], ['pa', 'do'],
  ['ve', 'co'], ['co', 've'], ['ec', 've'], ['ve', 'ec'], ['gh', 'bo'],
  ['bo', 'gh'], ['sn', 'ml'], ['ml', 'sn'], ['cm', 'sn'], ['sn', 'cm'],
  ['et', 'bo'], ['bo', 'et'], ['uz', 'sl'], ['sl', 'uz'], ['kw', 'ae'],
  ['ae', 'kw'], ['qa', 'bh'], ['bh', 'qa'], ['jo', 'ps'], ['ps', 'jo']
]; 

const HARD_PAIRS = [
  ['au', 'nz'], ['nz', 'au'], ['jp', 'pw'], ['pw', 'jp'], ['bd', 'jp'],
  ['ht', 'li'], ['li', 'ht'], ['ve', 'ec'], ['ec', 've'], ['co', 'ec'],
  ['qa', 'bh'], ['bh', 'qa'], ['sd', 'jo'], ['jo', 'sd'], ['ps', 'sd'],
  ['kw', 'jo'], ['jo', 'kw'], ['md', 'ad'], ['ad', 'md'], ['ro', 'td'],
  ['td', 'ro'], ['pl', 'mc'], ['mc', 'pl'], ['id', 'mc'], ['mc', 'id'],
  ['sg', 'id'], ['id', 'sg'], ['my', 'lr'], ['lr', 'my'], ['us', 'lr'],
  ['lr', 'us'], ['gs', 'gb'], ['gb', 'gs'], ['sh', 'gb'], ['gb', 'sh'],
  ['fj', 'tv'], ['tv', 'fj'], ['ky', 'ms'], ['ms', 'ky'], ['vg', 'ky'],
  ['nz', 'au'], ['au', 'nz'], ['lu', 'nl'], ['nl', 'lu'], ['hr', 'py'],
  ['py', 'hr'], ['sk', 'si'], ['si', 'sk'], ['rs', 'sk'], ['sk', 'rs']
]; 

const createLevel = (
  id: number,
  levelNum: number,
  difficulty: Difficulty,
  pair: string[],
  rows: number,
  cols: number,
  time: number | null,
  hints: number
): LevelData => {
  const target = pair[0];
  const distractorBase = pair[1];
  const totalItems = rows * cols;
  const distractors = Array(totalItems - 1).fill(distractorBase);

  return {
    id,
    levelNumber: levelNum,
    difficulty,
    targetFlag: target,
    distractorFlags: distractors,
    gridRows: rows,
    gridCols: cols,
    timerSeconds: time,
    maxHints: hints
  };
};

export const LEVELS: LevelData[] = [
  // EASY: 30 Seconds
  ...EASY_PAIRS.map((pair, i) => {
    let r = 2, c = 3;
    if (i >= 20) { r = 3; c = 3; }
    if (i >= 40) { r = 3; c = 4; }
    return createLevel(i + 1, i + 1, 'easy', pair, r, c, 30, 3);
  }),

  // MEDIUM: 20 Seconds
  ...MEDIUM_PAIRS.map((pair, i) => {
    let r = 4, c = 4;
    if (i >= 25) { r = 4; c = 6; }
    return createLevel(i + 51, i + 1, 'medium', pair, r, c, 20, 2);
  }),

  // HARD: 10 Seconds
  ...HARD_PAIRS.map((pair, i) => {
    let r = 5, c = 6;
    if (i >= 20) { r = 6; c = 6; }
    if (i >= 40) { r = 8; c = 6; }
    return createLevel(i + 101, i + 1, 'hard', pair, r, c, 10, 1);
  })
];
