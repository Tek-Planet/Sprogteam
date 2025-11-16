import * as React from 'react';
import {View, StyleSheet, ScrollView, Pressable, Text} from 'react-native';
import ProfileItem from './ProfileItem';
import {spacing} from '../assets/spacing';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../rtk/hooks';
import {colors} from '../assets/colors';
import {useNavigation} from '@react-navigation/native';
import {fontSize, fonts} from '../assets/fonts';

interface ClientProfileProps {}

const ClientProfile = (props: ClientProfileProps) => {
  const {t} = useTranslation();
  const {user} = useAppSelector(state => state.user);
  const navigation: any = useNavigation();

  return (
    <ScrollView>
      <View
        style={{
          padding: spacing.fiften,
          marginTop: spacing.twenty,
        }}>
        <ProfileItem
          value={user?.FirstName + ' ' + user.LastName}
          title={t('common:name')}
        />

        <ProfileItem value={user?.Email} title={t('email')} />
        <ProfileItem
          value={user?.PhoneNumber}
          title={t('common:phone') + ' ' + t('common:number')}
        />

        <ProfileItem
          value={`${user?.Adresse ? user?.Adresse : ''}  ${
            user?.City ? user?.City : ''
          } ${user?.State ? user?.State : ''}`}
          title={t('address')}
        />
        <ProfileItem value={user?.Zipcode} title={t('zipcode')} />

        <ProfileItem value={user?.Country} title={t('country')} />

        {(user.CompanyStatus === 'Private' ||
          user.CompanyStatus === 'Public') && (
          <View>
            <ProfileItem
              value={user?.CompanyName}
              title={t('company') + ' ' + t('name')}
            />

            <ProfileItem value={user?.EAN} title={t('EAN')} />

            <ProfileItem value={user?.CVR} title={t('CVR')} />
          </View>
        )}

        <Pressable
          onPress={() => {
            navigation.navigate('DeleteAccount');
          }}>
          <Text
            style={{
              ...styles.title,
              fontSize: fontSize.regular,
              marginBottom: spacing.twenty,
              color: colors.red,
            }}>
            {t('common:delete') + ' ' + t('common:account')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ClientProfile;

const styles = StyleSheet.create({
  title: {
    color: colors.black,
    fontSize: fontSize.regular,
    fontFamily: fonts.medium,
  },
});
