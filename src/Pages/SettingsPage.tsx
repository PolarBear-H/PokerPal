import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, Button } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { showMessage } from 'react-native-flash-message';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/Ionicons'; // 用于图标
import Localization from '../Components/Localization';
import { useLanguageContext } from '../Components/LanguageManager';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScoreContext } from '../Components/ScoreManager';
import { useNavigation } from '@react-navigation/native';
import { Utils } from '../Components/Utils';
import { useCurrencyContext } from '../Components/CurrencyManager';

const TAG: string = '[SettingsPage]: ';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const { scoreHistory, setScoreHistory } = useScoreContext();
  const {language, setLanguage} = useLanguageContext();
  const {currency, setCurrency} = useCurrencyContext();

  const [defaultBlind, setDefaultBlind] = useState('');
  const [defaultLocation, setDefaultLocation] = useState('');

  const languageOptions = [
    'English',
    '中文',
  ];

  const languageOptionsMapping: { [key: string]: string } =  {
    ['English']: 'en',
    ['中文']: 'zh'
  };

  const languageNameMapping: { [key: string]: string } =  {
    ['en']: 'English',
    ['zh']: '中文'
  };

  const currencyOptions = [
    '¥ - CNY',
    '$ - USD',
    '€ - EUR',
    '£ - GBP'
  ];

  const currencyOptionsMapping: { [key: string]: string } = {
    ['¥']: '¥ - CNY',
    ['$']: '$ - USD',
    ['€']: '€ - EUR',
    ['£']: '£ - GBP'
  };

  const handleExportDataHelper = async () => {
    Alert.alert(
      'Are you sure you want to export the data?',
      'Please note that all your records data will be exported to the clipboard.',
      [
          {
              text: Localization.cancel,
              style: 'cancel',
          },
          {
              text: "Yes",
              style: 'default',
              onPress: () => {handleExportData()},    
          },
      ]
    );
  };
  
  const handleExportData = async () => {
    const scoreHistory = await AsyncStorage.getItem('scoreHistory');
    if (scoreHistory) {
      Clipboard.setString(scoreHistory);

      Alert.alert(
        'Data exported successfully',
            'Data has copied to clipboard.',
            [
                {
                    text: 'Ok',
                    style: 'cancel',
                },
            ]
      );

      showMessage({
        message: 'Data exported successfully',
        type: 'success',
        floating: true,
      });
    } else {
      showMessage({
        message: 'No data to export',
        type: 'danger',
        floating: true,
      });
    }
  };

  const handleLanguageChange = async (value:any) => {
    const languageValue = languageOptionsMapping[value];
    if (Utils.printLog) console.log(TAG, 'Language is: ' + languageValue);
    Localization.setLanguage(languageValue); // 切换语言
    setLanguage(languageValue);
    await AsyncStorage.setItem('language', languageValue);
  };

  const handleCurrencyChange = async (value: string) => {
    value = value.split(' ')[0];
    if (Utils.printLog) console.log(TAG, 'Currency is: ' + value);
    setCurrency(value);
    await AsyncStorage.setItem('currency', value);
  };

  const handleDefaultBlindChange = (value:any) => {
    setDefaultBlind(value);
    // 实现更新默认盲注设置的逻辑
  };

  const handleDefaultLocationChange = (value:any) => {
    setDefaultLocation(value);
    // 实现更新默认地点设置的逻辑
  };
  
    return (
        <View style={styles.container}>
            {/* 语言选择 */}
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{Localization.language}</Text>
              <SelectDropdown
                  data={languageOptions}
                  defaultValue={languageNameMapping[language]}
                  onSelect={(selectedItem: string) => handleLanguageChange(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                      return item;
                  }}
                  buttonStyle={styles.dropdownBtnStyle}
                  buttonTextStyle={styles.dropdownBtnTxtStyle}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <View style={{alignItems:'center', flexDirection:'row'}}>
                        <Icon name="language-outline" size={24} style={{marginRight:4}}/>
                        <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#CCC'} size={18} />
                      </View>
                    );                  
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdownDropdownStyle}
                  rowStyle={styles.dropdownRowStyle}
                  rowTextStyle={styles.dropdownRowTxtStyle}
              />
            </View >

            {/* 设置货币 */}
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{Localization.currency}</Text>
              <SelectDropdown
                data={currencyOptions}
                onSelect={handleCurrencyChange}
                buttonTextAfterSelection={(selectedItem: string) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item: string) => {
                    return item;
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <View style={{alignItems:'center', flexDirection:'row'}}>
                      <Icon name="cash-outline" size={24} style={{marginRight:4}} />
                      <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#CCC'} size={18} />
                    </View>
                  );                  
                }}
                defaultValue={currencyOptionsMapping[currency]}
                defaultButtonText="Select Currency"
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                rowStyle={styles.dropdownRowStyle}
              />
            </View >

            {/* 导出及导入数据 */}
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{Localization.data}</Text>
              <TouchableOpacity style={styles.settingItem} onPress={handleExportDataHelper}>
                  <Text>{Localization.exportData}</Text>
                  <Icon name="cloud-upload-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ImportDataPage')}>
                  <Text>{Localization.importData}</Text>
                  <Icon name="cloud-download-outline" size={24} />
              </TouchableOpacity>
            </View >

            {/* 设置默认值 */}
            <View style={styles.itemContainer}>
              <Text style={styles.title}>Default Values</Text>
            <TouchableOpacity style={styles.settingItem}>
                <Text>Default Values</Text>
                <Icon name="settings-outline" size={24} />
            </TouchableOpacity>
            </View >
 
            {/* 关于软件 */}
            <View style={styles.itemContainer}>
              <Text style={styles.title}>About</Text>
            <TouchableOpacity style={styles.settingItem}>
                <Text>About</Text>
                <Icon name="information-circle-outline" size={24} />
            </TouchableOpacity>

            {/* 建议反馈 */}
            <TouchableOpacity style={styles.settingItem}>
                <Text>Feedback</Text>
                <Icon name="chatbox-outline" size={24} />
            </TouchableOpacity>
            </View >
            </ScrollView>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 8,
      borderRadius: 8,
      backgroundColor: 'white',
    },
    itemContainer: {
      marginLeft: 16,
      marginRight: 16,
      paddingTop: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
    },
    languageOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    languageText: {
      fontSize: 18,
    },
    dropdownBtnStyle: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
      marginBottom: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
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
    seperator: {
      height: 1,
      backgroundColor: '#E1E1E1',
      marginHorizontal: 8,
    },
    customCurrencyInput: {
      flex: 1,
      marginTop: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
  },
});

export default SettingsScreen;
