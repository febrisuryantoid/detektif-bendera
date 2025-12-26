
// Database of flag names
export const FLAG_NAMES: Record<string, string> = {
  // Asia
  id: "Indonesia", jp: "Jepang", kr: "Korea Selatan", cn: "Tiongkok", 
  in: "India", sa: "Arab Saudi", th: "Thailand", vn: "Vietnam", 
  my: "Malaysia", sg: "Singapura", ph: "Filipina", pk: "Pakistan",
  bd: "Bangladesh", ir: "Iran", iq: "Irak", af: "Afghanistan",
  kp: "Korea Utara", tw: "Taiwan", hk: "Hong Kong", mn: "Mongolia",
  la: "Laos", kh: "Kamboja", mm: "Myanmar", np: "Nepal",
  lk: "Sri Lanka", mv: "Maladewa", bt: "Bhutan", kz: "Kazakhstan",
  uz: "Uzbekistan", kg: "Kirgistan", tm: "Turkmenistan", tj: "Tajikistan",
  
  // Europe
  gb: "Inggris Raya", fr: "Prancis", de: "Jerman", it: "Italia",
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
  tt: "Trinidad & Tobago", pr: "Puerto Riko",

  // Africa
  eg: "Mesir", za: "Afrika Selatan", ng: "Nigeria", ke: "Kenya",
  gh: "Ghana", ma: "Maroko", dz: "Aljazair", tn: "Tunisia",
  et: "Ethiopia", sd: "Sudan", tz: "Tanzania", ug: "Uganda",
  sn: "Senegal", ci: "Pantai Gading", cm: "Kamerun", zw: "Zimbabwe",
  mg: "Madagaskar", ao: "Angola", mz: "Mozambik", zm: "Zambia",
  bw: "Botswana", na: "Namibia", so: "Somalia", lr: "Liberia",
  sl: "Sierra Leone", gn: "Guinea", ml: "Mali", bf: "Burkina Faso",
  ne: "Niger", td: "Chad", ly: "Libya", rw: "Rwanda",

  // Oceania
  au: "Australia", nz: "Selandia Baru", pg: "Papua Nugini", fj: "Fiji",
  sb: "Kep. Solomon", vu: "Vanuatu", ws: "Samoa", to: "Tonga",
  ki: "Kiribati", tv: "Tuvalu", nr: "Nauru", pw: "Palau",
  fm: "Mikronesia", mh: "Kep. Marshall"
};

// Groups of flags that look VERY similar to challenge the brain
// Urutan prioritas: Paling mirip ditaruh di awal array
export const CONFUSION_GROUPS = [
  // 1. Merah Putih (Sangat Mirip)
  ['id', 'mc', 'pl', 'sg', 'at', 'pe', 'gl', 'tn', 'bh', 'qa'], 
  // 2. Garis Horizontal Merah/Putih/Biru
  ['nl', 'lu', 'fr', 'ru', 'py', 'hr', 'th', 'cr'],
  // 3. Vertikal Biru/Kuning/Merah (Sangat Mirip)
  ['ro', 'td', 'ad', 'md', 'be', 'co', 'ec', 've'], 
  // 4. Hijau/Putih/Merah/Oranye
  ['it', 'ie', 'ci', 'in', 'mx', 'hu', 'bg', 'kw', 'ae'], 
  // 5. Union Jacks (Sangat Mirip - Biru Tua ada bendera inggris kecil)
  ['au', 'nz', 'gb', 'ky', 'vg', 'ms', 'sh', 'fj', 'tv'], 
  // 6. Segitiga di samping (Sangat Mirip)
  ['cz', 'ph', 'cu', 'pr', 'dj', 'bs'], 
  // 7. Salib Nordic
  ['no', 'is', 'dk', 'se', 'fi'], 
  // 8. Bulan Sabit & Bintang
  ['tr', 'tn', 'pk', 'dz', 'my', 'mv', 'mr'], 
  // 9. Bintang Kuning di latar Merah
  ['cn', 'vn', 'ma', 'kg'], 
  // 10. Garis Biru Putih (Amerika Tengah)
  ['ar', 'uy', 'ni', 'sv', 'hn', 'gt', 'il'], 
  // 11. Lingkaran di tengah
  ['jp', 'bd', 'pw', 'la', 'kr'],
  // 12. Garis-garis Mirip USA
  ['us', 'my', 'lr', 'pr', 'cu', 'cl']
];

export const getFlagName = (code: string) => FLAG_NAMES[code] || code.toUpperCase();

export const getRandomFlagsFromGroup = (target: string, count: number): string[] => {
  let group = CONFUSION_GROUPS.find(g => g.includes(target));
  if (!group) group = Object.keys(FLAG_NAMES);
  let candidates = group.filter(f => f !== target);
  candidates = candidates.sort(() => 0.5 - Math.random());
  const selectedDistractors: string[] = [];
  for (let i = 0; i < count; i++) {
    const flag = candidates[i % candidates.length];
    selectedDistractors.push(flag);
  }
  return selectedDistractors.sort(() => 0.5 - Math.random());
};
