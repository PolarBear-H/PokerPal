// src/components/PokerScoreRecorder.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface PokerScoreRecorderProps {
  // Props if needed
}

const PokerScoreRecorder: React.FC<PokerScoreRecorderProps> = () => {
  const [score, setScore] = useState(0);

  const increaseScore = () => {
    setScore(score + 1);
  };

  const decreaseScore = () => {
    if (score > 0) {
      setScore(score - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>{score}</Text>
      <Button title="+" onPress={increaseScore} />
      <Button title="-" onPress={decreaseScore} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  score: {
    fontSize: 32,
    marginBottom: 10,
  },
});

export default PokerScoreRecorder;
