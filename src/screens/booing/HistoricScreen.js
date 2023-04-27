import React, {useContext, useState, useEffect} from 'react';
import {Agenda} from 'react-native-calendars';
import {Text, View, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import {AuthContext} from '../../context/AuthProvider';
import Button from '../../components/Button';
import AgendaList from '../../components/Agenda';
import {getBookings} from '../../data/data';
import {dateToMilliSeconds, getCurrentDate} from '../../util/util';

const Timetable = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(new Date());

  const [items, setItems] = useState({});

  const loadItems = day => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!bookings[strTime]) {
          items[strTime] = [];

          for (let j = 0; j < bookings.length; j++) {
            // push all kind of boooking for a user
            if (!user.profile.interpreter || user.profile.interpreter === 0) {
              if (
                bookings[j].DateTimeStart.includes(strTime) &&
                dateToMilliSeconds(bookings[j].DateTimeEnd) <
                  dateToMilliSeconds(getCurrentDate()) &&
                (bookings[j].StatusName === 2 ||
                  bookings[j].StatusName === 3 ||
                  bookings[j].StatusName === 7)
              ) {
                items[strTime].push(bookings[j]);
              }
            }
            //  push only pass comppleted bookings
            else {
              if (
                bookings[j].DateTimeStart.includes(strTime) &&
                dateToMilliSeconds(bookings[j].DateTimeEnd) <
                  dateToMilliSeconds(getCurrentDate()) &&
                (bookings[j].StatusName === 2 ||
                  bookings[j].StatusName === 3 ||
                  bookings[j].StatusName === 7)
              ) {
                // console.log('found match at', j);
                items[strTime].push(bookings[j]);
              }
            }
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
      // console.log(newItems);
    }, 1000);
  };

  const timeToString = time => {
    const date = new Date(time);
    // console.log(date.toISOString().split('T')[0]);
    return date.toISOString().split('T')[0];
  };

  async function fetchData() {
    // You can await here

    const res = await getBookings(user);
    setBookings(res);
    // console.log(res);
    setRefreshing(false);
  }

  const onRefresh = async () => {
    setItems({});
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    if (items === {}) {
      loadItems.bind(selected);
    }
  }, [items]);

  const renderItem = item => {
    return (
      <View
        key={item.Id}
        style={{
          margin: 5,
          elevation: 5,
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 10,
        }}>
        {/* top */}
        <View style={{}}>
          <Text style={[styles.text, {color: 'green'}]}>
            BookingID: {item.OrdreNumber}
          </Text>
        </View>
        <View style={{}}>
          <Text style={styles.text}>
            Startdato: {dayjs(item.DateTimeStart).format('YYYY-MM-DD HH:mm')}
          </Text>
          <Text style={styles.text}>
            Slutdato: {dayjs(item.DateTimeEnd).format('YYYY-MM-DD HH:mm')}
          </Text>
        </View>
        <Text style={styles.text}>{item.BookingDetails}</Text>
        <View style={{alignItems: 'center'}}>
          <Button
            onPress={() =>
              navigation.navigate('OtherNav', {
                screen: 'BookingDetails',
                params: {item: item},
              })
            }
            bGcolor={'#659ED6'}
            buttonTitle={'Details'}
          />
        </View>
      </View>
    );
  };

  return (
    <Agenda
      futureScrollRange={2}
      items={items}
      loadItemsForMonth={loadItems.bind(this)}
      selected={selected}
      renderItem={item => {
        return <AgendaList item={item} navigation={navigation} />;
      }}
      onRefresh={() => onRefresh()}
      refreshing={refreshing}
    />
  );
};

export default Timetable;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'justify',
    margin: 5,
  },
});
