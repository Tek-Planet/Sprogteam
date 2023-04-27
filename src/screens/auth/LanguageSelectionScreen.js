import React from 'react';
import {View, Text, Image} from 'react-native';

import {fonts} from '../../assets/fonts';
import Button from '../../components/Button';
import LanguageSelector from '../../components/LanguageSelector';

import {useTranslation} from 'react-i18next';
import {storeFirstLaunch} from '../../data/data';
import {colors} from '../../assets/colors';

const LanguageSelectorScreen = ({navigation}) => {
  const {t} = useTranslation();

  const goToSignIn = async () => {
    await storeFirstLaunch();
    navigation.navigate('SignIn');
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Image
        style={{
          height: 100,
          width: 100,
          margin: 20,
          marginTop: 40,
        }}
        source={require('../../assets/imgs/language.png')}
      />

      <View style={{marginTop: 30, padding: 10}}>
        <Text
          style={{
            marginStart: 10,
            fontFamily: fonts.bold,
            fontSize: 18,
            color: colors.black,
          }}>
          {t('common:preferred_language')}
        </Text>

        <View style={{marginBottom: 20, marginTop: 20}}>
          <LanguageSelector />
        </View>

        <Button
          onPress={() => {
            goToSignIn();
          }}
          bGcolor={'#659ED6'}
          buttonTitle={t('common:continue')}
        />
      </View>
    </View>
  );
};

export default LanguageSelectorScreen;
