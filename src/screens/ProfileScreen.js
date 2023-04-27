import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AuthContext} from '../context/AuthProvider';
import {fonts} from '../assets/fonts';

import Selector from '../components/LanguageSelector';
import {useTranslation} from 'react-i18next';
import {getUser, storeDetails} from '../data/data';
import {ProfileHeader} from '../components';
import {colors} from '../assets/colors';

const ProfileScreen = ({navigation}) => {
  const {user, setUser, setAuth, logout, onlineStatus} =
    useContext(AuthContext);
  const {t} = useTranslation();
  // console.log(user.profile.Available);

  const [avaiable, setAvailAble] = useState(
    user && user !== null && user?.profile?.Available,
  );

  const changeAvailability = async val => {
    setAvailAble(val);
    const status = val ? 1 : 0;
    await onlineStatus(user.profile.Email, 'Available', status);
    const resUser = await getUser(user.profile.Email);
    await storeDetails(resUser);
    setUser(resUser);
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <ProfileHeader name={t('navigate:settings')} />
      <View>
        <Text style={styles.text}>{t('common:languageSelector')}</Text>
        <Selector />
      </View>
      {user.profile.interpreter && (
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OtherNav', {screen: 'PaymentOption'})
            }
            style={styles.row}>
            <View style={styles.innerRow}>
              <Ionicons
                name="card-outline"
                color="#000"
                size={20}
                style={{marginEnd: 10}}
              />
              <Text style={styles.infoHeader}>{t('common:payment')}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              color="#000"
              size={20}
              style={{marginEnd: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('OtherNav', {screen: 'KYC'})}
            style={styles.row}>
            <View style={styles.innerRow}>
              <Ionicons
                name="person-circle-outline"
                color="#000"
                size={20}
                style={{marginEnd: 10}}
              />
              <Text style={styles.infoHeader}>{t('common:KYC')}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              color="#000"
              size={20}
              style={{marginEnd: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Availability')}
            style={styles.row}>
            <View style={styles.innerRow}>
              <Ionicons
                name="calendar-outline"
                color="#000"
                size={20}
                style={{marginEnd: 10}}
              />
              <Text style={styles.infoHeader}>{t('common:available')}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              color="#000"
              size={20}
              style={{marginEnd: 10}}
            />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[
          styles.row,
          {marginBottom: 10, marginStart: 10, marginEnd: 10},
        ]}>
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate('DeleteAccount');
          }}
          style={styles.innerRow}>
          <Ionicons
            name="log-out-outline"
            color={colors.black}
            size={20}
            style={{marginEnd: 10}}
          />
          <Text style={styles.infoHeader}>
            {t('common:delete') + ' ' + t('common:account')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  infoHeader: {
    marginStart: 5,
    color: colors.black,
    fontSize: 16,
    fontFamily: fonts.medium,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    elevation: 1,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    backgroundColor: '#F3F3F3',
  },

  // modal styles

  innerRow: {flexDirection: 'row', alignItems: 'center'},

  text: {
    fontFamily: fonts.medium,
    margin: 10,
    fontSize: 16,
  },
});
