import LocalizedStrings from 'react-native-localization';

const translations = {
  en: require('../Translations/en.json'),
  zh: require('../Translations/zh.json')
};

const Localization = new LocalizedStrings(translations);

export default Localization;
