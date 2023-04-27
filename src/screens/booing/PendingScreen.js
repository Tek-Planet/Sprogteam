import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import BookingList from '../../components/BookingList';
import Header from '../../components/Header';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../assets/colors';

const PendingScreen = ({navigation}) => {
  const {t} = useTranslation();

  const {pendingBookings, setReload, reload} = useContext(AuthContext);
  // console.log(reload);
  const [refreshing, setRefreshing] = useState(true);
  const [filter, setFilter] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    setReload(true);
  };

  useEffect(() => {
    if (!reload && refreshing) setRefreshing(false);
  }, [reload]);

  const searchLanguage = val => {
    setFilter(val);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
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
        data={pendingBookings}
        renderItem={({item, index}) => {
          if (item.BookingID.toString().includes(filter))
            return (
              <BookingList
                onRefresh={onRefresh}
                item={item}
                index={index}
                navigation={navigation}
              />
            );
        }}
      />
    </View>
  );
};

export default PendingScreen;
