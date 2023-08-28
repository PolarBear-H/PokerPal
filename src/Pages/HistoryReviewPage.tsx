import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';

import { format, getYear } from 'date-fns'; // Import the date-fns library for date formatting
import Score from '../Components/Score';
import { useScoreContext } from '../Components/ScoreManager';
import { Utils } from '../Components/Utils';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import CheckBox from '@react-native-community/checkbox';

const HistoryReviewPage: React.FC = () => {
    const navigation = useNavigation<any>();
    const { scoreHistory, setScoreHistory } = useScoreContext();
    
    const [yearTabs, setYearTabs] = useState<string[]>(['All']);
    const [monthTabs, setMonthTabs] = useState<string[]>(['All']);
    const [selectedYear, setSelectedYear] = useState<string>("All");
    const [selectedMonth, setSelectedMonth] = useState<string>("All");
    const [filteredScores, setFilteredScores] = useState<Score[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Score[]>([]);

    useEffect(() => {
        generateTabs();
        getFilteredScores();
    }, [scoreHistory]);

    useLayoutEffect(() => {
        if (editMode)  {
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity 
                        style={styles.headerButton} 
                        onPress={() => {
                            setEditMode(false);
                            setSelectedItems([]);
                        }}
                    >
                        <Text style={styles.editButton}>Cancel</Text>
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => {
                            if (selectedItems.length==0) {
                                setEditMode(false);
                                setSelectedItems([]);
                            } else {
                                handleDelete();
                            }
                        }} 
                    >
                        <Text style={styles.editButton}>{selectedItems.length==0 ? 'Done' : 'Delete'}</Text>
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity 
                        style={styles.headerButton} 
                        onPress={() => navigation.navigate("RecordScorePage")}
                    >
                        <Ionicons name="add" size={30} color="#007AFF" />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setEditMode(true)} 
                    >
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, editMode, selectedItems]);

    const getFilteredScores = () => {
        const newfilteredScores = scoreHistory.filter(score => {
            const scoreYear = new Date(score.startDate).getFullYear().toString();
            const scoreMonth = format(new Date(score.startDate), 'MMM');
    
            const yearMatch = selectedYear === 'All' || selectedYear === scoreYear;
            const monthMatch = selectedMonth === 'All' || selectedMonth === scoreMonth;
    
            return yearMatch && monthMatch;
        });

        setFilteredScores(newfilteredScores);
    }

    const generateTabs = () => {
        let newYearTabs = Array.from(new Set(scoreHistory.map((score) => getYear(new Date(score.startDate)).toString())));
        newYearTabs.unshift('All');
        setYearTabs(newYearTabs);

        let newMonthTabs = scoreHistory.filter(score => {
            const scoreYear = new Date(score.startDate).getFullYear().toString();
            const yearMatch = selectedYear === 'All' || selectedYear === scoreYear;
            return yearMatch;
        }).map((score) => format(new Date(score.startDate), 'MMM'));
        newMonthTabs = Array.from(new Set(newMonthTabs)).reverse();
        newMonthTabs.unshift('All');
        setMonthTabs(newMonthTabs);
    }
        
    const toggleSelection = (item: Score) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };    

    const handleDelete = (item?: Score) => {
        Alert.alert(
            'Delete Record',
            'Are you sure you want to delete the record(s)?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        let updatedScoreHistory;
                        if (editMode) {
                            updatedScoreHistory = scoreHistory.filter(score => !selectedItems.includes(score));
                            setSelectedItems([]);
                        } else {
                            updatedScoreHistory = scoreHistory.filter(score => score !== item);
                        }
                        setScoreHistory(updatedScoreHistory);
                        AsyncStorage.setItem('scoreHistory', JSON.stringify(updatedScoreHistory));
                    },
                },
            ]
        );
    };    

    const renderHiddenItem = (data: any) => (
        <View style={styles.rowBack}>
            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => handleDelete(data.item)}>
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
  
    const renderScoreItem = ({ item }: { item: Score }) => {
        const profitColor = parseFloat(item.chipsWon)>0 ? 'green' : parseFloat(item.chipsWon)==0 ? 'grey' : '#DD3E35';

        return (
            <View style={styles.itemContainer}>
                {editMode && (
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            style={styles.checkbox}
                            value={selectedItems.includes(item)}
                            onValueChange={() => toggleSelection(item)}
                        />
                    </View>
                )}
                <TouchableOpacity
                    style={styles.scoreItem}
                    disabled={editMode}
                    onPress={() => navigation.navigate('RecordScorePage', { item: item })}
                >
                    <View style={styles.infoContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{format(new Date(item.startDate), 'yyyy/MM/dd')}</Text>
                            <Text style={styles.weekdayText}>{Utils.getWeekday(new Date(item.startDate))}</Text>
                        </View>
                        <Text style={styles.infoText}>
                            Duration: {Utils.getFormettedDuration(item.duration)}
                        </Text>
                    </View>
                    <View style={styles.infoRightContainer}>
                        <Text style={[styles.profitText, { color: profitColor }]}>
                            ¥ {item.chipsWon.toFixed(2)}
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color="#C5C6CA" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };  

    // Render the year and month tabs
    const renderTabs = (tabs: string[], selectedTab: string, setSelectedTab: React.Dispatch<React.SetStateAction<string>>) => {
        return (
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, tab === selectedTab && styles.selectedTab]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, tab === selectedTab && styles.selectedTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.outTabContainer}>
                {renderTabs(yearTabs, selectedYear, setSelectedYear)}
                {renderTabs(monthTabs, selectedMonth, setSelectedMonth)}
            </View>
            <SwipeListView
                style={styles.flatListContainer} 
                data={filteredScores}
                keyExtractor={(item, index) => (item.startDate.toString()+item.chipsWon.toString()+index.toString())}
                renderItem={renderScoreItem}
                renderHiddenItem={renderHiddenItem}
                disableLeftSwipe={editMode}
                disableRightSwipe={true}
                //previewRowKey={'0'}
                //previewOpenValue={0}
                //previewOpenDelay={300}
                rightOpenValue={-75}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    scoreItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        marginLeft: 8,
        padding: 8,
        width: '97%',
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
        color: 'gray',
    },
    infoContainer: {
        alignItems: 'flex-start',
    },
    infoRightContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    infoText: {
        fontSize: 16,
        paddingTop: 8,
    },
    profitText: {
        fontSize: 20, // Increase font size for profit
        fontWeight: 'bold', // Add bold style to profit
        marginRight: 10, // Add margin to separate profit from chevron icon
    },
    headerButton: {
        fontSize: 18,
        color: '#007AFF', // Set header button color
        marginRight: 16,
        marginLeft: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    outTabContainer: {
        backgroundColor: 'white',
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    flatListContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
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
    editButton: {
        fontSize: 18,
        color: '#007AFF',
        marginRight: 8,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#DD3E35',
        right: 0,
    },
    backTextWhite: {
        color: '#ffffff',
    },
    checkboxContainer: {
        marginLeft: 8,
    },
    checkbox: {
        width: 25,
        height: 25,
    },
});

export default HistoryReviewPage;
