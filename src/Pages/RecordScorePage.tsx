import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, LogBox, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
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
import Localization from '../Components/Localization';
import { useCurrencyContext } from '../Components/CurrencyManager';

const RecordScorePage: React.FC = () => {
    LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);
    console.log('RecordScorePage: Utils.defaultBreakTime: ', Utils.defaultBreakTime);

    const navigation = useNavigation<any>();
    const { currency } = useCurrencyContext();
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const route = useRoute(); // Get the route object

    let scoreData: any;
    let isSetTemplate: any = false;
    if (route && route?.params) {
        scoreData = 'item' in route?.params ? route.params.item : {};
        isSetTemplate = 'setTemplate' in route?.params ? route.params.setTemplate : false;
    }

    const [score, setScore] = useState<Score>(scoreData ? scoreData : {
        startDate: new Date(), // Provide a default value
        endDate: new Date(),
        breakTime: Utils.defaultBreakTime,
        duration: 0,
        location: Utils.defaultLocation,
        playerCount: Utils.defaultPlayerCount,
        betUnit: Utils.defaultBlindLevel,
        buyInAmount: Utils.defaultBuyIn,
        remainingBalance: 0,
        chipsWon: 0 - Utils.defaultBuyIn,
    });
    
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const { scoreHistory, setScoreHistory } = useScoreContext(); // Use the context

    const playCountOptions = Array.from(Array(9).keys()).map((i) => `${i + 2}`);

    // Calculate the duration in hours
    const durationInHours = (new Date(score.endDate).getTime() - new Date(score.startDate).getTime()) / (1000 * 60 * 60) - score.breakTime;
    const durationFormatted = Utils.getFormettedDuration(durationInHours);
    const chipsWon = score.remainingBalance - score.buyInAmount;;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => {if (navigation.canGoBack()) navigation.goBack()}}>
                    <Text style={styles.headerButton}>{Localization.cancel}</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={() => {isSetTemplate? createTemplate() : scoreData ? handleEdit() : handleSave()}}>
                    <Text style={styles.headerButton}>{scoreData? Localization.edit : Localization.save}</Text>
                </TouchableOpacity>
            ),
            headerTitle: isSetTemplate ? Localization.createTemplate : scoreData ? Localization.sessionRecord : Localization.newRecord,
            headerTitleStyle: {fontSize: 20},
        });
    }, [navigation, score]);

    const handleEdit = async () => {
        Alert.alert(
            Localization.editTitle,
            Localization.editMessage,
            [
                {
                    text: Localization.cancel,
                    style: 'cancel',
                },
                {
                    text: Localization.yes,
                    style: 'default',
                    onPress: () => handleSave(),
                },
            ]
        );  
    }
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
                startDate: new Date(), // Provide a default value
                endDate: new Date(),
                breakTime: Utils.defaultBreakTime,
                duration: 0,
                location: Utils.defaultLocation,
                playerCount: Utils.defaultPlayerCount,
                betUnit: Utils.defaultBlindLevel,
                buyInAmount: Utils.defaultBuyIn,
                remainingBalance: 0,
                chipsWon: 0 - Utils.defaultBuyIn,
            });

            // Show a success message
            const message = scoreData ? Localization.sessionUpdateMessage : Localization.sessionAddMessage;
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

    const createTemplate = async () => {
        if(Utils.printLog) console.log('Create template');
        
        if (score.breakTime || score.breakTime == 0) {
            Utils.defaultBreakTime = score.breakTime;
            await AsyncStorage.setItem('defaultBreakTime', score.breakTime.toString());
        }

        if (score.betUnit) {
            Utils.defaultBlindLevel = score.betUnit;
            await AsyncStorage.setItem('defaultBlindLevel', score.betUnit);
        }

        if (score.location) {
            Utils.defaultLocation = score.location;
            await AsyncStorage.setItem('defaultLocation', score.location);
        } else {
            Utils.defaultLocation = '';
            await AsyncStorage.setItem('defaultLocation', Utils.defaultLocation);
        }

        if (score.playerCount) {
            Utils.defaultPlayerCount = score.playerCount;
            console.log('defaultPlayerCount: ', Utils.defaultPlayerCount);
            await AsyncStorage.setItem('defaultPlayerCount', score.playerCount.toString());
        }

        if (score.buyInAmount || score.buyInAmount == 0) {
            Utils.defaultBuyIn = score.buyInAmount;
            await AsyncStorage.setItem('defaultBuyIn', score.buyInAmount.toString());
        }

        if (navigation.canGoBack()) {
            navigation.goBack();
        } 
    };

    const cleanTemplate = async () => {
        Alert.alert(
            Localization.cleanTemplate,
            Localization.cleanTemplateMessage,
            [
                {
                    text: Localization.cancel,
                    style: 'cancel',
                },
                {
                    text: Localization.yes,
                    style: 'destructive',
                    onPress: async () => {
                        if(Utils.printLog) console.log('Clean template');

                        Utils.defaultBreakTime = 0;
                        Utils.defaultBlindLevel = '';
                        Utils.defaultLocation = '';
                        Utils.defaultPlayerCount = null;
                        Utils.defaultBuyIn = 0;

                        await AsyncStorage.setItem('defaultBreakTime', Utils.defaultBreakTime.toString());
                        await AsyncStorage.setItem('defaultBlindLevel', Utils.defaultBlindLevel);
                        await AsyncStorage.setItem('defaultLocation', Utils.defaultLocation);
                        await AsyncStorage.setItem('defaultPlayerCount', '');
                        await AsyncStorage.setItem('defaultBuyIn', Utils.defaultBuyIn.toString());

                        if (navigation.canGoBack()) navigation.goBack();
                    },
                },
            ]
        );
    }
    
    const renderPropertyRow = (title: string, value: any, onChangeText: (text: any) => void) => {
        const openDatePicker = () => {
            setShowTimePicker(false);
            if (title === Localization.startTime) {
                setShowStartDatePicker(true);
            } else if (title === Localization.endTime) {
                setShowEndDatePicker(true);
            }
        };

        const openTimePicker = () => {
            setShowTimePicker(true);
            if (title === Localization.startTime) {
                setShowStartDatePicker(true);
            } else if (title === Localization.endTime) {
                setShowEndDatePicker(true);
            }
        };

        return (
            <View>
                <View style={styles.propertyRow}>
                    <Text style={styles.propertyTitle}>{title}</Text>
                    <View style={styles.propertyRight}>
                    {(title === Localization.startTime || title === Localization.endTime) ? (
                        <>
                        <TouchableOpacity onPress={openDatePicker}>
                            <Text style={styles.propertyTimeValue}>{format(new Date(value), 'yyyy/MM/dd')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openTimePicker}>
                            <Text style={styles.propertyValue}>{format(new Date(value), 'HH:mm')}</Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={(title === Localization.startTime) ? showStartDatePicker : showEndDatePicker}
                            date={new Date(value)}
                            mode= {showTimePicker ? 'time' : 'date'}
                            theme="light"
                            textColor="black" // Set text color for DatePicker
                            onConfirm={(newDate) => {
                                setShowStartDatePicker(false);
                                setShowEndDatePicker(false);
                                if (title === Localization.startTime) {
                                    setScore({ ...score, startDate: newDate, endDate: newDate });
                                } else {
                                    setScore({ ...score, endDate: newDate });
                                }
                            }}
                            onCancel={() => {
                                setShowStartDatePicker(false);
                                setShowEndDatePicker(false);
                            }}
                            confirmText={Localization.confirm}
                            cancelText={Localization.cancel}
                            title={Localization.selectDate}
                        />
                        </>
                    ) : (title === Localization.duration || title === Localization.profit) ? (
                        <Text style={styles.propertyValue}>
                            {value.toString()}
                        </Text>
                    ) : (title === Localization.blindLevel) ? (
                        <SelectDropdown
                            data={Utils.convertBlindLevelListToStringList(Utils.blindLevelList, currency)}
                            defaultValue={value}
                            onSelect={(selectedItem: string) => onChangeText(selectedItem)}
                            defaultButtonText={Localization.selectBlindLevel}
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
                    ) : (title === Localization.playerCount) ? (
                        <SelectDropdown
                            data={playCountOptions}
                            defaultValue={value}
                            onSelect={(selectedItem: string) => onChangeText(selectedItem)}
                            defaultButtonText={Localization.selectPlayerCount}
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
                        <>
                        <TextInput
                            style={styles.propertyValue}
                            defaultValue={(typeof value === "number") ? value.toString() : value}
                            placeholder={(typeof value === "number") ? value.toString() : ''}
                            placeholderTextColor={'#ccc'}
                            clearTextOnFocus={(!value || value == 0) ? true : false}
                            onChangeText={onChangeText}
                            textAlign="right"
                        />
                        {title === Localization.breakTime ? <Text style={{fontSize:18}}> {Localization.hour}</Text> : null}
                        </>
                    )}  
                    </View>
                </View>
                <View style={styles.separator} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={'position'}
                keyboardVerticalOffset={50} // Adjust the value as needed
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {isSetTemplate ? (
                        <>
                        {renderPropertyRow(Localization.breakTime, score.breakTime, (text) => setScore({ ...score, breakTime: text != '' ? parseFloat(text) : 0}))}
                        {renderPropertyRow(Localization.blindLevel, score.betUnit, (text) => setScore({ ...score, betUnit: text }))}
                        {renderPropertyRow(Localization.location, score.location, (text) => setScore({ ...score, location: text }))}
                        {renderPropertyRow(Localization.playerCount, score.playerCount, (text) => setScore({ ...score, playerCount: parseInt(text)}))}
                        {renderPropertyRow(Localization.buyIn, score.buyInAmount, (text) => setScore({ ...score, buyInAmount: text != '' ? parseFloat(text) : 0}))}
                        <View style={{alignItems:'center', marginTop:35}}>
                            <TouchableOpacity style={styles.addButton} onPress={() => cleanTemplate()}>
                                <Text style={styles.addButtonLabel}>{Localization.cleanTemplate}</Text>
                            </TouchableOpacity>
                        </View>
                        </>
                    ) : (
                        <>
                        {renderPropertyRow(Localization.startTime, score.startDate, () => {})}
                        {renderPropertyRow(Localization.endTime, score.endDate, () => {})}
                        {renderPropertyRow(Localization.breakTime, score.breakTime, (text) => setScore({ ...score, breakTime: text != '' ? parseFloat(text) : 0}))}
                        {renderPropertyRow(Localization.duration, durationFormatted, () => {})}
                        {renderPropertyRow(Localization.blindLevel, score.betUnit, (text) => setScore({ ...score, betUnit: text }))}
                        {renderPropertyRow(Localization.location, score.location, (text) => setScore({ ...score, location: text }))}
                        {renderPropertyRow(Localization.playerCount, score.playerCount, (text) => setScore({ ...score, playerCount: parseInt(text)}))}
                        {renderPropertyRow(Localization.buyIn, score.buyInAmount, (text) => setScore({ ...score, buyInAmount: text != '' ? parseFloat(text) : 0}))}
                        {renderPropertyRow(Localization.cashOut, score.remainingBalance, (text) => setScore({ ...score, remainingBalance: text != '' ? parseFloat(text) : 0}))}
                        {renderPropertyRow(Localization.profit, `${score.remainingBalance - score.buyInAmount}`, () => {})}
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        margin: 8,
        borderRadius: 8,
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
    scrollContainer: {
        flexGrow: 1,
    },
    addButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
    },
    addButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default RecordScorePage;
