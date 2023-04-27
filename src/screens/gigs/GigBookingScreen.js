import React, {useState, createRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {fonts} from '../../assets/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

import {
  Button,
  CustomCheckBox,
  ErrorMsg,
  Calendar,
  ActivityIndicator,
  GigList,
} from '../../components';
import DocumentPicker from 'react-native-document-picker';

import {
  createMeetingLink,
  getToken,
  toastNew as toast,
  timeToString,
  mergeDateTime,
  normalizePath,
  dimention,
  baseCurrency,
  timeDifferenceInMilliseconds,
  msToTime,
  gigPriceCalculator,
  priceCalculator,
  isCustomer,
  getCurrentDate,
  getTaskName,
  requestStoragePermission,
} from '../../util/util';

import {AuthContext} from '../../context/AuthProvider';
import moment from 'moment';
import {checkAvailability, getGiGs, sendNotificaion} from '../../data/data';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {colors} from '../../assets/colors';

import ActionSheet from 'react-native-actions-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const actionSheetRef = createRef();

const Action = props => {
  const {gigs, selectedGig} = props;
  return (
    <ActionSheet
      bounceOnOpen={true}
      containerStyle={{height: dimention.height * 0.9}}
      gestureEnabled={true}
      ref={actionSheetRef}>
      <ScrollView>
        {gigs?.map((item, index) => {
          return (
            <GigList
              key={index.toString()}
              customer
              selected
              selectedGig={selectedGig}
              mini
              item={item}
              index={index}
              closeRef={actionSheetRef}
            />
          );
        })}
      </ScrollView>
    </ActionSheet>
  );
};

const GigBookingScreen = ({navigation, route}) => {
  const [otherItem, setOtherItem] = useState({});
  const [showMsgToCitizen, setShowMsgToCitizen] = useState(false);

  const {returnToChat, customerInfo, translatorInfo} = route.params;

  // console.log(translatorInfo)

  const {
    checkVideo,
    checkPhone,
    checkAttendance,
    selectedPrice,
    languageId,
    serviceId,
    selectedTask,
    toLanguageName,
    languageName,
    service,
  } = otherItem;

  // console.log(service);

  const [selectedGig, setSelectedGig] = useState({});

  const [image, setIimage] = useState(null);

  const {user, setToken, token, setReload, booking_types} =
    useContext(AuthContext);

  const [isFree, setIsFree] = useState(null);
  const [disable, setDisable] = useState(null);
  const [SSN, setSSN] = useState(null);
  const {t} = useTranslation();
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [mode, setMode] = useState();
  const [duration, setDuration] = useState();
  const [dateType, setDateType] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [body, setBody] = useState('');
  const [messageToCitizen, setMessageToCitizen] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedphone, setCheckedPhone] = useState(checkPhone);
  const [checkedvideo, setCheckedVideo] = useState(checkVideo);
  const [checkedtendency, setCheckedTenddency] = useState(checkAttendance);

  const [taskTypeId, setTaskTypeId] = useState(selectedTask);
  const [useMyAddress, setUseMyAddress] = useState(true);
  const [price, setPrice] = useState(0);
  const [priceCustomer, setPriceCustomer] = useState(0);
  const [self, setSelf] = useState(true);
  const [policeApproved, setPoliceApproved] = useState(null);
  const [address, setAddress] = useState(
    user?.profile?.Adresse + ' ' + user?.profile?.City + ' ',
  );

  const [tfare, setTfare] = useState(null);

  const [interpreterFee, setInterpreterFee] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(
    t('common:no') + ' ' + t('common:file') + ' ' + t('common:selected'),
  );
  const [filePath, setFilePath] = useState(null);

  const calendarEvents = async (bool, dt) => {
    setCalendarVisible(bool);
    if (dt !== 'cancel') {
      if (dateType === 'date') {
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

        setDate(new Date(dt));
      } else if (dateType === 'start') {
        const today = timeToString(getCurrentDate());
        const bookingDay = timeToString(date);
        const bookingTime = timeToString(dt);

        if (bookingDay.date === today.date && bookingTime.hours < today.hours) {
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

          const servicePrice = await gigPriceCalculator(
            selectedPrice,
            timeVariant.milliSecToHours,
          );

          setPrice(servicePrice);
        } else toast('Endtime cannot be less than start time', 'error');
      }
    }
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

    if (meeting !== 'error' && meeting !== null) {
      bookingObject(null, meeting, null);
    } else {
      setError('Unable to submit your booking please try again');
      setLoading(false);
    }

    // console.log(new Date(token.expires_in) - new Date());
  };

  const saveBooking = async () => {
    // console.log(user.profile)

    if (date === null) setError('Provide start date');
    else if (startDate === null) setError('Provide start time');
    else if (endDate === null) setError('Provide end time');
    else if (checkedtendency && address === null)
      setError('Provide meeting venue');
    else if (price <= 4) {
      setError('Minimum charge is 5 USD');
    } else {
      setError(null);
      setLoading(true);
      // check the task type
      if (serviceId === 3 && (taskTypeId === 2 || taskTypeId === 3)) {
        checkToken();
      } else {
        bookingObject(null, null, null);
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

  const bookingObject = async (add, meeting, distance) => {
    try {
      const mergedDate = await mergeDateTime(date, startDate, endDate);
      const startTime = timeToString(startDate || new Date());
      const endTime = timeToString(endDate || new Date());

      const newBooking = {
        OrderNumber: null,
        CreateBy: isCustomer(user) ? user.profile.Id : customerInfo.Id,
        DateTimeStart: mergedDate.startTime,
        DateTimeEnd: mergedDate.endTime,
        TaskTypeId: taskTypeId,
        FromLanguageID: languageName ? languageName : 'Danish',
        ToLanguageID: languageId,
        ToLanguageString: toLanguageName ? toLanguageName : 'null',
        InterpreterID: selectedGig.userId,
        RekvirantID: isCustomer(user) ? user.profile.Email : customerInfo.Email,
        CitizenName: isCustomer(user)
          ? user.profile.FirstName + '  ' + user.profile.LastName
          : customerInfo.FirstName + '  ' + customerInfo.LastName,
        CitizenNumber: SSN,
        Address: checkedtendency ? address : null,
        Duration: duration,
        KmTilTask: null,
        Fee: priceCalculator(price),
        PricesCustomer: price,
        FeeCustomer: price,
        Tfare: priceCalculator(tfare),
        TfareCustomer: tfare,
        Remark: body,
        OnlineMeeting:
          serviceId === 3 && (taskTypeId === 2 || taskTypeId === 3)
            ? meeting.joinUrl
            : null,
        BookingForSelf: 1,
        RequirePolice: policeApproved,
        CompanyName: isCustomer(user)
          ? user.profile.CompanyName && user.profile.CompanyName !== null
            ? user.profile.CompanyName
            : user.profile.FirstName + '  ' + user.profile.LastName
          : customerInfo.CompanyName && customerInfo.CompanyName !== null
          ? customerInfo.CompanyName
          : customerInfo.FirstName + '  ' + customerInfo.LastName,
        IsBookingCompleted: isCustomer(user) ? 1 : 2,
        Attachment: filePath,
        serviceId,
        OfferStage: 'initial',
        MessageToCitizen: messageToCitizen,
        DepartmentID: user.profile.DeparmentId,

        // mail data
        isCustomer: false,
        isApproved: false,
        currentDate: moment().format('DD-MM-YYYY HH:mm'),
        translatorEmail: isCustomer(user)
          ? translatorInfo.Email
          : customerInfo.Email,
        taskType: getTaskName(taskTypeId),
        startDate: startTime.date,
        startTime: startTime.time,
        endTime: endTime.time,
        interpreterName: translatorInfo.FirstName,
        interpreterTelephone: translatorInfo.PhoneNumber,
        recipient: [
          isCustomer(user) ? translatorInfo.Email : customerInfo.Email,
        ],
        caseNumber: self ? null : SSN,
        toLanguage: toLanguageName ? toLanguageName : 'null',
        meetingPoint: checkedtendency ? address : null,
        link:
          serviceId === 3 && (taskTypeId === 2 || taskTypeId === 3)
            ? meeting.joinUrl
            : null,
      };

      postToDB(newBooking);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // setBooking(newBooking);
    // setLoading(false);
    // setConfirm(true);
  };

  const postToDB = async newBooking => {
    try {
      const res = await axios.post(`/orders`, newBooking);

      if (res.data.msg === 'success') {
        const data = res?.data?.data[0];
        // send notification
        setReload(true);

        const body = {
          userId: selectedGig?.userId,
          title: 'Booking Notification',
          text: 'You have a new offer from ' + user.profile.FirstName,
          bookingId: data.BookingID.toString(),
        };
        sendNotificaion(body);

        toast('Booking Completed', 'success');

        // return to chat screen
        if (returnToChat) {
          const newMsg = [{text: data.BookingID, isOffer: 1}];
          navigation.navigate({
            name: 'ChatScreen',
            params: {
              newMsg,
            },
            merge: true,
          });
        } else navigation.goBack();
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

  const [gigs, setGigs] = useState(null);

  const [reloadgigs, setReloadGigs] = useState(true);

  async function fetchData(Id) {
    // You can await here

    const res = await getGiGs(Id);
    setGigs(res);

    setReloadGigs(false);
  }

  useEffect(() => {
    if (selectedGig !== null) fetchData(selectedGig?.userId);
  }, [selectedGig]);

  useEffect(() => {
    if (price > 0) changeInPrice();
  }, [price, tfare]);

  useEffect(() => {
    if (price > 4 && isFree) setDisable(true);
  }, [price, isFree]);

  const isAvailable = async () => {
    var dt = new Date(date).toISOString().split('T');
    var st = new Date(startDate).toISOString().split('T');
    var et = new Date(endDate).toISOString().split('T');

    st = dt[0] + 'T' + st[1];
    et = dt[0] + 'T' + et[1];

    const isFree = await checkAvailability(st, et, selectedGig.userId);
    // console.log(isFree);
    setIsFree(isFree);
  };

  const changeInPrice = () => {
    if (price <= 4) {
      setInterpreterFee(0);
      setError('Minimum charge is 5 USD');
      return;
    }
    setError(null);
    var total = parseInt(price) + parseInt(tfare);
    var translatorIncome = priceCalculator(total);
    setInterpreterFee(translatorIncome);

    // console.log(total, 'et', translatorIncome);
  };

  useEffect(() => {
    if (selectedGig !== null) {
      setIimage(selectedGig.imgOne);
      actionSheetRef.current?.setModalVisible(false);
    }
  }, [selectedGig]);

  useEffect(() => {
    if (endDate !== null && startDate !== null) isAvailable();
  }, [endDate, startDate, date]);

  useEffect(() => {
    if (route.params?.info) {
      setSelectedGig(route.params.info);
      setOtherItem(route.params.otherItem);
      setTaskTypeId(route.params.otherItem.selectedTask);
      setCheckedPhone(route.params.otherItem.checkPhone);
      setCheckedVideo(route.params.otherItem.checkVideo);
      setCheckedTenddency(route.params.otherItem.checkAttendance);
      setPrice(route.params.otherItem.selectedPrice);
    }
  }, [route.params?.info]);

  return (
    <KeyboardAwareScrollView>
      <View>
        <View style={styles.headerBG}>
          <Text style={[styles.text, {fontSize: 16, color: colors.white}]}>
            {t('common:create') +
              ' ' +
              t('common:an') +
              ' ' +
              t('common:offer') +
              ' ' +
              t('common:now')}
          </Text>
          <Ionicons
            name="close"
            size={23}
            color="#E43F5A"
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              position: 'absolute',
              right: 5,
              backgroundColor: colors.white,
              borderRadius: 100,
              margin: 5,
            }}
          />
        </View>

        <View style={{margin: 5, padding: 5}}>
          {/* gig section */}

          <View style={styles.view}>
            <Text style={[styles.offertext]}>
              {t('common:select') + ' ' + t('common:gig')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  margin: 10,
                }}
                source={
                  image !== null
                    ? {uri: image}
                    : require('../../assets/imgs/empty.png')
                }
              />
              <TouchableOpacity
                onPress={() => {
                  actionSheetRef.current?.setModalVisible(true);
                }}>
                <Text style={[styles.offertext, {marginStart: 20}]}>
                  {t('common:select')}
                </Text>
              </TouchableOpacity>
            </View>
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
              {t('common:schedule')}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setMode('date');
                setDateType('date');
                setCalendarVisible(true);
              }}
              style={styles.dateRow}>
              <View style={styles.innerDateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:date')}:{' '}
                </Text>
                <Ionicons
                  style={{marginEnd: 20}}
                  name={'calendar'}
                  size={16}
                  color={colors.main}
                />
              </View>
              <Text style={styles.text}>{date && timeToString(date).date}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => [
                setMode('time'),
                setCalendarVisible(true),
                setDateType('start'),
              ]}
              style={styles.dateRow}>
              <View style={styles.innerDateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:start_time')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'stopwatch-outline'}
                  size={16}
                  color={colors.main}
                />
              </View>
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
              <View style={styles.innerDateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:end_time')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={'time'}
                  size={16}
                  color={colors.main}
                />
              </View>
              <Text style={styles.text}>
                {endDate && timeToString(endDate).time}
              </Text>
            </TouchableOpacity>

            {isFree !== null && (
              <View style={styles.dateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:available')}:{' '}
                </Text>

                <Ionicons
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
              </View>
            )}
            <View style={styles.dateRow}>
              <View style={styles.innerDateRow}>
                <Text style={[styles.text, {width: 90}]}>
                  {t('common:duration')}:
                </Text>
              </View>

              <Text style={[styles.text]}>{duration && duration}</Text>
            </View>
          </View>

          {/* <Text style={styles.offertext}>Rates</Text> */}
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
            {serviceId === 3 ? (
              <View style={{}}>
                {checkPhone && (
                  <View style={styles.rowApart}>
                    <CustomCheckBox
                      mp
                      selector={1}
                      checked={checkedphone}
                      setChecked={setCheckedPhone}
                      placeholder={booking_types[2].label}
                    />
                    <Text style={styles.text}>
                      {selectedPrice +
                        ' ' +
                        baseCurrency.usd +
                        ' / ' +
                        t('common:hour')}
                    </Text>
                  </View>
                )}

                {checkVideo && (
                  <View style={styles.rowApart}>
                    <CustomCheckBox
                      mp
                      selector={2}
                      checked={checkedvideo}
                      setChecked={setCheckedVideo}
                      placeholder={booking_types[1].label}
                    />
                    <Text style={styles.text}>
                      {selectedPrice +
                        ' ' +
                        baseCurrency.usd +
                        ' / ' +
                        t('common:hour')}
                    </Text>
                  </View>
                )}

                {checkAttendance && (
                  <View style={styles.rowApart}>
                    <CustomCheckBox
                      mp
                      selector={3}
                      checked={checkedtendency}
                      setChecked={setCheckedTenddency}
                      placeholder={booking_types[0].label}
                    />
                    <Text style={styles.text}>
                      {selectedPrice +
                        ' ' +
                        baseCurrency.usd +
                        ' / ' +
                        t('common:hour')}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={{marginTop: 20}}>
                {checkPhone && (
                  <View style={[styles.rowApart, {paddingHorizontal: 5}]}>
                    <Text style={styles.text}>{t('common:fee')}</Text>
                    <Text style={styles.text}>
                      {selectedPrice +
                        ' ' +
                        baseCurrency.usd +
                        ' / ' +
                        t('common:hour')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.dateRow}>
              <View style={styles.innerDateRow}>
                <Text style={[styles.text, {marginTop: 10}]}>
                  {t('common:booking') + ' ' + t('common:fee')}:
                </Text>
              </View>

              <Text style={[styles.text]}>
                {price + ' ' + baseCurrency.usd}{' '}
              </Text>
            </View>

            {taskTypeId === 1 && (
              <View style={styles.dateRow}>
                <Text style={[styles.text, {flex: 1}]}>
                  {t('common:transportation') + ' ' + t('common:fee')}
                </Text>
                <TextInput
                  onChangeText={val => {
                    if (parseInt(val)) setTfare(parseInt(val));
                    else setTfare(0);
                  }}
                  style={[styles.offertextinput, {width: 100}]}
                  placeholderTextColor="#adb5bd"
                  value={tfare}
                />
              </View>
            )}

            {!isCustomer(user) && interpreterFee > 1 && (
              <View>
                <View style={styles.dateRow}>
                  <View style={styles.row}>
                    <Text
                      style={[styles.text, {fontFamily: fonts.bold, flex: 1}]}>
                      {t('common:percentage_text')} :
                    </Text>
                    <Text style={styles.text}>
                      {interpreterFee > 1 && interpreterFee.toFixed(0)} USD
                    </Text>
                  </View>
                </View>

                <Text style={[styles.text, {margin: 10}]}>
                  SprogTeam charges 20% service charge on all transaction
                </Text>
              </View>
            )}
          </View>

          {/* other booking details */}
          <View style={styles.view}>
            <Text style={[styles.offertext]}>
              {t('common:task') + ' ' + t('common:information')}
            </Text>
            <TextInput
              onChangeText={val => setBody(val)}
              multiline={true}
              numberOfLines={5}
              style={[styles.offertextinput, {height: 80}]}
              // placeholder={t('common:comment')}
              placeholderTextColor="#adb5bd"
            />
            {/* message to citizen */}

            {checkedtendency && (
              <View style={{marginTop: 10}}>
                <Text style={[styles.offertext]}>
                  {t('common:meeting_point')}
                </Text>
                <TextInput
                  value={address}
                  onChangeText={val => setAddress(val)}
                  multiline={true}
                  numberOfLines={5}
                  style={[styles.offertextinput, {height: 50}]}
                  // placeholder={t('common:comment')}
                  placeholderTextColor="#adb5bd"
                />
              </View>
            )}

            {serviceId === 3 && (
              <View>
                <View style={{marginVertical: 10, marginStart: -5}}>
                  <CustomCheckBox
                    mp
                    checked={showMsgToCitizen}
                    setChecked={setShowMsgToCitizen}
                    placeholder={t('common:booking_for_another')}
                  />
                </View>
                {showMsgToCitizen && (
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
                )}
              </View>
            )}
          </View>

          {/* file section */}
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
              <Ionicons
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
        </View>

        {error !== null && <ErrorMsg error={error} />}
        <View style={{marginBottom: 50}}>
          {loading ? (
            <ActivityIndicator
              color={'#659ED6'}
              show={loading}
              size={'large'}
            />
          ) : (
            <Button
              disable={!disable}
              onPress={() => {
                if (!disable) {
                  return;
                }

                if (uploading) {
                  toast('uploading in progress please wait', 'info');
                  return;
                }
                saveBooking();
              }}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:send_offer')}
            />
          )}
        </View>

        {calendarVisible && (
          <Calendar
            isDateTimePickerVisible={calendarVisible}
            mode={mode}
            calendarEvents={calendarEvents}
          />
        )}

        <Action gigs={gigs} selectedGig={setSelectedGig} />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default GigBookingScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: colors.black,
    fontFamily: fonts.medium,
  },

  headerBG: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#659ED6',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },

  offertext: {
    fontSize: 18,
    margin: 5,
    color: colors.black,
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

  dateRow: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginBottom: 10,
  },
  innerDateRow: {flex: 1, flexDirection: 'row', marginTop: 5},
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  rowApart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  view: {
    padding: 5,
    borderColor: colors.main,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
