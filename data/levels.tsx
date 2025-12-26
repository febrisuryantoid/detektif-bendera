
import { LevelData, Difficulty } from '../types';

// Helper: Mix multiple distractors randomly
const getDistractors = (distractors: string[], count: number) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(distractors[i % distractors.length]);
  }
  return result;
};

const createLevel = (
  id: number,
  levelNum: number,
  difficulty: Difficulty,
  target: string,
  distractors: string[],
  rows: number,
  cols: number,
  time: number | null,
  hints: number
): LevelData => {
  const totalItems = rows * cols;
  const distractorFlags = getDistractors(distractors, totalItems - 1);

  return {
    id,
    levelNumber: levelNum,
    difficulty,
    targetFlag: target,
    distractorFlags,
    gridRows: rows,
    gridCols: cols,
    timerSeconds: time,
    maxHints: hints
  };
};

/* 
  DAFTAR 150 LEVEL PROGRESIF
  - Easy: 1-50 (30 Detik)
  - Medium: 51-100 (20 Detik)
  - Hard: 101-150 (10 Detik)
*/

export const LEVELS: LevelData[] = [
  // --- EASY (50 LEVELS) ---
  createLevel(1, 1, 'easy', 'id', ['pl'], 2, 3, 30, 3), // Indonesia - Polandia
  createLevel(2, 2, 'easy', 'id', ['mc'], 2, 3, 30, 3), // Indonesia - Monako
  createLevel(3, 3, 'easy', 'pl', ['mc'], 2, 3, 30, 3), // Polandia - Monako
  createLevel(4, 4, 'easy', 'ro', ['td'], 2, 3, 30, 3), // Rumania - Chad
  createLevel(5, 5, 'easy', 'ie', ['ci'], 2, 3, 30, 3), // Irlandia - Pantai Gading
  createLevel(6, 6, 'easy', 'nl', ['lu'], 2, 3, 30, 3), // Belanda - Luksemburg
  createLevel(7, 7, 'easy', 'ru', ['rs'], 2, 3, 30, 3), // Rusia - Serbia
  createLevel(8, 8, 'easy', 'ua', ['pw'], 2, 3, 30, 3), // Ukraina - Palau
  createLevel(9, 9, 'easy', 'jp', ['bd'], 2, 3, 30, 3), // Jepang - Bangladesh
  createLevel(10, 10, 'easy', 'at', ['lv'], 2, 3, 30, 3), // Austria - Latvia
  createLevel(11, 11, 'easy', 'ng', ['ie'], 2, 3, 30, 3), // Nigeria - Irlandia
  createLevel(12, 12, 'easy', 'be', ['de'], 2, 3, 30, 3), // Belgia - Jerman
  createLevel(13, 13, 'easy', 'am', ['co'], 2, 3, 30, 3), // Armenia - Kolombia
  createLevel(14, 14, 'easy', 'bg', ['hu'], 2, 3, 30, 3), // Bulgaria - Hungaria
  createLevel(15, 15, 'easy', 'pe', ['ca'], 2, 3, 30, 3), // Peru - Kanada
  createLevel(16, 16, 'easy', 'fr', ['nl'], 2, 3, 30, 3), // Prancis - Belanda
  createLevel(17, 17, 'easy', 'it', ['mx'], 2, 3, 30, 3), // Italia - Meksiko
  createLevel(18, 18, 'easy', 'eg', ['ye'], 2, 3, 30, 3), // Mesir - Yaman
  createLevel(19, 19, 'easy', 'sy', ['iq'], 2, 3, 30, 3), // Suriah - Irak
  createLevel(20, 20, 'easy', 'kw', ['ae'], 3, 3, 30, 3), // Kuwait - UEA
  createLevel(21, 21, 'easy', 'sn', ['ml'], 3, 3, 30, 3), // Senegal - Mali
  createLevel(22, 22, 'easy', 'gn', ['ml'], 3, 3, 30, 3), // Guinea - Mali
  createLevel(23, 23, 'easy', 'ml', ['ci'], 3, 3, 30, 3), // Mali - Pantai Gading
  createLevel(24, 24, 'easy', 'sl', ['ga'], 3, 3, 30, 3), // Sierra Leone - Gabon
  createLevel(25, 25, 'easy', 'bo', ['gh'], 3, 3, 30, 3), // Bolivia - Ghana
  createLevel(26, 26, 'easy', 'cm', ['sn'], 3, 3, 30, 3), // Kamerun - Senegal
  createLevel(27, 27, 'easy', 'at', ['pe'], 3, 3, 30, 3), // Austria - Peru
  createLevel(28, 28, 'easy', 'lv', ['at'], 3, 3, 30, 3), // Latvia - Austria
  createLevel(29, 29, 'easy', 'td', ['ro'], 3, 3, 30, 3), // Chad - Rumania
  createLevel(30, 30, 'easy', 'id', ['pl', 'mc'], 3, 3, 30, 3), // Indonesia - Polandia - Monako
  createLevel(31, 31, 'easy', 'jp', ['pw'], 3, 3, 30, 3), // Jepang - Palau
  createLevel(32, 32, 'easy', 'bd', ['jp'], 3, 3, 30, 3), // Bangladesh - Jepang
  createLevel(33, 33, 'easy', 'bg', ['ru'], 3, 3, 30, 3), // Bulgaria - Rusia
  createLevel(34, 34, 'easy', 'hu', ['ir'], 3, 3, 30, 3), // Hungaria - Iran
  createLevel(35, 35, 'easy', 'ng', ['ne'], 3, 3, 30, 3), // Nigeria - Niger
  createLevel(36, 36, 'easy', 'ua', ['kz'], 3, 3, 30, 3), // Ukraina - Kazakhstan
  createLevel(37, 37, 'easy', 'th', ['cr'], 3, 3, 30, 3), // Thailand - Kosta Rika
  createLevel(38, 38, 'easy', 'co', ['am'], 3, 3, 30, 3), // Kolombia - Armenia
  createLevel(39, 39, 'easy', 'be', ['am'], 3, 3, 30, 3), // Belgia - Armenia
  createLevel(40, 40, 'easy', 'ye', ['eg'], 3, 4, 30, 3), // Yaman - Mesir
  createLevel(41, 41, 'easy', 'sy', ['ye'], 3, 4, 30, 3), // Suriah - Yaman
  createLevel(42, 42, 'easy', 'iq', ['eg'], 3, 4, 30, 3), // Irak - Mesir
  createLevel(43, 43, 'easy', 'pe', ['at'], 3, 4, 30, 3), // Peru - Austria
  createLevel(44, 44, 'easy', 'lv', ['id'], 3, 4, 30, 3), // Latvia - Indonesia
  createLevel(45, 45, 'easy', 'td', ['id'], 3, 4, 30, 3), // Chad - Indonesia
  createLevel(46, 46, 'easy', 'pl', ['lv'], 3, 4, 30, 3), // Polandia - Latvia
  createLevel(47, 47, 'easy', 'mc', ['at'], 3, 4, 30, 3), // Monako - Austria
  createLevel(48, 48, 'easy', 'ga', ['sl'], 3, 4, 30, 3), // Gabon - Sierra Leone
  createLevel(49, 49, 'easy', 'gh', ['bo'], 3, 4, 30, 3), // Ghana - Bolivia
  createLevel(50, 50, 'easy', 'ml', ['sn'], 3, 4, 30, 3), // Mali - Senegal

  // --- MEDIUM (50 LEVELS) ---
  createLevel(51, 1, 'medium', 'no', ['is'], 4, 4, 20, 2), // Norwegia - Islandia
  createLevel(52, 2, 'medium', 'fi', ['se'], 4, 4, 20, 2), // Finlandia - Swedia
  createLevel(53, 3, 'medium', 'dk', ['no'], 4, 4, 20, 2), // Denmark - Norwegia
  createLevel(54, 4, 'medium', 'si', ['sk'], 4, 4, 20, 2), // Slovenia - Slovakia
  createLevel(55, 5, 'medium', 'hr', ['rs'], 4, 4, 20, 2), // Kroasia - Serbia
  createLevel(56, 6, 'medium', 'ru', ['si'], 4, 4, 20, 2), // Rusia - Slovenia
  createLevel(57, 7, 'medium', 'py', ['nl'], 4, 4, 20, 2), // Paraguay - Belanda
  createLevel(58, 8, 'medium', 'th', ['cr'], 4, 4, 20, 2), // Thailand - Kosta Rika
  createLevel(59, 9, 'medium', 've', ['co'], 4, 4, 20, 2), // Venezuela - Kolombia
  createLevel(60, 10, 'medium', 'ec', ['co'], 4, 4, 20, 2), // Ekuador - Kolombia
  createLevel(61, 11, 'medium', 'ht', ['li'], 4, 4, 20, 2), // Haiti - Liechtenstein
  createLevel(62, 12, 'medium', 'qa', ['bh'], 4, 4, 20, 2), // Qatar - Bahrain
  createLevel(63, 13, 'medium', 'tn', ['tr'], 4, 4, 20, 2), // Tunisia - Turki
  createLevel(64, 14, 'medium', 'pk', ['sa'], 4, 4, 20, 2), // Pakistan - Arab Saudi
  createLevel(65, 15, 'medium', 'my', ['id'], 4, 4, 20, 2), // Malaysia - Indonesia
  createLevel(66, 16, 'medium', 'ph', ['cz'], 4, 4, 20, 2), // Filipina - Ceko
  createLevel(67, 17, 'medium', 'np', ['bt'], 4, 4, 20, 2), // Nepal - Bhutan
  createLevel(68, 18, 'medium', 'ge', ['gb'], 4, 4, 20, 2), // Georgia - Inggris
  createLevel(69, 19, 'medium', 'cu', ['pr'], 4, 4, 20, 2), // Kuba - Puerto Riko
  createLevel(70, 20, 'medium', 'dm', ['th'], 4, 4, 20, 2), // Dominika - Thailand
  createLevel(71, 21, 'medium', 'cm', ['gn'], 4, 4, 20, 2), // Kamerun - Guinea
  createLevel(72, 22, 'medium', 'bo', ['gh'], 4, 4, 20, 2), // Bolivia - Ghana
  createLevel(73, 23, 'medium', 'eg', ['iq'], 4, 4, 20, 2), // Mesir - Irak
  createLevel(74, 24, 'medium', 'ir', ['hu'], 4, 4, 20, 2), // Iran - Hungaria
  createLevel(75, 25, 'medium', 'pe', ['ca'], 4, 6, 20, 2), // Peru - Kanada
  createLevel(76, 26, 'medium', 'at', ['lv'], 4, 6, 20, 2), // Austria - Latvia
  createLevel(77, 27, 'medium', 'jp', ['pw', 'bd'], 4, 6, 20, 2), // Jepang - Palau - Bangladesh
  createLevel(78, 28, 'medium', 'ua', ['kz'], 4, 6, 20, 2), // Ukraina - Kazakhstan
  createLevel(79, 29, 'medium', 'ru', ['sk'], 4, 6, 20, 2), // Rusia - Slovakia
  createLevel(80, 30, 'medium', 'rs', ['me'], 4, 6, 20, 2), // Serbia - Montenegro
  createLevel(81, 31, 'medium', 'sv', ['ni'], 4, 6, 20, 2), // El Salvador - Nikaragua
  createLevel(82, 32, 'medium', 'hn', ['ni'], 4, 6, 20, 2), // Honduras - Nikaragua
  createLevel(83, 33, 'medium', 'gt', ['hn'], 4, 6, 20, 2), // Guatemala - Honduras
  createLevel(84, 34, 'medium', 'sl', ['ga'], 4, 6, 20, 2), // Sierra Leone - Gabon
  createLevel(85, 35, 'medium', 'td', ['ro'], 4, 6, 20, 2), // Chad - Rumania
  createLevel(86, 36, 'medium', 'id', ['pl'], 4, 6, 20, 2), // Indonesia - Polandia
  createLevel(87, 37, 'medium', 'pe', ['at'], 4, 6, 20, 2), // Peru - Austria
  createLevel(88, 38, 'medium', 'ng', ['ne'], 4, 6, 20, 2), // Nigeria - Niger
  createLevel(89, 39, 'medium', 'am', ['co'], 4, 6, 20, 2), // Armenia - Kolombia
  createLevel(90, 40, 'medium', 'bg', ['ru'], 4, 6, 20, 2), // Bulgaria - Rusia
  createLevel(91, 41, 'medium', 'la', ['th'], 4, 6, 20, 2), // Laos - Thailand
  createLevel(92, 42, 'medium', 'mm', ['id'], 4, 6, 20, 2), // Myanmar - Indonesia
  createLevel(93, 43, 'medium', 'ye', ['eg'], 4, 6, 20, 2), // Yaman - Mesir
  createLevel(94, 44, 'medium', 'iq', ['sy'], 4, 6, 20, 2), // Irak - Suriah
  createLevel(95, 45, 'medium', 'kw', ['ae'], 4, 6, 20, 2), // Kuwait - UEA
  createLevel(96, 46, 'medium', 'om', ['ae'], 4, 6, 20, 2), // Oman - UEA
  createLevel(97, 47, 'medium', 've', ['ec'], 4, 6, 20, 2), // Venezuela - Ekuador
  createLevel(98, 48, 'medium', 'se', ['fi'], 4, 6, 20, 2), // Swedia - Finlandia
  createLevel(99, 49, 'medium', 'is', ['no'], 4, 6, 20, 2), // Islandia - Norwegia
  createLevel(100, 50, 'medium', 'li', ['ht'], 4, 6, 20, 2), // Liechtenstein - Haiti

  // --- HARD (50 LEVELS) ---
  createLevel(101, 1, 'hard', 'au', ['nz'], 5, 6, 10, 1), // Australia - Selandia Baru
  createLevel(102, 2, 'hard', 'jp', ['pw'], 5, 6, 10, 1), // Jepang - Palau
  createLevel(103, 3, 'hard', 'bd', ['jp'], 5, 6, 10, 1), // Bangladesh - Jepang
  createLevel(104, 4, 'hard', 'ht', ['li'], 5, 6, 10, 1), // Haiti - Liechtenstein
  createLevel(105, 5, 'hard', 've', ['co', 'ec'], 5, 6, 10, 1), // Venezuela - Kolombia - Ekuador
  createLevel(106, 6, 'hard', 'qa', ['bh'], 5, 6, 10, 1), // Qatar - Bahrain
  createLevel(107, 7, 'hard', 'td', ['ro'], 5, 6, 10, 1), // Chad - Rumania
  createLevel(108, 8, 'hard', 'mc', ['id'], 5, 6, 10, 1), // Monako - Indonesia
  createLevel(109, 9, 'hard', 'rs', ['ru'], 5, 6, 10, 1), // Serbia - Rusia
  createLevel(110, 10, 'hard', 'si', ['sk'], 5, 6, 10, 1), // Slovenia - Slovakia
  createLevel(111, 11, 'hard', 'hr', ['rs'], 5, 6, 10, 1), // Kroasia - Serbia
  createLevel(112, 12, 'hard', 'is', ['no'], 5, 6, 10, 1), // Islandia - Norwegia
  createLevel(113, 13, 'hard', 'fi', ['se'], 5, 6, 10, 1), // Finlandia - Swedia
  createLevel(114, 14, 'hard', 'bo', ['gh'], 5, 6, 10, 1), // Bolivia - Ghana
  createLevel(115, 15, 'hard', 'ml', ['gn'], 5, 6, 10, 1), // Mali - Guinea
  createLevel(116, 16, 'hard', 'ml', ['ci'], 5, 6, 10, 1), // Mali - Pantai Gading
  createLevel(117, 17, 'hard', 'sn', ['cm'], 5, 6, 10, 1), // Senegal - Kamerun
  createLevel(118, 18, 'hard', 'sd', ['jo'], 5, 6, 10, 1), // Sudan - Yordania
  createLevel(119, 19, 'hard', 'ps', ['jo'], 5, 6, 10, 1), // Palestina - Yordania
  createLevel(120, 20, 'hard', 'pk', ['sa'], 6, 6, 10, 1), // Pakistan - Arab Saudi
  createLevel(121, 21, 'hard', 'tn', ['tr'], 6, 6, 10, 1), // Tunisia - Turki
  createLevel(122, 22, 'hard', 'la', ['th'], 6, 6, 10, 1), // Laos - Thailand
  createLevel(123, 23, 'hard', 'mm', ['id'], 6, 6, 10, 1), // Myanmar - Indonesia
  createLevel(124, 24, 'hard', 'cu', ['pr'], 6, 6, 10, 1), // Kuba - Puerto Riko
  createLevel(125, 25, 'hard', 'cz', ['ph'], 6, 6, 10, 1), // Ceko - Filipina
  createLevel(126, 26, 'hard', 'at', ['lv'], 6, 6, 10, 1), // Austria - Latvia
  createLevel(127, 27, 'hard', 'pe', ['at'], 6, 6, 10, 1), // Peru - Austria
  createLevel(128, 28, 'hard', 'ng', ['ne'], 6, 6, 10, 1), // Nigeria - Niger
  createLevel(129, 29, 'hard', 'am', ['co'], 6, 6, 10, 1), // Armenia - Kolombia
  createLevel(130, 30, 'hard', 'bg', ['ru'], 6, 6, 10, 1), // Bulgaria - Rusia
  createLevel(131, 31, 'hard', 'eg', ['iq'], 6, 6, 10, 1), // Mesir - Irak
  createLevel(132, 32, 'hard', 'sy', ['ye'], 6, 6, 10, 1), // Suriah - Yaman
  createLevel(133, 33, 'hard', 'kw', ['ae'], 6, 6, 10, 1), // Kuwait - UEA
  createLevel(134, 34, 'hard', 'om', ['ae'], 6, 6, 10, 1), // Oman - UEA
  createLevel(135, 35, 'hard', 'ir', ['hu'], 6, 6, 10, 1), // Iran - Hungaria
  createLevel(136, 36, 'hard', 'np', ['bt'], 6, 6, 10, 1), // Nepal - Bhutan
  createLevel(137, 37, 'hard', 'ge', ['gb'], 6, 6, 10, 1), // Georgia - Inggris
  createLevel(138, 38, 'hard', 'gb', ['gb-sct'], 6, 6, 10, 1), // Inggris - Skotlandia
  createLevel(139, 39, 'hard', 'dm', ['th'], 6, 6, 10, 1), // Dominika - Thailand
  createLevel(140, 40, 'hard', 'hn', ['ni'], 8, 6, 10, 1), // Honduras - Nikaragua
  createLevel(141, 41, 'hard', 'gt', ['hn'], 8, 6, 10, 1), // Guatemala - Honduras
  createLevel(142, 42, 'hard', 'sl', ['ga'], 8, 6, 10, 1), // Sierra Leone - Gabon
  createLevel(143, 43, 'hard', 'kz', ['ua'], 8, 6, 10, 1), // Kazakhstan - Ukraina
  createLevel(144, 44, 'hard', 'pl', ['id', 'mc'], 8, 6, 10, 1), // Polandia - Indonesia - Monako
  createLevel(145, 45, 'hard', 'jp', ['bd', 'pw'], 8, 6, 10, 1), // Jepang - Bangladesh - Palau
  createLevel(146, 46, 'hard', 'au', ['nz', 'tv'], 8, 6, 10, 1), // Australia - Selandia Baru - Tuvalu
  createLevel(147, 47, 'hard', 'td', ['ro', 'md'], 8, 6, 10, 1), // Chad - Rumania - Moldova
  createLevel(148, 48, 'hard', 'ht', ['li', 'ad'], 8, 6, 10, 1), // Haiti - Liechtenstein - Andorra
  createLevel(149, 49, 'hard', 'qa', ['bh', 'ae'], 8, 6, 10, 1), // Qatar - Bahrain - UEA
  createLevel(150, 50, 'hard', 've', ['co', 'ec', 'bo'], 8, 6, 10, 1) // Venezuela - Kolombia - Ekuador - Bolivia
];
