import React, {useState, useEffect} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

import TitleHeader from '../../components/TitleHeader';
import Button from '../../components/Button';
import ErrorMsg from '../../components/ErrorMsg';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {CustomCheckBox} from '../../components';

const AccountSelectorScreen = ({navigation}) => {
  const {t} = useTranslation();

  const [checkCustomer, setCheckedCustomer] = useState(false);
  const [checkTranslator, setCheckedTranslator] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (checkCustomer) setCheckedTranslator(false);
  }, [checkCustomer]);

  useEffect(() => {
    if (checkTranslator) setCheckedCustomer(false);
  }, [checkTranslator]);

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
        }}>
        <AntDesign
          name={'back'}
          size={26}
          color={'#000'}
          style={{padding: 5}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('LanguageSelector')}
        style={{
          position: 'absolute',
          right: 20,
          top: 20,
        }}>
        <Image
          style={{
            height: 30,
            width: 30,
          }}
          source={require('../../assets/imgs/language.png')}
        />
      </TouchableOpacity>
      <Image
        resizeMode="contain"
        style={{
          height: 80,
          width: 80,
          marginTop: 20,
          borderRadius: 150,
        }}
        source={require('../../assets/imgs/logo.png')}
      />

      <View
        style={{
          marginStart: 8,
          marginEnd: 8,
          marginTop: 30,
          backgroundColor: '#fff',
          width: '90%',
          padding: 20,
          borderRadius: 10,
          elevation: 2,
        }}>
        <TitleHeader title={t('common:account') + ' ' + t('common:type')} />

        <View>
          <View style={{marginTop: 15}} />
          <CustomCheckBox
            mp
            checked={checkCustomer}
            setChecked={setCheckedCustomer}
            placeholder={t('common:customer')}
          />
          <View style={{marginTop: 15}} />
          <CustomCheckBox
            mp
            checked={checkTranslator}
            setChecked={setCheckedTranslator}
            placeholder={t('common:freelancer')}
          />
          <View style={{marginTop: 10}}>
            {error !== null && <ErrorMsg error={error} />}

            <Button
              onPress={() => {
                if (!checkCustomer && !checkTranslator) {
                  setError('Choose account type');
                  return;
                }
                setError(null);
                if (checkCustomer)
                  navigation.navigate('Email', {
                    location: 'SignUp',
                  });

                if (checkTranslator)
                  navigation.navigate('Email', {
                    location: 'SignUpTranslator',
                  });
              }}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:continue')}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AccountSelectorScreen;
