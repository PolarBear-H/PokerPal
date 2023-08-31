import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message'; // 用于显示提示信息
import Localization from '../Components/Localization';
import { useLanguageContext } from '../Components/LanguageManager';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SettingsPage = () => {
  const {language, setLanguage} = useLanguageContext();

  const [exportData, setExportData] = useState(false);
  const [importData, setImportData] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [defaultBlind, setDefaultBlind] = useState('');
  const [defaultLocation, setDefaultLocation] = useState('');

  const languageMapping =  {
    [Localization.english]: 'en',
    [Localization.chinese]: 'zh'
  };

  const handleLanguageChange = (value:any) => {
    //const languageValue = languageMapping[value];
    Localization.setLanguage(value); // 切换语言
    setLanguage(value);
  };
  
  const handleExportData = () => {
    // 实现导出数据的逻辑
    showMessage({
      message: 'Data exported successfully',
      type: 'success',
      floating: true,
    });
  };

  const handleImportData = () => {
    // 实现导入数据的逻辑
    showMessage({
      message: 'Data imported successfully',
      type: 'success',
      floating: true,
    });
  };

  const handleCurrencyChange = (selectedCurrency: any) => {
    setCurrency(selectedCurrency);
    // 实现更新货币设置的逻辑
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
      <Text style={styles.sectionTitle}>{Localization.language}</Text>
      <View style={styles.sectionContent}>
      <SelectDropdown
        data={['en', 'zh']}
        defaultValue={language}
        onSelect={(selectedItem: string) => handleLanguageChange(selectedItem)}
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
      </View>

      {/* 其他设置项类似，使用相应的组件和逻辑 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    marginBottom: 24,
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
  // 其他样式...
});

export default SettingsPage;
