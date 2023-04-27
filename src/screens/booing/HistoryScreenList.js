import React, {useContext, useEffect, useState} from 'react';
import {Text, FlatList, SafeAreaView} from 'react-native';
import Header from '../../components/Header';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {getHistoricBookings} from '../../data/data';
import Agenda from '../../components/Agenda';

const HistoryListScreen = ({navigation}) => {
  const {
    historicBookings,
    setHistoricBookings,
    bookings,
    setReload,
    isInterpreter,
    user,
  } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    setReload(true);
  };

  async function fetchData() {
    // You can await here
    const res = await getHistoricBookings(bookings, isInterpreter);
    console.log(res.length);
    setHistoricBookings(res);
    // console.log(res);
    setRefreshing(false);
  }

  useEffect(() => {
    if (historicBookings.length === 0) fetchData();
  }, []);

  const searchLanguage = val => {
    setFilter(val);
  };

  return (
    <SafeAreaView>
      <Header
        placeholder={'Search by Booking ID'}
        searchLanguage={searchLanguage}
        showSearchBar={true}
      />

      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={{marginBottom: 50}}
        ListEmptyComponent={
          !refreshing && (
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                margin: 10,
                fontFamily: fonts.light,
              }}>
              List is empty {'\n'} swipe down to reload
            </Text>
          )
        }
        keyExtractor={item => item.BookingID}
        data={historicBookings}
        renderItem={({item, index}) => {
          if (item.BookingID.toString().includes(filter))
            return <Agenda item={item} navigation={navigation} />;
        }}
      />
    </SafeAreaView>
  );
};

export default HistoryListScreen;
