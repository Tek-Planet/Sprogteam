import React, {useState, useContext, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';

import Button from '../../components/Button';
import {Icon} from 'react-native-elements'

// import Mcicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fonts} from '../../assets/fonts';
import {AuthContext} from '../../context/AuthProvider';
import axios from 'axios';
import TranlatorsList from '../../components/TranlatorsList';
import moment from 'moment';
import {getFavourite} from '../../data/data';

const HomeScreen = ({navigation, route}) => {
  const {users, info} = route.params;

  const {favourites, user, setFavourites} = useContext(AuthContext);
  const [favList, setFavList] = useState(favourites);
  const [change, setChange] = useState('');
  const [refreshing, setRefreshing] = useState(true);

  async function fetchData() {
    // You can await here

    const res = await getFavourite(user.profile.Id);
    setFavourites(res);
    setRefreshing(false);
  }

  useEffect(() => {
    if (user && user !== null) {
      fetchData();
    }
  }, []);

  const removeFavourite = (interpreterId, index) => {
    axios
      .delete(`/favourites/${user.profile.Id}/${interpreterId}`)
      .then(res => {
        if (res.data.msg === 'Deleted') {
          // getFavourite(user.profile.Email);
          // let tem = favourites;
          // tem.splice(index, 1);
          // setFavList(tem);
          // setChange('  ');
          fetchData();
        } else {
          console.log(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const cooperateList = (item, index) => {
    const language = item.languages;
    console.log(item);
    return (
      <View
        key={index}
        style={{
          borderRadius: 10,
          margin: 5,
          shadowColor: 'grey',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.9,
          shadowRadius: 5,
          elevation: 5,
          backgroundColor: '#fff',
          padding: 15,
          justifyContent: 'space-between',
        }}>
        {/* top */}

        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              {/* circle-medium */}

              <Image
                source={
                  item.ProfilePicture && item.ProfilePicture !== null
                    ? {uri: item.ProfilePicture}
                    : require('../../assets/imgs/paulo.png')
                }
                style={{width: 70, height: 70, borderRadius: 100}}
              />

              <Icon
              type={"MaterialCommunityIcons"}
                style={{position: 'absolute', bottom: -10, right: -5}}
                name={'circle-medium'}
                size={36}
                color={item.Online === 'online' ? 'green' : 'grey'}
              />
            </View>
          </View>

          <Text
            style={[
              styles.statusText,
              {color: '#000', marginStart: 5, fontFamily: fonts.bold},
            ]}>
            {item.FirstName + ' ' + item.LastName}
          </Text>
          <Text
            style={[
              styles.statusText,
              {color: '#000', marginStart: 5, fontFamily: fonts.bold},
            ]}>
            {item.GenderId === 0 ? 'Kvinde' : 'Mand'}
          </Text>
          <Text
            style={[
              styles.statusText,
              {color: '#000', marginStart: 5, fontFamily: fonts.bold},
            ]}>
            City: {item.City}
          </Text>

          <Text
            style={[
              styles.statusText,
              {color: '#000', marginStart: 5, fontFamily: fonts.bold},
            ]}>
            Zipcode: {item.Zipcode}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.statusText,
                {color: '#000', marginStart: 5, fontFamily: fonts.bold},
              ]}>
              Sprog: {'  '}
            </Text>
            <FlatList
              listKey={moment().valueOf().toString()}
              numColumns={3}
              data={language}
              renderItem={({item}) => {
                return (
                  <Text style={[styles.statusText, {fontFamily: fonts.medium}]}>
                    {item.label + ', '}
                  </Text>
                );
              }}
              keyExtractor={(item, index) => item.value + index}
            />
          </View>
          <Text
            style={[
              styles.statusText,
              {
                color: '#000',
                marginStart: 5,
                fontFamily: fonts.medium,
                textAlign: 'justify',
              },
            ]}>
            {item.About}
          </Text>
        </View>

        {/* base */}
        <View>
          {item.Rating !== null && item.RatingNumber !== null && (
            <View
              style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
              <Icon type={'ionicons'} name={'star'} size={16} color={'#ECC369'} />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: '#000',
                    marginStart: 5,
                    fontFamily: fonts.medium,
                    marginBottom: 8,
                  },
                ]}>
                {item.Rating.toFixed(0)}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  {
                    color: '#000',
                    marginStart: 3,
                    fontFamily: 'Montserrat-Medium',
                    marginBottom: 8,
                  },
                ]}>
                {' '}
                ( {item.RatingNumber} )
              </Text>
            </View>
          )}

          <View
            style={{
              marginTop: 10,
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            }}>
            <View style={styles.filterBox}>
              <Button
                bGcolor={'#659ED6'}
                buttonTitle={'Kontakt'}
                onPress={() =>
                  navigation.navigate('OtherNav', {
                    screen: 'ChatScreen',
                    params: {info: item, type: 1},
                  })
                }
              />
            </View>
            <View style={styles.filterBox}>
              <Button
                bGcolor={'green'}
                buttonTitle={'Book'}
                onPress={() =>
                  navigation.navigate('OtherNav', {
                    screen: 'Order',
                    params: {info: item},
                  })
                }
              />
            </View>
            <View style={styles.filterBox}>
              <Button
                buttonTitle={'Fjern'}
                onPress={() => removeFavourite(item.Id, index)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        !refreshing && (
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              margin: 10,
              fontFamily: fonts.bold,
            }}>
            Inge tolke at vise
          </Text>
        )
      }
      keyExtractor={item => item.Id}
      data={users}
      renderItem={({item, index}) => {
        return (
          <TranlatorsList
            navigation={navigation}
            item={item}
            index={index}
            info={info}
            doPrice={true}
          />
        );
      }}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  filterBox: {
    minWidth: 100,
  },

  statusText: {
    fontFamily: fonts.medium,
    color: '#000',
    fontSize: 13,
    marginTop: 10,
  },
});
