import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  CustomButton,
  CustomError,
  CustomInput,
  CustomLoader,
  Header,
  SuccessModal,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useAppDispatch} from '../../rtk/hooks';
import {LoginModel} from '../../rtk';
import {resetPassword} from '../../rtk/features/user/userSlice';
import {AuthStackParams} from '../../navigations/AuthNavigation';

type Props = NativeStackScreenProps<AuthStackParams, 'ResetPassword'>;

const ResetPasswordScreen = ({navigation, route}: Props) => {
  const {user: newUser} = route.params;

  const dispatch = useAppDispatch();

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [erroMessage, setErrorMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onSubmit = async () => {
    if (password.length === 0) {
      setErrorMessage('Password is required');
      return;
    }

    if (confirmPassword.length === 0) {
      setErrorMessage('Confirm password is required');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords dees not match');
      return;
    }

    setLoading(true);

    const body: LoginModel = {
      UserName: newUser.Email + '',
      Password: password,
    };

    setErrorMessage('');

    let response: any = await dispatch(resetPassword(body));
    setLoading(false);
    if (response.error) {
      setErrorMessage('uanble to reset your password please try again later');
      return;
    }
    setMessage('Password reset successful');
    setModalVisible(true);
  };

  const reset = () => {
    setModalVisible(false);
    navigation.replace('Login');
  };

  return (
    <View style={{...baseStyles.padding, ...styles.container}}>
      <Header
        showleftIcon
        headerTitle={t('common:reset') + ' ' + t('common:password')}
      />
      {loading && <CustomLoader color={colors.main} />}
      <View style={{padding: spacing.ten}}>
        <View style={{marginTop: spacing.ten}}>
          <Text
            style={{
              ...styles.headerText,
            }}>
            {t('common:enter') +
              ' ' +
              t('common:new') +
              ' ' +
              t('common:password')}
          </Text>

          <CustomInput
            showleftIcon
            placeholder={t('common:password')}
            leftIconName="lock"
            onTextChange={setPassword}
            isSecure
          />

          <Text
            style={{
              ...styles.headerText,
            }}>
            {t('common:confirm') + ' ' + t('common:password')}
          </Text>

          <CustomInput
            showleftIcon
            placeholder={t('common:password')}
            leftIconName="lock"
            onTextChange={setConfirmPassword}
            isSecure
            onEnterPress={() => onSubmit()}
          />
          {<CustomError message={erroMessage} />}

          <CustomButton
            buttonTitle={t('common:reset') + ' ' + t('common:password')}
            onTap={() => {
              console.log('here');
              onSubmit();
            }}
          />
        </View>

        {modalVisible && (
          <SuccessModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            message={message}
            closeModal={() => {
              reset();
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    image: {
      height: 100,
      width: 100,
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
    },

    forgotPassword: {
      marginVertical: spacing.ten,
      fontSize: fontSize.light,
      color: colors.main,
      alignSelf: 'flex-end',
      fontFamily: fonts.medium,
    },

    signUp: {
      marginVertical: 10,
      fontSize: fontSize.light,
      alignSelf: 'center',
      fontFamily: fonts.medium,
    },
    headerText: {
      fontSize: fontSize.medium,
      marginVertical: spacing.five,
      fontFamily: fonts.bold,
      color: colors.black,
    },
  });
