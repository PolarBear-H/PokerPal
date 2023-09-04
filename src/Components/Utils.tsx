import AsyncStorage from "@react-native-async-storage/async-storage";
import Score from "./Score";
import { format, getYear } from "date-fns";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BlindLevel from "./BlindLevel";

export class Utils {
    public static printLog: boolean = true;
    public static appVersion: string = '1.0.0';
    public static style: number = 1;
    public static blindLevelList: BlindLevel[] = [{smallBlind:1, bigBlind:2}, {smallBlind:5, bigBlind:10}, {smallBlind:10, bigBlind:20}, {smallBlind:50, bigBlind:100}];

    // default values
    public static defaultBreakTime: number = 0;
    public static defaultBlindLevel: string;
    public static defaultLocation: string;
    public static defaultPlayerCount: number;
    public static defaultBuyIn: number = 0;

    // Retrieve score history from AsyncStorage
    public static async fetchScoreHistory(setScoreHistory: React.Dispatch<React.SetStateAction<Score[]>>) {
        try {
            const storedScoreHistory = await AsyncStorage.getItem('scoreHistory');
            if (storedScoreHistory) {
                const parsedScoreHistory = JSON.parse(storedScoreHistory);
                setScoreHistory(parsedScoreHistory);
            } else {
                setScoreHistory([]);
            }
        } catch (error) {
            console.error('Error fetching score history:', error);
        }
    };

    public static getWeekday(date: Date) {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekdayIndex = date.getDay();
        return weekdays[weekdayIndex];
    };

    public static getFormettedDuration(durationInHours: number) {
        const hours = Math.floor(durationInHours);
        const minutes = Math.round((durationInHours - hours) * 60);
        const durationFormatted = `${hours} h ${minutes} m`;
        return durationFormatted;
    };

    public static getFormattedBlindLevel(blindLevel: BlindLevel, currency: string) {
        return `SB ${currency}${blindLevel.smallBlind} / BB ${currency}${blindLevel.bigBlind}`;
    }

    public static convertBlindLevelListToStringList(blindLevelList: BlindLevel[], currency: string) {
        const blindLevelStringList: string[] = [];
        for (const blindLevel of blindLevelList) {
            blindLevelStringList.push(Utils.getFormattedBlindLevel(blindLevel, currency));
        }
        return blindLevelStringList;
    }

    public static calculateTotalProfit(scoreHistory: Score[]) {
        let totalProfit = 0;
        scoreHistory.forEach((score:Score) => {
            const chipsWon = score.chipsWon;
            totalProfit += chipsWon;
        });

        return totalProfit;
    };

    public static getTotalProfitList(scoreHistory: Score[]) {
        const totalProfitData: number[] = [];
        let totalProfit = 0;
        for (const score of scoreHistory) {
            const chipsWon = score.chipsWon;
            totalProfit += chipsWon;
            totalProfitData.push(totalProfit);
        }

        return totalProfitData;
    };

    public static getFilteredScores(scoreHistory: Score[], selectedYear: string, selectedMonth: string) {
        const newfilteredScores = scoreHistory.filter(score => {
            const scoreYear = new Date(score.startDate).getFullYear().toString();
            const scoreMonth = format(new Date(score.startDate), 'MMM');
    
            const yearMatch = selectedYear === 'All' || selectedYear === scoreYear;
            const monthMatch = selectedMonth === 'All' || selectedMonth === scoreMonth;
    
            return yearMatch && monthMatch;
        });

        return newfilteredScores;
    }

    public static generateTabs(scoreHistory: Score[], selectedYear: string) {
        let newYearTabs = Array.from(new Set(scoreHistory.map((score) => getYear(new Date(score.startDate)).toString())));
        newYearTabs.unshift('All');

        let newMonthTabs = scoreHistory.filter(score => {
            const scoreYear = new Date(score.startDate).getFullYear().toString();
            const yearMatch = selectedYear === 'All' || selectedYear === scoreYear;
            return yearMatch;
        }).map((score) => format(new Date(score.startDate), 'MMM'));
        newMonthTabs = Array.from(new Set(newMonthTabs)).reverse();
        newMonthTabs.unshift('All');

        return [newYearTabs, newMonthTabs];
    }

    // Render the year and month tabs
    public static renderTabs(tabs: string[], selectedTab: string, handleTabChange: any) {
        return (
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, tab === selectedTab && styles.selectedTab]}
                        onPress={() => {
                            handleTabChange(tab);
                        }}>
                        <Text style={[styles.tabText, tab === selectedTab && styles.selectedTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>
            </View>
        );
    };

    public static async getDefaultValue() {
        let style = await AsyncStorage.getItem('style');
        let blindLevelList = await AsyncStorage.getItem('blindLevelList');

        let defaultBreakTime = await AsyncStorage.getItem('defaultBreakTime');
        let defaultBlindLevel = await AsyncStorage.getItem('defaultBlindLevel');
        let defaultLocation = await AsyncStorage.getItem('defaultLocation');
        let defaultPlayerCount = await AsyncStorage.getItem('defaultPlayerCount');

        if (style) {
            Utils.style = parseInt(style);
        }
        if (blindLevelList) {
            Utils.blindLevelList = JSON.parse(blindLevelList);
        }
        if (defaultBreakTime) {
            Utils.defaultBreakTime;
        }
        if (defaultBlindLevel) {
            Utils.defaultBlindLevel = defaultBlindLevel;
        }
        if (defaultLocation) {
            Utils.defaultLocation = defaultLocation;
        }
        if (defaultPlayerCount) {
            Utils.defaultPlayerCount = parseInt(defaultPlayerCount);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    tab: {
        paddingHorizontal: 16,
        marginRight: 2,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F4F4F4',
    },
    selectedTab: {
        backgroundColor: '#007AFF',
    },
    tabText: {
        color: 'black',
        fontSize: 16,
    },
    selectedTabText: {
        color: 'white',
    },
});
