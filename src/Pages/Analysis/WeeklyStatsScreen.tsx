import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Score from '../../Components/Score';
import { format, startOfWeek, addDays } from 'date-fns';
import { useScoreContext } from '../../Components/ScoreManager';
import { Utils } from '../../Components/Utils';
import Localization from '../../Components/Localization';
import { useLanguageContext } from '../../Components/LanguageManager';

interface WeeklyStats {
    week: string;
    totalProfit: number;
    hourlyProfit: number;
    perGameProfit: number;
    totalGames: number;
    totalDuration: number;
}

const WeeklyStatsScreen: React.FC = () => {
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
    const { scoreHistory } = useScoreContext();
    const { language } = useLanguageContext();
    const [showTotalDuration, setShowTotalDuration] = useState(false); 

    useEffect(() => {
        const fetchData = () => {
            try {
                if (scoreHistory) {
                    const statsByWeek: WeeklyStats[] = calculateWeeklyStats(scoreHistory);
                    setWeeklyStats(statsByWeek);
                }
            } catch (error) {
                console.error('Error fetching score history:', error);
            }
        };

        fetchData();
    }, [scoreHistory, language]);

    const calculateWeeklyStats = (scoreHistory: Score[]): WeeklyStats[] => {
        const weeklyStatsMap: Map<string, WeeklyStats> = new Map();

        for (const score of scoreHistory) {
            const weekLabel = Utils.getWeekday(new Date(score.startDate))

            if (!weeklyStatsMap.has(weekLabel)) {
                weeklyStatsMap.set(weekLabel, {
                    week: weekLabel,
                    totalProfit: parseFloat(score.chipsWon),
                    hourlyProfit: 0,
                    perGameProfit: 0,
                    totalGames: 1,
                    totalDuration: score.duration,
                });
            } else {
                const weeklyStat = weeklyStatsMap.get(weekLabel);

                if (weeklyStat) {
                    weeklyStat.totalProfit += parseFloat(score.chipsWon);
                    weeklyStat.totalGames += 1;
                    weeklyStat.totalDuration += score.duration;
                }
            }
        }

        for (const [_, weeklyStat] of weeklyStatsMap) {
            if (weeklyStat.totalDuration == 0)
            {
                weeklyStat.hourlyProfit = weeklyStat.totalProfit;
            } else {
                weeklyStat.hourlyProfit = weeklyStat.totalProfit / (weeklyStat.totalDuration);
            }

            weeklyStat.perGameProfit = weeklyStat.totalProfit / (weeklyStat.totalGames);
        }

        // Sort the weekly stats by week (from Monday to Sunday)
        const sortedWeeklyStats = Array.from(weeklyStatsMap.values()).sort((a, b) => {
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const aIndex = daysOfWeek.indexOf(a.week);
            const bIndex = daysOfWeek.indexOf(b.week);
            return aIndex - bIndex;
        });

        return sortedWeeklyStats;
    };

    const totalProfitColor = (totalProfit: number) => totalProfit > 0 ? 'green' : totalProfit == 0 ? 'gray' : '#DD3E35';

    const renderWeeklyStatsItem = ({ item }: { item: WeeklyStats }) => (
        <TouchableOpacity style={styles.statsItem} onPress={() => setShowTotalDuration(!showTotalDuration)}>
            <Text style={styles.statsLabel}>{item.week}</Text>
            <Text style={[
                styles.statsValue, 
                styles.totalProfitValue, 
                { backgroundColor: totalProfitColor(item.totalProfit)}
            ]}>
                ¥{item.totalProfit}
            </Text>
            {showTotalDuration ? (
                <>
                <Text style={styles.statsValue}>
                    {Utils.getFormettedDuration(item.totalDuration)}
                </Text>
                <Text style={styles.statsValue}>
                    {item.totalGames}
                </Text>
                </>
            ) : (
                <>
                <Text style={[styles.statsValue, { color: totalProfitColor(item.totalProfit) }]}>
                    ¥{item.hourlyProfit.toFixed(2)}
                </Text>
                <Text style={[styles.statsValue, { color: totalProfitColor(item.totalProfit) }]}>
                    ¥{item.perGameProfit.toFixed(2)}
                </Text>
                </>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <Text style={styles.headerLabel}>{Localization.month}</Text>
            <Text style={styles.headerLabel}>{Localization.profit}</Text>
            <Text style={styles.headerLabel}>{showTotalDuration ? Localization.duration : Localization.hourlyProfitShort}</Text>
            <Text style={styles.headerLabel}>{showTotalDuration ? Localization.sessions : Localization.SessionAvgProfitShort}</Text>
            </View>
            <View style={styles.separator} />
            <FlatList
                data={weeklyStats}
                keyExtractor={(item) => item.week}
                renderItem={renderWeeklyStatsItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10,
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

export default WeeklyStatsScreen;
