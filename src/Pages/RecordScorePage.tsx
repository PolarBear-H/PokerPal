import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { showMessage } from 'react-native-flash-message';
import SelectDropdown from 'react-native-select-dropdown';

import Score from '../Components/Score';
import { format } from 'date-fns';
import { useScoreContext } from '../Components/ScoreManager';
import { Utils } from '../Components/Utils';


const RecordScorePage: React.FC = () => {
    LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

    const navigation = useNavigation<any>();
    const route = useRoute(); // Get the route object

    let scoreData: any;
    if (route && route?.params) {
        scoreData = 'item' in route?.params ? route.params.item : {};
    }

    const [score, setScore] = useState<Score>({
        startDate: scoreData?.startDate || new Date(), // Provide a default value
        endDate: scoreData?.endDate || new Date(),
        breakTime: scoreData?.breakTime || 0,
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
    const [showTimePicker, setShowTimePicker] = useState(false);
    const { scoreHistory, setScoreHistory } = useScoreContext(); // Use the context

    const blindLever = ["1/1", "1/2", "3/5", "5/10", "10/20", "25/50", "50/100", "100/200"]

    // Calculate the duration in hours
    const durationInHours = (new Date(score.endDate).getTime() - new Date(score.startDate).getTime()) / (1000 * 60 * 60) - score.breakTime;
    const durationFormatted = Utils.getFormettedDuration(durationInHours);
    const chipsWon = score.remainingBalance - score.buyInAmount;;
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => {if (navigation.canGoBack()) navigation.goBack()}}>
                    <Text style={styles.headerButton}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.headerButton}>Save</Text>
                </TouchableOpacity>
            ),
            headerTitle: scoreData ? 'Session Record' :'New Record',
            headerTitleStyle: {fontSize: 22},
        });
    }, [navigation, score]);

    const handleSave = async () => {
        try {
            // Update the score history array with the new record
            const newScore = { ...score };
            newScore.duration = durationInHours;
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
                breakTime: 0,
                location: '',
                playerCount: '',
                betUnit: '',
                buyInAmount: 0,
                remainingBalance: 0,
                chipsWon: 0,
                duration: 0,
            });

            // Show a success message
            const message = scoreData ? 'Session record is updated successfully.' : 'Session record is added successfully.';
            showMessage({
                message: message,
                type: "success",
                floating: true,
            });

            if (navigation.canGoBack()) {
                navigation.goBack();
            } 
            
        } catch (error) {
            // Handle any errors that occur during the save process
            // You can show an error message to the user
            // Alert.alert('Error', 'Failed to save game score');
        }
    };    
    
    const renderPropertyRow = (title: string, value: string, onChangeText: (text: any) => void) => {
        const openDatePicker = () => {
            setShowTimePicker(false);
            if (title === 'Start Time') {
                setShowStartDatePicker(true);
            } else if (title === 'End Time') {
                setShowEndDatePicker(true);
            }
        };

        const openTimePicker = () => {
            setShowTimePicker(true);
            if (title === 'Start Time') {
                setShowStartDatePicker(true);
            } else if (title === 'End Time') {
                setShowEndDatePicker(true);
            }
        };

        return (
            <View>
                <View style={styles.propertyRow}>
                    <Text style={styles.propertyTitle}>{title}</Text>
                    <View style={styles.propertyRight}>
                    {(title === 'Start Time' || title === 'End Time') ? (
                        <>
                        <TouchableOpacity onPress={openDatePicker}>
                            <Text style={styles.propertyTimeValue}>{format(new Date(value), 'yyyy/MM/dd')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openTimePicker}>
                            <Text style={styles.propertyValue}>{format(new Date(value), 'HH:mm')}</Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={(title === 'Start Time') ? showStartDatePicker : showEndDatePicker}
                            date={new Date(value)}
                            mode= {showTimePicker ? 'time' : 'date'}
                            theme="light"
                            textColor="black" // Set text color for DatePicker
                            onConfirm={(newDate) => {
                                setShowStartDatePicker(false);
                                setShowEndDatePicker(false);
                                if (title === 'Start Time') {
                                    setScore({ ...score, startDate: newDate, endDate: newDate });
                                } else {
                                    setScore({ ...score, endDate: newDate });
                                }
                            }}
                            onCancel={() => {
                                setShowStartDatePicker(false);
                                setShowEndDatePicker(false);
                            }}
                        />
                        </>
                    ) : (title === 'Duration' || title === 'Profit') ? (
                        <Text style={styles.propertyValue}>
                            {value.toString()}
                        </Text>
                    ) : (title === 'Break Time') ? (
                        <>
                        <TextInput
                            style={styles.propertyValue}
                            placeholder='0'
                            placeholderTextColor={'#ccc'}
                            onChangeText={onChangeText}
                            textAlign="right"
                        />
                        <Text style={{fontSize:18}}> hours</Text>
                        </>
                    ) : (title === 'Blind Level') ? (
                        <SelectDropdown
                            data={blindLever}
                            defaultValue={value}
                            onSelect={(selectedItem: string) => onChangeText(selectedItem)}
                            defaultButtonText={'Select Blind'}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            buttonStyle={styles.dropdownBtnStyle}
                            buttonTextStyle={styles.dropdownBtnTxtStyle}
                            renderDropdownIcon={isOpened => {
                                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#CCC'} size={18} />;
                            }}
                            dropdownIconPosition={'right'}
                            dropdownStyle={styles.dropdownDropdownStyle}
                            rowStyle={styles.dropdownRowStyle}
                            rowTextStyle={styles.dropdownRowTxtStyle}
                        />
                    ) : (
                        <TextInput
                            style={styles.propertyValue}
                            placeholder={value.toString()}
                            placeholderTextColor={'#ccc'}
                            onChangeText={onChangeText}
                            textAlign="right"
                        />
                    )}  
                    </View>
                </View>
                <View style={styles.separator} />
            </View>
        );
    };

    return (
            <View style={styles.container}>
                {renderPropertyRow('Start Time', new Date(score.startDate).toISOString(), () => {})}
                {renderPropertyRow('End Time', new Date(score.endDate).toISOString(), () => {})}
                {renderPropertyRow('Break Time', score.breakTime, (text) => setScore({ ...score, breakTime: text }))}
                {renderPropertyRow('Duration', durationFormatted, () => {})}
                {renderPropertyRow('Buy-In', score.buyInAmount, (text) => setScore({ ...score, buyInAmount: text }))}
                {renderPropertyRow('Cash-Out', score.remainingBalance, (text) => setScore({ ...score, remainingBalance: text }))}
                {renderPropertyRow('Profit', `${score.remainingBalance - score.buyInAmount}`, () => {})}
                {renderPropertyRow('Blind Level', score.betUnit, (text) => setScore({ ...score, betUnit: text }))}
                {renderPropertyRow('Location', score.location, (text) => setScore({ ...score, location: text }))}
                {renderPropertyRow('Player Count', score.playerCount, (text) => setScore({ ...score, playerCount: text }))}
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
        alignItems: 'center',
        marginBottom: 12,
        height:40
    },
    propertyRight: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
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
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding:8,
        fontSize: 18,
        marginLeft: 8,
        backgroundColor: 'white', // Set value container background color to white
        textAlign: "right",
    },
    propertyTimeValue: {
        width: '115%',
        flex: 2,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding:8,
        fontSize: 18,
        marginLeft: 8,
        backgroundColor: 'white', // Set value container background color to white
        textAlign: "right",
    },
    separator: {
        height: 1,
        marginBottom: 14,
        backgroundColor: '#ccc',
        overflow: 'hidden',
    },
    dropdownBtnStyle: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dropdownBtnTxtStyle: {color: 'black', textAlign: 'right'},
    dropdownDropdownStyle: {
        backgroundColor: '#EFEFEF',
        borderRadius: 4,
    },
    dropdownRowStyle: {
        backgroundColor: '#EFEFEF', 
        borderBottomColor: '#C5C5C5',
        borderRadius: 4,
    },
    dropdownRowTxtStyle: {color: 'black', textAlign: 'left'},
});

export default RecordScorePage;
