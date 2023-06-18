import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import TitleHeader from '../../components/TitleHeader';
import Button from '../../components/Button';
import TextBox from '../../components/TextInput';
import TextBoxTitle from '../../components/TextBoxTitle';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import {AuthContext} from '../../context/AuthProvider';
import {useTranslation} from 'react-i18next';

import {getUserName} from '../../data/data';
// import Feather from 'react-native-vector-icons/Feather';
import {generateOtp} from '../../util/util';
import {ActivityIndicator} from '../../components';
import {colors} from '../../assets/colors';
import {fonts} from '../../assets/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {sendOtp} from '../../model/user';

const OTPScreen = ({navigation, route}) => {
  var {details} = route.params;
  const {setUser, setAuth, user, userName, setUserName} =
    useContext(AuthContext);
  const {t} = useTranslation();

  const [userId, setUserId] = useState(details.recipient);

  const [code, setCode] = useState(null);
  const [codeTwo, setCodeTwo] = useState(null);
  const [codeThree, setCodeThree] = useState(null);
  const [codeFour, setCodeFour] = useState(null);
  const [otp, setotp] = useState(details.code);
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [active, setActive] = useState(0);
  const [countdown, setCountdown] = useState(120);

  const [sentTime, setSentTime] = useState(new Date(details.sentTime));

  const onKeyPress = ({nativeEvent}) => {
    if (nativeEvent.key === 'Backspace') {
      if (active !== 0) {
        inputsRef.current[active - 1]?.focus();
        return setActive(active - 1);
      }
    } else {
      inputsRef.current[active + 1]?.focus();
      return setActive(active + 1);
    }
    return null;
  };

  const mergeCodes = async val => {
    const currentTime = new Date();
    const expirationTime = new Date(sentTime.getTime() + 30 * 60000); // Adding 30 minutes (30 * 60 * 1000 milliseconds)

    if (currentTime.getTime() > expirationTime.getTime()) {
      setError('OTP has expired');
      setCountdown(0);
      return;
    }
    setCodeFour(val);
    var tempcode = code + codeTwo + codeThree + val;

    if (parseInt(tempcode) === parseInt(otp)) {
      setError(null);
      setLoading(true);
      navigation.replace(details?.location, {email: details?.recipient});
    } else {
      setError('Wrong OTP provided');
      console.log('error');
    }
  };

  useEffect(() => {
    let intervalId;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [countdown]);

  const processOpt = async () => {
    setLoading(true);
    setError(null);
    const tempOtp = await generateOtp();
    const body = {
      recipient: userId,
      code: tempOtp,
      isCustomer: details?.location === 'SignUp' ? true : false,
    };

    setSentTime(new Date());
    setotp(tempOtp);

    const res = await sendOtp(body);

    if (res.status !== 200) {
      setError(res.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setCountdown(120);
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
          marginTop: 20,
          backgroundColor: '#fff',
          width: '90%',
          elevation: 2,
        }}>
        <TitleHeader
          title={t('common:verification') + ' ' + t('common:code')}
        />

        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text style={styles.text}>
            {t('common:otp_text')} {userId}
          </Text>
        </View>

        {/*otp box */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: 20,
          }}>
          {/* <Confirmation /> */}

          <View style={{flexDirection: 'row'}}>
            <View style={styles.sectionStyle}>
              <TextInput
                value={code}
                onChangeText={val => setCode(val)}
                onKeyPress={onKeyPress}
                autoFocus={active === 0}
                ref={r => {
                  inputsRef.current[0] = r;
                }}
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                value={codeTwo}
                onChangeText={val => setCodeTwo(val)}
                onKeyPress={onKeyPress}
                autoFocus={active === 1}
                ref={r => {
                  inputsRef.current[1] = r;
                }}
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                value={codeThree}
                onChangeText={val => setCodeThree(val)}
                onKeyPress={onKeyPress}
                autoFocus={active === 2}
                ref={r => {
                  inputsRef.current[2] = r;
                }}
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                value={codeFour}
                onChangeText={val => mergeCodes(val)}
                onKeyPress={onKeyPress}
                autoFocus={active === 3}
                ref={r => {
                  inputsRef.current[3] = r;
                }}
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
          </View>
        </View>

        <View>
          <View style={{marginBottom: 20}}>
            {error !== null && <ErrorMsg error={error} />}
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.text}>
                  Didn’t recieved code on your number yet?{' '}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        marginEnd: 0,
                      },
                    ]}>
                    Resend code in
                  </Text>
                  <Text style={{...styles.text, fontFamily: fonts.bold}}>
                    {' '}
                    {countdown.toString().padStart(2, '0')} sec
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {countdown === 0 &&
          (loading ? (
            <Indicator color={'#659ED6'} show={loading} size={'large'} />
          ) : (
            <Button
              onPress={() => processOpt()}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:continue')}
            />
          ))}
      </View>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  sectionStyle: {
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    width: 60,
    height: 60,
    borderColor: colors.main,
  },
  textInput: {
    fontSize: 30,
    textAlign: 'center',
    color: colors.black,
    fontFamily: fonts.medium,
    padding: Platform.OS === 'ios' ? 10 : 3,
  },
  text: {
    fontFamily: fonts.medium,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 25,
  },
});
