import React, {useContext, useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {ScrollView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getInterpreterLanguage, getInterpreterSkill} from '../../data/data';

const FullPublicProfile = ({navigation, route}) => {
  const {user, available_services} = useContext(AuthContext);
  const {profile} = route.params;

  const {
    Id,
    Email,
    ProfilePicture,
    Country,
    State,
    About,
    FirstName,
    LastName,
    RatingNumber,
    Rating,

    services,

    CreateAt,
  } = profile;

  const [languages, setLanguages] = useState(profile?.languages);
  const [skills, setSkills] = useState(profile?.skills);

  const {t} = useTranslation();

  async function fetchData() {
    // You can await here
    if (profile?.languages === undefined || profile?.languages?.length === 0) {
      res = await getInterpreterLanguage(Id, Email);
      setLanguages(res);
    }
    if (profile?.skills === undefined || profile?.skills?.length === 0) {
      res = await getInterpreterSkill(Id, Email);
      setSkills(res);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <ScrollView>
        <View>
          {/* general insformation section */}
          <View style={{margin: 10}}>
            {/* Imag and name section */}
            <View style={{flexDirection: 'row'}}>
              <Image
                source={
                  ProfilePicture !== undefined &&
                  ProfilePicture !== null &&
                  ProfilePicture !== 'null' &&
                  ProfilePicture !== 'default'
                    ? {uri: ProfilePicture}
                    : require('../../assets/imgs/paulo.png')
                }
                style={{width: 50, height: 50, borderRadius: 100}}
              />
              <View
                style={{
                  margin: 10,
                  marginTop: 0,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View>
                  <Text style={[styles.info, {marginBottom: 5, fontSize: 16}]}>
                    {FirstName}
                  </Text>
                  <Text style={styles.info}>
                    <AntDesign name={'star'} size={16} color={'#ECC369'} />{' '}
                    {Rating && Rating !== null
                      ? Rating.toFixed(0) + ' ' + '(' + RatingNumber + ')'
                      : 'N/A'}{' '}
                  </Text>
                </View>
                {user.profile.Id !== profile.Id && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('OtherNav', {
                        screen: 'ChatScreen',
                        params: {info: profile, type: 1},
                      })
                    }>
                    <Text
                      style={[
                        styles.info,
                        {color: '#659ED6', fontFamily: fonts.bold},
                      ]}>
                      {t('common:contact')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View>
              <Text
                style={[
                  styles.infoHeader,
                  {
                    marginTop: 20,
                    marginBottom: 10,
                    fontSize: 16,
                    fontFamily: fonts.bold,
                  },
                ]}>
                {t('common:user') + ' ' + t('common:information')}
              </Text>
            </View>
            <View style={[styles.divider, {width: '98%'}]} />
            {/* country */}
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
                  {profile.Zipcode !== null && profile.Zipcode + ' '}
                  {profile.City !== null && profile.City + ' '}
                  {profile.State !== null && profile.State}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* member since  */}

            <View style={styles.infoContainer}>
              <AntDesign
                name={'addusergroup'}
                size={26}
                color={'#000'}
                style={{padding: 5}}
              />
              <View style={styles.row}>
                <Text style={styles.infoHeader}>{t('common:member')}</Text>
                <Text style={styles.info}>
                  {CreateAt !== null && moment(CreateAt).format('MMM Do YYYY')}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoContainer}>
              <AntDesign
                name={'user'}
                size={26}
                color={'#000'}
                style={{padding: 5}}
              />
              <View style={[styles.row, {flex: 1}]}>
                <Text style={styles.infoHeader}>{t('common:about')}</Text>
                <Text style={styles.info}>{About}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* Language */}

            <View style={styles.infoContainer}>
              <Ionicons
                name={'language'}
                size={26}
                color={'#000'}
                style={{padding: 5}}
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
            <View style={styles.divider} />

            {/* skills section */}
            <View style={styles.infoContainer}>
              <MaterialIcons
                name={'design-services'}
                size={26}
                color={'#000'}
                style={{padding: 5}}
              />
              <View style={styles.row}>
                <Text style={styles.infoHeader}>{t('common:skills')}</Text>

                <ScrollView
                  contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginEnd: 10,
                  }}
                  showsHorizontalScrollIndicator={false}>
                  {skills?.map((item, index) => {
                    return (
                      <Text key={index.toString()} style={styles.info}>
                        {item.label}
                      </Text>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            <View style={styles.divider} />
            {/* services */}
            {/* services section */}
            {/* <View style={styles.infoContainer}>
              <MaterialIcons
                name="work-outline"
                size={26}
                color={'#000'}
                style={{padding: 5}}
              />
              <View style={styles.row}>
                <Text style={styles.infoHeader}>{t('common:services')}</Text>

                <ScrollView
                  contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginEnd: 30,
                  }}
                  showsHorizontalScrollIndicator={false}>
                  {services?.map((item, index) => {
                    return (
                      <Text key={index.toString()} style={styles.info}>
                        {available_services[item.value - 1].label}
                      </Text>
                    );
                  })}
                </ScrollView>
              </View>
            </View> */}
            <View style={styles.divider} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default FullPublicProfile;

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
