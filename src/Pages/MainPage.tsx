import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScoreContext } from '../Components/ScoreManager';
import Score from '../Components/Score';
import { format } from 'date-fns';
import { Utils } from '../Components/Utils';
import { useNavigation } from '@react-navigation/native';

const MainPage: React.FC = () => {
  const navigation = useNavigation<any>();
    const [recentGame, setRecentGame] = useState<Score|null>(null);
    const [totalProfit, setTotalProfit] = useState<number>(0);
    const { scoreHistory } = useScoreContext();

    useEffect(() => {
        async function fetchRecentGame() {
            try {
              if (scoreHistory.length > 0) {
                const mostRecentGame = scoreHistory[0]; // Assuming scoreHistoryData is an array
                setRecentGame(mostRecentGame);
              }
              setTotalProfit(Utils.calculateTotalProfit(scoreHistory));
            } catch (error) {
                console.error('Error fetching recent game:', error);
            }
        }

        fetchRecentGame();
    }, [scoreHistory]);

    const totalProfitLabel = totalProfit >= 0 ? "Total Profit" : "Total Loss";
    const totalProfitColor = totalProfit > 0 ? 'green' : totalProfit == 0 ? 'black' : '#DD3E35';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.totalProfit, { color: totalProfitColor }]}>{totalProfitLabel}: ¥{totalProfit.toFixed(2)}</Text>
            </View>
            <View style={styles.content}>
              {recentGame && (
                  <View style={styles.recentGame}>
                      <Text style={styles.recentGameTitle}>Recent Session</Text>
                      <Text style={styles.recentGameDetails}>Date: {format(new Date(recentGame?.startDate), 'yyyy-MM-dd')}</Text>
                      <Text style={styles.recentGameDetails}>Profit: ¥{recentGame?.chipsWon}</Text>
                      <Text style={styles.recentGameDetails}>Duration: {Utils.getFormettedDuration(recentGame?.duration)} </Text>
                  </View>
              )}
            </View>
            <View style={styles.buttonContent}>
              <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('RecordScorePage')}>
                <Text style={styles.addButtonLabel}>Add</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F4F4F4',
  },
  header: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
  },
  totalProfit: {
      fontSize: 26,
      fontWeight: 'bold',
      color: 'green',
  },
  content: {
      flex: 4,
      alignItems: 'center',
      width: '100%',
  },
  buttonContent: {
    flex: 2,
  },
  recentGame: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      width: '90%',
  },
  recentGameTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
  },
  recentGameDetails: {
      fontSize: 16,
      marginBottom: 4,
  },
  addButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
  },
  addButtonLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
  },
});

export default MainPage;
