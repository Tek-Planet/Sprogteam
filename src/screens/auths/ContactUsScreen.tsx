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
import {height} from '../../utils';

type Props = NativeStackScreenProps<AuthStackParams>;

const ContactUsScreen = ({navigation}: Props) => {
  const {error} = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('Password@1012');

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

  return (
    <View style={{...styles.container}}>
      <Header
        showleftIcon
        headerTitle={t('common:contact') + ' ' + t('common:us')}
      />
      <View style={{padding: spacing.ten}}>
        {loading && <CustomLoader color={colors.main} />}

        <Text style={styles.header}>
          {t('common:get') + ' ' + t('common:in') + ' ' + t('common:touch')}
        </Text>
        <Text style={styles.subHeader}>{t('common:contact_text')}</Text>
        <CustomInput
          placeholder={t('common:name')}
          label={t('common:name')}
          onTextChange={setEmail}
          value={email}
        />

        <CustomInput
          placeholder={t('common:email')}
          label={t('common:email')}
          onTextChange={setEmail}
          value={email}
        />

        <CustomInput
          placeholder={t('common:title')}
          label={t('common:title')}
          onTextChange={setEmail}
          value={email}
        />

        <CustomInput
          placeholder={t('common:write') + ' ' + t('common:here')}
          label={t('common:comment')}
          onTextChange={setEmail}
          value={email}
          height={100}
        />

        {erroMessage.length > 0 && <CustomError message={erroMessage} />}

        <CustomButton
          buttonTitle={t('common:continue')}
          onTap={() => {
            onSubmit();
          }}
        />
      </View>
    </View>
  );
};

export default ContactUsScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    header: {
      fontSize: fontSize.medium,
      color: colors.black,
      fontFamily: fonts.medium,
      marginBottom: spacing.ten,
    },
    subHeader: {
      fontSize: fontSize.light,
      color: colors.black,
    },
  });
