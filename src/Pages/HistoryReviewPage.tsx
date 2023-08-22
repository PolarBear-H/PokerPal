import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns'; // Import the date-fns library for date formatting
import Score from '../Components/Score';
import { useScoreContext } from '../Components/ScoreManager';
import { Utils } from '../Components/Utils';

const HistoryReviewPage: React.FC = () => {
    const navigation = useNavigation<any>();
    const { scoreHistory, setScoreHistory } = useScoreContext();

    useEffect(() => {
        // Retrieve score history from AsyncStorage
        Utils.fetchScoreHistory(setScoreHistory);
    }, []);

    const handleDelete = (item: Score) => {
        Alert.alert(
        'Delete Record',
        'Are you sure you want to delete this record?',
        [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
                // Filter out the selected score from the score history
                const updatedScoreHistory = scoreHistory.filter((score) => score !== item);
                setScoreHistory(updatedScoreHistory);

                // Save the updated score history to AsyncStorage
                AsyncStorage.setItem('scoreHistory', JSON.stringify(updatedScoreHistory));
            },
            },
        ]
        );
    };
  
    const renderScoreItem = ({ item }: { item: Score }) => {
        const isProfit = parseFloat(item.chipsWon) > 0;
        const profitColor = isProfit ? 'green' : 'red';
    
        const renderRightActions = () => (
            <TouchableOpacity style={styles.deleteContainer} onPress={() => handleDelete(item)}>
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        );
    
        return (
            <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity
                    style={styles.scoreItem}
                    onPress={() => navigation.navigate('RecordScorePage', { item: item })}
                >
                    <View style={styles.infoContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{format(new Date(item.startDate), 'yyyy/MM/dd')}</Text>
                            <Text style={styles.weekdayText}>{Utils.getWeekday(new Date(item.startDate))}</Text>
                        </View>
                        <Text style={styles.infoText}>
                            Game Time: {item.duration} hours
                        </Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={[styles.profitText, { color: profitColor }]}>
                            ¥ {item.chipsWon}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };    
    
    return (
        <View style={styles.container}>
        <FlatList
            data={scoreHistory}
            renderItem={renderScoreItem}
            keyExtractor={(item, index) => index.toString()}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    scoreItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    weekdayText: {
        fontSize: 16,
    },
    infoContainer: {
        alignItems: 'flex-end',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 4, // Add margin to separate game time from profit
    },
    profitText: {
        fontSize: 18, // Increase font size for profit
        fontWeight: 'bold', // Add bold style to profit
    },
    deleteContainer: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
    },
});


export default HistoryReviewPage;
