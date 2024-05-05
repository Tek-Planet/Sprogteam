import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, Platform, TextInput, Image} from 'react-native';
import {
  CustomButton,
  CustomError,
  CustomLoader,
  Header,
} from '../../components';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {useTranslation} from 'react-i18next';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch} from '../../rtk/hooks';
import {sendOTP, sendPasswordResetOTP} from '../../rtk/features/user/userSlice';
import {generateOtp} from '../../utils';
import {logo} from '../../assets/images';
import {OTPModel} from '../../types';
import baseStyles from '../../assets/styles';

type Props = NativeStackScreenProps<AuthStackParams, 'OTP'>;

const OTPScreen = ({route, navigation}: Props) => {
  const {user: newUser} = route.params;
  const dispatch = useAppDispatch();

  const [erroMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [code, setCode] = useState('');
  const [codeTwo, setCodeTwo] = useState('');
  const [codeThree, setCodeThree] = useState('');
  const [codeFour, setCodeFour] = useState('');
  const [otp, setotp] = useState(newUser.code + '');
  const inputsRef = useRef<any>([]);
  const [active, setActive] = useState(0);
  const [countdown, setCountdown] = useState(120);

  const [sentTime, setSentTime] = useState(new Date());

  const {t} = useTranslation();

  const {colors} = useTheme();
  const styles = getStyles(colors);

  const onKeyPress = (props: any) => {
    const {nativeEvent} = props;
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

  const mergeCodes = async (val: any) => {
    const currentTime = new Date();
    const expirationTime = new Date(sentTime.getTime() + 30 * 60000); // Adding 30 minutes (30 * 60 * 1000 milliseconds)

    if (currentTime.getTime() > expirationTime.getTime()) {
      setErrorMessage('OTP has expired');
      setCountdown(0);
      return;
    }
    setCodeFour(val);
    var tempcode = code + codeTwo + codeThree + val;

    if (parseInt(tempcode) === parseInt(otp)) {
      // check the operation type
      setErrorMessage('');

      if (newUser.title === 'Password Reset') {
        navigation.replace('ResetPassword', {user: newUser});
      } else {
        if (newUser.Role === 'interpreter')
          navigation.replace('SignUpTranslator', {user: newUser});
        else navigation.replace('SignUp', {user: newUser});
      }
    } else {
      setErrorMessage('Wrong OTP provided');
      console.log('error');
    }
  };

  useEffect(() => {
    let intervalId: any;

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
    setErrorMessage('');
    const tempOtp = await generateOtp();
    const body: OTPModel = {
      recipient: newUser.Email + '',
      code: tempOtp,
    };

    if (newUser.title === 'Password Reset') {
      body.userName = newUser.FirstName;
      await dispatch(sendPasswordResetOTP(body));
    } else {
      await dispatch(sendOTP(body));
    }

    setSentTime(new Date());
    setotp(tempOtp);

    setLoading(false);
    setCountdown(120);
  };

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header showleftIcon />
      {loading && <CustomLoader color={colors.main} />}

      <Image resizeMode="contain" style={styles.image} source={logo} />

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.accountLabel}>
            {t('common:verify') + ' ' + t('common:OTP')}
          </Text>
          <View
            style={{
              marginTop: spacing.ten * 2,
              marginBottom: spacing.twenty,
              alignItems: 'center',
              padding: spacing.ten,
            }}>
            <Text
              style={{
                ...styles.text,
                textAlign: 'center',
                marginBottom: spacing.ten,
              }}>
              Enter OTP sent to{' '}
              <Text style={{fontFamily: fonts.medium}}>{newUser.Email}</Text>
            </Text>
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

          {erroMessage.length > 0 && <CustomError message={erroMessage} />}
        </View>

        <View style={{marginBottom: 20}}>
          <View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.ten,
              }}>
              <Text style={styles.text}>
                Didn’t recieved OTP in your email yet?{' '}
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

          {countdown === 0 &&
            (loading ? (
              <CustomLoader color={colors.main} />
            ) : (
              <CustomButton
                buttonTitle={t('common:resend')}
                onTap={() => {
                  processOpt();
                }}
              />
            ))}
        </View>
      </View>
    </View>
  );
};

export default OTPScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    content: {
      flex: 1,
      justifyContent: 'space-between',
      padding: spacing.ten,
    },

    text: {
      fontSize: fontSize.intermediate,
      color: colors.black,
      fontFamily: fonts.regular,
    },

    accountLabel: {
      fontSize: fontSize.medium,
      marginVertical: spacing.ten,
      fontFamily: fonts.bold,
      textAlign: 'center',
    },

    signUp: {
      fontSize: fontSize.light,
      alignSelf: 'center',
      fontFamily: fonts.medium,
    },
    textInput: {
      fontSize: 30,
      textAlign: 'center',
      color: colors.black,
      fontFamily: fonts.medium,
      padding: Platform.OS === 'ios' ? 10 : 3,
    },
    sectionStyle: {
      borderWidth: 2,
      borderRadius: 10,
      margin: 10,
      width: 60,
      height: 60,
      borderColor: colors.main,
    },
    image: {
      height: 100,
      width: 100,
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
    },
  });
