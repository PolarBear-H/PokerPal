import React, { createContext, useContext, useState } from 'react';
import Score from '../Components/Score';

interface ScoreContextProps {
  scoreHistory: Score[];
  setScoreHistory: React.Dispatch<React.SetStateAction<Score[]>>;
}

const ScoreContext = createContext<ScoreContextProps | undefined>(undefined);

export const useScoreContext = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScoreContext must be used within a ScoreProvider');
  }
  return context;
};

// Explicitly define the children prop here
export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scoreHistory, setScoreHistory] = useState<Score[]>([]);
  
  return (
    <ScoreContext.Provider value={{ scoreHistory, setScoreHistory }}>
      {children}
    </ScoreContext.Provider>
  );
};
