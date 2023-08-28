import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LineChart } from 'react-native-chart-kit';
import TotalStatsScreen from './Analysis/TotalStatesScreen';
import MonthlyStatsScreen from './Analysis/MonthlyStatsScreen';
import WeeklyStatsScreen from './Analysis/WeeklyStatsScreen';
import ChartStatsScreen from './Analysis/ChartStatsScreen';

const Tab = createMaterialTopTabNavigator();
  
const StatsTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 14 }, // Adjust the label font size
                tabBarStyle: { borderRadius: 8, marginBottom: 4}, // Adjust the tab bar background color
            }}
        >
            <Tab.Screen name="Total" component={TotalStatsScreen} />
            <Tab.Screen 
                name="Month" 
                component={MonthlyStatsScreen} 
                />
            <Tab.Screen name="Week" component={WeeklyStatsScreen} />
            <Tab.Screen name="Charts" component={ChartStatsScreen} />
        </Tab.Navigator>
    );
};

const StatisticsPage: React.FC = () => {
    return (
        <View style={styles.container}>
            <StatsTabNavigator />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
    },
    heading: {
        fontSize: 20,
        marginBottom: 16,
    },
    statsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    tabLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StatisticsPage;
