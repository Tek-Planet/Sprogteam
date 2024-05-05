import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  CustomButton,
  CustomError,
  CustomInput,
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
import {
  getMinimalUserDetails,
  sendOTP,
  sendPasswordResetOTP,
} from '../../rtk/features/user/userSlice';
import {errorText, generateOtp} from '../../utils';
import {OTPModel, UserModel} from '../../types';
import baseStyles from '../../assets/styles';

type Props = NativeStackScreenProps<AuthStackParams, 'EmailVerification'>;

const EmailVerificationScreen = ({route, navigation}: Props) => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [erroMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {t} = useTranslation();

  const {user: newUser} = route.params;

  const {colors} = useTheme();
  const styles = getStyles(colors);

  const onSubmit = async () => {
    if (email.length === 0) {
      setEmail(errorText);
      return;
    }
    setLoading(true);
    const tempOtp = await generateOtp();
    setErrorMessage('');

    let body: OTPModel = {
      recipient: email.trim(),
      code: tempOtp,
    };

    var userRecord: any = await getMinimalUserDetails(body.recipient);

    let response: any;
    // if it password reset operation do this
    if (newUser.title === 'Password Reset') {
      if (!userRecord.result) {
        setErrorMessage('No record Found');
        setLoading(false);
        return;
      }
      body.userName = userRecord.result.FirstName;

      response = await dispatch(sendPasswordResetOTP(body));

      if (!response.payload) {
        setErrorMessage('Unable to reset your account at this point');
        setLoading(false);
        return;
      }

      if (response.payload.message !== 'success') {
        setErrorMessage(response.payload.message);
        setLoading(false);
        return;
      }

      setLoading(false);

      newUser.Email = email;
      newUser.code = tempOtp;
      newUser.FirstName = userRecord.result.FirstName;
      navigation.navigate('OTP', {user: newUser});
    } else {
      // create account operation

      if (userRecord.result) {
        setErrorMessage('email has been taken by another user');
        setLoading(false);
        return;
      }

      response = await dispatch(sendOTP(body));

      // console.log(response);

      if (!response.payload) {
        setErrorMessage('error setting up your account');
        setLoading(false);
        return;
      }

      if (response.payload.message !== 'success') {
        setErrorMessage(response.payload.message);
        setLoading(false);
        return;
      }

      setLoading(false);

      newUser.Email = email;
      newUser.code = tempOtp;
      navigation.navigate('OTP', {user: newUser});
    }
  };

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header showleftIcon />
      {loading && <CustomLoader color={colors.main} />}
      <View style={styles.content}>
        <View>
          {newUser.title === 'Password Reset' ? (
            <Text style={styles.accountTypeText}>
              {t('common:reset') +
                ' ' +
                t('common:your') +
                ' ' +
                t('common:password')}
            </Text>
          ) : (
            <Text style={styles.accountTypeText}>
              {t('common:create') +
                ' ' +
                t('common:an') +
                ' ' +
                t('common:account') +
                ' ' +
                t('common:as') +
                ' ' +
                t('common:a') +
                ' '}

              <Text style={{fontFamily: fonts.medium}}>{newUser.title}</Text>
            </Text>
          )}

          <Text style={styles.accountLabel}>
            {t('common:enter') + ' ' + t('common:email')}
          </Text>

          {/* text filed section */}

          <CustomInput
            placeholder={t('common:email')}
            onTextChange={setEmail}
            value={email}
            onEnterPress={onSubmit}
          />
        </View>
        {erroMessage !== '' && <CustomError message={erroMessage} />}
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

export default EmailVerificationScreen;

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

    accountTypeText: {
      fontSize: fontSize.regular,
      color: colors.black,
      fontFamily: fonts.regular,
    },

    accountLabel: {
      fontSize: fontSize.medium,
      marginVertical: spacing.ten,
      fontFamily: fonts.medium,
    },

    signUp: {
      fontSize: fontSize.light,
      alignSelf: 'center',
      fontFamily: fonts.medium,
    },
  });
