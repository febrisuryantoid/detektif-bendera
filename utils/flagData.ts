
import { Language } from './i18n';

// Database of flag names (Indonesian)
export const FLAG_NAMES_ID: Record<string, string> = {
  // Asia
  id: "Indonesia", jp: "Jepang", kr: "Korea Selatan", cn: "Tiongkok", 
  in: "India", sa: "Arab Saudi", th: "Thailand", vn: "Vietnam", 
  my: "Malaysia", sg: "Singapura", ph: "Filipina", pk: "Pakistan",
  bd: "Bangladesh", ir: "Iran", iq: "Irak", af: "Afghanistan",
  kp: "Korea Utara", tw: "Taiwan", hk: "Hong Kong", mn: "Mongolia",
  la: "Laos", kh: "Kamboja", mm: "Myanmar", np: "Nepal",
  lk: "Sri Lanka", mv: "Maladewa", bt: "Bhutan", kz: "Kazakhstan",
  uz: "Uzbekistan", kg: "Kirgistan", tm: "Turkmenistan", tj: "Tajikistan",
  ge: "Georgia", am: "Armenia", az: "Azerbaijan", om: "Oman",
  qa: "Qatar", bh: "Bahrain", kw: "Kuwait", ae: "Uni Emirat Arab",
  ye: "Yaman", sy: "Suriah", jo: "Yordania", lb: "Lebanon",
  il: "Israel", ps: "Palestina",
  
  // Europe
  gb: "Inggris Raya", "gb-sct": "Skotlandia", fr: "Prancis", de: "Jerman", it: "Italia",
  es: "Spanyol", pt: "Portugal", nl: "Belanda", be: "Belgia",
  ch: "Swiss", at: "Austria", se: "Swedia", no: "Norwegia",
  dk: "Denmark", fi: "Finlandia", is: "Islandia", ie: "Irlandia",
  pl: "Polandia", cz: "Ceko", hu: "Hungaria", gr: "Yunani",
  ru: "Rusia", ua: "Ukraina", tr: "Turki", hr: "Kroasia",
  rs: "Serbia", ro: "Rumania", bg: "Bulgaria", sk: "Slovakia",
  si: "Slovenia", ee: "Estonia", lv: "Latvia", lt: "Lithuania",
  by: "Belarus", md: "Moldova", al: "Albania", ba: "Bosnia & Herz.",
  mk: "Makedonia Utara", me: "Montenegro", cy: "Siprus", mt: "Malta",
  mc: "Monako", lu: "Luksemburg", li: "Liechtenstein", sm: "San Marino",
  va: "Vatikan", ad: "Andorra",

  // Americas
  us: "Amerika Serikat", ca: "Kanada", mx: "Meksiko", br: "Brasil",
  ar: "Argentina", co: "Kolombia", pe: "Peru", cl: "Chili",
  ve: "Venezuela", ec: "Ekuador", bo: "Bolivia", py: "Paraguay",
  uy: "Uruguay", gy: "Guyana", sr: "Suriname", pa: "Panama",
  cr: "Kosta Rika", ni: "Nikaragua", hn: "Honduras", sv: "El Salvador",
  gt: "Guatemala", bz: "Belize", cu: "Kuba", jm: "Jamaika",
  ht: "Haiti", do: "Rep. Dominika", bs: "Bahama", bb: "Barbados",
  tt: "Trinidad & Tobago", pr: "Puerto Riko", dm: "Dominika",

  // Africa
  eg: "Mesir", za: "Afrika Selatan", ng: "Nigeria", ke: "Kenya",
  gh: "Ghana", ma: "Maroko", dz: "Aljazair", tn: "Tunisia",
  et: "Ethiopia", sd: "Sudan", tz: "Tanzania", ug: "Uganda",
  sn: "Senegal", ci: "Pantai Gading", cm: "Kamerun", zw: "Zimbabwe",
  mg: "Madagaskar", ao: "Angola", mz: "Mozambik", zm: "Zambia",
  bw: "Botswana", na: "Namibia", so: "Somalia", lr: "Liberia",
  sl: "Sierra Leone", gn: "Guinea", ml: "Mali", bf: "Burkina Faso",
  ne: "Niger", td: "Chad", ly: "Libya", rw: "Rwanda", ga: "Gabon",

  // Oceania
  au: "Australia", nz: "Selandia Baru", pg: "Papua Nugini", fj: "Fiji",
  sb: "Kep. Solomon", vu: "Vanuatu", ws: "Samoa", to: "Tonga",
  ki: "Kiribati", tv: "Tuvalu", nr: "Nauru", pw: "Palau",
  fm: "Mikronesia", mh: "Kep. Marshall"
};

