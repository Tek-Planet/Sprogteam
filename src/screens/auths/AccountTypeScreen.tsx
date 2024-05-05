import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {AccountTypeCardItem, Header} from '../../components';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {useTranslation} from 'react-i18next';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {accountOptions} from '../../utils';
import {useTheme} from '@react-navigation/native';
import {AccountType} from '../../types';
import baseStyles from '../../assets/styles';

type Props = NativeStackScreenProps<AuthStackParams, 'AccountType'>;

const AccountTypeScreen = ({route, navigation}: Props) => {
  const {t} = useTranslation();

  const {colors} = useTheme();
  const styles = getStyles(colors);

  const nextScreen = (item: AccountType, index: number) => {
    let user: any = {};

    user.title = item.title;
    user.Role = item.role;

    navigation.navigate('EmailVerification', {user});
  };

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header showleftIcon />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          padding: spacing.ten,
        }}>
        <View>
          <Text style={styles.accountLabel}>
            {t('common:create') + ' ' + t('common:your') + ' '}

            <Text style={{fontFamily: fonts.medium}}>
              {t('common:account')}
            </Text>
          </Text>

          <Text style={styles.accountTypeText}>
            {t('common:create') +
              ' ' +
              t('common:an') +
              ' ' +
              t('common:account') +
              ' ' +
              t('common:as') +
              ' ' +
              t('common:user') +
              ' ' +
              t('common:or') +
              ' ' +
              t('common:interpreter')}
          </Text>
          {/* accouny type list */}
          <ScrollView>
            {accountOptions().map((item, index) => (
              <AccountTypeCardItem
                onPress={() => {
                  nextScreen(item, index);
                }}
                item={item}
                key={item.id}
              />
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.signUp}>
            {t('common:already') +
              ' ' +
              t('common:have') +
              ' ' +
              t('common:an') +
              ' ' +
              t('common:account').toLowerCase() +
              '? '}

            <Text style={{color: colors.main}}>{t('common:sign_up')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountTypeScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    accountTypeText: {
      fontSize: fontSize.light,
      color: colors.black,
      fontFamily: fonts.regular,
    },

    accountLabel: {
      fontSize: fontSize.medium,
      marginVertical: spacing.ten,
      fontFamily: fonts.regular,
    },

    signUp: {
      fontSize: fontSize.light,
      alignSelf: 'center',
      fontFamily: fonts.medium,
    },
  });
