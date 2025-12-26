
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface Translation {
  mainMenu: {
    title: string;
    subtitle: string;
    tagline: string;
    // Difference Mode Descriptions
    btnEasy: string;
    subEasy: string;
    btnMedium: string;
    subMedium: string;
    btnHard: string;
    subHard: string;
    // Quiz Mode Descriptions (NEW)
    subEasyQuiz: string;
    subMediumQuiz: string;
    subHardQuiz: string;
    
    btnLeaderboard: string;
    btnInstall: string;
    modeDiff: string;
    modeQuiz: string;
    footer: string;
  };
  game: {
    level: string;
    mission: string;
    find: string;
    hint: string;
    time: string;
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
  };
  nameModal: {
    title: string;
    desc: string;
    placeholder: string;
    error: string;
    btnStart: string;
  };
  about: {
    title: string;
    dev: string;
    assets: string;
    icons: string;
    flags: string;
    audio: string;
    fonts: string;
    footer: string;
    btnClose: string;
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
      
      btnEasy: "Mudah",
      subEasy: "Santai & Gampang", // Diff
      
      btnMedium: "Sedang",
      subMedium: "Tantangan Seru", // Diff
      
      btnHard: "Sulit",
      subHard: "Ahli Detektif!", // Diff

      // Quiz Mode Descriptions
      subEasyQuiz: "Negara Populer",
      subMediumQuiz: "Bendera Mirip",
      subHardQuiz: "Ahli Geografi!",

      btnLeaderboard: "Papan Peringkat",
      btnInstall: "Install App",
      modeDiff: "Cari Beda",
      modeQuiz: "Tebak Nama",
      footer: "© 2025 Detektif Bendera"
    },
    game: {
      level: "Level",
      mission: "Misi Pencarian",
      find: "Temukan",
      hint: "Bantuan",
      time: "DETIK",
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
      loseMsg: "Waktu habis atau salah tebak.",
      totalScore: "Total Skor",
      btnNext: "Level Berikutnya",
      btnChampion: "KAMU JUARA DUNIA! 🏆",
      btnReplay: "Main Dari Awal",
      btnHome: "Kembali ke Menu",
      btnRetry: "Coba Lagi"
    },
    levelSelect: {
      title: "Level"
    },
    leaderboard: {
      title: "Peringkat Dunia",
      emptyTitle: "Belum ada juara.",
      emptyDesc: "Jadilah yang pertama!",
      loading: "Sedang memuat skor...",
      modeDiff: "Cari Beda",
      modeQuiz: "Tebak Nama",
      diffEasy: "Mudah",
      diffMedium: "Sedang",
      diffHard: "Sulit"
    },
    nameModal: {
      title: "Siapa Namamu?",
      desc: "Isi nama untuk papan peringkat ya!",
      placeholder: "Ketik namamu...",
      error: "Nama tidak boleh kosong!",
      btnStart: "Mulai Main"
    },
    about: {
      title: "Tentang Game",
      dev: "Pengembang",
      assets: "Kredit & Aset",
      icons: "Ikon & UI",
      flags: "Gambar Bendera",
      audio: "Audio & SFX",
      fonts: "Font",
      footer: "Dibuat dengan ❤️ untuk Anak Indonesia",
      btnClose: "Tutup"
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
      
      btnEasy: "Easy",
      subEasy: "Relaxed & Simple", // Diff
      
      btnMedium: "Medium",
      subMedium: "Exciting Challenge", // Diff
      
      btnHard: "Hard",
      subHard: "Detective Expert!", // Diff

      // Quiz Mode Descriptions
      subEasyQuiz: "Popular Countries",
      subMediumQuiz: "Tricky Flags",
      subHardQuiz: "Geography Expert!",

      btnLeaderboard: "Leaderboard",
      btnInstall: "Install App",
      modeDiff: "Find Diff",
      modeQuiz: "Name Quiz",
      footer: "© 2025 Flag Detective"
    },
    game: {
      level: "Level",
      mission: "Search Mission",
      find: "Find",
      hint: "Hint",
      time: "SECONDS",
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
      loseMsg: "Time up or wrong guess.",
      totalScore: "Total Score",
      btnNext: "Next Level",
      btnChampion: "WORLD CHAMPION! 🏆",
      btnReplay: "Play Again",
      btnHome: "Back to Menu",
      btnRetry: "Try Again"
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
      diffHard: "Hard"
    },
    nameModal: {
      title: "What's Your Name?",
      desc: "Enter your name for the leaderboard!",
      placeholder: "Type your name...",
      error: "Name cannot be empty!",
      btnStart: "Start Game"
    },
    about: {
      title: "About Game",
      dev: "Developer",
      assets: "Credits & Assets",
      icons: "Icons & UI",
      flags: "Flag Images",
      audio: "Audio & SFX",
      fonts: "Fonts",
      footer: "Made with ❤️ for Kids Worldwide",
      btnClose: "Close"
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
