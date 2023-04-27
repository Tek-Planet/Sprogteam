import React, {useContext, useState, useEffect} from 'react';
import {Agenda} from 'react-native-calendars';
import {StyleSheet} from 'react-native';

import {AuthContext} from '../../context/AuthProvider';

import AgendaList from '../../components/Agenda';
import {getBookings} from '../../data/data';
import {dateToMilliSeconds, getCurrentDate} from '../../util/util';

const Timetable = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(new Date());

  const [items, setItems] = useState({});

  async function fetchData() {
    // You can await here

    const res = await getBookings(user);
    setBookings(res);
    // console.log(res);
    setRefreshing(false);
  }

  const loadItems = day => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!bookings[strTime]) {
          items[strTime] = [];

          for (let j = 0; j < bookings.length; j++) {
            if (
              bookings[j].DateTimeStart.includes(strTime) &&
              (bookings[j].StatusName === 2 || bookings[j].StatusName === 3) &&
              dateToMilliSeconds(bookings[j].DateTimeEnd) >
                dateToMilliSeconds(getCurrentDate())
            ) {
              items[strTime].push(bookings[j]);
            }
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const timeToString = time => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const onRefresh = async () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    if (items === {}) {
      loadItems.bind(selected);
    }
  }, [items]);

  return (
    <Agenda
      pastScrollRange={2}
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
