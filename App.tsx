
import React, { useState, useMemo, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultModal } from './components/ResultModal';
import { LevelSelect } from './components/LevelSelect';
import { Leaderboard } from './components/Leaderboard';
import { NameInputModal } from './components/NameInputModal';
import { LEVELS } from './data/levels';
import { QUIZ_LEVELS } from './data/quizLevels';
import { Difficulty, GameMode } from '../types';
import { startMusic, stopMusic } from './utils/sound';
import { LanguageProvider, useLanguage } from './utils/i18n';

type ScreenState = 'MENU' | 'LEVEL_SELECT' | 'GAME' | 'RESULT' | 'LEADERBOARD';

function AppContent() {
  const { lang } = useLanguage();
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

  // Unlocked levels state
  const [unlockedState, setUnlockedState] = useState({
    easy: 1,
    medium: 1,
    hard: 1
  });

  // SEO Update Effect
  useEffect(() => {
    if (lang === 'id') {
      document.title = "Detektif Bendera - Game Edukasi Anak";
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'Mainkan game edukasi Detektif Bendera. Tebak nama negara dan cari perbedaan bendera. Seru, mendidik, dan gratis untuk anak Indonesia!');
    } else {
      document.title = "Detective Flags - Educational Kids Game";
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'Play Detective Flags educational game. Guess the country flags and find differences. Fun, educational, and free for kids worldwide!');
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

  const handleStartFlow = (diff: Difficulty, mode: GameMode) => {
    setPendingStart({ diff, mode });
    setShowNameModal(true);
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
      
      const currentUnlocked = unlockedState[selectedDifficulty];
      // Logic unlock max 30 for Quiz, 50 for Diff
      const maxLevels = selectedMode === 'quiz' ? 30 : 50;
      
      if (currentLevelIndex + 1 >= currentUnlocked && currentUnlocked < maxLevels) {
        setUnlockedState(prev => ({
          ...prev,
          [selectedDifficulty]: prev[selectedDifficulty] + 1
        }));
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

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900 font-sans">
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#fbbf24 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
      </div>
      
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
        <Leaderboard onBack={handleGoHome} />
      )}

      {screen === 'LEVEL_SELECT' && (
        <LevelSelect 
          difficulty={selectedDifficulty}
          unlockedCount={unlockedState[selectedDifficulty]}
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
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
