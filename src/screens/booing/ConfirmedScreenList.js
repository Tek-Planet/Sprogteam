import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import BookingList from '../../components/BookingList';
import Header from '../../components/Header';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {getConfirmedCount} from '../../data/data';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../assets/colors';
import {dimention} from '../../util/util';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const ConfirmedScreenList = () => {
  const {t} = useTranslation();

  const {
    confirmedBookings,
    setConfirmedBookings,
    bookings,
    setReload,
    setBookings,
    user,
  } = useContext(AuthContext);

  // console.log(user.profile.ContractID);

  const [refreshing, setRefreshing] = useState(true);
  const [filter, setFilter] = useState('');

  const [showPaymentAlert, setShowPaymentAlert] = useState(
    user !== null && user.profile.interpreter && user.profile.PaymentId === null
      ? true
      : false,
  );

  const navigation = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    setReload(true);
  };

  async function fetchData() {
    const res = await getConfirmedCount(bookings);
    setConfirmedBookings(res);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchData();
  }, [bookings]);

  useEffect(() => {
    if (bookings.length === 0) {
      setReload(true);
    }
  }, []);

  const searchLanguage = val => {
    setFilter(val);
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Header
        placeholder={'Search by Booking ID'}
        searchLanguage={searchLanguage}
        showSearchBar={true}
      />
      {showPaymentAlert && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('OtherNav', {
              screen: 'PaymentOption',
            });
          }}
          style={{
            margin: 5,
            padding: 10,
            borderRadius: 10,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 3,
            backgroundColor: colors.white,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.light,
              width: dimention.width * 0.7,
            }}>
            {t('common:click_to_add_payment')}
          </Text>

          <IonIcons
            onPress={() => {
              setShowPaymentAlert(false);
            }}
            name="close"
            size={26}
            color={colors.main}
            style={{padding: 5}}
          />
        </TouchableOpacity>
      )}
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={{marginBottom: 50}}
        ListEmptyComponent={
          !refreshing && (
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                margin: 10,
                marginTop: 20,
                fontFamily: fonts.light,
              }}>
              {t('common:list_empty')}
            </Text>
          )
        }
        keyExtractor={item => item.BookingID}
        data={confirmedBookings}
        renderItem={({item, index}) => {
          if (item.BookingID.toString().includes(filter))
            return (
              <BookingList
                onRefresh={onRefresh}
                user={user}
                item={item}
                index={index}
              />
            );
        }}
      />
    </View>
  );
};

export default ConfirmedScreenList;
