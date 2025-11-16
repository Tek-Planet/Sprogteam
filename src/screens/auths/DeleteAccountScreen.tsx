import React, {useState} from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';
import {deleteaccount} from '../../assets/images';
import {
  CustomButton,
  CustomError,
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
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {deleteMyAccount, logoutUser} from '../../rtk/features/user/userSlice';
import {RootStackParams} from '../../navigations/MainNavigation';
import {width} from '../../utils';

type Props = NativeStackScreenProps<RootStackParams, 'DeleteAccount'>;

const DeleteAccountScreen = ({navigation}: Props) => {
  const {user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [erroMessage, setErrorMessage] = useState<string>('');
  const [accountDeleted, setAccountDeleted] = useState(false);

  const onDeleteAccount = async () => {
    let response: any = await deleteMyAccount(user.Email);

    if (response === 'deleted') {
      setAccountDeleted(true);
      setTimeout(async () => {
        dispatch(logoutUser());
      }, 1500);
    } else {
      setErrorMessage(
        'Unable to delete your account, please contact admin for assistance',
      );
      setLoading(false);
    }
  };

  return (
    <View style={{...baseStyles.padding, ...styles.container}}>
      <Header
        showleftIcon
        headerTitle={t('common:delete') + ' ' + t('common:account')}
      />
      {loading && <CustomLoader color={colors.main} />}
      <View style={{padding: spacing.ten}}>
        <Image style={styles.image} source={deleteaccount} />
        <View>
          <Text
            style={{
              fontFamily: fonts.bold,
              marginBottom: spacing.fiften,
              color: colors.black,
              fontSize: fontSize.regular,
              textAlign: 'center',
            }}>
            {t('common:deleteTitle')}
          </Text>

          <Text
            style={{
              opacity: 0.6,
              fontFamily: fonts.regular,
              marginBottom: spacing.fiften,
              color: colors.black,
              fontSize: fontSize.regular,
              textAlign: 'center',
            }}>
            {t('common:deleteBody')}
          </Text>

          {erroMessage.length > 0 && <CustomError message={erroMessage} />}

          {/* action buttond  */}
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{width: width * 0.3}}>
              <CustomButton
                buttonTitle={t('common:cancel')}
                textSize={fontSize.light}
                onTap={() => {
                  navigation.goBack();
                }}
                bGcolor={colors.white}
                testColor={colors.main}
                borderWidth={1}
              />
            </View>
            <View style={{width: width * 0.3}}>
              <CustomButton
                bGcolor={colors.red}
                buttonTitle={t('common:delete')}
                textSize={fontSize.light}
                onTap={() => {
                  onDeleteAccount();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeleteAccountScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    image: {
      height: 150,
      width: 150,
      alignSelf: 'center',
      marginTop: spacing.ten,
      marginBottom: spacing.twenty,
    },

    headerText: {
      fontSize: fontSize.medium,
      marginVertical: spacing.five,
      fontFamily: fonts.bold,
      color: colors.black,
    },
  });
