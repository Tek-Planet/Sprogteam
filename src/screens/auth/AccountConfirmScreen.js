import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';
import TextBoxTitle from '../../components/TextBoxTitle';
import Button from '../../components/Button';
import {fonts} from '../../assets/fonts';
import {useTranslation} from 'react-i18next';
import {active} from '../../assets/icons';

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
      <Image
        source={active}
        style={{
          width: 250,
          height: 100,
          resizeMode: 'contain',
          marginBottom: 30,
        }}
      />
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
      {/* <Text
        style={{
          color: 'red',
          textAlign: 'center',
          fontSize: 15,
          margin: 20,
          fontFamily: fonts.medium,
        }}>
       
        {t('common:evaluate_text')}
      </Text> */}

      {/* <Text
        style={{
          color: '#000',
          textAlign: 'center',
          fontSize: 15,
          margin: 20,
          fontFamily: fonts.medium,
        }}>
        {t('common:add_language_text')}
      </Text> */}

      <View style={{marginTop: 30, width: '60%'}}>
        <Button
          onPress={() => navigation.replace('SignIn')}
          bGcolor={'#659ED6'}
          buttonTitle={t('common:log_in')}
        />
      </View>
    </View>
  );
};

export default AccountConfirmScreen;
