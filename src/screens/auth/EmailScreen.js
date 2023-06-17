import React, {useState, useContext} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

import TitleHeader from '../../components/TitleHeader';
import Button from '../../components/Button';
import TextBox from '../../components/TextInput';
import TextBoxTitle from '../../components/TextBoxTitle';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import {AuthContext} from '../../context/AuthProvider';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {generateOtp} from '../../util/util';
import {sendOtp} from '../../model/user';

const EmailScreen = ({navigation, route}) => {
  const {location} = route.params;

  const {t} = useTranslation();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processOpt = async () => {
    try {
      if (userId === null) {
        setError('email cannot be empty');
        return;
      }
      setLoading(true);
      setError(null);
      const tempOtp = await generateOtp();
      const body = {
        recipient: userId,
        code: tempOtp,
        location,
        isCustomer: location === 'SignUp' ? true : false,
        sentTime: new Date().toISOString(),
      };

      const res = await sendOtp(body);

      console.log(res);

      if (res.status !== 200) {
        setError(res.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigation.navigate('OTP', {details: body});
    } catch (error) {
      setError('Unable to send verifcation email email');
      setLoading(false);
    }
  };

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
        <TitleHeader title={t('common:email_text')} />

        <View>
          {/* firstname */}
          <TextBoxTitle title={t('common:email')} />
          <TextBox
            name="mail"
            keyboardType={'email-address'}
            value={userId}
            onChangeText={val => setUserId(val)}
            autoCapitalize={'none'}
            autoCompleteType={'email'}
            onSubmitEditing={() => {
              processOpt();
            }}
          />

          <View style={{marginTop: 10}}>
            {error !== null && <ErrorMsg error={error} />}
            {loading ? (
              <Indicator color={'#659ED6'} show={loading} size={'large'} />
            ) : (
              <Button
                onPress={() => processOpt()}
                bGcolor={'#659ED6'}
                buttonTitle={t('common:continue')}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default EmailScreen;
