import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView} from 'react-native';
import {BookingList} from '../../components';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {getBookings, getMyRequests} from '../../data/data';
import {FAB} from 'react-native-paper';
import {Header} from '../../components';

const MyRequestScreen = ({navigation}) => {
  const {bookings, user} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(true);
  const [myRequests, setMyRequests] = useState([]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getBookings(user);
    fetchData();
  };

  async function fetchData() {
    // You can await here

    const res = await getMyRequests(bookings, user.profile.Id);

    setMyRequests(res);
    // console.log(res);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchData();
  }, [bookings]);

  useEffect(() => {
    if (bookings.length === 0) {
      getBookings(user);
    }
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header navigation={navigation} />
      <FAB
        color="#fff"
        style={{
          position: 'absolute',
          backgroundColor: '#659ED6',
          margin: 16,
          right: 0,
          bottom: 10,
          zIndex: 1,
        }}
        small
        icon="plus"
        onPress={() =>
          navigation.navigate('OtherNav', {
            screen: 'RequestNav',
          })
        }
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
        keyExtractor={item => item.booking.BookingID}
        data={myRequests}
        renderItem={({item, index}) => {
          // console.log(item.request);
          return (
            <BookingList
              item={item.booking}
              users={item.users}
              index={index}
              navigation={navigation}
              request={item.request}
            />
          );
        }}
      />
    </View>
  );
};

export default MyRequestScreen;
