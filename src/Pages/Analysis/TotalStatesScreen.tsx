import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScoreContext } from '../../Components/ScoreManager';
import { Utils } from '../../Components/Utils';
import Score from '../../Components/Score';
import Localization from '../../Components/Localization';
import { useLanguageContext } from '../../Components/LanguageManager';

const TotalStatsScreen: React.FC = () => {
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [totalHands, setTotalHands] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
    const { scoreHistory } = useScoreContext();
    const { language } = useLanguageContext();

    const calculateTotalStats = async (scoreHistory: Score[]) => {
        try {
            if (scoreHistory) {
                let totalProfit = 0;
                let totalDuration = 0;
                let totalHands = 0;
                let totalWins = 0;

                scoreHistory.forEach((score:any) => {
                    const chipsWon = parseFloat(score.chipsWon);
                    const duration = parseFloat(score.duration);
                    const isWin = chipsWon >= 0;
                    totalProfit += chipsWon;
                    totalDuration += duration;
                    totalHands += 1;
                    if (isWin) {
                        totalWins += 1;
                    }
                });

                setTotalProfit(totalProfit);
                setTotalDuration(totalDuration);
                setTotalHands(totalHands);
                setTotalWins(totalWins);

                await AsyncStorage.setItem('totalProfit', totalProfit.toString());
            }
        } catch (error) {
            console.error('Error calculating total stats:', error);
        }
    };

    useEffect(() => {
        calculateTotalStats(scoreHistory);
    }, [scoreHistory, language]);

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

    const totalProfitColor = totalProfit > 0 ? 'green' : totalProfit == 0 ? 'grey' : 'red';

    return (
        <View style={styles.container}>
        <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>{Localization.totalProfit}:</Text>
            <Text
                style={[
                styles.statsValue,
                {color: totalProfitColor}
                ]}
            >
                ¥{totalProfit.toFixed(2)}
            </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>{Localization.hourlyProfit}:</Text>
            <Text
                style={[
                styles.statsValue,
                {color: totalProfitColor}
                ]}
            >
                ¥{hourlyProfit.toFixed(2)}
            </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>{Localization.sessionAvgProfit}:</Text>
            <Text
                style={[
                styles.statsValue,
                {color: totalProfitColor}
                ]}
            >
                ¥{perHandProfit.toFixed(2)}
            </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>{Localization.totalDuration}:</Text>
            <Text style={styles.statsValue}>{Utils.getFormettedDuration(totalDuration)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>{Localization.winRate}:</Text>
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
        borderRadius: 8,
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
    statsValue: {
        fontSize: 20,
    },
});

export default TotalStatsScreen;
