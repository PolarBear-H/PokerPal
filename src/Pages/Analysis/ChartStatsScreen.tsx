import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, LogBox, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Rect, Text as TextSVG, Svg, Line, NumberProp } from "react-native-svg";

import { useScoreContext } from '../../Components/ScoreManager';
import { Utils } from '../../Components/Utils';
import Score from '../../Components/Score';
import { format } from 'date-fns';
import { useCurrencyContext } from '../../Components/CurrencyManager';
import { useNavigation } from '@react-navigation/native';
import Localization from '../../Components/Localization';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ChartStatsScreen: React.FC = () => {
    LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);
    const navigation = useNavigation<any>();
    
    const { scoreHistory } = useScoreContext();
    const { currency } = useCurrencyContext();
    const [selectedYear, setSelectedYear] = useState<string>(Localization.all);
    const [selectedMonth, setSelectedMonth] = useState<string>(Localization.all);
    const [style, setStyle] = useState<number>(Utils.style);

    let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })

    const [yearTabs, monthTabs] = Utils.generateTabs(scoreHistory, selectedYear);
    let filteredScores = Utils.getFilteredScores(scoreHistory, selectedYear, selectedMonth).reverse();
    let totalProfit = Utils.getTotalProfitList(filteredScores);

    useEffect(() => {
        
    }, [scoreHistory]);

    navigation.addListener('focus', () => {
        console.log("ChartStatsScreen focused: " + Utils.style);
        setStyle(Utils.style);
    });

    const handleYearTabChange = (selectedYear: string) => {
        setSelectedYear(selectedYear);
        setSelectedMonth(Localization.all);
        filteredScores = Utils.getFilteredScores(scoreHistory, selectedYear, selectedMonth).reverse();
    };
    
    const handleMonthTabChange = (selectedMonth: string) => {
        setSelectedMonth(selectedMonth);
    };

    const profitData = {
        labels: filteredScores.map(score => format(new Date(score.startDate), 'M.d')),
        datasets: [
            {
                data: filteredScores.map(score => score.chipsWon),
                colors: filteredScores.map((score) =>
                    score.chipsWon >= 0 ? ((opacity = 1) => `#cce6cc`) : (opacity = 1) => `#fcb4ac`
                ),
            },
        ],
    };

    const totalProfitData = {
        labels: ["0", ...filteredScores.map(score => format(new Date(score.startDate), 'M.d'))],
        datasets: [
            {
                data: [0, ...totalProfit],
            },
            
        ],
    };

    //const labelWidth = 23; // Width of each label
    //const chartWidth = profitData.labels.length * labelWidth;

    const profitChartConfig = {
        backgroundColor: 'white',
        backgroundGradientFrom: 'white',
        backgroundGradientTo: 'white',
        decimalPlaces: 0,
        barPercentage: 10/totalProfit.length,
        color: style == 1 ? (opacity = 1) => `rgba(0, 128, 0, ${opacity})` : (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color
    };

    const totalProfitChartConfig ={
        backgroundColor: 'white',
        backgroundGradientFrom: 'white',
        backgroundGradientTo: 'white',
        //fillShadowGradientOpacity: 0.1,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green color
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color
        //useShadowColorFromDataSet: true,
        strokeWidth: 3,
        propsForDots: {
            r: "3",
            //strokeWidth: "1",
            //stroke: "#fff"
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.outTabContainer}>
                {Utils.renderTabs(yearTabs, selectedYear, handleYearTabChange)}
                {Utils.renderTabs(monthTabs, selectedMonth, handleMonthTabChange)}
            </View>
            <View style={[styles.chartContainer, {marginBottom:8}]}>
                <Text style={styles.title}>{Localization.profitOverTime}</Text>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <BarChart
                        data={profitData}
                        width={screenWidth-15}
                        height={200}
                        yAxisLabel={currency}
                        yAxisSuffix=""
                        chartConfig={profitChartConfig}
                        showBarTops={false} 
                        showValuesOnTopOfBars={true}
                        fromZero={true} 
                        flatColor={true}
                        xLabelsOffset={8}
                        //yAxisInterval={100}
                        verticalLabelRotation= {280}
                        style={styles.barChart}
                        withCustomBarColorFromData={style == 1 ? false : true}
                    />
                </ScrollView>
            </View>
            <View style={styles.chartContainer}>
                <Text style={styles.title}>{Localization.totalProfitOverTime}</Text>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <LineChart
                        data={totalProfitData}
                        width={screenWidth-15}
                        height={200}
                        yAxisLabel={currency}
                        chartConfig={totalProfitChartConfig}
                        style={styles.lineChart}
                        xLabelsOffset={8} 
                        fromZero={true} 
                        verticalLabelRotation= {280}
                        withShadow={true}
                        bezier
                        getDotColor={(dataPoint, dataPointIndex) => {
                            if (dataPoint < 0) {
                                return '#DD3E35';
                            } else if (dataPoint == 0) {
                                return 'grey';
                            }
                                return 'green';
                            }
                        }
                        //renderDotContent={({ x, y, index }) => <Text style={{position: 'absolute', paddingTop: y-20, paddingLeft: x-15,}}>{index}</Text>}
                        decorator={() => {
                           
                            return tooltipPos.visible ? <View>
                                <Svg>
                                <TextSVG
                                    x={tooltipPos.x + 5}
                                    y={tooltipPos.y - 8}
                                    fill={tooltipPos.value>0 ? "green" : tooltipPos.value==0 ? "grey" : "#DD3E35"}
                                    opacity={0.8}
                                    fontSize="10"
                                    textAnchor="middle">
                                    {tooltipPos.value}
                                </TextSVG>
                                </Svg>
                            </View> : null
                        }}
                        onDataPointClick={(data) => {
                            let isSamePoint = (tooltipPos.x === data.x && tooltipPos.y === data.y);
                            isSamePoint ? setTooltipPos((previousState) => {
                                return { 
                                        ...previousState,
                                        value: data.value,
                                        visible: !previousState.visible
                                       }
                            }) : setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });
                        }}
                    />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    outTabContainer: {
        backgroundColor: 'white',
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    chartContainer:{
        backgroundColor: 'white',
        flex:1,
        borderRadius: 8,
        paddingTop: 8,
        paddingRight: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    barChart: {
        borderRadius: 16,
    },
    lineChart: {
        borderRadius: 16,
    },
});

export default ChartStatsScreen;
