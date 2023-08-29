import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, LogBox, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useScoreContext } from '../../Components/ScoreManager';
import { Utils } from '../../Components/Utils';
import Score from '../../Components/Score';
import { format } from 'date-fns';

const screenWidth = Dimensions.get("window").width;

const ChartStatsScreen: React.FC = () => {
    LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

    const { scoreHistory } = useScoreContext();
    const [totalProfit, setTotalProfit] = useState<number[]>([0]);

    const [selectedYear, setSelectedYear] = useState<string>("All");
    const [selectedMonth, setSelectedMonth] = useState<string>("All");

    const [yearTabs, monthTabs] = Utils.generateTabs(scoreHistory, selectedYear);
    let filteredScores = Utils.getFilteredScores(scoreHistory, selectedYear, selectedMonth).reverse();

    useEffect(() => {
        if (filteredScores.length > 0) {
            calculateTotalProfit(filteredScores);
        }
    }, [scoreHistory]);

    const calculateTotalProfit = (filteredScores: Score[]) => {
        const totalProfitData: number[] = [];
        let totalWins = 0;
        for (const score of filteredScores) {
            const chipsWon = parseFloat(score.chipsWon);
            
            totalWins += chipsWon;
            totalProfitData.push(totalWins);
        }

        setTotalProfit(totalProfitData);
    };

    const chartData = {
        labels: Array.from({ length: totalProfit.length }, (_, index) => 1 + index).map(number => number.toString()),
        datasets: [
            {
                data: filteredScores.map(score => parseFloat(score.chipsWon)),
            },
        ],
    };

    const totalProfitData = {
        labels: Array.from({ length: totalProfit.length }, (_, index) => 1 + index).map(number => number.toString()),
        datasets: [
            {
                data: totalProfit,
            },
        ],
    };

    const handleYearTabChange = (selectedYear: string) => {
        setSelectedYear(selectedYear);
        setSelectedMonth("All");
        filteredScores = Utils.getFilteredScores(scoreHistory, selectedYear, selectedMonth).reverse();
        calculateTotalProfit(filteredScores); // Recalculate totalProfitData
    };
    
    const handleMonthTabChange = (selectedMonth: string) => {
        setSelectedMonth(selectedMonth);
        calculateTotalProfit(filteredScores); // Recalculate totalProfitData
    };

    return (
        <View style={styles.container}>
            <View style={styles.outTabContainer}>
                {Utils.renderTabs(yearTabs, selectedYear, handleYearTabChange)}
                {Utils.renderTabs(monthTabs, selectedMonth, handleMonthTabChange)}
            </View>
            <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Profit Over Time</Text>
            <BarChart
                data={chartData}
                width={screenWidth}
                height={200}
                yAxisLabel="¥"
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: 'white',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green color
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color
                    style: {
                        padding: 16,
                        marginLeft: -16,
                        width: '80%',
                    },
                }}
                showBarTops={false} // 不显示柱状图的顶部
                showValuesOnTopOfBars={true} // 在柱状图上显示数值
                style={{
                    marginLeft: -16,
                    borderRadius: 16,
                }}
            />
            </ScrollView>
            <Text style={styles.title}>Total Profit Over Time</Text>
            <LineChart
                data={totalProfitData}
                width={screenWidth}
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
    outTabContainer: {
        backgroundColor: 'white',
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default ChartStatsScreen;
