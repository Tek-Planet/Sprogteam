import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Calendar from '../../components/Calendar';
import Button from '../../components/Button';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import dayjs from 'dayjs';
import moment from 'moment';
import {fonts} from '../../assets/fonts';
import {CheckBox} from 'react-native-elements';

import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Micons from 'react-native-vector-icons/MaterialIcons';

import {AuthContext} from '../../context/AuthProvider';
import ConfimScreen from '../../components/ConfimScreen';
import axios from 'axios';

import Geolocation from 'react-native-geolocation-service';

import {
  calculateDistance,
  getToken,
  createMeetingLink,
  toastNew as toast,
  decodeLocationByCoordinates,
  timeToString,
} from '../../util/util';
import CustomDropDown from '../../components/CustomDropDown';
import {useTranslation} from 'react-i18next';

const EditBookingScreen = ({navigation, route}) => {
  const {user, setReload, transInfo, setTransInfo, token} =
    useContext(AuthContext);
  const {t} = useTranslation();

  const {info, userDetails, doPrice} = route.params;

  // console.log(userDetails.Id);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [body, setBody] = useState(info.Remark);
  const [self, setSelf] = useState(info.BookingForSelf);
  const [address, setAddress] = useState(info.Address);
  const [useMyAddress, setUseMyAddress] = useState(false);
  const [checkedphone, setCheckedPhone] = useState(
    info.TaskTypeId === 3 ? true : false,
  );
  const [checkedvideo, setCheckedVideo] = useState(
    info.TaskTypeId === 2 ? true : false,
  );
  const [checkedtendency, setCheckedTenddency] = useState(
    info.TaskTypeId === 1 ? true : false,
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateType, setDateType] = useState(new Date(info.DateTimeStart));
  const [date, setDate] = useState(new Date(info.DateTimeStart));
  const [startDate, setStartDate] = useState(new Date(info.DateTimeStart));
  const [endDate, setEndDate] = useState(new Date(info.DateTimeEnd));
  const [SSN, setSSN] = useState(info.OrdreNumber);
  const [partnerName, setPatnerName] = useState(info.CitizenName);
  const [mode, setMode] = useState();
  const [duration, setDuration] = useState(info.Duration);
  const [taskTypeId, setTaskTypeId] = useState(info.TaskTypeId);
  const [showPoliceOption, setShowPoliceOption] = useState(
    info.RequirePolice === true || info.RequirePolice === 1 ? true : false,
  );

  // picker viariables

  const [policeApproved, setPoliceApproved] = useState(
    info.RequirePolice === true || info.RequirePolice === 1 ? true : false,
  );
  // console.log(policeApproved);

  const [price, setPrice] = useState(info.InterpreterSalary);
  const [priceCustomer, setPriceCustomer] = useState(info.PricesCustomer);
  const [fare, setFare] = useState(info.Tfare);
  const [fareCustomer, setFareCustomer] = useState(info.TfareCustomer);
  const [confirm, setConfirm] = useState(false);
  const [onlineMeeting, setOnlineMeeting] = useState(info.VideoApi);
  const [booking, setBooking] = useState(null);
  const [km, setKm] = useState(info.kmTilTask);

  const [hr, setHr] = useState(0);
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const language =
    userDetails.languages && userDetails.languages !== null
      ? userDetails.languages
      : [];

  const [value, setValue] = useState({
    label: info.ToLanguageName,
    value: info.ToLanguageID,
  });

  // console.log(value);

  // calculate price for booking that has no price when the page load.

  const calculatePriceIfMissing = async () => {
    const mergedDate = await mergeDateTime(date, startDate, endDate);

    calculateDuration(mergedDate.startTime, mergedDate.endTime);
  };

  const calendarEvents = async (bool, dt) => {
    setCalendarVisible(bool);
    if (dt !== 'cancel') {
      if (taskTypeId !== 0) {
        if (dateType === 'date') {
          if (new Date(dt).getUTCDate() >= new Date().getUTCDate()) setDate(dt);
          else toast('Date cannot be less than current date', 'error');
        } else if (dateType === 'start') {
          setStartDate(dt);
        } else {
          if (
            startDate &&
            new Date(dt).getHours() >= new Date(startDate).getHours()
          ) {
            if (
              new Date(dt).getUTCDate() !== new Date(startDate).getUTCDate()
            ) {
              const mergedDate = await mergeDateTime(
                new Date(date),
                new Date(startDate),
                new Date(dt),
              );

              setEndDate(dt);
              calculateDuration(mergedDate.startTime, mergedDate.endTime);
              setError(null);
            } else {
              setEndDate(dt);
              calculateDuration(startDate, dt);
              setError(null);
            }
          } else {
            console.log(new Date(dt).getHours());
            toast('Endtime cannot be less than start time', 'error');
          }
        }
      } else toast('Select tranlation type before schedulling', 'error');
    } else toast('Select a valid date', 'error');
  };

  const mergeDateTime = async (time, start, end) => {
    const date = new Date(time).toISOString().split('T')[0];
    const sTime = new Date(start).toISOString().split('T')[0];
    const eTime = new Date(end).toISOString().split('T')[0];
    const rSTime = new Date(start).toISOString().replace(sTime, date);
    const rETime = new Date(end).toISOString().replace(eTime, date);
    return {startTime: rSTime, endTime: rETime};
  };

  const calculatePrices = async min => {
    // decides if its morning or
    const hour = new Date(startDate).getHours();
    const day = new Date(date).getDay();

    let customerPrice,
      translatorPrice,
      defaultPriceCustomer,
      defaultPriceTranslator;

    if (taskTypeId === 2 || taskTypeId === 3) {
      // get the set price for customer
      defaultPriceCustomer =
        user.profile.VideoPhoneprice !== null
          ? user.profile.VideoPhoneprice
          : 320;
      // get the set price for translator
      defaultPriceTranslator =
        userDetails.Phonevideo !== null ? userDetails.Phonevideo : 160;
    } else {
      defaultPriceCustomer =
        user.profile.AttendancePrice !== null
          ? user.profile.AttendancePrice
          : 320;
      // get the set price for translator
      defaultPriceTranslator =
        userDetails.Attendance !== null ? userDetails.Attendance : 170;
    }
    console.log(defaultPriceCustomer, 'Kr');

    // weekday and morning price
    if (hour >= 8 && hour <= 16 && day > 0 && day < 6) {
      // check task type if its either audio or telephone
      if (taskTypeId === 2 || taskTypeId === 3) {
        console.log('weekday morning price telephone / video');
        if (policeApproved) {
          console.log('police approved');

          // get 50% incremanet for police approved translators during the day
          // charge customer  50% incremanet for police approved translators during the day
          customerPrice = min * (defaultPriceCustomer / 60);
          customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
          translatorPrice = min * (defaultPriceTranslator / 60);
          translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(
            2,
          );
        } else {
          customerPrice = (min * (defaultPriceCustomer / 60)).toFixed(0);
          translatorPrice = (min * (defaultPriceTranslator / 60)).toFixed(0);
          console.log(min + ' non police approved' + customerPrice);
        }
      } else {
        console.log('weekday morning price attendance');
        // calculate weekday and morning price for attendace booking
        if (policeApproved) {
          // get 50% incremanet for police approved translators during the day
          // charge customer  50% incremanet for police approved translators during the day
          customerPrice = min * defaultPriceCustomer;
          customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
          translatorPrice = min * defaultPriceTranslator;
          translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(
            0,
          );
        } else {
          customerPrice = (min * defaultPriceCustomer).toFixed(0);
          translatorPrice = (min * defaultPriceTranslator).toFixed(0);
        }
      }
    }
    // weekend and night price
    else {
      if (taskTypeId === 2 || taskTypeId === 3) {
        console.log('weekend night price telephone / video');
        if (policeApproved) {
          console.log('police approved');
          // get 50% incremanet for police approved translators during the day
          // charge customer  50% incremanet for police approved translators during the day
          customerPrice = min * (defaultPriceCustomer / 60);
          customerPrice = (customerPrice + customerPrice).toFixed(0);
          translatorPrice = min * (defaultPriceTranslator / 60);
          translatorPrice = (translatorPrice + translatorPrice).toFixed(0);
        } else {
          console.log('non  approved');
          // get 30% incremanet for police approved translators during the day
          // charge customer  30% incremanet for police approved translators during the day
          customerPrice = min * (defaultPriceCustomer / 60);
          customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
          translatorPrice = min * (defaultPriceTranslator / 60);
          translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(
            0,
          );
        }
      } else {
        // calculate weekend price for attendace booking
        console.log('weekend night price attendance');
        if (policeApproved) {
          console.log('police approved');
          // get 50% incremanet for police approved translators during the day
          // charge customer  50% incremanet for police approved translators during the day
          customerPrice = min * defaultPriceCustomer;
          customerPrice = (customerPrice + customerPrice).toFixed(0);
          translatorPrice = min * defaultPriceTranslator;
          translatorPrice = (translatorPrice + translatorPrice).toFixed(0);
        } else {
          console.log('non approved');
          // get 30% incremanet for police approved translators during the day
          // charge customer  30% incremanet for police approved translators during the day
          customerPrice = min * defaultPriceCustomer;
          customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
          translatorPrice = min * defaultPriceTranslator;
          translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(
            0,
          );
        }
      }
    }

    setPriceCustomer(customerPrice);
    setPrice(translatorPrice);
    const prices = {
      customerPrice,
      translatorPrice,
    };
    return prices;
  };

  const calculateDuration = (start, end) => {
    var timeStart = dayjs(start);
    var timeEnd = dayjs(end);
    var d = timeEnd.diff(timeStart);
    // 10800000
    msToTime(d);
  };

  const msToTime = async duration => {
    var minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    var min = hours * 60 + minutes;

    // calculate the actual hour attendance calculation
    var hrs;
    if (minutes <= 0) hrs = hours;
    else if (minutes >= 1 && minutes <= 30) hrs = hours + 0.5;
    else hrs = hours + 1;

    setHr(hrs);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    setDuration(hours + ':' + minutes);

    const value = taskTypeId === 2 || taskTypeId === 3 ? min : hrs;
    const prices = await calculatePrices(value);
    console.log(prices);
  };

  const calculatDistance = async (pos1, pos2) => {
    let customerKmPrice =
      user.profile.KmPrice !== null ? user.profile.KmPrice : 3.44;
    let translatorKmPrice =
      userDetails.KmPrice !== null ? userDetails.KmPrice : 2.44;

    let fareTranslator, fareCustomer;

    const res = await calculateDistance(pos1, pos2);

    if (res === 'error') {
      setLoading(false);
      setError('Please try again');
    } else {
      const distance = (res.rows[0].elements[0].distance.value / 1000).toFixed(
        0,
      );

      if (distance * 2 > 12) {
        fareTranslator = ((distance * 2 - 12) * translatorKmPrice).toFixed(0);
      } else fareTranslator = 0;
      setFare(fareTranslator);
      fareCustomer = (distance * customerKmPrice * 2).toFixed(0);
      setFareCustomer(fareCustomer);
      bookingObject(fareTranslator, fareCustomer, res, null, distance);
    }
  };

  const checkToken = async () => {
    // const token = await getToken();
    var meeting = null;
    const methodType = 'post';
    if (token !== null) {
      const expire = moment(token.expires_in).subtract(10, 'minutes');
      const now = moment();

      // token has expired get new token
      if (now.isSameOrAfter(expire)) {
        const token = await getToken();
        if (token !== 'error') {
          // token was created

          meeting = await createMeetingLink(
            startDate,
            endDate,
            token.token,
            methodType,
          );
        } else {
          setError('Unable to submit your booking please try again');
          setLoading(false);
        }
      } else {
        // book meeting with token existing tokwn
        meeting = await createMeetingLink(
          startDate,
          endDate,
          token.token,
          methodType,
          // onlineMeeting,
        );
      }

      if (meeting !== 'error' && meeting !== null) {
        let joinUrl = meeting.joinUrl;
        setOnlineMeeting(joinUrl);
        bookingObject(null, null, null, joinUrl, null);
      } else {
        setError('Unable to submit your booking please try again');
        setLoading(false);
      }

      // console.log(new Date(token.expires_in) - new Date());
    }
  };

  const saveBooking = async () => {
    // console.log(user.profile)
    if (taskTypeId === 0) setError('Vælg type af tolkning');
    else if (date === null) setError('Provide start date');
    else if (startDate === null) setError('Provide start time');
    else if (endDate === null) setError('Provide end time');
    else if (!useMyAddress && address === null && taskTypeId === 1)
      setError('Provide meeting venue');
    else if (!self && partnerName.trim().length < 1)
      setError('Provide meeting person name');
    // else if (body.trim().length < 1) setError(null);
    else if (value === null) setError('Select langauge');
    else {
      //08171931956
      setError(null);
      setLoading(true);
      // check the task type
      if (taskTypeId === 2 || taskTypeId === 3) {
        // the date has not changed so save without updating link
        if (onlineMeeting !== null) {
          console.log(' saving without link');
          bookingObject(null, null, null, onlineMeeting, null);
        }
        // this will be triggered incase of editing from tendency to other types of translation
        else {
          console.log('create link b4 saving');
          checkToken();
        }

        // bookingObject(null, null, null);
      } else {
        bookingObject(null, null, null, null, null);

        // we need to calculate distance

        // let addres = useMyAddress
        //   ? user.profile.Adresse +
        //     ' ' +
        //     user.profile.City +
        //     ' ' +
        //     user.profile.State
        //   : address;

        // let transaAddress =
        //   userDetails.Adresse +
        //   ' ' +
        //   userDetails.City +
        //   ' ' +
        //   userDetails.State;

        // we need to calculate distance

        // convert provided address
        // const res = await decodeLocationByName(addres);
        // const resT = await decodeLocationByName(transaAddress);

        // if (res !== null && resT !== null) {
        //   addres = res[0];
        //   transaAddress = resT[0];

        //   calculatDistance(
        //     transaAddress.formattedAddress,
        //     addres.formattedAddress,
        //   );
        // } else {
        //   setError('Connectivity error please try again later');
        //   setLoading(false);
        // }
      }

      // setLoading(true);
    }
  };

  const bookingObject = async (tfare, customertfare, add, meting, distance) => {
    const mergedDate = await mergeDateTime(date, startDate, endDate);

    const booking = {
      BookingID: info.BookingID,
      DateTimeStart: mergedDate.startTime,
      DateTimeEnd: mergedDate.endTime,
      TaskTypeId: taskTypeId,
      FromLanguageID: 'Danish',
      ToLanguageString: value.label,
      ToLanguageID: value.value,
      InterpreterID: userDetails.Id,
      CitizenName: self
        ? user.profile.FirstName + '  ' + user.profile.LastName
        : partnerName,
      OrderNumber: SSN,
      Address:
        taskTypeId === 1
          ? useMyAddress
            ? user.profile.Adresse + ' ' + user.profile.City
            : address
          : null,
      Duration: duration,
      Fee: price,
      FeeCustomer: priceCustomer,
      Tfare: tfare,
      TfareCustomer: customertfare,
      Remark: body,
      OnlineMeeting: taskTypeId === 1 ? null : meting,
      KmTilTask: distance !== null ? distance * 2 : km,
      BookingForSelf: self ? 1 : 0,
      RequirePolice: policeApproved ? 1 : 0,
    };

    // console.log(booking);

    setBooking(booking);
    setLoading(false);
    setConfirm(true);
  };

  const postToDB = async booking => {
    setLoading(true);
    setTransInfo(null);

    try {
      const res = await axios.put(`/orders`, booking);
      if (res.data.msg === 'success') {
        axios.put(`/request/Closed/${info.BookingID}`);

        setReload(true);
        await toast('Booking Completed', 'success');
        navigation.navigate('Tab', {screen: 'Pending'});
      } else {
        toast('unable to complete booking please try again', 'error');
        console.log(res.data.error.originalError);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast('unable to complete booking please try again', 'error');
    }
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    setLocationLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        decodeLocation(pos);
      },
      error => {
        toast('unable to decode your location', 'error');
        console.log(error);
        setLocationLoading(false);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: true,
      },
    );
  };

  const hasPermissionIOS = async () => {
    // const openSetting = () => {
    //   Linking.openSettings().catch(() => {
    //     setError('Unable to open settings');
    //     setLoading(false);
    //   });
    // };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      setError('Location permission denied');
      setLoading(false);
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      setError('Location permission denied by user');
      toast('Location permission denied by user.', 'error');

      setLoading(false);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      setError('Location permission revoked by user');
      toast('Location permission revoked by user.', 'error');
      setLoading(false);
    }

    return false;
  };

  const decodeLocation = async position => {
    const res = await decodeLocationByCoordinates(position);

    if (res.length > 0) {
      setLocation(res[0].formattedAddress);
      setAddress(res[0].formattedAddress);
      setLocationLoading(false);
    } else {
      toast('Unable to decode your location', 'error');
      setLocationLoading(false);
    }
  };

  // useeffect to execute ifprice is missing method

  useEffect(() => {
    if (doPrice) calculatePriceIfMissing();
  }, []);

  if (!confirm) {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            margin: 5,

            flex: 1,
          }}>
          {calendarVisible && (
            <Calendar
              isDateTimePickerVisible={calendarVisible}
              mode={mode}
              calendarEvents={calendarEvents}
            />
          )}

          {transInfo !== null && (
            <TouchableOpacity
              onPress={() => {
                setTransInfo(null);
                navigation.goBack();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'grey',
                borderRadius: 10,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    margin: 10,
                    lineHeight: 20,
                    color: '#fff',
                    fontFamily: fonts.bold,
                  },
                ]}>
                Rebooking Mode Enabled {`\n`}Click to Cancel
              </Text>

              <Ionicons
                style={{marginEnd: 10}}
                name={'close'}
                size={20}
                color={'#000'}
              />
            </TouchableOpacity>
          )}
          {/*  the language section */}
          <Text style={[styles.text, {margin: 10}]}>
            {t('common:select') + ' ' + t('common:language')}
          </Text>

          <CustomDropDown
            value={value}
            language={language}
            setValue={setValue}
          />

          <View>
            <View
              style={{
                margin: 10,
              }}>
              <Text style={styles.text}>
                {t('common:type_of_interpretation')}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  onPress={() => {
                    if (checkedphone) {
                      setCheckedPhone(false);
                      setCheckedVideo(false);
                      setCheckedTenddency(false);
                    } else {
                      setTaskTypeId(3);
                      setCheckedPhone(true);
                      setCheckedVideo(false);
                      setCheckedTenddency(false);
                    }
                  }}
                  checked={checkedphone}
                />
                <Text style={styles.text}>{t('common:phone')}</Text>
              </View>

              <View style={styles.checkRow}>
                <CheckBox
                  onPress={() => {
                    if (checkedvideo) {
                      setCheckedVideo(!checkedvideo);
                      setCheckedPhone(!checkedvideo);
                      setCheckedTenddency(!checkedvideo);
                    } else {
                      setTaskTypeId(2);
                      setCheckedVideo(true);
                      setCheckedPhone(false);
                      setCheckedTenddency(false);
                    }
                  }}
                  checked={checkedvideo}
                />
                <Text style={styles.text}> {t('common:video')} </Text>
              </View>

              <View style={styles.checkRow}>
                <CheckBox
                  onPress={() => {
                    if (checkedtendency) {
                      setCheckedTenddency(false);
                      setCheckedPhone(false);
                      setCheckedVideo(false);
                    } else {
                      setTaskTypeId(1);
                      setCheckedTenddency(true);
                      setCheckedPhone(false);
                      setCheckedVideo(false);
                    }
                  }}
                  checked={checkedtendency}
                />
                <Text style={styles.text}> {t('common:attendance')}</Text>
              </View>
            </View>

            {showPoliceOption && (
              <View
                style={{
                  margin: 10,
                }}>
                <Text style={styles.text}>
                  {t('common:task_require_approval')} ?
                </Text>
                <View style={[styles.checkRow, {marginTop: -5}]}>
                  <CheckBox
                    onPress={() => {
                      if (policeApproved) {
                        setPoliceApproved(false);
                        //calculatePrices(hr);
                      } else {
                        setPoliceApproved(true);
                        //  calculatePrices(hr);
                      }
                    }}
                    checked={policeApproved}
                  />
                  <Text style={styles.text}>{t('common:yes')}</Text>

                  <CheckBox
                    onPress={() => {
                      setPoliceApproved(false);
                    }}
                    checked={!policeApproved}
                  />
                  <Text style={styles.text}>{t('common:no')} </Text>
                </View>
              </View>
            )}
            {/* task police */}
            <View style={{marginTop: -10}}>
              <TouchableOpacity
                onPress={() => [
                  setMode('date'),
                  setCalendarVisible(true),
                  setDateType('date'),
                ]}
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
                  {date && timeToString(date).date}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  setMode('time'),
                  setCalendarVisible(true),
                  setDateType('start'),
                ]}
                style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {' '}
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
                  {' '}
                  {t('common:end_time')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'clock-check'}
                  size={16}
                  color={'#000'}
                />

                <Text style={styles.text}>
                  {endDate && timeToString(endDate).time}
                </Text>
              </TouchableOpacity>
              <View style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {' '}
                  {t('common:duration')}:
                </Text>
                <Text style={[styles.text]}>{duration && duration}</Text>
              </View>

              <View style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {' '}
                  {t('common:price')}:
                </Text>

                <Text style={[styles.text]}>
                  {priceCustomer && priceCustomer + ' kr'}
                </Text>
              </View>

              {checkedtendency && (
                <View>
                  <View style={{marginTop: 5, marginStart: 15}}>
                    <Text style={styles.text}>
                      {' '}
                      {t('common:meeting_point')}
                    </Text>

                    <View
                      style={[
                        styles.checkRow,
                        {marginStart: -20, marginTop: 5},
                      ]}>
                      <CheckBox
                        onPress={() => setUseMyAddress(!useMyAddress)}
                        checked={useMyAddress}
                      />
                      <Text style={styles.text}>
                        {t('common:use_my_address')}
                      </Text>
                    </View>
                  </View>

                  {!useMyAddress && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        value={
                          address !== null && address !== 'null' ? address : ''
                        }
                        onChangeText={val => setAddress(val)}
                        multiline={true}
                        style={{
                          textAlignVertical: 'top',
                          borderColor: '#000',
                          color: '#000',
                          borderWidth: 1,
                          fontSize: 16,
                          flex: 1,
                          borderRadius: 10,
                          fontFamily: fonts.medium,
                        }}
                        placeholder={'Mødested'}
                        placeholderTextColor="#adb5bd"
                      />
                      <View style={{margin: 5}}>
                        {locationLoading ? (
                          <Indicator
                            color={'#659ED6'}
                            show={locationLoading}
                            size={'small'}
                          />
                        ) : (
                          <Micons
                            name={'my-location'}
                            size={30}
                            color={'#000'}
                            onPress={() => getLocation()}
                          />
                        )}
                      </View>
                    </View>
                  )}

                  <Text
                    style={[
                      styles.text,
                      {
                        fontSize: 16,
                        margin: 10,
                        fontFamily: fonts.bold,
                      },
                    ]}>
                    {t('common:citizen_details')}
                  </Text>
                  <Text style={[styles.text, {marginStart: 10}]}>
                    {t('common:name')}
                  </Text>
                  <TextInput
                    onChangeText={val => setPatnerName(val)}
                    style={styles.textBox}
                    value={partnerName}
                    placeholder={t('common:citizen')}
                    placeholderTextColor="#adb5bd"
                  />

                  <Text style={[styles.text, {marginStart: 10}]}>
                    {t('common:case_number')}
                  </Text>

                  <TextInput
                    value={SSN !== null && SSN !== 'null' ? SSN : ''}
                    onChangeText={val => setSSN(val)}
                    style={styles.textBox}
                    placeholderTextColor="#adb5bd"
                  />

                  {/* <TextInput
              value={SSN}
              onChangeText={val => setSSN(val)}
              style={{
                textAlignVertical: 'top',
                borderColor: '#000',
                color: '#000',
                borderWidth: 1,
                fontSize: 16,
                padding: 5,
                margin: 5,
                borderRadius: 10,
                fontFamily: fonts.medium,
              }}
              placeholder={'Social Security Number'}
              placeholderTextColor="#adb5bd"
            /> */}
                </View>
              )}

              <TextInput
                value={body}
                onChangeText={val => setBody(val)}
                multiline={true}
                numberOfLines={5}
                style={{
                  textAlignVertical: 'top',
                  borderColor: '#000',
                  color: '#000',
                  borderWidth: 1,
                  fontSize: 16,
                  padding: 5,
                  margin: 5,
                  borderRadius: 10,
                  fontFamily: fonts.medium,
                }}
                placeholder={t('common:comment')}
                placeholderTextColor="#adb5bd"
              />

              {error !== null && <ErrorMsg error={error} />}
            </View>
          </View>
        </View>
        <View style={{}}>
          {loading ? (
            <Indicator color={'#659ED6'} show={loading} size={'large'} />
          ) : (
            <Button
              onPress={() => saveBooking()}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:book')}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    );
  } else {
    return (
      <View style={styles.wrapper}>
        <ConfimScreen
          loading={loading}
          setConfirm={setConfirm}
          postToDB={postToDB}
          item={booking}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
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

export default EditBookingScreen;
