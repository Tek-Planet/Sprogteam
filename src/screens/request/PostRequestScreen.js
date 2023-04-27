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

import Calendar from '../../components/Calendar';
import Button from '../../components/Button';
import Indicator from '../../components/ActivityIndicator';
import ConfimScreen from './ConfimScreen';
import ErrorMsg from '../../components/ErrorMsg';
import dayjs from 'dayjs';
import moment from 'moment';
import {fonts} from '../../assets/fonts';
import {CheckBox} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import CustomDropDown from '../../components/CustomLanguageDropDown';
import Micons from 'react-native-vector-icons/MaterialIcons';

import {AuthContext} from '../../context/AuthProvider';
import {
  createMeetingLink,
  getToken,
  toastNew as toast,
  decodeLocationByCoordinates,
  timeToString,
} from '../../util/util';
import axios from 'axios';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getLanguages} from '../../data/data';
import {useTranslation} from 'react-i18next';
import {colors} from '../../assets/colors';
import {CustomInput} from '../../components';

const PostRequestScreen = ({navigation, route}) => {
  const {t} = useTranslation();

  const {user, setToken, setReload, token} = useContext(AuthContext);

  // const {info} = route.params;

  // get Languages

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [body, setBody] = useState('');
  const [address, setAddress] = useState('');
  const [useMyAddress, setUseMyAddress] = useState(true);
  const [self, setSelf] = useState(true);
  const [checkedphone, setCheckedPhone] = useState(false);
  const [checkedvideo, setCheckedVideo] = useState(false);
  const [checkedtendency, setCheckedTenddency] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateType, setDateType] = useState('');
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [SSN, setSSN] = useState(null);
  const [partnerName, setPatnerName] = useState('');
  const [taskTypeId, setTaskTypeId] = useState(0);
  const [mode, setMode] = useState();
  const [duration, setDuration] = useState();
  const [price, setPrice] = useState(0);
  const [priceCustomer, setPriceCustomer] = useState(0);

  const [confirm, setConfirm] = useState(false);

  const [booking, setBooking] = useState(null);
  const [policeApproved, setPoliceApproved] = useState(null);
  const [showPoliceOption, setShowPoliceOption] = useState(false);

  const [hr, setHr] = useState(0);
  const [language, setLanguage] = useState([]);
  //info.languages;
  // const [language, setLanguage] = useState([]);

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // picker viariables

  const [value, setValue] = useState({
    label: t('common:select'),
    value: 0,
  });

  // alert cariables
  const [status, setStatus] = useState(false);

  const fetchData = async () => {
    const res = await getLanguages();
    // console.log('response ', res);
    setLanguage(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calendarEvents = (bool, dt) => {
    setCalendarVisible(bool);
    if (dt !== 'cancel') {
      if (taskTypeId !== 0) {
        if (dateType === 'date') {
          if (new Date(dt).getMonth() >= new Date().getMonth()) setDate(dt);
          else toast('Date cannot be less than current date', 'error');
        } else if (dateType === 'start') {
          setStartDate(dt);
        } else {
          if (startDate && dt > startDate) {
            setEndDate(dt);
            calculateDuration(startDate, dt);
            setError(null);
          } else toast('Endtime cannot be less than start time', 'error');
        }
      } else toast('Select tranlation type before schedulling', 'error');
    } else toast('Select a valid date', 'error');
  };

  const mergeDateTime = (time, start, end) => {
    const date = new Date(time).toISOString().split('T')[0];
    const sTime = new Date(start).toISOString().split('T')[0];
    const eTime = new Date(end).toISOString().split('T')[0];
    const rSTime = new Date(start).toISOString().replace(sTime, date);
    const rETime = new Date(end).toISOString().replace(eTime, date);
    return {startTime: rSTime, endTime: rETime};
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

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    setDuration(hours + ':' + minutes);

    const value = taskTypeId === 2 || taskTypeId === 3 ? min : hrs;
    setHr(value);
    // const prices = await calculatePrices(value);
    // console.log(prices);
  };

  const checkToken = async () => {
    var meeting = null;
    let tokenLocal = null;
    if (token === null) {
      // this will run for the first ime
      console.log('First time run');
      tokenLocal = await getToken();
      setToken(tokenLocal);
    } else {
      const expire = moment(token.expires_in).subtract(10, 'minutes');
      const now = moment();
      // if token has exoired
      if (now.isSameOrAfter(expire)) {
        console.log('we have token but has expired creating new one');
        tokenLocal = await getToken();
        setToken(tokenLocal);
      } else {
        console.log('token is still valid');
        tokenLocal = token;
      }
    }
    if (tokenLocal === null) {
      setError('Unable to submit your booking please try again');
      setLoading(false);
      return;
    }

    meeting = await createMeetingLink(
      startDate,
      endDate,
      tokenLocal.token,
      'post',
    );

    // // token has expired get new token
    // if (now.isSameOrAfter(expire)) {
    //   console.log('created new token');
    //   const token = await getToken();
    //   if (token !== 'error') {
    //     // token was created
    //     meeting = await createMeetingLink(
    //       startDate,
    //       endDate,
    //       token.token,
    //       'post',
    //     );
    //   } else {
    //     setError('Unable to submit your booking please try again');
    //     setLoading(false);
    //   }
    // } else {
    //   console.log('old token');
    //   // book meeting with token esisting tokwn
    //   meeting = await createMeetingLink(
    //     startDate,
    //     endDate,
    //     token.token,
    //     'post',
    //   );
    // }

    if (meeting !== 'error' && meeting !== null) {
      bookingObject(null, null, null, meeting, null);
    } else {
      setError('Unable to submit your booking please try again');
      setLoading(false);
    }

    // console.log(new Date(token.expires_in) - new Date());
  };
  const saveBooking = async () => {
    // console.log(user.profile)
    if (taskTypeId === 0) setError('Vælg type af tolkning');
    else if (date === null) setError('Provide start date');
    else if (startDate === null) setError('Provide start time');
    else if (endDate === null) setError('Provide end time');
    else if (!useMyAddress && address === null)
      setError('Provide meeting venue');
    else if (!self && partnerName.trim().length < 1)
      setError('Borgerens navn mangler');
    // else if (body.trim().length < 1) setError(null);
    else if (value.value === 0) setError('Select langauge');
    else {
      //08171931956
      setError(null);
      setLoading(true);
      // check the task type
      if (taskTypeId === 2 || taskTypeId === 3) {
        checkToken();
      } else {
        // console.log('my',address);
        bookingObject(null, null, null, null, null);
      }

      // setLoading(true);
    }
  };

  const bookingObject = (tfare, customertfare, add, meeting, distance) => {
    const mergedDate = mergeDateTime(date, startDate, endDate);

    const newBooking = {
      OrderNumber: self ? null : SSN,
      CreateBy: user.profile.Id,
      DateTimeStart: mergedDate.startTime,
      DateTimeEnd: mergedDate.endTime,
      TaskTypeId: taskTypeId,
      FromLanguageID: 'Danish',
      ToLanguageID: value.value,
      ToLanguageString: value.label,
      InterpreterID: 'Anonym',
      CitizenName: self
        ? user.profile.FirstName + '  ' + user.profile.LastName
        : partnerName,
      CitizenNumber: SSN,
      Address:
        taskTypeId === 1
          ? useMyAddress
            ? user.profile.Adresse + ' ' + user.profile.City
            : address
          : null,
      Duration: duration,
      KmTilTask: distance !== null ? distance * 2 : null,
      Fee: price,
      FeeCustomer: priceCustomer,
      Tfare: tfare,
      TfareCustomer: customertfare,
      Remark: body,
      OnlineMeeting: taskTypeId === 1 ? null : meeting.joinUrl,
      BookingForSelf: self ? 1 : 0,
      RequirePolice: policeApproved,
      CompanyName:
        user.profile.CompanyName && user.profile.CompanyName !== null
          ? user.profile.CompanyName
          : user.profile.FirstName + '  ' + user.profile.LastName,
      IsBookingCompleted: 0,
      Attachment: null,

      serviceId: 0,
      OfferStage: 'initial',
      MessageToCitizen: null,
      DepartmentID: user.profile.DeparmentId ? user.profile.DeparmentId : null,
    };

    // console.log(newBooking);

    setBooking(newBooking);
    setLoading(false);
    setConfirm(true);
  };

  const postToDB = async newBooking => {
    const userId = user.profile.Id;

    setLoading(true);
    try {
      // add request to booking table
      const res = await axios.post(`/orders`, newBooking);
      if (res.data.msg === 'success') {
        const data = res?.data?.data[0];
        // request successful then  fetch the details of the just entered booking
        setReload(true);

        // create a booking request object
        const bookingRequest = {
          CreateBy: userId,
          BookingID: data.BookingID,
          LanguagesID: newBooking.ToLanguageID,
          Country: user?.profile?.Country ? user?.profile?.Country : 'Denmark',
        };

        // save the booking request
        axios.post(`/request`, bookingRequest);

        toast('Booking Completed', 'success');
        navigation.goBack();
      } else {
        toast('unable to complete booking please try again', 'error');
        console.log(res.data.error.originalError);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast('unable to complete booking', 'error');
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
  if (!confirm)
    return (
      <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
        <View
          style={{
            margin: 5,
            marginTop: 0,
            paddingTop: 0,
            elevation: 5,
            flex: 1,
            padding: 10,
            paddingBottom: 0,
          }}>
          <View>
            {/* LANGUAGE SELECT section */}

            <Text style={[styles.text, {margin: 10}]}>
              {t('common:select') + ' ' + t('common:language')}
            </Text>

            {/* a custom picker component */}
            <View>
              <CustomDropDown
                value={value}
                language={language}
                setValue={setValue}
              />
            </View>

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

            {/* task require police appproval or not */}
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
                  <Text style={styles.text}>{t('common:no')}</Text>
                </View>
              </View>
            )}
            <View style={{marginTop: -10}}>
              <TouchableOpacity
                onPress={() => {
                  setMode('date');
                  setDateType('date');
                  setCalendarVisible(true);
                }}
                style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:date')}:{' '}
                </Text>
                <Ionicons
                  style={{marginEnd: 20}}
                  name={'calendar'}
                  size={16}
                  color={colors.main}
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
                  {t('common:start_time')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'clock'}
                  size={16}
                  color={colors.main}
                />

                <Text style={styles.text}>
                  {startDate && timeToString(startDate).time}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMode('time');
                  setDateType('end');
                  setCalendarVisible(true);
                }}
                style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:end_time')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'clock'}
                  size={16}
                  color={colors.main}
                />

                <Text style={styles.text}>
                  {endDate && timeToString(endDate).time}
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
                  {t('common:price')}
                </Text>

                <Text style={[styles.text]}>
                  {priceCustomer && priceCustomer + ' kr'}
                </Text>
              </View>

              {checkedtendency && (
                <View>
                  <View style={{marginTop: 5, marginStart: 15}}>
                    <Text style={styles.text}>{t('common:meeting_point')}</Text>

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
                        value={address !== null && address}
                        onChangeText={val => setAddress(val)}
                        multiline={true}
                        numberOfLines={5}
                        style={[styles.offertextinput, {height: 60, flex: 1}]}
                        placeholder={t('common:meeting_point')}
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
                </View>
              )}
              {/* booking for yourself or not */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox onPress={() => setSelf(!self)} checked={self} />
                <Text style={styles.text}>
                  {t('common:booking_for_self')} ?
                </Text>
              </View>
              {!self && (
                <View>
                  <Text
                    style={[
                      styles.text,
                      {
                        marginStart: 5,
                        marginBottom: 10,
                        fontFamily: fonts.bold,
                      },
                    ]}>
                    {t('common:citizen_details')}
                  </Text>
                  <CustomInput
                    value={partnerName}
                    onChangeText={val => setPatnerName(val)}
                    placeholder={t('common:name')}
                  />
                  <CustomInput
                    value={SSN}
                    onChangeText={val => setSSN(val)}
                    placeholder={t('common:case_number')}
                  />
                </View>
              )}

              <Text style={[styles.offertext]}>
                {t('common:task') + ' ' + t('common:information')}
              </Text>
              <TextInput
                value={body}
                onChangeText={val => setBody(val)}
                multiline={true}
                numberOfLines={5}
                style={[styles.offertextinput, {height: 80}]}
                // placeholder={t('common:comment')}
                placeholderTextColor="#adb5bd"
              />
              {error !== null && <ErrorMsg error={error} />}
              <View style={{marginBottom: 50}}>
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
      </KeyboardAwareScrollView>
    );
  else
    return (
      // show summary page
      <View style={styles.wrapper}>
        <ConfimScreen
          setStatus={setStatus}
          status={status}
          navigation={navigation}
          setLoading={setLoading}
          loading={loading}
          setConfirm={setConfirm}
          postToDB={postToDB}
          item={booking}
        />
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
  offertextinput: {
    textAlignVertical: 'top',
    borderColor: colors.main,
    color: colors.black,
    borderWidth: 1,
    fontSize: 16,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    fontFamily: fonts.medium,
  },
});

export default PostRequestScreen;
