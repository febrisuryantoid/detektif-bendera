
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface Translation {
  mainMenu: {
    title: string;
    subtitle: string;
    tagline: string;
    mainTitle1: string;
    mainTitle2: string;
    btnEasy: string;
    subEasy: string;
    btnMedium: string;
    subMedium: string;
    btnHard: string;
    subHard: string;
    subEasyQuiz: string;
    subMediumQuiz: string;
    subHardQuiz: string;
    btnLeaderboard: string;
    btnInstall: string;
    modeDiff: string;
    modeQuiz: string;
    footer: string;
  };
  settings: {
    title: string;
    music: string;
    sfx: string;
    track: string;
    trackFun: string;
    trackAdv: string;
    trackChill: string;
    btnClose: string;
  };
  game: {
    level: string;
    lvl: string;
    mission: string;
    find: string;
    hint: string;
    time: string;
    timeSuffix: string;
    gameOver: string;
    gameOverDesc: string;
  };
  quiz: {
    question: string;
    guess: string;
    errorImg: string;
  };
  result: {
    winTitle: string;
    winMsg: string;
    loseTitle: string;
    loseMsg: string;
    totalScore: string;
    btnNext: string;
    btnChampion: string;
    btnReplay: string;
    btnHome: string;
    btnRetry: string;
    btnShare: string;
    linkCopied: string;
    shareMsgScore: string;
  };
  levelSelect: {
    title: string;
  };
  leaderboard: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    loading: string;
    modeDiff: string;
    modeQuiz: string;
    diffEasy: string;
    diffMedium: string;
    diffHard: string;
    shareRankMsg: string;
    btnShare: string;
  };
  nameModal: {
    title: string;
    desc: string;
    placeholder: string;
    error: string;
    btnStart: string;
    welcomeBack: string;
    nameAvailable: string;
    btnContinue: string;
  };
  about: {
    title: string;
    dev: string;
    job: string;
    assets: string;
    icons: string;
    flags: string;
    audio: string;
    fonts: string;
    footer: string;
    btnClose: string;
    version: string;
    btnChangelog: string;
    btnWebsite: string;
  };
  changelog: {
    title: string;
    latest: string;
    btnClose: string;
    v1_5: string;
    v1_4: string;
    v1_3: string;
    v1_2: string;
    v1_1: string;
    v1_0: string;
  };
  installWizard: {
    welcome: string;
    introDesc: string;
    introHighlight: string;
    btnSetup: string;
    permTitle: string;
    permDesc: string;
    permStorage: string;
    permStorageDesc: string;
    permNotify: string;
    permNotifyDesc: string;
    btnGrant: string;
    downloadTitle: string;
    downloadDesc: string;
    complete: string;
  };
}

