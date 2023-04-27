import React, {useContext, useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

import {fonts} from '../assets/fonts';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import {getGiGs, removeFavourite} from '../data/data';
import {AuthContext} from '../context/AuthProvider';
import {toastNew} from '../util/util';
import GigListPrice from './GigListPrice';
import {colors} from '../assets/colors';
import Button from './Button';

const TranlatorsListDirect = props => {
  const {user, setReloadFavourite} = useContext(AuthContext);

  const {t} = useTranslation();
  const navigation = useNavigation();

  const {item, favorite, width, filter} = props;

  const [languages, setLanguages] = useState(item?.languages);

  const removeFromFavourite = async interpreterId => {
    const res = await removeFavourite(user.profile.Id, interpreterId);
    if (res !== null) toastNew('Done', 'success');
    setReloadFavourite(true);
  };

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
      {/* top    */}
      <View>
        <TouchableOpacity
        // onPress={() =>
        //   navigation.navigate('OtherNav', {
        //     screen: 'PublicProfile',
        //     params: {profile: item},
        //   })
        // }
        >
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                position: 'absolute',
                right: 5,
                top: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('OtherNav', {
                    screen: 'ChatScreen',
                    params: {info: item, type: 1},
                  })
                }>
                <AntDesign
                  style={{marginEnd: 10}}
                  name={'message1'}
                  size={20}
                  color={colors.main}
                />
              </TouchableOpacity>

              {favorite && (
                <TouchableOpacity
                  onPress={() => {
                    removeFromFavourite(item.Id);
                  }}>
                  <Ionicons name={'heart'} size={25} color={'#FF3F31'} />
                </TouchableOpacity>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
              {/* circle-medium */}

              <View>
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
                        color: colors.black,
                        marginStart: 5,
                        fontFamily: fonts.bold,
                        marginEnd: 10,
                        fontSize: 16,
                      },
                    ]}>
                    {item.FirstName}
                    {/* {item.MunicipalTasks && ' ' + item.LastName} */}
                  </Text>
                  {item.CategoryId && item.CategoryId !== null && (
                    <MaterialIcons
                      style={{marginTop: 10}}
                      name={'verified'}
                      size={20}
                      color={'#659ED6'}
                    />
                  )}
                  <Fontisto
                    style={{marginTop: 10, marginStart: 10}}
                    name={item.GenderId === 2 ? 'male' : 'female'}
                    size={20}
                    color={colors.black}
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
                    {item.Rating && item.Rating !== null
                      ? item.Rating.toFixed(0) +
                        ' ' +
                        '(' +
                        item.RatingNumber +
                        ')'
                      : 'N/A'}{' '}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* location section */}
          <View style={styles.infoContainer}>
            <Ionicons
              name={'location'}
              size={26}
              color={colors.black}
              style={{padding: 5}}
            />
            <View style={styles.row}>
              <Text style={styles.infoHeader}>{t('common:from')}</Text>
              <Text style={styles.info}>
                {item.Zipcode !== null && item.Zipcode + ' '}
                {item.City !== null && item.City + ' '}
                {item.State !== null && item.State}
              </Text>
              <Text style={styles.info}>
                {item?.Country !== null ? item?.Country : 'Denmark'}
              </Text>
              {/* 
            {item.distance && (
              <View>
                <Text>{item.distance} km</Text>
              </View>
            )} */}
            </View>
          </View>
          <View style={styles.divider} />
          {/* language list section */}
          <View style={styles.infoContainer}>
            <Ionicons
              name={'language'}
              size={26}
              color={'#000'}
              style={{padding: 5}}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <View style={styles.row}>
              <Text style={styles.infoHeader}>{t('common:language')}</Text>

              <ScrollView
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginEnd: 10,
                }}
                showsHorizontalScrollIndicator={false}>
                {languages?.map((item, index) => {
                  return (
                    <Text key={index.toString()} style={styles.info}>
                      {item.label}
                    </Text>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          {/* <View style={styles.divider} /> */}
        </TouchableOpacity>

        <View>
          <Button
            bGcolor={colors.main}
            buttonTitle={t('common:book')}
            onPress={() => {
              navigation.navigate('OtherNav', {
                screen: 'Order',
                params: {info: item},
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default TranlatorsListDirect;

const styles = StyleSheet.create({
  statusText: {
    color: colors.black,
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
    color: colors.black,
    fontFamily: fonts.light,
  },
  info: {
    color: colors.black,
    margin: 5,
    fontFamily: fonts.medium,
  },
});
