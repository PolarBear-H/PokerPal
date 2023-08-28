import AsyncStorage from "@react-native-async-storage/async-storage";
import Score from "./Score";

export class Utils {
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

    public static calculateTotalProfit(scoreHistory: Score[]) {
        let totalProfit = 0;
        scoreHistory.forEach((score:any) => {
            const chipsWon = parseFloat(score.chipsWon);
            totalProfit += chipsWon;
        });
        return totalProfit;
    };
}