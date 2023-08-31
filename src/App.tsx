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
import FlashMessage from 'react-native-flash-message';
import { LanguageProvider, useLanguageContext } from './Components/LanguageManager';
import ImportDataPage from './Pages/Others/ImportDataPage';
import { CurrencyProvider, useCurrencyContext } from './Components/CurrencyManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Localization from './Components/Localization';

const RootStack = createStackNavigator();

const Main = () => {
  const { setScoreHistory } = useScoreContext();
  const {setLanguage} = useLanguageContext();
  const {setCurrency} = useCurrencyContext();

  useEffect(() => {
    Utils.fetchScoreHistory(setScoreHistory);
    getSavedPrefs();
  }, []);

  // Retrieve the saved preferences
  const getSavedPrefs = async () => {
    const currency = await AsyncStorage.getItem('currency');
    const language = await AsyncStorage.getItem('language');

    if (currency) {
      setCurrency(currency);
    }

    if (language) {
      Localization.setLanguage(language);
      setLanguage(language);
  }
}

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
        <RootStack.Screen 
          name="ImportDataPage" 
          component={ImportDataPage} 
          options={({ route, navigation }) => ({
            headerTitle: 'Import Data',
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
        <LanguageProvider>
          <CurrencyProvider>
            <ScoreProvider>
              <Main />
            </ScoreProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </SafeAreaProvider>
  );
};
