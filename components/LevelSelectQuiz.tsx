
import React from 'react';
import { Difficulty } from '../types';
import { SharedLevelGrid } from './SharedLevelGrid';

interface LevelSelectQuizProps {
  difficulty: Difficulty;
  unlockedCount: number;
  onSelectLevel: (levelIndex: number) => void;
  onBack: () => void;
}

export const LevelSelectQuiz: React.FC<LevelSelectQuizProps> = ({
  difficulty,
  unlockedCount,
  onSelectLevel,
  onBack
}) => {
  // Logic specific to Quiz mode can go here
  // Note: Quiz currently has 30 levels in data/quizLevels.ts, but UI requests perfect grid of 50.
  // Ideally we should generate 50 quiz levels or pad the array. 
  // For visual consistency with the request, we will render 50 grid slots, 
  // but logically only the available ones (30) will be playable if not extended.
  // *Assumption*: We will show 50 slots to maintain the "Perfect Grid" visual requirement.
  
  return (
    <SharedLevelGrid 
      mode="quiz"
      difficulty={difficulty}
      unlockedCount={unlockedCount}
      totalLevels={50} // Enforcing 50 grid items for visual consistency
      onSelectLevel={onSelectLevel}
      onBack={onBack}
    />
  );
};
