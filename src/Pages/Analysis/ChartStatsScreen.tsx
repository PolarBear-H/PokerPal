import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useScoreContext } from '../../Components/ScoreManager';
import { Utils } from '../../Components/Utils';
import Score from '../../Components/Score';
import { format } from 'date-fns';

const ChartStatsScreen: React.FC = () => {
    const [winRates, setWinRates] = useState<number[]>([]);
    const { scoreHistory, setScoreHistory } = useScoreContext();

    useEffect(() => {
        if (scoreHistory.length > 0) {
            calculateWinRates(scoreHistory);
        }
    }, [scoreHistory]);

    const calculateWinRates = (scores: Score[]) => {
        const winRateData: number[] = [];
        let totalWins = 0;
        const reversedScores = scoreHistory.slice().reverse();
        for (const score of reversedScores) {
            const chipsWon = parseInt(score.chipsWon);
            
            totalWins += chipsWon;
            winRateData.push(totalWins);
        }

        setWinRates(winRateData);
    };

    const chartData = {
        labels: scoreHistory.map(score => format(new Date(score.startDate), 'MM/dd')).reverse(),
        datasets: [
            {
                data: winRates,
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profit Over Time</Text>
            <LineChart
                data={chartData}
                width={300}
                height={200}
                chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: 'white',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green color
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color
                    style: {
                        borderRadius: 16,
                        width: '100%',
                    },
                }}
                bezier
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        width:'100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default ChartStatsScreen;
