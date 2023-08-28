import React, { useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RecordScorePage from './Pages/RecordScorePage';
import MainTabNavigator from './Navigator/MainTabNavigator';
import { Image, LogBox, TouchableHighlight, View } from 'react-native';
import { ScoreProvider, useScoreContext } from './Components/ScoreManager';
import { Utils } from './Components/Utils';
import DiceRollScreen from './Pages/DiceRollScreen';
import PreflopWinRateCalculator from './Components/PreflopWinRateCalculator';
import FlashMessage from 'react-native-flash-message';

const RootStack = createStackNavigator();

const Main = () => {
  const { setScoreHistory } = useScoreContext();

  useEffect(() => {
    Utils.fetchScoreHistory(setScoreHistory);
  }, []);

  return (
    <>
    <NavigationContainer>
      <RootStack.Navigator
          initialRouteName="MainTabNavigator"
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: '#F2F2F2',
            },
          })}
      >
        <RootStack.Screen 
          name="MainTabNavigator" 
          component={MainTabNavigator} 
          options={{ 
            headerShown: false,
          }} 
          
        />
        <RootStack.Screen 
          name="RecordScorePage" 
          component={RecordScorePage} 
          options={({ route, navigation }) => ({
            headerTitle: 'Record Score',
         })} 
        />
      </RootStack.Navigator>
    </NavigationContainer>
    <FlashMessage position="top" statusBarHeight={64} />
    </>
  );
}

export default function App() {
  return (
      <SafeAreaProvider>
        <ScoreProvider>
          <Main />
        </ScoreProvider>
      </SafeAreaProvider>
  );
};
