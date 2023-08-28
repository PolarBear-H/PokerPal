import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DiceRollScreen = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleRollDice = () => {
    const randomValue = Math.random(); // Generate a random number between 0 and 1
    const selectedValue = randomValue < 0.5 ? 'call' : 'fold';
    setSelectedOption(selectedValue);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRollDice} style={styles.diceButton}>
        <Text style={styles.buttonText}>Roll Dice</Text>
      </TouchableOpacity>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{selectedOption}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DiceRollScreen;
