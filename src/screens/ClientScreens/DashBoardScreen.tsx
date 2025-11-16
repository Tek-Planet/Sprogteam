import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  CustomButton,
  CustomError,
  CustomInput,
  CustomLoader,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import SPACING from '../../components/SPACING';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {getUserName, loginUser} from '../../rtk/features/user/userSlice';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {LoginModel} from '../../rtk';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';

import TextInputScreen from '../../components/TextInputScreen';
import FlagScreen from '../../components/FlagScreen';
import TimeScreen from '../../components/TimeScreen';
import HeaderIcon from '../../components/HeaderIcon';
import AnonymousButton from '../../components/AnonymousButton';

interface SignInScreenProps {}
interface DataState {
  checkBox_secureEntry: boolean;
}
type Props = NativeStackScreenProps<AuthStackParams>;

const DashBoardScreen = ({navigation}: Props) => {
  const user = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();
  const [data, setData] = useState<DataState>({
    checkBox_secureEntry: true,
  });

  const updateCheckBoxSecureEntry = () => {
    setData({
      ...data,
      checkBox_secureEntry: !data.checkBox_secureEntry,
    });
  };
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [erroMessage, setErrorMessage] = useState<string>('');

  return (
    <ScrollView>
      <View style={{...styles.container, ...baseStyles.padding}}>
        <HeaderIcon />
        <View style={{padding: spacing.ten}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize.bold,
              fontFamily: fonts.medium,
            }}>
            {t('common:Order') + ' ' + t('interpreter')}
          </Text>
          {user.loadingUI && <CustomLoader color={colors.main} />}
          <View>
            <TextInputScreen />
            <FlagScreen />
            <TimeScreen />
            <TouchableOpacity onPress={() => navigation}>
              <CustomButton
                buttonTitle={t('common:Search')}
                onTap={() => {
                  {
                  }
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('InterpreterInfo');
              }}>
              <Text style={styles.buttonText}>
                {t('common:Order') +
                  ' ' +
                  t('common:anonymous') +
                  ' ' +
                  t('common:interpreter')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashBoardScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#fff',
      padding: 10,
      borderColor: '#2260A6',
      borderWidth: 1.5,
      borderRadius: 30,
      width: '100%',
      height: spacing.twenty * 2.8,
      // marginBottom: spacing.twenty,
    },
    buttonText: {
      color: '#2260A6',
      // justifyContent: 'center',
      alignSelf: 'center',
      padding: 3,
      fontSize: fontSize.medium,
    },
  });
