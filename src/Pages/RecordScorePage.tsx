import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Score from '../Components/Score';
import { format } from 'date-fns';
import { useScoreContext } from '../Components/ScoreManager';

const RecordScorePage: React.FC = () => {
    const navigation = useNavigation<any>();
    LogBox.ignoreLogs(['Sending...']);
    const route = useRoute(); // Get the route object
    // Use optional chaining and provide a default value
    let scoreData: any;
    if (route && route?.params) {
        scoreData = 'item' in route?.params ? route.params.item : {};
    }

    const [score, setScore] = useState<Score>({
        startDate: scoreData?.startDate || new Date(), // Provide a default value
        endDate: scoreData?.endDate || new Date(),
        duration: scoreData?.duration || 0,
        location: scoreData?.location || '',
        playerCount: scoreData?.playerCount || '',
        betUnit: scoreData?.betUnit || '',
        buyInAmount: scoreData?.buyInAmount || 0,
        remainingBalance: scoreData?.remainingBalance || 0,
        chipsWon: scoreData?.chipsWon || 0,
    });
    
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const { scoreHistory, setScoreHistory } = useScoreContext(); // Use the context

    // Calculate the duration in hours
    const durationInHours = (new Date(score.endDate).getTime() - new Date(score.startDate).getTime()) / (1000 * 60 * 60);
    const roundedDuration = Math.round(durationInHours * 100) / 100;
    const chipsWon = score.remainingBalance - score.buyInAmount;;
    
    const handleSave = async () => {
        try {
            // Update the score history array with the new record
            const newScore = { ...score };
            newScore.duration = roundedDuration;
            newScore.chipsWon = chipsWon;

            let updatedHistory;
            if (scoreData) {
                // Update the score history array with the updated record
                updatedHistory = scoreHistory.map((scoreItem) =>
                    JSON.stringify(scoreItem) == JSON.stringify(scoreData) ? newScore : scoreItem
                );
            } else {
                updatedHistory = [...scoreHistory, newScore];
            }

            updatedHistory.sort((a: { startDate: Date; }, b: { startDate: Date; }) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
            setScoreHistory(updatedHistory);
        
            // Save the updated score history array to storage
            await AsyncStorage.setItem('scoreHistory', JSON.stringify(updatedHistory));

            // Clear the input fields after saving
            setScore({
                startDate: new Date(),
                endDate: new Date(),
                location: '',
                playerCount: '',
                betUnit: '',
                buyInAmount: 0,
                remainingBalance: 0,
                chipsWon: 0,
                duration: 0,
            });

            if (scoreData) {
                navigation.navigate("HistoryReviewPage");
            } else {
                navigation.navigate("MainPage");
            }
            
            // Optionally, show a success message to the user
            // Alert.alert('Success', 'Game score saved successfully');
        } catch (error) {
            // Handle any errors that occur during the save process
            // You can show an error message to the user
            // Alert.alert('Error', 'Failed to save game score');
        }
    };    

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.headerButton}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.headerButton}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, score]);
    
    const renderPropertyRow = (title: string, value: string, onChangeText: (text: any) => void) => {
        const openDatePicker = () => {
            if (title === 'Start Date') {
                setShowStartDatePicker(true);
            } else if (title === 'End Date') {
                setShowEndDatePicker(true);
            }
        };

        return (
            <View style={styles.propertyRow}>
                <Text style={styles.propertyTitle}>{title}</Text>
                {(title === 'Start Date' || title === 'End Date') ? (
                    <>
                    <TouchableOpacity onPress={openDatePicker}>
                        <Text style={styles.propertyValue}>{format(new Date(value), 'yyyy/MM/dd HH:mm')}</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        open={(title === 'Start Date') ? showStartDatePicker : showEndDatePicker}
                        date={new Date(value)}
                        mode="datetime"
                        theme="light"
                        textColor="black" // Set text color for DatePicker
                        minuteInterval={30}
                        onConfirm={(newDate) => {
                            setShowStartDatePicker(false);
                            setShowEndDatePicker(false);
                            (title === 'Start Date') ? setScore({ ...score, startDate: newDate }) : setScore({ ...score, endDate: newDate });
                        }}
                        onCancel={() => {
                            setShowStartDatePicker(false);
                            setShowEndDatePicker(false);
                        }}
                    />
                    </>
                ) : (title === 'Duration' || title === 'Profit') ? (
                    <Text style={styles.propertyValue}>
                        {value}
                    </Text>
                ) : (title === 'Buy-In') ? (
                    <TextInput
                        style={styles.propertyValue}
                        defaultValue={score.buyInAmount.toString()}
                        value={value}
                        onChangeText={onChangeText}
                        textAlign="right"
                    />
                ) : (title === 'Balance') ? (
                    <TextInput
                        style={styles.propertyValue}
                        defaultValue={score.remainingBalance.toString()}
                        value={value}
                        onChangeText={onChangeText}
                        textAlign="right"
                    />
                ): (
                    <TextInput
                        style={styles.propertyValue}
                        value={value}
                        onChangeText={onChangeText}
                        textAlign="right"
                    />
                )}  
                <View style={styles.separator} />     
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderPropertyRow('Start Date', new Date(score.startDate).toISOString(), () => {})}
            {renderPropertyRow('End Date', new Date(score.endDate).toISOString(), () => {})}
            {renderPropertyRow('Duration', `${roundedDuration} hours`, () => {})}
            {renderPropertyRow('Location', score.location, (text) => setScore({ ...score, location: text }))}
            {renderPropertyRow('Player Count', score.playerCount, (text) => setScore({ ...score, playerCount: text }))}
            {renderPropertyRow('Blind Level', score.betUnit, (text) => setScore({ ...score, betUnit: text }))}
            {renderPropertyRow('Buy-In', score.buyInAmount, (text) => setScore({ ...score, buyInAmount: text }))}
            {renderPropertyRow('Balance', score.remainingBalance, (text) => setScore({ ...score, remainingBalance: text }))}
            {renderPropertyRow('Profit', `${score.remainingBalance - score.buyInAmount}`, () => {})}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        alignItems: 'center',
    },
    headerButton: {
        fontSize: 18,
        color: '#007AFF', // Set header button color
        marginRight: 16,
        marginLeft: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    propertyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        height:40
    },
    propertyTitle: {
        flex: 1,
        marginRight: 8,
        fontSize: 18,
        fontWeight: 'bold',
    },
    propertyValue: {
        flex: 2,
        height: 40,
        paddingHorizontal: 8,
        fontSize: 18,
        marginLeft: 8,
        backgroundColor: 'white', // Set value container background color to white
        textAlign: "right"
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 16,
        overflow: 'hidden',
    },
});

export default RecordScorePage;
