
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultModal } from './components/ResultModal';
import { LevelSelectDifference } from './components/LevelSelectDifference';
import { LevelSelectQuiz } from './components/LevelSelectQuiz';
import { Leaderboard } from './components/Leaderboard';
import { NameInputModal } from './components/NameInputModal';
import { InstallWizard } from './components/InstallWizard';
import { GameNotificationContainer } from './components/GameNotification.tsx';
import { NotificationProvider, useNotification } from './utils/NotificationContext.tsx';
import { LEVELS } from './data/levels';
import { QUIZ_LEVELS } from './data/quizLevels';
import { Difficulty, GameMode } from '../types';
import { startMusic, stopMusic } from './utils/sound';
import { LanguageProvider, useLanguage } from './utils/i18n';
import { subscribeToGlobalRecords, fetchCurrentTopScore } from './utils/supabase';

type ScreenState = 'MENU' | 'LEVEL_SELECT' | 'GAME' | 'RESULT' | 'LEADERBOARD';

function AppContent() {
  const { lang } = useLanguage();
  const { showNotification } = useNotification();
  
  // App Setup State
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (!isStandalone) {
      return true;
    }
    return localStorage.getItem('db_setup_complete') === 'true';
  });

  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [selectedMode, setSelectedMode] = useState<GameMode>('difference');
  
  // Player Name State
  const [playerName, setPlayerName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingStart, setPendingStart] = useState<{diff: Difficulty, mode: GameMode} | null>(null);

  // Game State
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [cumulativeScore, setCumulativeScore] = useState(0); 
  const [isLevelPassed, setIsLevelPassed] = useState(false);

  // --- INDEPENDENT UNLOCK STATES ---
  const [unlockedDiff, setUnlockedDiff] = useState({
    easy: 1,
    medium: 1,
    hard: 1
  });

  const [unlockedQuiz, setUnlockedQuiz] = useState({
    easy: 1,
    medium: 1,
    hard: 1
  });

  // Load Unlocked Levels from LocalStorage on mount
  useEffect(() => {
    try {
      const savedDiff = localStorage.getItem('unlocked_diff');
      if (savedDiff) setUnlockedDiff(JSON.parse(savedDiff));

      const savedQuiz = localStorage.getItem('unlocked_quiz');
      if (savedQuiz) setUnlockedQuiz(JSON.parse(savedQuiz));
    } catch (e) {
      console.error("Failed to load progress", e);
    }
  }, []);

  // Save Progress helpers
  const updateDiffProgress = (diff: Difficulty, level: number) => {
    const newState = { ...unlockedDiff, [diff]: level };
    setUnlockedDiff(newState);
    localStorage.setItem('unlocked_diff', JSON.stringify(newState));
  };

  const updateQuizProgress = (diff: Difficulty, level: number) => {
    const newState = { ...unlockedQuiz, [diff]: level };
    setUnlockedQuiz(newState);
    localStorage.setItem('unlocked_quiz', JSON.stringify(newState));
  };

  // Global High Score Tracking for Notifications
  const globalTopScoreRef = useRef(0);

  useEffect(() => {
    fetchCurrentTopScore().then(score => {
      globalTopScoreRef.current = score;
      const unsubscribe = subscribeToGlobalRecords(score, (name, newScore, mode) => {
        if (newScore > globalTopScoreRef.current) {
          globalTopScoreRef.current = newScore;
          const title = lang === 'id' ? "Rekor Baru!" : "New Record!";
          const msg = lang === 'id' 
            ? `${name} mencetak skor ${newScore}!`
            : `${name} just scored ${newScore}!`;
          showNotification(title, msg, 'record');
        }
      });
      return () => unsubscribe();
    });
  }, [lang, showNotification]);

  // SEO Update Effect
  useEffect(() => {
    if (lang === 'id') {
      document.title = "Detektif Bendera - Game Edukasi Anak";
    } else {
      document.title = "Detective Flags - Educational Kids Game";
    }
  }, [lang]);

  // Determine Active Levels based on Mode and Difficulty
  const activeLevels = useMemo(() => {
    if (selectedMode === 'difference') {
      return LEVELS.filter(l => l.difficulty === selectedDifficulty);
    } else {
      return QUIZ_LEVELS[selectedDifficulty];
    }
  }, [selectedDifficulty, selectedMode]);

  const currentLevel = activeLevels[currentLevelIndex];

  // Manage Background Music
  useEffect(() => {
    if (screen === 'GAME' || screen === 'RESULT') {
      startMusic(selectedDifficulty);
    } else {
      stopMusic();
    }
  }, [screen, selectedDifficulty]);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
  };

  const handleStartFlow = (diff: Difficulty, mode: GameMode) => {
    setPendingStart({ diff, mode });
    if (!playerName) {
        setShowNameModal(true);
    } else {
        // Direct start if name exists
        setSelectedDifficulty(diff);
        setSelectedMode(mode);
        setScreen('LEVEL_SELECT');
        setPendingStart(null);
        setCumulativeScore(0);
    }
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNameModal(false);
    
    if (pendingStart) {
      setSelectedDifficulty(pendingStart.diff);
      setSelectedMode(pendingStart.mode);
      setScreen('LEVEL_SELECT');
      setPendingStart(null);
      setCumulativeScore(0);
    }
  };

  const handleSelectLevel = (index: number) => {
    setCurrentLevelIndex(index);
    setCumulativeScore(0); 
    setScreen('GAME');
  };

  const handleLevelComplete = (levelScore: number, passed: boolean) => {
    setIsLevelPassed(passed);
    
    if (passed) {
      setCumulativeScore(prev => prev + levelScore);
      
      const nextLevelIdx = currentLevelIndex + 1;
      const maxLevels = selectedMode === 'quiz' ? 30 : 50; // Quiz has fewer levels in data currently

      // Update specific mode progress
      if (selectedMode === 'difference') {
        const currentUnlocked = unlockedDiff[selectedDifficulty];
        if (nextLevelIdx + 1 > currentUnlocked && nextLevelIdx < maxLevels) {
            updateDiffProgress(selectedDifficulty, nextLevelIdx + 1);
        }
      } else {
        const currentUnlocked = unlockedQuiz[selectedDifficulty];
        if (nextLevelIdx + 1 > currentUnlocked && nextLevelIdx < maxLevels) {
            updateQuizProgress(selectedDifficulty, nextLevelIdx + 1);
        }
      }
    }

    setScreen('RESULT');
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < activeLevels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setScreen('GAME');
    } else {
      // Tamat semua level
      setScreen('LEVEL_SELECT'); 
    }
  };

  const handleReplay = () => {
    if (isLevelPassed) {
      setScreen('GAME');
    } else {
      // Game Over -> Reset
      setCurrentLevelIndex(0);
      setCumulativeScore(0);
      setScreen('GAME');
    }
  };

  const handleGoHome = () => {
    setScreen('MENU');
    setCumulativeScore(0);
  };
  
  const handleBackToLevelSelect = () => {
    setScreen('LEVEL_SELECT');
  };

  const handleShowLeaderboard = () => {
    setScreen('LEADERBOARD');
  };

  if (!isSetupComplete) {
    return (
        <NotificationProvider>
            <InstallWizard onComplete={handleSetupComplete} />
        </NotificationProvider>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900 font-sans">
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#fbbf24 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
      </div>
      
      <GameNotificationContainer />

      {showNameModal && (
        <NameInputModal 
          onSubmit={handleNameSubmit} 
          initialValue={playerName} 
        />
      )}

      {screen === 'MENU' && (
        <MainMenu onStart={handleStartFlow} onShowLeaderboard={handleShowLeaderboard} />
      )}

      {screen === 'LEADERBOARD' && (
        <Leaderboard onBack={handleGoHome} playerName={playerName} />
      )}

      {/* SEPARATE LEVEL SELECT PAGES */}
      {screen === 'LEVEL_SELECT' && selectedMode === 'difference' && (
        <LevelSelectDifference 
          difficulty={selectedDifficulty}
          unlockedCount={unlockedDiff[selectedDifficulty]}
          onSelectLevel={handleSelectLevel}
          onBack={handleGoHome}
        />
      )}

      {screen === 'LEVEL_SELECT' && selectedMode === 'quiz' && (
        <LevelSelectQuiz 
          difficulty={selectedDifficulty}
          unlockedCount={unlockedQuiz[selectedDifficulty]}
          onSelectLevel={handleSelectLevel}
          onBack={handleGoHome}
        />
      )}

      {screen === 'GAME' && currentLevel && (
        selectedMode === 'difference' ? (
          <GameScreen 
            key={`diff-${selectedDifficulty}-${currentLevelIndex}-${cumulativeScore}`} 
            level={currentLevel as any}
            currentTotalScore={cumulativeScore}
            onLevelComplete={handleLevelComplete}
            onGoHome={handleBackToLevelSelect}
            onRetry={handleReplay} 
          />
        ) : (
          <QuizScreen 
             key={`quiz-${selectedDifficulty}-${currentLevelIndex}-${cumulativeScore}`}
             level={currentLevel as any}
             currentTotalScore={cumulativeScore}
             onLevelComplete={handleLevelComplete}
             onGoHome={handleBackToLevelSelect}
          />
        )
      )}

      {screen === 'RESULT' && (
        <>
           <div className="opacity-20 pointer-events-none fixed inset-0 bg-white"></div>
          <ResultModal 
            score={cumulativeScore}
            difficulty={selectedDifficulty}
            mode={selectedMode} 
            playerName={playerName}
            isLastLevel={currentLevelIndex === activeLevels.length - 1}
            isWin={isLevelPassed}
            onNext={handleNextLevel}
            onHome={handleBackToLevelSelect}
            onReplay={handleReplay}
            onLeaderboard={handleShowLeaderboard}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
         <AppContent />
      </NotificationProvider>
    </LanguageProvider>
  );
}
