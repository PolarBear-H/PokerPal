import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Score from '../../Components/Score';
import { format } from 'date-fns';
import { useScoreContext } from '../../Components/ScoreManager';
import { Utils } from '../../Components/Utils';

interface MonthlyStats {
    month: string;
    totalProfit: number;
    hourlyProfit: number;
    perGameProfit: number;
    totalGames: number;
    totalDuration: number;
}

const MonthlyStatsScreen: React.FC = () => {
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
    const { scoreHistory } = useScoreContext();
    const [showTotalDuration, setShowTotalDuration] = useState(false); 

    useEffect(() => {
        const fetchData = () => {
            try {
                if (scoreHistory) {
                    const statsByMonth: MonthlyStats[] = calculateMonthlyStats(scoreHistory);
                    setMonthlyStats(statsByMonth);
                }
            } catch (error) {
                console.error('Error fetching score history:', error);
            }
        };

        fetchData();
    }, [scoreHistory]);

    const calculateMonthlyStats = (scoreHistory: Score[]): MonthlyStats[] => {
        const monthlyStatsMap: Map<string, MonthlyStats> = new Map();

        for (const score of scoreHistory) {
            const month = format(new Date(score.startDate), 'yyyy-MM');

            if (!monthlyStatsMap.has(month)) {
                monthlyStatsMap.set(month, {
                    month: month,
                    totalProfit: parseFloat(score.chipsWon),
                    hourlyProfit: 0,
                    perGameProfit: parseFloat(score.chipsWon),
                    totalGames: 1,
                    totalDuration: score.duration,
                });
            } else {
                const monthlyStat = monthlyStatsMap.get(month);

                if (monthlyStat) {
                    monthlyStat.totalProfit += parseFloat(score.chipsWon);
                    monthlyStat.perGameProfit += parseFloat(score.chipsWon);
                    monthlyStat.totalGames += 1;
                    monthlyStat.totalDuration += score.duration;
                }
            }
        }

        for (const [_, monthlyStat] of monthlyStatsMap) {
            if (monthlyStat.totalDuration == 0)
            {
                monthlyStat.hourlyProfit = monthlyStat.totalProfit;
            } else {
                monthlyStat.hourlyProfit = monthlyStat.totalProfit / (monthlyStat.totalDuration);
            }
        }

        return Array.from(monthlyStatsMap.values());
    };

    const renderMonthlyStatsItem = ({ item }: { item: MonthlyStats }) => (
        <TouchableOpacity style={styles.statsItem} onPress={() => setShowTotalDuration(!showTotalDuration)}>
            <Text style={styles.statsLabel}>{item.month}</Text>
            <Text style={[
                styles.statsValue, 
                styles.totalProfitValue, 
                { backgroundColor: item.totalProfit >= 0 ? 'green' : 'red' }
            ]}>
                ¥{item.totalProfit}
            </Text>
            {showTotalDuration ? (
                <>
                <Text style={styles.statsValue}>
                    {item.totalDuration} h
                </Text>
                <Text style={styles.statsValue}>
                    {item.totalGames}
                </Text>
                </>
            ) : (
                <>
                <Text style={[styles.statsValue, { color: item.hourlyProfit >= 0 ? 'green' : 'red' }]}>
                    ¥{item.hourlyProfit.toFixed(2)}
                </Text>
                <Text style={[styles.statsValue, { color: item.perGameProfit >= 0 ? 'green' : 'red' }]}>
                    ¥{item.perGameProfit.toFixed(2)}
                </Text>
                </>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerLabel}>Month</Text>
            <Text style={styles.headerLabel}>Total Profit</Text>
            <Text style={styles.headerLabel}>{showTotalDuration ? 'Total Duration' : 'Hourly Profit'}</Text>
            <Text style={styles.headerLabel}>{showTotalDuration ? 'Total Games' : 'Per Games Profit'}</Text>
        </View>
        <FlatList
            data={monthlyStats}
            keyExtractor={(item) => item.month}
            renderItem={renderMonthlyStatsItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    dataMeaning: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    headerLabel: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    statsLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
    },
    statsValue: {
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        flex: 1,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 16,
    },
    totalProfitValue: {
        color: 'white', // Set text color to white
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6, // Add border radius to create a rounded box
        fontWeight: 'bold',
        overflow: 'hidden',
    },
});

export default MonthlyStatsScreen;
