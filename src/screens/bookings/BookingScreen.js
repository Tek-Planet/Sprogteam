import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import Calendar from '../../components/Calendar';
import Button from '../../components/Button';
import ConfimScreen from '../../components/ConfimScreen';
import {
  ActivityIndicator,
  CustomCheckBox,
  CustomInput,
  ErrorMsg,
} from '../../components';
import moment from 'moment';
import {fonts} from '../../assets/fonts';
import {CheckBox} from 'react-native-elements';

import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons2 from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import CustomDropDown from '../../components/CustomDropDown';

import {AuthContext} from '../../context/AuthProvider';
import {
  createMeetingLink,
  getToken,
  toastNew as toast,
  decodeLocationByCoordinates,
  timeToString,
  dimention,
  normalizePath,
  mergeDateTime,
  getCurrentDate,
  timeDifferenceInMilliseconds,
  msToTime,
  calculatePrices,
  getTaskName,
  requestStoragePermission,
} from '../../util/util';
import axios from 'axios';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useTranslation} from 'react-i18next';

import {
  checkAvailability,
  getInterpreterLanguage,
  sendNotificaion,
} from '../../data/data';
import {colors} from '../../assets/colors';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

const BookingScreen = ({navigation, route}) => {
  const {user, setToken, setReload, token} = useContext(AuthContext);

  const {t} = useTranslation();

  const {info} = route.params;

  // console.log(info.Phonevideo, 'hey ow');

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [body, setBody] = useState('');
  const [address, setAddress] = useState('');
  const [rekvirantID, setRekvirantID] = useState(user.profile.Email);
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
  const [price, setPrice] = useState();
  const [priceCustomer, setPriceCustomer] = useState();

  const [confirm, setConfirm] = useState(false);

  const [booking, setBooking] = useState(null);
  const [policeApproved, setPoliceApproved] = useState(null);
  const [showPoliceOption, setShowPoliceOption] = useState(false);
  const [isFree, setIsFree] = useState(null);

  const [hr, setHr] = useState(0);
  const [languages, setLanguages] = useState(info?.languages);
  //info.languages;
  // const [language, setLanguage] = useState([]);

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(
    t('common:no') + ' ' + t('common:file') + ' ' + t('common:selected'),
  );
  const [filePath, setFilePath] = useState(null);

  // picker viariables

  const [value, setValue] = useState({
    label: t('common:select'),
    value: 0,
  });

  const [image, setImage] = useState(info.ProfilePicture);
  const [messageToCitizen, setMessageToCitizen] = useState(null);

  useEffect(() => {
    if (endDate !== null && startDate !== null) isAvailable();
  }, [endDate, startDate, date]);

  const isAvailable = async () => {
    var dt = new Date(date).toISOString().split('T');
    var st = new Date(startDate).toISOString().split('T');
    var et = new Date(endDate).toISOString().split('T');

    st = dt[0] + 'T' + st[1];
    et = dt[0] + 'T' + et[1];

    // console.log(st, 'et', et);

    const isFree = await checkAvailability(st, et, info.Id);
    // console.log(isFree);
    setIsFree(isFree);
  };

  const calendarEvents = async (bool, dt) => {
    // console.log('System time', new Date().getTimezoneOffset());
    // console.log('time + 1', moment(dt).add(2, 'h'));

    // console.log('********* ' + dt);

    setCalendarVisible(bool);
    if (dt !== 'cancel') {
      if (taskTypeId !== 0) {
        const today = timeToString(getCurrentDate());
        const bookingTime = timeToString(dt);
        if (dateType === 'date') {
          if (bookingTime.year < today.year) {
            toast('Invalid Year selected', 'error');
            return;
          }
          if (
            bookingTime.month < today.month &&
            bookingTime.year <= today.year
          ) {
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

          setDate(new Date(dt));
        } else if (dateType === 'start') {
          const bookingDay = timeToString(date);

          if (
            bookingDay.date === today.date &&
            bookingTime.hours < today.hours
          ) {
            toast('Invalid Hour selected', 'error');
            return;
          }

          if (
            bookingDay.date === today.date &&
            bookingTime.hours === today.hours &&
            bookingTime.minutes < today.minutes
          ) {
            toast('Invalid Minutes selected', 'error');
            return;
          }
          // console.log(date);
          setStartDate(new Date(dt));
          // setStartDate(timeToString(dt));
        } else {
          // console.log(date);

          if (startDate && dt > startDate) {
            // some clenan up stuff

            const mergedDate = await mergeDateTime(date, startDate, dt);

            setEndDate(new Date(dt));

            const timeDifInMillsec = timeDifferenceInMilliseconds(
              mergedDate.startTime,
              mergedDate.endTime,
            );

            var timeVariant = await msToTime(timeDifInMillsec);
            setDuration(timeVariant.duration);
            // console.log(timeVariant);

            let defaultPriceCustomer, defaultPriceTranslator;

            if (taskTypeId === 2 || taskTypeId === 3) {
              // get the set price for customer
              defaultPriceCustomer =
                user.profile.VideoPhoneprice !== null
                  ? user.profile.VideoPhoneprice
                  : 320;
              // ge

              // get the set price for translator
              defaultPriceTranslator =
                info.Phonevideo !== null ? info.Phonevideo : 160;
            } else {
              defaultPriceCustomer =
                user.profile.AttendancePrice !== null
                  ? user.profile.AttendancePrice
                  : 320;
              // get the set price for translator
              defaultPriceTranslator =
                info.Attendance !== null ? info.Attendance : 160;
            }

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
          } else toast('Endtime cannot be less than start time', 'error');
        }
      } else toast('Select tranlation type before schedulling', 'error');
    } else toast('Select a valid date', 'error');
  };

  // destination_addresses

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
        bookingObject(null, null, null, null, null);
        // let addres = useMyAddress
        //   ? user.profile.Adresse + ' ' + user.profile.City
        //   : address;

        // let transaAddress = info.Adresse + ' ' + info.City;

        // console.log(addres);

        // we need to calculate distance

        // convert provided address
        // const res = await decodeLocationByName(addres);
        // const resT = await decodeLocationByName(transaAddress);
        // console.log(res);
        // console.log(resT);
        // setLoading(false);

        // if (res !== null && resT !== null) {
        //   addres = res[0];
        //   transaAddress = resT[0];

        //   calculatDistance(
        //     transaAddress.formattedAddress,
        //     addres.formattedAddress,
        //   );
        // } else {
        //   setError('Connectivitys error please try again later');

        //   setLoading(false);
        // }
      }

      // setLoading(true);
    }
  };

  const bookingObject = (tfare, customertfare, add, meeting, distance) => {
    const mergedDate = mergeDateTime(date, startDate, endDate);

    const startTime = timeToString(startDate || new Date());

    const endTime = timeToString(endDate || new Date());

    const newBooking = {
      OrderNumber: self ? null : SSN,
      CreateBy: user.profile.Id,
      DateTimeStart: mergedDate.startTime,
      DateTimeEnd: mergedDate.endTime,
      TaskTypeId: taskTypeId,
      FromLanguageID: 75,
      ToLanguageID: value.value,
      ToLanguageString: value.label,
      InterpreterID: info.Id || info.profile.Id,
      RekvirantID: rekvirantID.toLowerCase(),
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
      KmTilTask: distance * 2,
      Fee: price,
      FeeCustomer: priceCustomer,
      PricesCustomer: priceCustomer,
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
      Attachment: filePath,
      serviceId: null,
      OfferStage: null,
      MessageToCitizen: messageToCitizen,
      DepartmentID: user.profile.DeparmentId ? user.profile.DeparmentId : null,

      // email data
      isCustomer: false,
      isApproved: false,
      currentDate: moment().format('DD-MM-YYYY HH:mm'),
      translatorEmail: info.Email,
      taskType: getTaskName(taskTypeId),
      startDate: startTime.date,
      startTime: startTime.time,
      endTime: endTime.time,
      interpreterName: info.FirstName,
      interpreterTelephone: info.PhoneNumber,
      recipient: [info.Email],
      caseNumber: self ? null : SSN,
      toLanguage: value.label,
      meetingPoint:
        taskTypeId === 1
          ? useMyAddress
            ? user.profile.Adresse + ' ' + user.profile.City
            : address
          : null,
      link: taskTypeId === 1 ? null : meeting.joinUrl,
    };

    // console.log(newBooking);

    setBooking(newBooking);
    setLoading(false);
    setConfirm(true);

    // postToDB(booking);
  };

  const postToDB = async newBooking => {
    setLoading(true);
    try {
      const res = await axios.post(`/orders`, newBooking);

      if (res.data.msg === 'success') {
        console.log(res.data);
        // send notification
        setReload(true);

        const body = {
          userId: info.Id,
          title: 'Booking Notification',
          text: 'You have a new booking from ' + user.profile.FirstName,
        };
        sendNotificaion(body);

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

  const chooseDocument = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        alert('You need to enable storage permission to continue');
        return;
      }
    }

    try {
      const file = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.allFiles,
          // DocumentPicker.types.txt,
        ],
      });
      let localfile;
      if (Array.isArray(file)) localfile = file[0];
      else localfile = file;

      // get absolurte path

      const path = await normalizePath(localfile.uri);

      const pathToBase64 = await RNFetchBlob.fs.readFile(path, 'base64');

      const image = {
        path: pathToBase64,
        filename: localfile.name,
      };

      //  console.log (image)
      uploadChatImage(image);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  // upload selecred file to Db
  const uploadChatImage = async image => {
    setUploading(true);
    const imageData = {
      uri: image.path,
      name: image.filename,
      type: 'image/jpeg',
      originalname: image.filename,
    };

    try {
      const res = await axios.post('/chats/upload', imageData);
      // console.log(res.data);

      if (res.data.code === 200) {
        setFilePath(res.data.url);
        console.log(res.data.url);
        setUploading(false);
        setFileName(image.filename);
      } else {
        setUploading(false);
        setFileName('unable to attach file');
      }
    } catch (error) {
      console.log(error);
      setUploading(false);
      setFileName('cannot attach file');
    }
  };

  async function fetchData() {
    // You can await here
    if (
      info?.languages === undefined ||
      info.profile?.languages?.length === 0
    ) {
      let res = await getInterpreterLanguage(info.Id, info.Email);
      setLanguages(res);
      // console.log(res, info.Id, info.Email);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!confirm)
    return (
      <KeyboardAwareScrollView>
        <View
          style={{
            margin: 5,

            elevation: 5,
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            paddingBottom: 0,
          }}>
          <View>
            <View style={styles.view}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={
                    image !== undefined && image !== null && image !== 'default'
                      ? {uri: image}
                      : require('../../assets/imgs/paulo.png')
                  }
                  style={{width: 70, height: 70, borderRadius: 100}}
                />

                <View style={{marginStart: 15, marginTop: 10}}>
                  <Text style={{fontFamily: fonts.bold}}>
                    {info.FirstName + ' ' + info.LastName}
                  </Text>
                  <Text style={styles.text}>
                    {info.GenderId === 0 ? t('common:woman') : t('common:man')}
                  </Text>
                </View>
              </View>
            </View>
            {/* LANGUAGE SELECT section */}

            <View style={styles.view}>
              <Text style={[styles.text, {margin: 10}]}>
                {t('common:select') + ' ' + t('common:language')}
              </Text>

              {/* a custom picker component */}
              <CustomDropDown
                value={value}
                language={languages}
                setValue={setValue}
              />
            </View>

            {/* tranaltion type */}
            <View style={styles.view}>
              <Text style={{...styles.offertext, textAlign: 'center'}}>
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
                  <Text style={styles.text}>{t('common:no')} </Text>
                </View>
              </View>
            )}

            <View>
              <View style={styles.view}>
                <Text
                  style={[
                    styles.offertext,
                    {
                      textAlign: 'center',
                      marginTop: 10,
                    },
                  ]}>
                  {t('common:schedule')}
                </Text>
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
                    name={'clock-check'}
                    size={16}
                    color={colors.main}
                  />

                  <Text style={styles.text}>
                    {endDate && timeToString(endDate).time}
                  </Text>
                </TouchableOpacity>

                {isFree !== null && (
                  <TouchableOpacity style={styles.dateRow}>
                    <Text style={[styles.text, {width: 90}]}>
                      {t('common:available')}:{' '}
                    </Text>

                    <Ionicons2
                      style={{marginEnd: 20}}
                      name={isFree ? 'checkmark-done' : 'close'}
                      size={20}
                      color={isFree ? 'green' : 'red'}
                    />

                    <Text style={[styles.text, {width: dimention.width * 0.5}]}>
                      {isFree
                        ? t('common:translator_is_free')
                        : t('common:translator_is_not_free')}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.dateRow}>
                  <Text style={[styles.text, {width: 90}]}>
                    {t('common:duration')}:
                  </Text>
                  <Text style={[styles.text]}>{duration && duration}</Text>
                </View>
              </View>
              {/* prices section */}
              <View style={styles.view}>
                <Text
                  style={[
                    styles.offertext,
                    {
                      textAlign: 'center',
                      marginTop: 10,
                    },
                  ]}>
                  {t('common:price')}
                </Text>

                <View style={[styles.rowApart, {paddingHorizontal: 5}]}>
                  <Text style={styles.text}>{t('common:fee')}</Text>
                  <Text style={styles.text}>
                    {taskTypeId === 1
                      ? user.profile.AttendancePrice
                        ? user.profile.AttendancePrice
                        : 320
                      : user.profile.VideoPhoneprice
                      ? user.profile.VideoPhoneprice
                      : 320}{' '}
                    / {t('common:hour')}
                  </Text>
                </View>

                <View style={[styles.rowApart, {paddingHorizontal: 5}]}>
                  <Text style={styles.text}>
                    {t('common:booking') + ' ' + t('common:fee')}:
                  </Text>
                  <Text style={styles.text}>
                    {priceCustomer && priceCustomer + ' kr'}
                  </Text>
                </View>
              </View>

              {checkedtendency && (
                <View style={{...styles.view}}>
                  <Text style={{...styles.offertext, textAlign: 'center'}}>
                    {t('common:meeting_point')}
                  </Text>

                  <View
                    style={[styles.checkRow, {marginStart: -20, marginTop: 5}]}>
                    <CheckBox
                      onPress={() => setUseMyAddress(!useMyAddress)}
                      checked={useMyAddress}
                    />
                    <Text style={styles.text}>
                      {t('common:use_my_address')}
                    </Text>
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
                      {/* <View style={{margin: 5}}>
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
                            color={colors.main}
                            onPress={() => getLocation()}
                          />
                        )}
                      </View> */}
                    </View>
                  )}
                </View>
              )}
              {/* booking for yourself or not */}
              <View style={{...styles.view}}>
                <View style={{margin: 10, marginLeft: -10}}>
                  <CustomCheckBox
                    mp
                    checked={self}
                    setChecked={setSelf}
                    placeholder={t('common:booking_for_self')}
                  />
                </View>

                {!self && (
                  <View>
                    <Text
                      style={[
                        styles.offertext,
                        {
                          textAlign: 'center',
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

                    <View>
                      <Text style={[styles.offertext]}>
                        {t('common:comment')}
                      </Text>
                      <TextInput
                        onChangeText={val => setMessageToCitizen(val)}
                        multiline={true}
                        numberOfLines={5}
                        style={[styles.offertextinput, {height: 80}]}
                        // placeholder={t('common:comment')}
                        placeholderTextColor="#adb5bd"
                      />
                    </View>
                  </View>
                )}

                <CustomInput
                  value={rekvirantID}
                  onChangeText={val => setRekvirantID(val)}
                  placeholder={t('common:rekvirantID')}
                />
              </View>

              <View style={styles.view}>
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
              </View>

              <View style={styles.view}>
                <Text
                  style={[
                    styles.offertext,
                    {
                      textAlign: 'center',
                      marginTop: 10,
                    },
                  ]}>
                  {t('common:file')}
                </Text>

                <TouchableOpacity
                  onPress={() => chooseDocument()}
                  style={[styles.dateRow, {alignItems: 'center'}]}>
                  <Ionicons2
                    style={{marginEnd: 20}}
                    name={'attach'}
                    size={26}
                    color={colors.main}
                  />
                  {uploading ? (
                    <ActivityIndicator
                      color={'#659ED6'}
                      show={uploading}
                      size={'small'}
                    />
                  ) : (
                    <Text style={[styles.text]}>{fileName}</Text>
                  )}
                </TouchableOpacity>
              </View>

              {error !== null && <ErrorMsg error={error} />}
              <View style={{marginVertical: 20}}>
                {loading ? (
                  <ActivityIndicator
                    color={'#659ED6'}
                    show={loading}
                    size={'large'}
                  />
                ) : (
                  // <Text>Loading</Text>
                  <Button
                    disable={!isFree}
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
  view: {
    padding: 5,
    borderColor: colors.main,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
  },

  offertext: {
    fontSize: 18,
    margin: 5,
    color: colors.black,
    fontFamily: fonts.medium,
  },
  rowApart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
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

export default BookingScreen;
