import * as React from 'react';
import {View, StyleSheet, ScrollView, Pressable, Text} from 'react-native';
import ProfileItem from './ProfileItem';
import {spacing} from '../assets/spacing';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../rtk/hooks';

import {colors} from '../assets/colors';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {fontSize, fonts} from '../assets/fonts';

const InterpreterProfile = () => {
  const {t} = useTranslation();
  const {user} = useAppSelector(state => state.user);

  return (
    <ScrollView>
      <View
        style={{
          padding: spacing.fiften,
          marginTop: spacing.twenty,
          paddingBottom: spacing.fiften * 2,
        }}>
        <ProfileItem value={user?.FirstName} title={t('common:name')} />
        <ProfileItem value={user?.Email} title={t('email')} />
        <ProfileItem
          value={user?.PhoneNumber}
          title={t('common:phone') + ' ' + t('common:number')}
        />
        <ProfileItem
          value={user?.DOB}
          title={
            t('common:date') + ' ' + t('common:of') + ' ' + t('common:birth')
          }
        />
        <ProfileItem value={user?.Adresse} title={t('address')} />

        <ProfileItem value={user?.Country} title={t('country')} />

        {/* {user?.CV && user?.CVExtension && (
          <Pressable
            onPress={() =>
              downloadFileFromBase64(user?.CV + '', user?.CVExtension + '')
            }
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: spacing.ten,
              borderColor: colors.lightGray,
            }}>
            <Text style={{...styles.title, marginTop: 0}}>
              {t('uploaded') + ' ' + t('cv')}
            </Text>
            <Ionicon
              color={colors.lightGray}
              name={'download-outline'}
              size={25}
            />
          </Pressable>
        )} */}
      </View>
    </ScrollView>
  );
};

export default InterpreterProfile;

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.black,
    fontSize: fontSize.regular,
    fontFamily: fonts.medium,
  },
});
