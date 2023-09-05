import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainPage from '../Pages/MainPage';
import HistoryReviewPage from '../Pages/HistoryReviewPage';
import StatisticsPage from '../Pages/StatisticsPage';
import SettingsPage from '../Pages/SettingsPage';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Localization from '../Components/Localization';

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
                    tabBarLabel: Localization.home,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="home" size={24} color={color} />
                    ),
                    title: Localization.pokerPal,
                    headerTitleStyle: {fontSize: 22},
                }}
            />
            <Tab.Screen
                name="HistoryReviewPage"
                component={HistoryReviewPage}
                options={{ 
                    tabBarLabel: Localization.history,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="history" size={24} color={color} />
                    ),
                    title: Localization.sessionHistory,
                    headerTitleStyle: {fontSize: 22},
                }}
            />
            <Tab.Screen
                name="StatisticsPage"
                component={StatisticsPage}
                options={{ 
                    tabBarLabel: Localization.analysis,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="chart-bar" size={24} color={color} />
                    ),
                    title: Localization.sessionAnalysis,
                    headerTitleStyle: {fontSize: 22},
                }}
            />
            <Tab.Screen
                name="SettingsPage"
                component={SettingsPage}
                options={{ 
                    tabBarLabel: Localization.settings,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings" size={24} color={color} />
                    ),
                    title: Localization.settings,
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