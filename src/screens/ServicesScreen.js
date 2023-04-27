import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  Header,
  BookingList,
  TranlatorsList,
  ActivityIndicator,
} from '../components';
import {fonts} from '../assets/fonts';
import {AuthContext} from '../context/AuthProvider';

import {useTranslation} from 'react-i18next';
import {dimention, getBookingToken, isIpad} from '../util/util';
import {getConfirmedCount, getFavourite} from '../data/data';
import {colors} from '../assets/colors';
import {booking} from '../assets/icons';

const ServicesScreen = ({navigation}) => {
  const {
    translators,

    refreshing,
    setRefreshing,

    bookings,
    confirmedBookings,
    setConfirmedBookings,
    user,

    favourites,
    setFavourites,
    reloadFavourite,
    setReloadFavourite,
    setReload,
    setToken,
    available_services,
  } = useContext(AuthContext);
  const {t} = useTranslation();

  // console.log(user.profile.CanBook);

  const [translatorList, setTranslatorList] = useState(
    refreshing ? [] : translators,
  );

  const [filter, setFilter] = useState('');

  const [loading, setLoading] = useState(false);

  // const services = getServices();

  const fetchData = async () => {
    // console.log(user.profile.MunicipalTasks);
    setLoading(true);

    if (bookings.length === 0) setReload(true);

    if (favourites.length === 0) setReloadFavourite(true);

    setRefreshing(false);
    const bookingToken = await getBookingToken();
    setToken(bookingToken);
  };

  const servieslist = () => (
    <View style={{marginTop: 5}}>
      {/* this take the skills list */}
      <View style={styles.headerRow}>
        <Text style={[styles.boxHeadingText]}>
          {t('common:available') + ' ' + t('common:services')}
        </Text>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 10}}
        horizontal>
        {user?.profile?.CanBook && (
          <TouchableOpacity
            onPress={() => {
              // console.log(item.value);
              navigation.navigate('AllTranslators');
            }}
            style={[styles.filterBox]}>
            <Image
              resizeMode="contain"
              style={{
                height: 120,
                width: '100%',
              }}
              source={booking}
            />
            <Text style={[styles.filterText]}>
              {t('common:direct') + ' ' + t('common:booking')}
            </Text>
          </TouchableOpacity>
        )}
        {available_services.map((item, index) => {
          if (item.label.toLowerCase().includes(filter.toLowerCase())) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // console.log(item.value);
                  navigation.navigate('TranslatorList', {
                    id: item.value,
                    serviceName: item.label,
                  });
                }}
                style={[styles.filterBox]}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 120,
                    width: '100%',
                  }}
                  source={item.image}
                />
                <Text style={[styles.filterText]}>
                  {item.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    </View>
  );

  const LoadingComponent = () => {
    return (
      <View
        style={{height: 200, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" show={loading} />
      </View>
    );
  };

  const upcomingList = () => (
    <View style={{marginTop: 13}}>
      {/* this take the skills list */}
      <View style={styles.headerRow}>
        <Text style={[styles.boxHeadingText, {width: 240}]}>
          {t('common:upcoming') + ' ' + t('common:booking') + ' '}(
          {confirmedBookings.length})
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Confirmed');
          }}>
          <Text
            style={[
              styles.boxHeadingText,
              {color: '#659ED6', fontFamily: fonts.medium},
            ]}>
            {t('common:view') + ' ' + t('common:all')}
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <LoadingComponent />
      ) : (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 10}}
          horizontal>
          {confirmedBookings.map((item, index) => {
            if (index <= 1) {
              return (
                <BookingList
                  key={index.toString()}
                  item={item}
                  index={index}
                  navigation={navigation}
                  width={
                    isIpad ? dimention.width * 0.45 : dimention.width * 0.9
                  }
                />
              );
            }
          })}
        </ScrollView>
      )}
    </View>
  );

  const favouriteList = () => (
    <View style={{marginTop: 13}}>
      {/* this take the skills list */}
      <View style={styles.headerRow}>
        <Text style={[styles.boxHeadingText]}>
          {t('common:favourites')} ({favourites.length})
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Favourite');
          }}>
          <Text
            style={[
              styles.boxHeadingText,
              {color: '#659ED6', fontFamily: fonts.medium},
            ]}>
            {t('common:view') + ' ' + t('common:all')}
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <LoadingComponent />
      ) : (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 10}}
          horizontal>
          {favourites?.map((item, index) => {
            if (index <= 2) {
              return (
                <TranlatorsList
                  key={index.toString()}
                  item={item.info}
                  favorite={true}
                  width={
                    isIpad ? dimention.width * 0.45 : dimention.width * 0.9
                  }
                  filter={''}
                />
              );
            }
          })}
        </ScrollView>
      )}
    </View>
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getConfirmedBooking = async () => {
      const resConfirm = await getConfirmedCount(bookings);
      setConfirmedBookings(resConfirm);
      setLoading(false);
    };
    if (bookings.length > 0) getConfirmedBooking();
  }, [bookings]);

  useEffect(() => {
    const fetchFavourite = async () => {
      if (reloadFavourite && user && user !== null) {
        const resFavourite = await getFavourite(user.profile.Id);
        setFavourites(resFavourite);
        setReloadFavourite(false);
        setLoading(false);
      }
    };
    fetchFavourite();
  }, [reloadFavourite]);

  const goToSearch = () => {
    navigation.navigate('Search');
  };

  return (
    <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
      <Header
        doSomething={goToSearch}
        showTouchNav
        navigation={navigation}
        placeholder={t('common:search')}
      />
      <View style={{padding: 10}}>
        {servieslist()}
        {upcomingList()}
        {favouriteList()}
      </View>
    </ScrollView>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  boxHeadingText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: fonts.bold,
    padding: 10,
  },

  filterBox: {
    margin: 5,
    borderRadius: 10,
    height: 160,
    width: isIpad ? dimention.width * 0.2 : dimention.width * 0.4,
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
  },
  filterText: {
    marginTop: 10,
    fontFamily: fonts.bold,
    fontSize: 13,
    textAlign: 'center',
    color: colors.black,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
