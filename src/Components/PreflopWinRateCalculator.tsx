import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import simulateWinRate from './simulateWinRate';

const PreflopWinRateCalculator: React.FC = () => {
  const [userHand, setUserHand] = useState('');
  const [winRate, setWinRate] = useState(0);

  const calculateWinRate = () => {
    const simulatedWinRate = simulateWinRate(userHand);
    setWinRate(simulatedWinRate);
  };

  return (
    <View style={styles.container}>
      <Text>输入您的底牌：</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserHand}
        value={userHand}
      />
      <Button title="计算翻前胜率" onPress={calculateWinRate} />
      <Text>您的翻前胜率为：{winRate.toFixed(2)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: 200,
    marginBottom: 10,
  },
});

export default PreflopWinRateCalculator;
