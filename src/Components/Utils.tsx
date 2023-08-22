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
}