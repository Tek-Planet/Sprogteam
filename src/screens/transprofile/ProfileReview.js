import React, {useEffect, useState} from 'react';
import {View, Image, FlatList, Text, StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {getRatings} from '../../data/data';
import {RatingItem} from '../../components';
import {fonts} from '../../assets/fonts';

const ProfileReview = ({route}) => {
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
              : require('../../assets/imgs/paulo.png')
          }
          style={{width: 50, height: 50, borderRadius: 100}}
        />

        <View style={{margin: 5, marginStart: 10}}>
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
                width: 250,
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
        padding: 10,
      }}>
      {/* general insformation section */}

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
              {t('common:no') +
                ' ' +
                t('common:rating') +
                ' ' +
                t('common:yet')}
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
  );
};
export default ProfileReview;

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
});
