import React, {useState} from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';
import {passwordicon} from '../../assets/images';
import {
  CustomButton,
  CustomError,
  CustomInput,
  CustomLoader,
  Header,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';

import {LoginModel} from '../../rtk';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {verifyPassword} from '../../rtk/features/user/userSlice';
import {RootStackParams} from '../../navigations/MainNavigation';

type Props = NativeStackScreenProps<RootStackParams, 'EnterPassword'>;

const EnterPasswordScreen = ({navigation}: Props) => {
  const {user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [erroMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async () => {
    if (password.length === 0) {
      setErrorMessage('Password is required');
      return;
    }
    setLoading(true);
    const body: LoginModel = {
      UserName: user.Email,
      Password: password,
    };
    setErrorMessage('');

    let response: any = await dispatch(verifyPassword(body));

    if (response.error) {
      console.log(response.error);
      setErrorMessage(
        response?.error?.code === 'ERR_BAD_REQUEST'
          ? 'Wrong Password Provided'
          : 'connectivity issue, try again later',
      );
      setLoading(false);
      return;
    }

    navigation.replace('ChangePassword', {password});
  };

  return (
    <View style={{...baseStyles.padding, ...styles.container}}>
      <Header
        showleftIcon
        headerTitle={t('common:change') + ' ' + t('common:password')}
      />
      {loading && <CustomLoader color={colors.main} />}
      <View style={{padding: spacing.ten}}>
        <Image style={styles.image} source={passwordicon} />

        <View style={{marginTop: spacing.ten}}>
          <Text
            style={{
              ...styles.headerText,
            }}>
            {t('common:enter') +
              ' ' +
              t('common:your') +
              ' ' +
              t('common:password')}
          </Text>

          <CustomInput
            showleftIcon
            placeholder={t('common:password')}
            leftIconName="lock"
            onTextChange={setPassword}
            isSecure
            onEnterPress={() => onSubmit()}
          />

          {<CustomError message={erroMessage} />}

          <CustomButton
            buttonTitle={t('common:continue')}
            onTap={() => {
              onSubmit();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default EnterPasswordScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    image: {
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
    },

    headerText: {
      fontSize: fontSize.medium,
      marginVertical: spacing.five,
      fontFamily: fonts.bold,
      color: colors.black,
    },
  });