// Database of flag names (English)
export const FLAG_NAMES_EN: Record<string, string> = {
  // Asia
  id: "Indonesia", jp: "Japan", kr: "South Korea", cn: "China", 
  in: "India", sa: "Saudi Arabia", th: "Thailand", vn: "Vietnam", 
  my: "Malaysia", sg: "Singapore", ph: "Philippines", pk: "Pakistan",
  bd: "Bangladesh", ir: "Iran", iq: "Iraq", af: "Afghanistan",
  kp: "North Korea", tw: "Taiwan", hk: "Hong Kong", mn: "Mongolia",
  la: "Laos", kh: "Cambodia", mm: "Myanmar", np: "Nepal",
  lk: "Sri Lanka", mv: "Maldives", bt: "Bhutan", kz: "Kazakhstan",
  uz: "Uzbekistan", kg: "Kyrgyzstan", tm: "Turkmenistan", tj: "Tajikistan",
  ge: "Georgia", am: "Armenia", az: "Azerbaijan", om: "Oman",
  qa: "Qatar", bh: "Bahrain", kw: "Kuwait", ae: "UAE",
  ye: "Yemen", sy: "Syria", jo: "Jordan", lb: "Lebanon",
  il: "Israel", ps: "Palestine",
  
  // Europe
  gb: "United Kingdom", "gb-sct": "Scotland", fr: "France", de: "Germany", it: "Italy",
  es: "Spain", pt: "Portugal", nl: "Netherlands", be: "Belgium",
  ch: "Switzerland", at: "Austria", se: "Sweden", no: "Norway",
  dk: "Denmark", fi: "Finland", is: "Iceland", ie: "Ireland",
  pl: "Poland", cz: "Czechia", hu: "Hungary", gr: "Greece",
  ru: "Russia", ua: "Ukraine", tr: "Turkey", hr: "Croatia",
  rs: "Serbia", ro: "Romania", bg: "Bulgaria", sk: "Slovakia",
  si: "Slovenia", ee: "Estonia", lv: "Latvia", lt: "Lithuania",
  by: "Belarus", md: "Moldova", al: "Albania", ba: "Bosnia & Herz.",
  mk: "North Macedonia", me: "Montenegro", cy: "Cyprus", mt: "Malta",
  mc: "Monaco", lu: "Luxembourg", li: "Liechtenstein", sm: "San Marino",
  va: "Vatican City", ad: "Andorra",

  // Americas
  us: "United States", ca: "Canada", mx: "Mexico", br: "Brazil",
  ar: "Argentina", co: "Colombia", pe: "Peru", cl: "Chile",
  ve: "Venezuela", ec: "Ecuador", bo: "Bolivia", py: "Paraguay",
  uy: "Uruguay", gy: "Guyana", sr: "Suriname", pa: "Panama",
  cr: "Costa Rica", ni: "Nicaragua", hn: "Honduras", sv: "El Salvador",
  gt: "Guatemala", bz: "Belize", cu: "Cuba", jm: "Jamaica",
  ht: "Haiti", do: "Dominican Rep.", bs: "Bahamas", bb: "Barbados",
  tt: "Trinidad & Tobago", pr: "Puerto Rico", dm: "Dominica",

  // Africa
  eg: "Egypt", za: "South Africa", ng: "Nigeria", ke: "Kenya",
  gh: "Ghana", ma: "Morocco", dz: "Algeria", tn: "Tunisia",
  et: "Ethiopia", sd: "Sudan", tz: "Tanzania", ug: "Uganda",
  sn: "Senegal", ci: "Ivory Coast", cm: "Cameroon", zw: "Zimbabwe",
  mg: "Madagascar", ao: "Angola", mz: "Mozambique", zm: "Zambia",
  bw: "Botswana", na: "Namibia", so: "Somalia", lr: "Liberia",
  sl: "Sierra Leone", gn: "Guinea", ml: "Mali", bf: "Burkina Faso",
  ne: "Niger", td: "Chad", ly: "Libya", rw: "Rwanda", ga: "Gabon",

  // Oceania
  au: "Australia", nz: "New Zealand", pg: "Papua New Guinea", fj: "Fiji",
  sb: "Solomon Islands", vu: "Vanuatu", ws: "Samoa", to: "Tonga",
  ki: "Kiribati", tv: "Tuvalu", nr: "Nauru", pw: "Palau",
  fm: "Micronesia", mh: "Marshall Islands"
};

export const CONFUSION_GROUPS = [
  ['id', 'mc', 'pl', 'sg', 'at', 'pe', 'gl', 'tn', 'bh', 'qa'], 
  ['nl', 'lu', 'fr', 'ru', 'py', 'hr', 'th', 'cr'],
  ['ro', 'td', 'ad', 'md', 'be', 'co', 'ec', 've'], 
  ['it', 'ie', 'ci', 'in', 'mx', 'hu', 'bg', 'kw', 'ae'], 
  ['au', 'nz', 'gb', 'ky', 'vg', 'ms', 'sh', 'fj', 'tv'], 
  ['cz', 'ph', 'cu', 'pr', 'dj', 'bs'], 
  ['no', 'is', 'dk', 'se', 'fi'], 
  ['tr', 'tn', 'pk', 'dz', 'my', 'mv', 'mr'], 
  ['cn', 'vn', 'ma', 'kg'], 
  ['ar', 'uy', 'ni', 'sv', 'hn', 'gt', 'il'], 
  ['jp', 'bd', 'pw', 'la', 'kr'],
  ['us', 'my', 'lr', 'pr', 'cu', 'cl']
];

export const FLAG_NAMES = FLAG_NAMES_ID;

export const getFlagName = (code: string, lang: Language = 'id') => {
  const dictionary = lang === 'en' ? FLAG_NAMES_EN : FLAG_NAMES_ID;
  return dictionary[code] || FLAG_NAMES_ID[code] || code.toUpperCase();
};

export const getRandomFlagsFromGroup = (target: string, count: number): string[] => {
  let group = CONFUSION_GROUPS.find(g => g.includes(target));
  if (!group) group = Object.keys(FLAG_NAMES_ID);
  let candidates = group.filter(f => f !== target);
  candidates = candidates.sort(() => 0.5 - Math.random());
  const selectedDistractors: string[] = [];
  for (let i = 0; i < count; i++) {
    const flag = candidates[i % candidates.length];
    selectedDistractors.push(flag);
  }
  return selectedDistractors.sort(() => 0.5 - Math.random());
};
