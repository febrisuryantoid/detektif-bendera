
import React from 'react';
import { Difficulty } from '../types';
import { SharedLevelGrid } from './SharedLevelGrid';

interface LevelSelectDifferenceProps {
  difficulty: Difficulty;
  unlockedCount: number;
  onSelectLevel: (levelIndex: number) => void;
  onBack: () => void;
}

export const LevelSelectDifference: React.FC<LevelSelectDifferenceProps> = ({
  difficulty,
  unlockedCount,
  onSelectLevel,
  onBack
}) => {
  // Logic specific to Find Difference mode can go here (e.g. specific data fetching if needed)
  
  return (
    <SharedLevelGrid 
      mode="difference"
      difficulty={difficulty}
      unlockedCount={unlockedCount}
      totalLevels={50} // Fixed 50 levels for this mode
      onSelectLevel={onSelectLevel}
      onBack={onBack}
    />
  );
};
