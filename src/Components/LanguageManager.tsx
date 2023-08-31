import React, { createContext, useContext, useState } from 'react';
import * as RNLocalize from "react-native-localize";

interface LanguageProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const LanguageContext = createContext<LanguageProps | undefined>(undefined);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

// Explicitly define the children prop here
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const locales = RNLocalize.getLocales();
  const systemLanguage = locales[0]?.languageCode; 
  const defaultLanguage = systemLanguage ? systemLanguage : 'en';
  const [language, setLanguage] = useState<string>(defaultLanguage);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
