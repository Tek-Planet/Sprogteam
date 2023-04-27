import React, {useState, useContext, useEffect} from 'react';
import {View, Text} from 'react-native';
import {ProfileHeader} from '../components';
import {Calendar} from 'react-native-calendars';
import {colors} from '../assets/colors';
import moment from 'moment';
import {AuthContext} from '../context/AuthProvider';
import {addRemoveAvailability, getAvailability} from '../data/data';

const AvailabilityScreen = () => {
  const {user, availability, setAvailability} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // var [availability, setAvailability] = useState({
  //   '2022-08-20': {color: colors.main, textColor: colors.white},
  //   '2022-08-22': {color: colors.main, textColor: colors.white},
  //   '2022-08-24': {color: colors.main, textColor: colors.white},
  //   '2022-09-24': {color: colors.main, textColor: colors.white},
  // });
  var [reload, setReload] = useState();
  //   delete availability['2022-08-20'];
  // availability['2022-08-02'] = {color: colors.main, textColor: colors.white};
  const addNewDate = date => {
    if (availability[date]) {
      delete availability[date];
    } else {
      availability[date] = {color: 'red', textColor: colors.white};
    }

    const body = {
      InterpreterId: user.profile.Id,
      Day: date,
    };

    setReload(moment().valueOf().toString());

    addRemoveAvailability(body);
  };

  async function fetchData() {
    const res = await getAvailability(user.profile.Id);

    if (res.length > 0) {
      for (const iterator of res) {
        availability[iterator.Day] = {
          color: 'red',
          textColor: colors.white,
        };
      }
      setAvailability(availability);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{backgroundColor: colors.white}}>
      <ProfileHeader />
      <Calendar
        onDayPress={day => {
          addNewDate(day.dateString);
        }}
        markingType={'period'}
        markedDates={availability}
      />
    </View>
  );
};

export default AvailabilityScreen;
