import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import CustomDropDown from '../components/CustomDropDown';
import {useTranslation} from 'react-i18next';
import {fonts} from '../assets/fonts';
import {getStoredLanguage, storeLanguage} from '../util/util';

const LANGUAGES = [
  {code: 'dk', label: 'Dansk'},
  {code: 'en', label: 'English'},
  {code: 'fr', label: 'Français'},
  {code: 'de', label: 'German'},
  {code: 'es', label: 'Spanish'},
];

const Selector = () => {
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  // console.log(selectedLanguageCode);

  const setLanguage = async item => {
    setValue(item);
    await storeLanguage(item);
    return i18n.changeLanguage(item.code);
  };

  const getStoredLanguageFromStorage = async () => {
    const language = await getStoredLanguage();
    setValue(language);
  };

  useEffect(() => {
    getStoredLanguageFromStorage();
  }, []);

  const [value, setValue] = useState(i18n.language);

  // console.log(i18n);

  return (
    <View style={styles.container}>
      <CustomDropDown
        setValue={setLanguage}
        value={value}
        language={LANGUAGES}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  titleSmall: {
    margin: 10,
    fontSize: 14,
    color: 'grey',
    fontFamily: fonts.bold,
  },
});

export default Selector;
