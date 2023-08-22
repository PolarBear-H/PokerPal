import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MainPage from '../Pages/MainPage';
import HistoryReviewPage from '../Pages/HistoryReviewPage';
import StatisticsPage from '../Pages/StatisticsPage';
import SettingsPage from '../Pages/SettingsPage';
import { LogBox, Text } from 'react-native';


const Tab = createBottomTabNavigator();

export default class MainTabNavigator extends Component {
    render() {
        LogBox.ignoreLogs(['Sending...']);
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
                    }}
                />
                <Tab.Screen
                    name="StatisticsPage"
                    component={StatisticsPage}
                    options={{ 
                        tabBarLabel: 'Statistics' ,
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="chart-bar" size={24} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="SettingsPage"
                    component={SettingsPage}
                    options={{ 
                        tabBarLabel: "Settings",
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="tools" size={24} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}
