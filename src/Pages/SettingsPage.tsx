import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { openComposer } from 'react-native-email-link';

const TAG: string = '[SettingsPage]: ';
const screenWidth = Dimensions.get("window").width;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const {language, setLanguage} = useLanguageContext();
  const {currency, setCurrency} = useCurrencyContext();

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
    '$ - USD',
    '¥ - CNY',
    '€ - EUR',
    '£ - GBP'
  ];

  const currencyOptionsMapping: { [key: string]: string } = {
    ['$']: '$ - USD',
    ['¥']: '¥ - CNY',
    ['€']: '€ - EUR',
    ['£']: '£ - GBP'
  };

  const styleOptions = [
    Localization.style1,
    Localization.style2
  ]

  const handleExportDataHelper = async () => {
    Alert.alert(
      Localization.exportTitle,
      Localization.exportMessage,
      [
          {
              text: Localization.cancel,
              style: 'cancel',
          },
          {
              text: Localization.yes,
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
        Localization.dataExportSuccess,
        Localization.dataExportSuccessMessage,
        [
            {
                text: Localization.ok,
                style: 'cancel',
            },
        ]
      );

      showMessage({
        message: Localization.dataExportSuccess,
        type: 'success',
        floating: true,
      });
    } else {
      showMessage({
        message: Localization.dataExportFail,
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

  const handleStylesChange = async (value: string) => {
    let styleCode = 1;

    if (value == Localization.style1) { 
      styleCode = 1;
    } else if (value == Localization.style2) {
      styleCode = 2;
    }

    if (Utils.printLog) console.log(TAG, 'Styles code is: ' + styleCode);
    Utils.style = styleCode;
    await AsyncStorage.setItem('styleCode', styleCode.toString());
  };

  /**
    * Send email to report an issue
    */
  const ReportIssueViaEmail = () => {
    if (Utils.printLog) console.log('Send email to TorusPhoneAppAdmin@microsoft.com to report an issue.');

    openComposer({
      to: `TorusPhoneAppAdmin@microsoft.com`,
      subject: `Report a Torus Phone App V2 Issue`,
    });
}
  
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
                  onSelect={(selectedItem: string) => handleLanguageChange(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                      return item;
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <View style={{alignItems:'center', flexDirection:'row'}}>
                        <Icon name="language-outline" size={24} style={{marginRight:4}}/>
                        <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#CCC'} size={18} />
                      </View>
                    );                  
                  }}
                  defaultValue={languageNameMapping[language]}
                  defaultButtonText={Localization.selectLanguage}
                  //dropdownIconPosition={'right'}
                  buttonStyle={styles.dropdownBtnStyle}
                  buttonTextStyle={styles.dropdownBtnTxtStyle}
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
                defaultButtonText={Localization.selectCurrency}
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                dropdownStyle={styles.dropdownDropdownStyle}
                rowStyle={styles.dropdownRowStyle}
                rowTextStyle={styles.dropdownRowTxtStyle}
              />
            </View >

            {/* 导出及导入数据 */}
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{Localization.data}</Text>
              <TouchableOpacity style={styles.settingItem} onPress={handleExportDataHelper}>
                  <Text style={styles.settingItemText}>{Localization.exportData}</Text>
                  <Icon name="cloud-upload-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ImportDataPage')}>
                  <Text style={styles.settingItemText}>{Localization.importData}</Text>
                  <Icon name="cloud-download-outline" size={24} />
              </TouchableOpacity>
            </View >

            {/* 设置默认值 */}
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{Localization.customize}</Text>
              <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('RecordScorePage', {item: null, setTemplate: true})}>
                  <Text style={styles.settingItemText}>{Localization.createTemplate}</Text>
                  <Icon name="settings-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ManageBlindPage')}>
                  <Text style={styles.settingItemText}>{Localization.manageBlindLevel}</Text>
                  <FontAwesome5 name="coins" size={24}/>
              </TouchableOpacity>
              <SelectDropdown
                data={styleOptions}
                onSelect={handleStylesChange}
                buttonTextAfterSelection={(selectedItem: string) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item: string) => {
                    return item;
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <View style={{alignItems:'center', flexDirection:'row'}}>
                      <Icon name="color-wand-outline" size={24} />
                      <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#CCC'} size={18} />
                    </View>
                  );                  
                }}
                defaultValue={styleOptions[Utils.style - 1]}
                defaultButtonText={Localization.selectChartStyle}
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                dropdownStyle={styles.dropdownDropdownStyle}
                rowStyle={styles.dropdownRowStyle}
                rowTextStyle={styles.dropdownRowTxtStyle}
              />
            </View >
 
            {/* 关于软件 */}
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{Localization.about}</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('AboutPage')}>
                <Text style={styles.settingItemText}>{Localization.about}</Text>
                <Icon name="information-circle-outline" size={24} />
            </TouchableOpacity>

            {/* 建议反馈 
            <TouchableOpacity style={styles.settingItem} onPress={() => ReportIssueViaEmail()}>
                <Text>Feedback</Text>
                <Icon name="chatbox-outline" size={24} />
            </TouchableOpacity>
            */}
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
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
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
      marginBottom: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    dropdownBtnTxtStyle: {
      color: 'black', 
      textAlign: 'left',
      fontSize: 16,
    },
    dropdownDropdownStyle: {
      flex: 1,
      backgroundColor: '#EFEFEF',
      borderRadius: 4,
      width: '50%',
      marginLeft: '30%',
      alignSelf: 'flex-end'
    },
    dropdownRowStyle: {
      backgroundColor: '#EFEFEF', 
      borderBottomColor: '#C5C5C5',
      borderRadius: 4,
    },
    dropdownRowTxtStyle: {
      color: 'black', 
      textAlign: 'left'
    },
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
    settingItemText: {
      fontSize: 16,
      paddingLeft: 8,
    }
});

export default SettingsScreen;