const translations: Record<Language, Translation> = {
  id: {
    mainMenu: {
      title: "DETEKTIF",
      subtitle: "BENDERA",
      tagline: "Belajar Mengenal Negara dengan Cara Seru",
      mainTitle1: "DETEKTIF",
      mainTitle2: "BENDERA",
      btnEasy: "Mudah",
      subEasy: "Santai & Gampang",
      btnMedium: "Sedang",
      subMedium: "Tantangan Seru",
      btnHard: "Sulit",
      subHard: "Ahli Detektif!",
      subEasyQuiz: "Negara Populer",
      subMediumQuiz: "Bendera Mirip",
      subHardQuiz: "Ahli Geografi!",
      btnLeaderboard: "Papan Peringkat",
      btnInstall: "Install App",
      modeDiff: "Cari Perbedaan",
      modeQuiz: "Tebak Nama",
      footer: "© 2025 Detektif Bendera"
    },
    settings: {
      title: "PENGATURAN",
      music: "Musik Latar",
      sfx: "Efek Suara",
      track: "Pilihan Musik",
      trackFun: "Ceria",
      trackAdv: "Petualangan",
      trackChill: "Santai",
      btnClose: "Simpan & Tutup"
    },
    game: {
      level: "Level",
      lvl: "LVL",
      mission: "Misi Pencarian",
      find: "Temukan",
      hint: "Bantuan",
      time: "DETIK",
      timeSuffix: "s",
      gameOver: "Waktu Habis!",
      gameOverDesc: "Kamu kehabisan waktu."
    },
    quiz: {
      question: "Soal",
      guess: "Tebak Aku!",
      errorImg: "Gambar Error"
    },
    result: {
      winTitle: "HORE BERHASIL!",
      winMsg: "Kamu hebat sekali!",
      loseTitle: "YAH, GAGAL!",
      loseMsg: "Jangan menyerah, coba lagi ya!",
      totalScore: "Total Skor",
      btnNext: "Level Berikutnya",
      btnChampion: "KAMU JUARA DUNIA! 🏆",
      btnReplay: "Main Dari Awal",
      btnHome: "Kembali ke Menu",
      btnRetry: "Coba Lagi",
      btnShare: "Bagikan",
      linkCopied: "Tautan disalin!",
      shareMsgScore: "Saya mendapatkan Skor {score} di game Detektif Bendera mode {mode} {diff}. Ayo kejar saya!"
    },
    levelSelect: {
      title: "Level"
    },
    leaderboard: {
      title: "Peringkat Dunia",
      emptyTitle: "Belum ada juara.",
      emptyDesc: "Jadilah yang pertama!",
      loading: "Sedang memuat skor...",
      modeDiff: "Cari Perbedaan",
      modeQuiz: "Tebak Nama",
      diffEasy: "Mudah",
      diffMedium: "Sedang",
      diffHard: "Sulit",
      btnShare: "Bagikan Posisi",
      shareRankMsg: "Saya telah berada di Posisi {rank} dalam permainan Detektif Bendera pada mode {mode} {diff}, ayo kejar posisi saya sekarang!"
    },
    nameModal: {
      title: "Siapa Namamu?",
      desc: "Isi nama untuk papan peringkat ya!",
      placeholder: "Ketik namamu...",
      error: "Nama tidak boleh kosong!",
      btnStart: "Mulai Main",
      welcomeBack: "Selamat datang kembali!",
      nameAvailable: "Nama tersedia",
      btnContinue: "Lanjut Main"
    },
    about: {
      title: "Tentang Game",
      dev: "Pengembang",
      job: "Web Design & Develop Profesional",
      assets: "Sumber Aset",
      icons: "Ikon & UI",
      flags: "Gambar Bendera",
      audio: "Audio & SFX",
      fonts: "Font",
      footer: "Game Edukasi Gratis",
      btnClose: "Tutup",
      version: "Versi",
      btnChangelog: "Lihat Changelog",
      btnWebsite: "Kunjungi Website"
    },
    changelog: {
      title: "Riwayat Update",
      latest: "Terbaru",
      btnClose: "Kembali",
      v1_5: "Fitur Auto Update, Menu Changelog, Perbaikan Bug Duplikat Nama",
      v1_4: "Fitur Share Ranking, Pengaturan Suara (BGM/SFX), Suara Menang/Kalah Baru",
      v1_3: "Sistem Papan Peringkat Global Realtime & Input Nama",
      v1_2: "Install Wizard PWA & Optimasi Mode Offline",
      v1_1: "Penambahan Mode Kuis & Total 150 Level",
      v1_0: "Rilis Perdana (Mode Cari Perbedaan)"
    },
    installWizard: {
      welcome: "SELAMAT DATANG!",
      introDesc: "Ayo siapkan game untuk pengalaman terbaik. Kami akan mengunduh data agar kamu bisa main",
      introHighlight: "100% Offline",
      btnSetup: "MULAI PENYIAPAN",
      permTitle: "IZIN AKSES",
      permDesc: "Izinkan penyimpanan untuk data game offline dan notifikasi untuk info rekor dunia.",
      permStorage: "Penyimpanan Offline",
      permStorageDesc: "Wajib untuk main tanpa internet.",
      permNotify: "Info Rekor Dunia",
      permNotifyDesc: "Dapat kabar jika ranking #1 pecah.",
      btnGrant: "IZINKAN & LANJUT",
      downloadTitle: "MENGUNDUH...",
      downloadDesc: "Menyiapkan aset offline. Mohon tunggu...",
      complete: "Selesai"
    }
  },
  en: {
    mainMenu: {
      title: "DETECTIVE",
      subtitle: "FLAGS",
      tagline: "Learn Countries in a Fun Way",
      mainTitle1: "DETECTIVE",
      mainTitle2: "FLAGS",
      btnEasy: "Easy",
      subEasy: "Relaxed & Simple",
      btnMedium: "Medium",
      subMedium: "Exciting Challenge",
      btnHard: "Hard",
      subHard: "Detective Expert!",
      subEasyQuiz: "Popular Countries",
      subMediumQuiz: "Tricky Flags",
      subHardQuiz: "Geography Expert!",
      btnLeaderboard: "Leaderboard",
      btnInstall: "Install App",
      modeDiff: "Find Diff",
      modeQuiz: "Name Quiz",
      footer: "© 2025 Flag Detective"
    },
    settings: {
      title: "SETTINGS",
      music: "Background Music",
      sfx: "Sound Effects",
      track: "Music Track",
      trackFun: "Fun",
      trackAdv: "Adventure",
      trackChill: "Chill",
      btnClose: "Save & Close"
    },
    game: {
      level: "Level",
      lvl: "LVL",
      mission: "Search Mission",
      find: "Find",
      hint: "Hint",
      time: "SECONDS",
      timeSuffix: "s",
      gameOver: "Time's Up!",
      gameOverDesc: "You ran out of time."
    },
    quiz: {
      question: "Question",
      guess: "Guess Me!",
      errorImg: "Image Error"
    },
    result: {
      winTitle: "YOU DID IT!",
      winMsg: "You are amazing!",
      loseTitle: "OH NO!",
      loseMsg: "Don't give up, try again!",
      totalScore: "Total Score",
      btnNext: "Next Level",
      btnChampion: "WORLD CHAMPION! 🏆",
      btnReplay: "Play Again",
      btnHome: "Back to Menu",
      btnRetry: "Try Again",
      btnShare: "Share",
      linkCopied: "Link copied!",
      shareMsgScore: "I scored {score} in Flag Detective game mode {mode} {diff}. Catch me if you can!"
    },
    levelSelect: {
      title: "Levels"
    },
    leaderboard: {
      title: "World Ranking",
      emptyTitle: "No champions yet.",
      emptyDesc: "Be the first one!",
      loading: "Loading scores...",
      modeDiff: "Find Diff",
      modeQuiz: "Name Quiz",
      diffEasy: "Easy",
      diffMedium: "Medium",
      diffHard: "Hard",
      btnShare: "Share Rank",
      shareRankMsg: "I reached Rank {rank} in Flag Detective game mode {mode} {diff}, catch my position now!"
    },
    nameModal: {
      title: "What's Your Name?",
      desc: "Enter your name for the leaderboard!",
      placeholder: "Type your name...",
      error: "Name cannot be empty!",
      btnStart: "Start Game",
      welcomeBack: "Welcome back!",
      nameAvailable: "Name available",
      btnContinue: "Continue"
    },
    about: {
      title: "About Game",
      dev: "Developer",
      job: "Professional Web Design & Develop",
      assets: "Credits & Assets",
      icons: "Icons & UI",
      flags: "Flag Images",
      audio: "Audio & SFX",
      fonts: "Fonts",
      footer: "Free Educational Game",
      btnClose: "Close",
      version: "Version",
      btnChangelog: "View Changelog",
      btnWebsite: "Visit Website"
    },
    changelog: {
      title: "Update History",
      latest: "Latest",
      btnClose: "Back",
      v1_5: "Auto Update Feature, Changelog Menu, Name Duplicate Fix",
      v1_4: "Share Ranking Feature, Sound Settings (BGM/SFX), New Win/Lose Sounds",
      v1_3: "Realtime Global Leaderboard & Name Input System",
      v1_2: "PWA Install Wizard & Offline Optimization",
      v1_1: "Added Quiz Mode & Total 150 Levels",
      v1_0: "Initial Release (Find Difference Mode)"
    },
    installWizard: {
      welcome: "WELCOME!",
      introDesc: "Let's set up the game for the best experience. We will download data so you can play",
      introHighlight: "100% Offline",
      btnSetup: "START SETUP",
      permTitle: "PERMISSIONS",
      permDesc: "Please allow storage to save game data locally and notifications for world record updates.",
      permStorage: "Offline Storage",
      permStorageDesc: "Required for offline play.",
      permNotify: "Record Alerts",
      permNotifyDesc: "Notify when #1 is beaten.",
      btnGrant: "GRANT & CONTINUE",
      downloadTitle: "DOWNLOADING...",
      downloadDesc: "Preparing offline assets. Please wait...",
      complete: "Complete"
    }
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('id');

  useEffect(() => {
    // 1. Cek LocalStorage
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
      setLangState(savedLang);
    } else {
      // 2. Auto-detect browser
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('id')) {
        setLangState('id');
      } else {
        setLangState('en');
      }
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('app_lang', l);
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { lang, setLang, t: translations[lang] } },
    children
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
