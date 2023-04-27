import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Calendar from '../../components/Calendar';
import Button from '../../components/Button';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import dayjs from 'dayjs';
import {fonts} from '../../assets/fonts';

import {AuthContext} from '../../context/AuthProvider';

import axios from 'axios';

import {
  baseURL,
  calculatePrices,
  getCurrentDate,
  getStatusName,
  getTaskName,
  mergeDateTime,
  msToTime,
  timeDifferenceInMilliseconds,
  timeToString,
  toastNew as toast,
} from '../../util/util';

import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {sendNotificaion} from '../../data/data';
import {useTranslation} from 'react-i18next';
import {ProfileHeader} from '../../components';

const EditTimeScreen = ({navigation, route}) => {
  const {user, setReload} = useContext(AuthContext);
  const {t} = useTranslation();

  const {info, userDetails, deviceId} = route.params;

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateType, setDateType] = useState(new Date(info.DateTimeStart));
  const [date, setDate] = useState(new Date(info.DateTimeStart));
  const [startDate, setStartDate] = useState(info.DateTimeStart);
  const [endDate, setEndDate] = useState(new Date(info.DateTimeEnd));

  const [mode, setMode] = useState();
  const [duration, setDuration] = useState(info.Duration);
  const [taskTypeId, setTaskTypeId] = useState(info.TaskTypeId);

  const bookingStatus = getStatusName(3, true);

  // picker viariables

  const [policeApproved, setPoliceApproved] = useState(
    info.RequirePolice === true || info.RequirePolice === 1 ? true : false,
  );
  // console.log(policeApproved);

  // alert cariables

  const [price, setPrice] = useState(info.InterpreterSalary);
  const [priceCustomer, setPriceCustomer] = useState(info.PricesCustomer);

  let defaultPriceCustomer, defaultPriceTranslator;

  if (taskTypeId === 2 || taskTypeId === 3) {
    // get the set price for customer
    defaultPriceCustomer = userDetails.VideoPhoneprice
      ? userDetails.VideoPhoneprice
      : 320;
    // get the set price for translator
    defaultPriceTranslator = user.profile.Phonevideo
      ? user.profile.Phonevideo
      : 160;
  } else {
    defaultPriceCustomer = userDetails.AttendancePrice
      ? userDetails.AttendancePrice
      : 320;
    // get the set price for translator
    defaultPriceTranslator = user.profile.Attendance
      ? user.profile.Attendance
      : 170;
  }

  // slight error here. we need to detrmin is task was booked as police approve or not

  const calendarEvents = async (bool, dt) => {
    console.log(dt, new Date(dt).getHours(), new Date(startDate).getHours());
    setCalendarVisible(bool);
    if (dt === 'cancel') {
      toast('Select a valid date', 'error');
      return;
    }

    const today = timeToString(getCurrentDate());
    const bookingTime = timeToString(dt);

    if (bookingTime.year < today.year) {
      toast('Invalid Year selected', 'error');
      return;
    }
    if (bookingTime.month < today.month && bookingTime.year <= today.year) {
      toast('Invalid month selected', 'error');
      return;
    }

    if (
      bookingTime.day < today.day &&
      bookingTime.month <= today.month &&
      bookingTime.year <= today.year
    ) {
      toast('Invalid day selected', 'error');
      return;
    }

    const mergedDate = await mergeDateTime(date, startDate, dt);

    setEndDate(dt);
    const timeDifInMillsec = timeDifferenceInMilliseconds(
      mergedDate.startTime,
      mergedDate.endTime,
    );
    var timeVariant = await msToTime(timeDifInMillsec);
    setDuration(timeVariant.duration);
    const value =
      taskTypeId === 2 || taskTypeId === 3
        ? timeVariant.milliSecToMins
        : timeVariant.milliSecToHours;
    const prices = await calculatePrices(
      value,
      taskTypeId,
      defaultPriceCustomer,
      defaultPriceTranslator,
      policeApproved,
      startDate,
    );
    setPriceCustomer(prices.customerPrice);
    setPrice(prices.translatorPrice);
    console.log(prices);
    setError('');
  };

  const saveBooking = async () => {
    setLoading(true);
    const mergedDate = await mergeDateTime(date, startDate, endDate);
    const booking = {
      BookingID: info.BookingID,
      DateTimeEnd: mergedDate.endTime,
      StatusNameId: 3,
      InterpreterID: user.profile.Email,
    };

    postToDB(booking);
  };

  const postToDB = async booking => {
    try {
      const res = await axios.put(`/orders/extension`, booking);
      if (res.data.msg === 'success') {
        setReload(true);
        // send mail
        const body = {
          customerName: userDetails.FirstName + ' ' + userDetails.LastName,
          taskType: getTaskName(taskTypeId),
          bookingId: info.BookingID,
          caseNumber:
            info.OrdreNumber === null || info.OrdreNumber === 'null'
              ? 'Nil'
              : info.OrdreNumber, //info.OrdreNumber,
          startDate: timeToString(info.DateTimeStart).date,
          startTime: timeToString(info.DateTimeStart).time,
          endTime: timeToString(endDate).time,
          oldEndTime: timeToString(info.DateTimeEnd).time,
          recipient: [userDetails.Email],
          bcc: ['noreply@sprogteam.dk'],
          interpreterName: user.profile.FirstName + ' ' + user.profile.LastName,
          interpreterTelephone: user.profile.PhoneNumber,
          statusNameId: bookingStatus,
          toLanguage: info.ToLanguageName,
        };

        axios.post(`${baseURL}/mails/extension`, body);

        // send notification

        const notifcationBody = {
          userId: deviceId,
          title: 'Booking Notification',
          text: `Your booking with ID ${info.BookingID} time has been extended, Login to confirm`,
        };
        sendNotificaion(notifcationBody);

        toast('successful', 'success');

        navigation.navigate('Tab', {screen: 'Pending'});
      } else {
        toast('unable to complete changes', 'error');
        console.log(res.data.error.originalError);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast('error updating booking', 'error');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />

      <View
        style={{
          padding: 10,
          marginTop: 10,
        }}>
        <ScrollView>
          <View>
            {/* task police */}
            <View style={{marginTop: -10}}>
              <TouchableOpacity
                // onPress={() =>
                //   {setMode('date'),
                //   setCalendarVisible(true)
                //   setDateType('date')}
                // }
                style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:date')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'calendar'}
                  size={16}
                  color={'#000'}
                />
                <Text style={styles.text}>
                  {date && dayjs(date).format('YYYY:MM:DD')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={() => [
                //   setMode('time'),
                //   setCalendarVisible(true),
                //   setDateType('start'),
                // ]}
                style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:start_time')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'clock'}
                  size={16}
                  color={'#000'}
                />

                <Text style={styles.text}>
                  {startDate && timeToString(startDate).time}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  setMode('time'),
                  setCalendarVisible(true),
                  setDateType('end'),
                ]}
                style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:end_time')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'clock-check'}
                  size={16}
                  color={'#000'}
                />

                <Text style={styles.text}>
                  {startDate && timeToString(endDate).time}
                </Text>
              </TouchableOpacity>
              <View style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:duration')}:
                </Text>
                <Text style={[styles.text]}>{duration && duration}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:price')}:
                </Text>

                <Text style={[styles.text]}>{price && price + ' kr'}</Text>
              </View>
              {/* <Text style={[styles.text]}>
                  Customer {price && price + ' kr'}
                </Text> */}
              <ErrorMsg error={error} />
            </View>
          </View>
        </ScrollView>

        <View>
          {loading ? (
            <Indicator color={'#659ED6'} show={loading} size={'large'} />
          ) : (
            <Button
              onPress={() => saveBooking()}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:save')}
            />
          )}
        </View>
      </View>

      {calendarVisible && (
        <Calendar
          isDateTimePickerVisible={calendarVisible}
          mode={mode}
          calendarEvents={calendarEvents}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  text: {
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  checkRow: {
    flexDirection: 'row',
    marginTop: -20,
    alignItems: 'center',
  },

  dateRow: {
    marginStart: 15,
    margin: 10,
    flexDirection: 'row',
    alignContent: 'center',
  },
  wrapper: {
    paddingStart: 10,
    paddingEnd: 10,
    flex: 1,
  },
  pickerItem: {backgroundColor: '#fff', color: '#000'},
  textBox: {
    textAlignVertical: 'top',
    borderColor: '#000',
    color: '#000',
    borderWidth: 1,
    fontSize: 16,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    fontFamily: fonts.medium,
  },
});

export default EditTimeScreen;
