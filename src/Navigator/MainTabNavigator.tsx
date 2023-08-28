import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainPage from '../Pages/MainPage';
import HistoryReviewPage from '../Pages/HistoryReviewPage';
import StatisticsPage from '../Pages/StatisticsPage';
import SettingsPage from '../Pages/SettingsPage';
import { LogBox, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
    const navigation = useNavigation<any>();

    return (
        <Tab.Navigator
            initialRouteName="MainPage"
            screenOptions={({ route }) => ({
                headerStyle: {
                    backgroundColor: 'white',
                },
            })}
        >
            <Tab.Screen
                name="MainPage"
                component={MainPage}
                options={{ 
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="home" size={24} color={color} />
                    ),
                    title: 'PokerPal',
                    headerTitleStyle: {fontSize: 22},
                }}
            />
            <Tab.Screen
                name="HistoryReviewPage"
                component={HistoryReviewPage}
                options={{ 
                    tabBarLabel: 'History',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="history" size={24} color={color} />
                    ),
                    title: 'Session History',
                    headerTitleStyle: {fontSize: 22},
                }}
            />
            <Tab.Screen
                name="StatisticsPage"
                component={StatisticsPage}
                options={{ 
                    tabBarLabel: 'Analysis' ,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="chart-bar" size={24} color={color} />
                    ),
                    title: 'Session Analysis',
                    headerTitleStyle: {fontSize: 22},
                }}
            />
            <Tab.Screen
                name="SettingsPage"
                component={SettingsPage}
                options={{ 
                    tabBarLabel: 'Settings' ,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings" size={24} color={color} />
                    ),
                    title: 'Settings',
                    headerTitleStyle: {fontSize: 22},
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    headerButton: {
        fontSize: 18,
        color: '#007AFF', // Set header button color
        marginRight: 16,
        marginLeft: 16,
    },
});

export default MainTabNavigator;