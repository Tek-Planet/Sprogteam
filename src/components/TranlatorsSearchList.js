import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

import {fonts} from '../assets/fonts';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {useTranslation} from 'react-i18next';
import {getUser} from '../data/data';
import GigListPrice from './GigListPrice';
import {colors} from '../assets/colors';

const TranslatorSearchList = props => {
  const {t} = useTranslation();

  const {gigInfo, index, info, doPrice, favorite, width, filter} = props;
  const navigation = useNavigation();

  const [item, setItem] = useState({});

  async function fetchData() {
    // You can await here

    const res = await getUser(gigInfo.userId);
    setItem(res.profile);
    // setGigs(res);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={{
        borderRadius: 10,
        margin: 5,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'space-between',
        width: width ? width : '95%',
        alignSelf: 'center',
      }}>
      {/* top */}
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('OtherNav', {
              screen: 'PublicProfile',
              params: {profile: item},
            })
          }>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                position: 'absolute',
                right: 5,
                top: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <AntDesign
                  style={{marginEnd: 10}}
                  name={'message1'}
                  size={20}
                  color={colors.main}
                />
              </View>

              {favorite && (
                <TouchableOpacity
                  onPress={() => {
                    removeFromFavourite(item.Id);
                  }}>
                  <Ionicons name={'heart'} size={25} color={'#FF3F31'} />
                </TouchableOpacity>
              )}
            </View>

            <View
              onPress={() =>
                navigation.navigate('OtherNav', {
                  screen: 'PublicProfile',
                  params: {profile: item},
                })
              }
              style={{flexDirection: 'row'}}>
              {/* circle-medium */}

              <View
                onPress={() =>
                  navigation.navigate('OtherNav', {
                    screen: 'PublicProfile',
                    params: {profile: item},
                  })
                }>
                <Image
                  source={
                    item.ProfilePicture !== undefined &&
                    item.ProfilePicture !== null &&
                    item.ProfilePicture !== 'null' &&
                    item.ProfilePicture !== 'default'
                      ? {uri: item.ProfilePicture}
                      : require('../assets/imgs/paulo.png')
                  }
                  style={{width: 70, height: 70, borderRadius: 100}}
                />
              </View>

              <View
                style={{
                  marginStart: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginStart: 10,

                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: '#000',
                        marginStart: 5,
                        fontFamily: fonts.bold,
                        marginEnd: 10,
                        fontSize: 16,
                      },
                    ]}>
                    {item?.FirstName}
                    {/* {item?.MunicipalTasks && ' ' + item?.LastName} */}
                  </Text>
                  {item?.CategoryId && item?.CategoryId !== null && (
                    <MaterialIcons
                      style={{marginTop: 10}}
                      name={'verified'}
                      size={20}
                      color={'#659ED6'}
                    />
                  )}
                  <Fontisto
                    style={{marginTop: 10, marginStart: 10}}
                    name={item?.GenderId === 2 ? 'male' : 'female'}
                    size={20}
                    color={'#000'}
                  />
                </View>

                <View
                  style={{
                    marginStart: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons name={'star'} size={16} color={'#ECC369'} />
                  <Text style={[styles.info, {marginStart: 10}]}>
                    {item?.Rating && item?.Rating !== null
                      ? item?.Rating.toFixed(0) +
                        ' ' +
                        '(' +
                        item?.RatingNumber +
                        ')'
                      : 'N/A'}{' '}
                  </Text>
                </View>
              </View>

              {/* <Mcicons
              style={{position: 'absolute', bottom: -10, right: -5}}
              name={'circle-medium'}
              size={36}
              color={item.Online === 'online' ? 'green' : 'grey'}
            /> */}
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Ionicons
              name={'location'}
              size={26}
              color={'#000'}
              style={{padding: 5}}
            />
            <View style={styles.row}>
              <Text style={styles.infoHeader}>{t('common:from')}</Text>
              <Text style={styles.info}>
                {item?.Zipcode} {item?.City} {item?.State}
              </Text>
              <Text style={styles.info}>
                {item?.Country !== item?.Country ? item?.Country : 'Denmark'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* gig list  */}
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <GigListPrice full item={gigInfo} index={index} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TranslatorSearchList;

const styles = StyleSheet.create({
  statusText: {
    color: '#000',
    fontSize: 14,
    marginTop: 10,
    fontFamily: fonts.bold,
  },
  row: {
    marginTop: 5,
    paddingBottom: 5,
  },

  divider: {
    height: 1,
    width: '90%',
    backgroundColor: '#659ED6',
    alignSelf: 'flex-end',
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoHeader: {
    margin: 5,
    color: '#000',
    fontFamily: fonts.light,
  },
  info: {
    color: '#000',
    margin: 5,
    fontFamily: fonts.medium,
  },
});
