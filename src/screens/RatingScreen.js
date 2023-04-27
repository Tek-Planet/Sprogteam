import React, {useContext, useEffect, useState} from 'react';
import {View, Image, FlatList, Text, StyleSheet} from 'react-native';

import Button from '../components/Button';
import {AuthContext} from '../context/AuthProvider';
import {fonts} from '../assets/fonts';

import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {getRatings} from '../data/data';
import {RatingItem} from '../components';

const ProfileScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const {profile} = route.params;
  const [refreshing, setRefreshing] = useState(true);
  const [ratings, setRatings] = useState([]);

  const {Id, RatingNumber, Rating} = profile;

  // console.log(Id);

  const {t} = useTranslation();

  const cooperateList = (item, index) => {
    return (
      <View
        key={index}
        style={{
          margin: 5,
          shadowColor: 'grey',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 5,
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 10,
          flexDirection: 'row',
        }}>
        <Image
          source={
            item.ProfilePicture !== undefined &&
            item.ProfilePicture !== null &&
            item.ProfilePicture !== 'default'
              ? {uri: item.ProfilePicture}
              : require('../assets/imgs/logo.png')
          }
          style={{width: 50, height: 50, borderRadius: 100}}
        />

        <View style={{margin: 5, marginStart: 10, flex: 1}}>
          <Text
            style={{color: '#000', marginBottom: 5, fontFamily: fonts.bold}}>
            {item.CustomerName}
          </Text>

          <RatingItem rating={item.Stars} />

          <Text
            style={[
              styles.statusText,
              {
                color: '#000',
                marginTop: 5,
                marginBottom: 5,
                fontFamily: fonts.medium,
              },
            ]}>
            {moment(item.CreateDate).fromNow()}
          </Text>

          <Text
            style={[
              styles.statusText,
              {
                color: '#000',
                fontSize: 15,
                marginTop: 5,
                fontFamily: fonts.light,
                textAlign: 'justify',
              },
            ]}>
            {item.Remark}
          </Text>
        </View>
      </View>
    );
  };

  async function fetchData() {
    const res = await getRatings(Id);
    setRatings(res);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View>
        {/* general insformation section */}
        <View style={{margin: 10}}>
          {/* Imag and name section */}
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                margin: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
              }}>
              <View>
                <Text style={[styles.info, {paddingBottom: 10, fontSize: 16}]}>
                  {t('common:overall') + ' ' + t('common:rating')}
                </Text>
              </View>

              {/* <Text
                style={[
                  styles.info,
                  {color: '#659ED6', fontFamily: fonts.bold},
                ]}>
                {t('common:contact')}
              </Text> */}

              <Text style={styles.info}>
                <AntDesign name={'star'} size={16} color={'#ECC369'} />{' '}
                {Rating && Rating !== null
                  ? Rating.toFixed(0) + ' ' + '(' + RatingNumber + ')'
                  : 'N/A'}{' '}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, {width: '98%'}]} />

          {/* Rating section */}

          <FlatList
            ListEmptyComponent={
              !refreshing && (
                <Text
                  style={{
                    color: '#000',
                    textAlign: 'center',
                    margin: 10,
                    fontFamily: fonts.light,
                  }}>
                  No Rating Yet
                </Text>
              )
            }
            keyExtractor={item => item.CreateDate}
            data={ratings}
            renderItem={({item, index}) => {
              return cooperateList(item, index);
            }}
            refreshing={refreshing}
          />
        </View>
      </View>
    </View>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
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
  row: {
    marginTop: 5,
    paddingBottom: 5,
  },

  // modal styles

  buttonText: {
    textAlign: 'center',
    color: '#fff',
    margin: 5,
    fontSize: 18,
  },

  buttonContainer: {
    width: 100,
    margin: 10,
    borderRadius: 50,
    backgroundColor: '#E43F5A',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: '#659ED6',
    alignSelf: 'flex-end',
  },
});
