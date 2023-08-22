import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScoreContext } from '../../Components/ScoreManager';
import { Utils } from '../../Components/Utils';
import Score from '../../Components/Score';

const TotalStatsScreen: React.FC = () => {
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [totalHands, setTotalHands] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
    const { scoreHistory } = useScoreContext();

    const calculateTotalStats = (scoreHistory: Score[]) => {
        try {
            if (scoreHistory) {
                let totalProfit = 0;
                let totalDuration = 0;
                let totalHands = 0;
                let totalWins = 0;

                scoreHistory.forEach((score:any) => {
                    const chipsWon = parseInt(score.chipsWon);
                    const duration = parseFloat(score.duration);
                    const isWin = chipsWon >= 0;
                    totalProfit += chipsWon;
                    totalDuration += duration;
                    totalHands += 1;
                    if (isWin) {
                        totalWins += 1;
                    }
                    //console.log("totalProfit: " + totalProfit + "chipsWon: " + chipsWon);
                });

                setTotalProfit(totalProfit);
                setTotalDuration(totalDuration);
                setTotalHands(totalHands);
                setTotalWins(totalWins);
            }
        } catch (error) {
            console.error('Error calculating total stats:', error);
        }
    };

    useEffect(() => {
        calculateTotalStats(scoreHistory);
    }, [scoreHistory]);

    let hourlyProfit = totalProfit / totalDuration;
    let perHandProfit = totalProfit / totalHands;
    let totalWinRate = (totalWins / totalHands) * 100;

    if (totalDuration == 0) {
        hourlyProfit = totalProfit;
    }
    if (totalHands == 0) {
        perHandProfit = 0;
        totalWinRate = 0;
    }

    return (
        <View style={styles.container}>
        <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Total Profit:</Text>
            <Text
                style={[
                styles.statsValue,
                totalProfit >= 0 ? styles.profitText : styles.lossText,
                ]}
            >
                ¥{totalProfit.toFixed(2)}
            </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Hourly Profit(¥/h):</Text>
            <Text
                style={[
                styles.statsValue,
                hourlyProfit >= 0 ? styles.profitText : styles.lossText,
                ]}
            >
                ¥{hourlyProfit.toFixed(2)}
            </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Per Game Profit:</Text>
            <Text
                style={[
                styles.statsValue,
                perHandProfit >= 0 ? styles.profitText : styles.lossText,
                ]}
            >
                ¥{perHandProfit.toFixed(2)}
            </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Total Duration:</Text>
            <Text style={styles.statsValue}>{totalDuration.toFixed(2)} hours</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Total Win Rate:</Text>
            <Text style={styles.statsValue}>{totalWins}/{totalHands} ({totalWinRate.toFixed(2)}%)</Text>
            </View>
        </View>
        {/* ... */}
        </View>
    );  
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  
        backgroundColor: 'white',
    },
    statsContainer: {
        flex: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16, // Increase vertical padding for row
        paddingHorizontal: 16,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginHorizontal: 16, // Add horizontal margin for divider
    },
    statsLabel: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    profitText: {
        color: 'green',
        fontSize: 20,
    },
    lossText: {
        color: 'red',
        fontSize: 20,
    },
    statsValue: {
        fontSize: 20,
    },
});

export default TotalStatsScreen;
