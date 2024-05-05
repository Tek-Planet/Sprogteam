import React, {useEffect, useState} from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {logo} from '../../assets/images';
import {
  CustomButton,
  CustomError,
  CustomInput,
  CustomLoader,
  Header,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {LoginModel} from '../../rtk';
import {loginUser, getUserName} from '../../rtk/features/user/userSlice';
import {Pressable} from 'react-native';
import {height, width} from '../../utils';

type Props = NativeStackScreenProps<AuthStackParams>;

const SignInScreen = ({navigation}: Props) => {
  const {error} = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [erroMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (email.length === 0) {
      setErrorMessage('Email is required');
      return;
    }

    if (password.length === 0) {
      setErrorMessage('Password is required');
      return;
    }
    setLoading(true);
    const body: LoginModel = {
      UserName: email,
      Password: password,
    };
    setErrorMessage('');

    var respose: any = await dispatch(loginUser(body));

    if (respose.payload?.message === 'lockout')
      setErrorMessage('Invalid credential');
    if (
      respose.payload?.message ===
      'You cannot login at this point as your account is under verifcation'
    )
      setErrorMessage(
        'You cannot login at this point as your account is under verifcation',
      );

    if (!respose.payload) {
      if (respose.error.message === 'Request failed with status code 401')
        setErrorMessage('Invalid username or password');
      else setErrorMessage('Error loggin you in');
    }
    if (respose) setLoading(false);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const storedName = await getUserName();
      setEmail(storedName);
    };
    fetchUserName();
  }, []);

  // useEffect(() => {
  //   if (error) setErrorMessage(error);
  // }, [error]);
  // console.log(error);
  return (
    <View style={{...styles.container}}>
      <Header showleftIcon />
      <View style={{padding: spacing.ten}}>
        {loading && <CustomLoader color={colors.main} />}

        <Image resizeMode="contain" style={styles.image} source={logo} />

        <View style={{marginTop: spacing.ten}}>
          <Text style={styles.header}>
            {t('common:let') + ' ' + t('common:log_in')}
          </Text>
          <Text style={styles.subHeader}>
            {t('common:please') +
              ' ' +
              t('common:enter') +
              ' ' +
              t('common:your') +
              ' ' +
              t('common:account') +
              ' ' +
              t('common:here')}
          </Text>
          <CustomInput
            showleftIcon
            leftIconName="mail"
            placeholder={t('common:email')}
            onTextChange={setEmail}
            value={email}
          />
          <CustomInput
            showleftIcon
            placeholder={t('common:password')}
            leftIconName="lock"
            onTextChange={setPassword}
            value={password}
            isSecure
            onEnterPress={() => {
              onSubmit();
            }}
          />

          <Pressable
            onPress={() => {
              navigation.navigate('EmailVerification', {
                user: {title: 'Password Reset'},
              });
            }}>
            <Text style={styles.forgotPassword}>
              {t('common:forgot') + ' ' + t('common:password')}
            </Text>
          </Pressable>

          {erroMessage.length > 0 && <CustomError message={erroMessage} />}

          <CustomButton
            buttonTitle={t('common:log_in')}
            onTap={() => {
              onSubmit();
            }}
          />
        </View>
      </View>
      <View style={styles.view}>
        <Text style={styles.signUp}>{t('common:create_account_text')}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AccountType');
          }}>
          <Text
            style={[
              {color: colors.main},
              {fontSize: fontSize.light, fontFamily: fonts.medium},
            ]}>
            {' ' + t('common:sign_up')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    image: {
      height: height * 0.15,
      width: height * 0.15,
      marginBottom: height * 0.03,
      alignSelf: 'center',
      marginTop: spacing.ten,
      borderRadius: 200,
    },

    forgotPassword: {
      marginVertical: spacing.five,
      fontSize: fontSize.light,
      color: '#1f619f',
      alignSelf: 'flex-end',
      fontFamily: fonts.medium,
    },
    view: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.ten / 4,
    },
    header: {
      fontSize: fontSize.bold,
      color: colors.black,
      alignSelf: 'flex-start',
      fontFamily: fonts.medium,
    },
    subHeader: {
      marginBottom: spacing.fiften,
      fontSize: fontSize.light,
      color: '#000',
      alignSelf: 'flex-start',
      fontWeight: '400',
    },
    signUp: {
      fontSize: fontSize.light,
      color: colors.black,
      alignSelf: 'flex-start',
      fontWeight: '400',
    },
  });
