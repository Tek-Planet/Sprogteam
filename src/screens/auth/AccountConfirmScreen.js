import React, {Component} from 'react';
import {View, Text} from 'react-native';
import TextBoxTitle from '../../components/TextBoxTitle';
import Button from '../../components/Button';
import {fonts} from '../../assets/fonts';
import {useTranslation} from 'react-i18next';

const AccountConfirmScreen = ({navigation, route}) => {
  const {t} = useTranslation();

  const {email} = route.params;
  return (
    <View
      style={{
        alignItems: 'center',
        paddingTop: 30,
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Text
        style={{
          color: 'green',
          textAlign: 'center',
          fontSize: 18,
          margin: 10,
          fontFamily: fonts.medium,
        }}>
        {/* Velkommen til Sprogteam */}
        {t('common:welcome_text')}
      </Text>
      <TextBoxTitle title={t('common:account_text')} showAsh={true} />
      <Text
        style={{
          color: 'red',
          textAlign: 'center',
          fontSize: 15,
          margin: 20,
          fontFamily: fonts.medium,
        }}>
        {/* Vi vil først evaluere din konto, før den kan bruges */}
        {t('common:evaluate_text')}
      </Text>

      <Text
        style={{
          color: '#000',
          textAlign: 'center',
          fontSize: 15,
          margin: 20,
          fontFamily: fonts.medium,
        }}>
        {/* Tilføj det sprog, du mestrer 100 %, ved at klikke på knappen nedenfor */}
        {t('common:add_language_text')}
      </Text>

      <Button
        onPress={() => navigation.replace('AddLanguage', {email: email})}
        bGcolor={'#659ED6'}
        buttonTitle={t('common:add') + ' ' + t('common:language')}
      />
    </View>
  );
};

export default AccountConfirmScreen;
