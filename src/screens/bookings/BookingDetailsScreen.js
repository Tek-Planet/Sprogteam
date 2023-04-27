import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Button from '../../components/Button';

import axios from 'axios';
import {AuthContext} from '../../context/AuthProvider';
import {Icon} from 'react-native-elements';
import {fonts} from '../../assets/fonts';
import {callNumber} from '../../components/call';

import {
  toastNew as toast,
  getTaskName,
  baseURL,
  timeToString,
  priceCalculator,
  dateToMilliSeconds,
  baseCurrency,
  checkStoragePermission,
  getCurrentDate,
  aalborgMail,
  timeDifferenceInMilliseconds,
  msToTime,
  calculatePrices,
  dimention,
  isCustomer,
} from '../../util/util';
import {
  changeInterPreterToAnonymous,
  changeNewTimeStatus,
  deleteBooking,
  getBooking,
  getFeedBack,
  getStatusName,
  sendNotificaion,
} from '../../data/data';

import {useTranslation} from 'react-i18next';
import {ActivityIndicator, ProfileHeader} from '../../components';
import {colors} from '../../assets/colors';
import moment from 'moment';

const BookingDetailsScreen = ({navigation, route}) => {
  const {
    user,
    setReloadFavourite,
    favourites,
    setReload,
    setTransInfo,
    available_services,
  } = useContext(AuthContext);
  const {t} = useTranslation();

  const [item, setItem] = useState(route?.params?.item || null);

  // console.log(item.DepartmentName);

  const getStatusName = (status, customer) => {
    const {t} = useTranslation();

    let statusName;
    switch (status) {
      case 1:
        // waiting
        statusName = t('common:waiting');
        break;
      case 2:
        // statusName = 'Approve';
        statusName = t('common:approve');

        break;
      case 3:
        // statusName = 'Approve new time';
        statusName = t('common:approve_new_time');
        break;
      case 4:
        // statusName = 'Cancel';
        statusName = t('common:cancelled');
        break;
      case 5:
        // statusName = 'Rejected';
        // if (customer) statusName = t('common:waiting');
        // else statusName = t('common:rejected');
        statusName = t('common:rejected');

        break;
      case 6:
        // rejected interpreter
        if (customer) statusName = t('common:waiting');
        else statusName = t('common:rejected_interpreter');
        break;
      case 7:
        // camcelled too late
        statusName = t('common:cancelled_too_late');
        break;
      case 8:
        //   AwaitingApprovalInterpretor
        // statusName = 'Afventer godkendelse tolk';
        if (customer) statusName = t('common:waiting');
        else statusName = t('common:awaiting_approval_interpretor');

        break;
      case 9:
        // statusName = 'CanceledInterpretor';
        if (customer) statusName = t('common:waiting');
        else statusName = t('common:canceled_interpretor');
        break;
      case 10:
        // statusName = 'RemvoveInterpretor';
        if (customer) statusName = t('common:approve');
        else statusName = t('common:removed_interpretor');
        break;
      case 11:
        // statusName = 'Denied New Time';
        statusName = t('common:denied_new_time');
        break;
      case 12:
        // statusName = 'Delete';
        statusName = 'Slet';
        break;
      default:
        statusName = 'unknown status';
    }
    return statusName;
  };
  const {
    StatusName = '',
    DateTimeStart = '',
    NewEndTime = '',
    TaskTypeId = '',
    RequirePolice = '',
    Attachment = '',
    IsBookingCompleted = '',
    CreateByApp = '',
    MessageToCitizen = '',
    OfferStage = '',
    BookingID = '',
    ServiceId = '',
    DateTimeEnd = '',
    RekvirantID = '',
    CompanyName = '',
    CreateBy = '',
    Address = '',
    OtherAdress = '',
    VideoApi = '',
    InterpreterID = '',
    Remark = '',
    DeptAdresse = '',
    DeptCity = '',
    DeptZipcode = '',
  } = item || {};

  // console.log(item);

  useEffect(() => {
    if (route.params?.reload) {
      console.log('reloading');
      var ID = route.params?.bookingId || BookingID;
      getBookingDetails(ID);
    }
  }, [route.params?.reload]);

  const meeting = VideoApi;

  const [userDetails, setUserDetails] = useState(null);
  const [requesterDetails, setRequesterDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [rejected, setRejected] = useState(false);
  const [feedbacks, setFeedBacks] = useState([]);

  const owner =
    (user?.profile?.Id === CreateBy ||
      user?.profile?.Email === CreateBy ||
      user?.profile?.Email === RekvirantID) &&
    !user.profile.interpreter
      ? true
      : false;

  const bookingStatus = getStatusName(StatusName, owner);

  const startTime = timeToString(DateTimeStart || new Date());

  const endTime = timeToString(DateTimeEnd || new Date());

  const isUser = CompanyName.toLowerCase().includes(
    'Aalborg kommune'.toLowerCase(),
  )
    ? false
    : true;

  const requesterMail = isUser ? RekvirantID : aalborgMail;

  const rekvirant = CompanyName;

  const address =
    Address || OtherAdress || DeptAdresse + ' ' + DeptZipcode + ' ' + DeptCity;

  // console.log(address);

  const getFeeBacks = async () => {
    const res = await getFeedBack(BookingID);
    setFeedBacks(res);
  };

  useEffect(() => {
    if (item !== null) {
      getSingleUserInfo();

      getFeeBacks();
    }
  }, [item]);

  // function to add translatorF
  const miniFavourite = () => {
    const newInterpreter = {
      customerIdId: user.profile.Id,
      Interpreter: InterpreterID,
    };

    axios
      .post(`/favourites`, newInterpreter)
      .then(async res => {
        if (res.data.msg === 'success') {
          setReloadFavourite(true);

          toast('Translator has been added to favourite', 'success');

          // getFavourite(user.profile.Email);
        } else if (res.data.msg === 'already exist') {
          toast('Translator already on favourite', 'info');

          // getFavourite(user.profile.Email);
        } else {
          console.log(res.data);
          toast('Unable to add translator to your list, ', 'error');
        }
      })
      .catch(err => {
        console.log(err);
        toast('Fatal Error', 'error');
      });
  };

  // function to add new translator to favourite
  const addFavourite = () => {
    let exist = false;
    // check if favourite list has data
    if (favourites.length > 0) {
      // loop through list to see if translator id exist
      for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].Email === InterpreterID) exist = true;
      }

      // if list exit telll user
      if (exist) {
        toast('Translator is  on your List', 'info');
        // alert('Translator has been added previously');
      }
      // otherwise add to it
      else {
        miniFavourite();
      }
    }
    // if list is empty add directly
    else {
      miniFavourite();
    }
  };

  // get either the trasnslator or customer details based on who is viewing the page
  const getSingleUserInfo = async () => {
    try {
      let id;
      // if user viewing this is the one that create the booking then get the interpreter details
      if (owner) {
        id = InterpreterID;
      } else {
        // then get the booking owner detaisl for the interpreter to see
        id = requesterMail;
      }

      var res = await axios.get(`/users/${id}`);

      if (res?.data?.msg !== 'success') {
        setUserDetails(user.profile);
        setDeviceId(user.profile.Id);
      } else {
        setUserDetails(res.data.result);
        setDeviceId(res.data.result.Id);
      }

      // get the requester details
      const requestDetails = await axios.get(`/users/${requesterMail}`);
      // if the requester details is not null set it
      if (requestDetails.data.msg === 'success') {
        // console.log(requestDetails.data);
        setRequesterDetails(requestDetails.data.result);
        // booking from web that has not address
        if (address === '' || address === null) {
        }
        // setAddress(
        //   requestDetails.data.result.Adresse +
        //     requestDetails.data.result.Zipcode +
        //     ' ' +
        //     ' ' +
        //     requestDetails.data.result.City,
        // );
      } else {
        // if the requester details is null then set the requester details to the be the details of one who create it
        setRequesterDetails(res.data.result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // update booking status
  const updateBookingStatus = async (status, bookingId) => {
    try {
      if (userDetails === null) {
        toast('loading user details plese try again', 'info');
        return;
      }
      setLoading(true);
      const res = await axios.put(`/orders/${status}/${bookingId}`);
      // kommune;
      if (res.data.msg === 'success') {
        // getBookings(user);
        setReload(true);

        if (status === 2) {
          const data = {
            InterpreterId: user.profile.Id,
            TaskId: item?.TaskTypeId,
            BookingId: BookingID,
          };

          axios.post('/tasks', data);

          axios.put(`/orders/BellStatus/1/${bookingId}`);

          // send acceptance mail to customer

          if (
            item?.TaskTypeId === 1 &&
            address !== 'null' &&
            address !== null
          ) {
            splitAddress = address.split(',');
          }

          const body = {
            customerName: isUser
              ? requesterDetails?.FirstName + ' ' + requesterDetails.LastName
              : rekvirant,
            bookingId: BookingID,
            taskType: getTaskName(item?.TaskTypeId),
            caseNumber:
              item?.OrdreNumber === null || item?.OrdreNumber === 'null'
                ? 'Nil'
                : item?.OrdreNumber, //item?.OrdreNumber,

            startDate: startTime.date,
            startTime: startTime.time,
            endTime: endTime.time,

            fromLanguage: 'Danish',
            toLanguage: item?.ToLanguageName,
            interpreterName:
              user.profile.FirstName + ' ' + user.profile.LastName,
            interpreterTelephone: user.profile.PhoneNumber,
            customerMail: requesterDetails.Email,
            meetingPoint: address,
            link: meeting,
            // postal_city:
            //   splitAddress === 'null'
            //     ? 'Nil'
            //     : splitAddress.length > 0
            //     ? splitAddress[1]
            //     : 'Nil',
            recipient: [requesterDetails.Emai],
            bcc: ['noreply@sprogteam.dk'],
            isUser: isUser,
            rekvirant: rekvirant,
            StatusName: rejected ? 1 : 0,
            RekvirantID: RekvirantID,
            isCustomer: true,
            isApproved: true,
            currentDate: moment().format('DD-MM-YYYY HH:mm'),
            translatorEmail: user.profile.Email,
          };

          axios.post(`${baseURL}/mails/confirmbooking`, body);
          // console.log('Mail Response', mailResponse.data);
        }

        if (status === 3) {
          // update a column
          axios.put(
            `/orders/InterpreterSalary/${item?.InterpreterSalaryPending}/${bookingId}`,
          );
        }

        if (status === 6 || status === 9) {
          // update a column
          const rejecedBody = {
            InterpreterID: user.profile.Id,
            BookingID: BookingID,
            StatusName: status,
          };
          axios.post(`/orders/rejected`, rejecedBody);

          changeInterPreterToAnonymous('Anonym', bookingId);

          // send cancel / rejection mail to admin

          const body = {
            title: status === 6 ? 'Booking Rejected' : 'Booking Cancelation',
            bookingId: BookingID,
            customerName: requesterDetails
              ? requesterDetails.FirstName !== null &&
                requesterDetails.FirstName + ' ' + requesterDetails.LastName !==
                  null &&
                requesterDetails.LastName
              : '',
            taskType: getTaskName(item?.TaskTypeId),
            caseNumber:
              item?.OrdreNumber === null || item?.OrdreNumber === 'null'
                ? 'Nil'
                : item?.OrdreNumber, //item?.OrdreNumber,
            startDate: startTime.date,
            startTime: startTime.time,
            endTime: endTime.time,
            fromLanguage: 'Danish',
            toLanguage: item?.ToLanguageName,
            interpreterName:
              user.profile.FirstName + ' ' + user.profile.LastName,
            interpreterTelephone: user.profile.PhoneNumber,
            customerMail: requesterMail,
            recipient: ['noreply@sprogteam.dk'],
            bcc: [],
            RekvirantID: RekvirantID,
          };

          axios.post(
            // testing server
            // `https://aatsapi.herokuapp.com/mails/confirmbooking`,
            // live server
            `${baseURL}/mails/cancelation`,
            body,
          );

          // console.log('mail response', mailResponse.data);
        }

        const body = {
          userId: deviceId,
          title: 'Booking Notification',
          text: 'The Status of your booking has been changed',
          bookingId: BookingID.toString(),
        };
        sendNotificaion(body);

        toast('Done', 'success');
        // navigation.replace('Tab', {screen: 'Home'});
        navigation.goBack();
      } else {
        toast('Unable to update status please try again ', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      console.log(address);
      toast('Unable to update status please try again ', 'error');
      setLoading(false);
    }
  };

  // remove an order by user
  const removeOrder = async () => {
    setLoading(true);
    const res = await deleteBooking(BookingID);
    if (res == 'Deleted') {
      setReload(true);
      navigation.goBack();
    } else {
      setLoadingAccept(false);
      toast('Unable to remove Item', 'error');
    }
  };

  const changeTimeStatus = async (status, bookingId, recordId) => {
    setLoading(true);
    var body;
    // get trans lators details to get the price of the tranlator
    try {
      if (status === 0) {
        body = {
          status,
          BookingID: bookingId,
          recordId,
        };
      } else {
        // const userDetails = await getSingleUserInfo(InterpreterID);

        let defaultPriceCustomer, defaultPriceTranslator;

        if (TaskTypeId === 2 || TaskTypeId === 3) {
          // get the set price for customer
          defaultPriceCustomer =
            user.profile.VideoPhoneprice !== null
              ? user.profile.VideoPhoneprice
              : defaultPrices.customerPhonePrice;

          defaultPriceTranslator =
            userDetails.Phonevideo !== null
              ? userDetails.Phonevideo
              : defaultPrices.translatorVideoPrice;
          // get the set price for translator
        } else {
          defaultPriceCustomer =
            user.profile.AttendancePrice !== null
              ? user.profile.AttendancePrice
              : defaultPrices.customerPhonePrice;

          defaultPriceTranslator =
            userDetails.Attendance !== null
              ? userDetails.Attendance
              : defaultPrices.translatorAttendancePrice;
        }

        const timeDifInMillsec = timeDifferenceInMilliseconds(
          DateTimeStart,
          NewEndTime,
        );

        var timeVariant = await msToTime(timeDifInMillsec);
        const duration = timeVariant.duration;

        const value =
          TaskTypeId === 2 || TaskTypeId === 3
            ? timeVariant.milliSecToMins
            : timeVariant.milliSecToHours;

        const prices = await calculatePrices(
          value,
          TaskTypeId,
          defaultPriceCustomer,
          defaultPriceTranslator,
          RequirePolice,
          DateTimeStart,
        );

        body = {
          status,
          BookingID: bookingId,
          recordId,
          duration,
          NewEndTime,
          NewFeeCustomer: prices.customerPrice,
          NewFeeTranlator: prices.translatorPrice,
        };
      }
      // {"customerPrice": "2676", "translatorPrice": "1338"}
      console.log(body);
      const res = await changeNewTimeStatus(body);

      if (res !== null) {
        toast('success', 'success');
        navigation.goBack();
      } else {
        toast('unable to update status', 'error');
      }
      setReload(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getBookingDetails = async ID => {
    const res = await getBooking(ID);

    if (res !== null) {
      // console.log(res);
      setItem(res);
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <ProfileHeader />

      {item === null ? (
        <ActivityIndicator show={true} size={'large'} />
      ) : (
        <View
          style={{
            marginTop: 1,
            backgroundColor: '#fff',
            flex: 1,
            padding: 10,
          }}>
          <ScrollView>
            <View style={styles.view}>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  BookingID :
                </Text>
                <Text style={[styles.text, {color: 'green'}]}>{BookingID}</Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:status')} :{' '}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        StatusName === 1 ||
                        StatusName === 3 ||
                        StatusName === 4 ||
                        StatusName === 5 ||
                        StatusName === 6 ||
                        StatusName === 7 ||
                        StatusName === 8 ||
                        StatusName === 9
                          ? 'red'
                          : 'green',
                    },
                  ]}>
                  {bookingStatus}
                </Text>
              </View>
              {/* shows if the time as been edited */}
              {item?.ChangeInterpreter && (
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:new') + ' ' + t('common:time')} :
                  </Text>
                  <Text style={[styles.text, {width: 220}]}>
                    {timeToString(item?.NewEndTime).time}
                  </Text>
                </View>
              )}

              {/* {owner && StatusName === 6 && (
              <View>
                <Text style={styles.text}>{t('common:rebook_text')}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setTransInfo(item);
                    navigation.navigate('Home', {
                      screen: 'TranslatorList',
                      params: {id: 3},
                    });
                  }}
                  style={[
                    styles.filterBox,
                    {backgroundColor: '#659ED6', marginTop: 5},
                  ]}>
                  <Text style={[styles.filterText, {color: colors.white}]}>
                    {t('common:book') + ' ' + t('common:again')}
                  </Text>
                </TouchableOpacity>
              </View>
            )} */}

              {owner ? (
                // customer price section
                <View>
                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:fee')} :{' '}
                    </Text>
                    <Text style={styles.text}>
                      {item?.PricesCustomer}{' '}
                      {!CreateByApp
                        ? ''
                        : IsBookingCompleted === 0
                        ? ' '
                        : baseCurrency.usd}
                    </Text>
                  </View>
                  {item?.TaskTypeId === 1 && (
                    <View>
                      {item?.TfareCustomer !== null && (
                        <View style={styles.row}>
                          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                            {t('common:transport_fee')} :
                          </Text>
                          <Text style={styles.text}>
                            {item?.TfareCustomer}{' '}
                            {!CreateByApp
                              ? ''
                              : IsBookingCompleted === 0
                              ? ' '
                              : baseCurrency.usd}
                          </Text>
                        </View>
                      )}
                      <View style={styles.row}>
                        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                          {t('common:total_fee')} :
                        </Text>
                        <Text style={styles.text}>
                          {(item?.TfareCustomer + item?.PricesCustomer).toFixed(
                            0,
                          )}{' '}
                          {!CreateByApp
                            ? ''
                            : IsBookingCompleted === 0
                            ? ' '
                            : baseCurrency.usd}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                // translator price section
                <View>
                  {/* this hide the price for trnaslators that has contract Id 13 */}
                  {user.profile.ContractID !== 13 && (
                    <View>
                      <View style={styles.row}>
                        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                          {t('common:fee')} :
                        </Text>

                        <Text style={styles.text}>
                          {CreateByApp && IsBookingCompleted > 0
                            ? item?.PricesCustomer
                            : item?.InterpreterSalary}
                          {!CreateByApp
                            ? ''
                            : IsBookingCompleted === 0
                            ? ' '
                            : baseCurrency.usd}
                        </Text>
                      </View>

                      {item?.IsBookingCompleted > 0 && item?.TaskTypeId !== 1 && (
                        <View style={styles.row}>
                          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                            {t('common:you_get')} :
                          </Text>
                          <Text style={[styles.text, {flex: 1}]}>
                            {item?.InterpreterSalary}{' '}
                            {!CreateByApp
                              ? ''
                              : IsBookingCompleted === 0
                              ? ' '
                              : baseCurrency.usd}{' '}
                            ( - 20% service charges)
                          </Text>
                        </View>
                      )}
                      {item?.TaskTypeId === 1 && (
                        <View>
                          {item?.TfareCustomer !== null && (
                            <View style={styles.row}>
                              <Text
                                style={[styles.text, {fontFamily: fonts.bold}]}>
                                {t('common:transport_fee')} :
                              </Text>
                              <Text style={styles.text}>
                                {CreateByApp && IsBookingCompleted > 0
                                  ? item?.TfareCustomer
                                  : item?.Tfare}{' '}
                                {!CreateByApp
                                  ? ''
                                  : IsBookingCompleted === 0
                                  ? ' '
                                  : baseCurrency.usd}
                              </Text>
                            </View>
                          )}
                          <View style={styles.row}>
                            <Text
                              style={[styles.text, {fontFamily: fonts.bold}]}>
                              {t('common:total_fee')} :
                            </Text>
                            <Text style={styles.text}>
                              {CreateByApp && IsBookingCompleted > 0
                                ? (
                                    item?.TfareCustomer + item?.PricesCustomer
                                  ).toFixed(0)
                                : (
                                    item?.Tfare + item?.InterpreterSalary
                                  ).toFixed(0)}
                              {!CreateByApp
                                ? ''
                                : IsBookingCompleted === 0
                                ? ' '
                                : baseCurrency.usd}
                            </Text>
                          </View>

                          {/* charge for Attendance booking in app */}
                          {CreateByApp && IsBookingCompleted > 0 && (
                            <View style={styles.row}>
                              <Text
                                style={[styles.text, {fontFamily: fonts.bold}]}>
                                {t('common:you_get')} :
                              </Text>
                              <Text style={[styles.text, {flex: 1}]}>
                                {priceCalculator(
                                  item?.TfareCustomer + item?.PricesCustomer,
                                ).toFixed(0)}
                                {!CreateByApp
                                  ? ''
                                  : IsBookingCompleted === 0
                                  ? ' '
                                  : baseCurrency.usd}{' '}
                                ( - 20% service charge)
                              </Text>
                            </View>
                          )}

                          {/*  {item?.kmTilTask !== null && item?.kmTilTask > 0 && ( */}
                          {item?.kmTilTask !== null && item?.kmTilTask > 0 && (
                            <View style={styles.row}>
                              <Text
                                style={[styles.text, {fontFamily: fonts.bold}]}>
                                {t('common:distance')} :{' '}
                              </Text>

                              <Text style={styles.text}>
                                {parseInt(item?.kmTilTask)} km (
                                {item?.kmTilTask} {t('common:multiply_by')} 2)
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {item?.BookingForSelf
                        ? t('common:customer')
                        : t('common:citizen')}{' '}
                      :
                    </Text>
                    <Text style={styles.text}> {item?.CitizenName}</Text>
                  </View>
                </View>
              )}
              {ServiceId === null || ServiceId === 2 || ServiceId === 3 ? (
                <View>
                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:start_time')} :
                    </Text>
                    <Text style={styles.text}>
                      {/* {dayjs(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                      {/* {moment(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                      {startTime.date + ' ' + startTime.time}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:end_time')} :
                    </Text>
                    <Text style={styles.text}>
                      {/* {dayjs(item?.DateTimeEnd).format('DD-MM-YYYY HH:mm')} */}
                      {endTime.date + ' ' + endTime.time}
                    </Text>
                    {!owner &&
                      item?.StatusName === 2 &&
                      dateToMilliSeconds(getCurrentDate()) >
                        dateToMilliSeconds(item?.DateTimeEnd) && (
                        <TouchableOpacity
                          onPress={() => {
                            if (userDetails === null) {
                              toast('loading user details', 'info');
                              return;
                            }
                            navigation.navigate('EditTime', {
                              info: item,
                              userDetails: userDetails,
                              deviceId: deviceId,
                            });
                          }}
                          style={{
                            marginStart: 10,
                            width: 30,
                            height: 30,
                            borderRadius: 100,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Icon
                            type="Ionicons"
                            name="edit"
                            size={20}
                            color="#659ED6"
                          />
                        </TouchableOpacity>
                      )}
                  </View>

                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:duration')} :
                    </Text>
                    <Text style={styles.text}>{item?.Duration} Timer </Text>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:deadline')} :
                    </Text>
                    <Text style={styles.text}>
                      {/* {dayjs(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                      {/* {moment(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                      {startTime.date + ' ' + startTime.time}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:translated_from')} :
                </Text>
                <Text style={styles.text}>Dansk</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:translated_to')} :
                </Text>
                <Text style={styles.text}>{item?.ToLanguageName}</Text>
              </View>
              {/* TaskTypeId */}
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:tasktype')} :
                </Text>
                <Text style={styles.text}>
                  {ServiceId === null || ServiceId === 3 || ServiceId === 0
                    ? getTaskName(item?.TaskTypeId)
                    : available_services[ServiceId - 1]?.label}
                </Text>
              </View>
              {item?.TaskTypeId === 1 && address !== null && (
                <View>
                  {/* <View style={styles.row}>
                <Text
                  style={[styles.text, {fontFamily: fonts.bold, width: 100}]}>
                  Translator Location :
                </Text>
                <Text style={[styles.text, {flex: 1}]}>
                  {address.origin_addresses}
                </Text>
              </View> */}
                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:address')} :
                    </Text>
                    <Text style={[styles.text, {flex: 1}]}>{address}</Text>
                  </View>
                  {item?.kmTilTask !== null && item?.kmTilTask > 0 && (
                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:distance')} :{' '}
                      </Text>
                      {item?.kmTilTask !== null ? (
                        <Text style={styles.text}>
                          {item?.kmTilTask} km ({parseInt(item?.kmTilTask) / 2}
                          {' ' + t('common:multiply_by')} 2)
                        </Text>
                      ) : (
                        <Text style={styles.text}>0</Text>
                      )}
                    </View>
                  )}
                  {!owner && (
                    <TouchableOpacity
                      onPress={() =>
                        // navigation.navigate('OtherNav', {
                        //   screen: 'Direction',
                        //   params: {info: item},
                        // })
                        {
                          const openInMap = () => {
                            const scheme = Platform.select({
                              ios: 'maps:0,0?q=',
                              android: 'geo:0,0?q=',
                            });
                            const url = Platform.select({
                              ios: `${scheme}${address}`,
                              android: `${scheme}${address}`,

                              //  ios: `${scheme}://?center=${latitude},${longitude}&q=${latitude},${longitude}&zoom=14&views=traffic"`,
                              // android: `geo://?q=${latitude},${longitude}`,
                            });

                            Linking.openURL(url);
                          };

                          openInMap();
                        }
                      }
                      style={[
                        styles.filterBox,
                        {backgroundColor: '#659ED6', marginTop: 5},
                      ]}>
                      <Text style={[styles.filterText, {color: colors.white}]}>
                        {t('common:get_direction')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {Remark !== null && Remark.length > 0 && (
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:details')} :
                  </Text>
                  <Text style={[styles.text, {flex: 1}]}>{Remark}</Text>
                </View>
              )}
              {!owner && item.DepartmentName && (
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:department')} :
                  </Text>
                  <Text style={[styles.text, {flex: 1}]}>
                    {item.DepartmentName}
                  </Text>
                </View>
              )}
              {/* MessageToCitizen */}
              {MessageToCitizen !== null &&
                MessageToCitizen !== 'null' &&
                MessageToCitizen.length > 0 && (
                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:message') +
                        ' ' +
                        t('common:to') +
                        '\n' +
                        t('common:citizen')}{' '}
                      :
                    </Text>
                    <Text style={[styles.text, {flex: 1}]}>
                      {MessageToCitizen}
                    </Text>
                  </View>
                )}
              {meeting !== null && meeting !== 'null' && (
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:start_meeting')} :
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        dateToMilliSeconds(getCurrentDate()) >=
                          dateToMilliSeconds(item?.DateTimeStart) &&
                        dateToMilliSeconds(getCurrentDate()) <=
                          dateToMilliSeconds(item?.DateTimeEnd) &&
                        item?.StatusName === 2
                      )
                        Linking.openURL(meeting);
                      else
                        toast('Unable to start meeting at this time', 'error');
                    }}
                    style={{
                      marginStart: 10,
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                      backgroundColor: '#659ED6',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon type="Ionicons" name="call" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:rekvirantID')}:
                </Text>
                <Text style={styles.text}>
                  {isUser ? requesterDetails?.FirstName : RekvirantID}
                </Text>
              </View>

              {/* attachment section */}
              {Attachment !== null && (
                <TouchableOpacity
                  onPress={() => {
                    checkStoragePermission(Attachment);
                    // showPaths();
                  }}
                  style={[styles.row, {alignItems: 'center'}]}>
                  <Icon
                    type="Entypo"
                    style={{margin: 10}}
                    name={'attachment'}
                    s
                    size={26}
                    color={'#000'}
                  />
                  <Text style={[styles.text, {flex: 1}]}>
                    {Attachment.split('/')[4]}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {item?.TaskTypeId === 1 && (
              <View style={styles.view}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:citizen_information')}
                </Text>
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:name')} :
                  </Text>
                  <Text style={styles.text}>{item?.CitizenName}</Text>
                </View>

                {/* <Text style={styles.text}>
          Social Security Number: {item?.CitizenNumber}
        </Text>
        <Text style={styles.text}>Phone Number: {item?.CitizenNumber}</Text> */}
              </View>
            )}

            {userDetails !== null && item?.StatusName === 2 && (
              <View style={[styles.view, {marginBottom: 15}]}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {owner
                    ? t('common:interpreter_information')
                    : t('common:customer_information')}
                </Text>

                {/* <Text style={styles.text}>Email: {userDetails.Email}</Text> */}

                {owner &&
                  dateToMilliSeconds(getCurrentDate()) <
                    dateToMilliSeconds(item?.DateTimeEnd) && (
                    <View>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        Name: {userDetails.FirstName}
                      </Text>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:phone')}:
                      </Text>
                      <View style={styles.row}>
                        <Text style={styles.text}>
                          {userDetails.PhoneNumber}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            callNumber(userDetails.PhoneNumber);
                          }}
                          style={{
                            marginStart: 10,
                            width: 30,
                            height: 30,
                            borderRadius: 100,
                            backgroundColor: '#659ED6',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Icon
                            type="Ionicons"
                            name="call"
                            size={20}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
              </View>
            )}

            {feedbacks.length > 0 && (
              <View style={[styles.view, {marginBottom: 15}]}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:translator') +
                    ' ' +
                    t('common:feed') +
                    ' ' +
                    t('common:back')}
                </Text>

                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:title')} :
                  </Text>
                  <Text style={[styles.text]}>{feedbacks[0].Title}</Text>
                </View>
                <View style={[styles.row]}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:details')} :
                  </Text>
                  <Text style={[styles.text, {flex: 1, marginEnd: 10}]}>
                    {feedbacks[0].Body}
                  </Text>
                </View>

                {/* <Text style={styles.text}>Email: {userDetails.Email}</Text> */}
              </View>
            )}
          </ScrollView>
          {/* display the cancel button if the starus is pending also if the  start date is more than 24hrs */}
          <View>
            {StatusName === 2 &&
              owner &&
              dateToMilliSeconds(DateTimeEnd) <
                dateToMilliSeconds(getCurrentDate()) && (
                // (!user.profile.interpreter || user.profile.interpreter === 0)
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <View style={{width: '50%'}}>
                    <Button
                      onPress={() => {
                        if (userDetails === null) {
                          toast(
                            'Fetching translator details, please try again',
                          );
                          return;
                        }
                        addFavourite();
                      }}
                      bGcolor={'#659ED6'}
                      buttonTitle={t('common:add_to_favourite')}
                    />
                  </View>
                  {!item?.RateStatus && (
                    <View style={{width: '50%'}}>
                      <Button
                        onPress={() => {
                          if (userDetails === null) {
                            toast(
                              'Fetching translator details, please try again',
                            );
                            return;
                          }
                          navigation.navigate('OtherNav', {
                            screen: 'Rating',
                            params: {info: item, userDetails: userDetails},
                          });
                        }}
                        bGcolor={'#659ED6'}
                        buttonTitle={t('common:rate')}
                      />
                    </View>
                  )}
                </View>
              )}

            {/* <Button
            onPress={() =>
              navigation.navigate('OtherNav', {
                screen: 'LandingPage',
                params: {item: item, from: 1},
              })
            }
            bGcolor={'green'}
            buttonTitle={t('common:proceed')}
          /> */}

            {loading ? (
              <ActivityIndicator show={loading} size={'large'} />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}>
                {/* an accept button for user to acept a direct booking after translator as repaonded with price */}
                {isCustomer(user) &&
                  IsBookingCompleted > 0 &&
                  (StatusName === 8 || StatusName === 1) && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      {OfferStage === 'concluded' && (
                        // payment button for customer 1
                        <View style={styles.buttonWrapper}>
                          <Button
                            onPress={() =>
                              navigation.navigate('OtherNav', {
                                screen: 'LandingPage',
                                params: {item: item, from: 1},
                              })
                            }
                            bGcolor={'green'}
                            buttonTitle={t('common:proceed')}
                          />
                        </View>
                      )}
                      {/* booking negotiation button for customer 2 */}
                      {dateToMilliSeconds(item.DateTimeStart) >
                        dateToMilliSeconds(getCurrentDate()) &&
                        ((OfferStage === 'initial' ||
                          OfferStage === 'negotiating') &&
                        IsBookingCompleted === 2 ? (
                          <View style={styles.buttonWrapper}>
                            <Button
                              onPress={() =>
                                navigation.navigate('OtherNav', {
                                  screen: 'BookingResponse',
                                  params: {item: item, path: 'BookingDetails'},
                                })
                              }
                              bGcolor={'green'}
                              buttonTitle={t('common:respond')}
                            />
                          </View>
                        ) : (
                          <View style={styles.buttonWrapper}>
                            <Text
                              style={[
                                styles.text,
                                {color: 'red', marginTop: 10},
                              ]}>
                              {t('common:awaiting') +
                                ' ' +
                                t('common:response')}
                            </Text>
                          </View>
                        ))}
                      <View style={styles.buttonWrapper}>
                        {/* offer cancel button for customer 3 */}
                        <Button
                          onPress={() => removeOrder()}
                          bGcolor={'#800000'}
                          buttonTitle={t('common:cancel')}
                        />
                      </View>
                    </View>
                  )}

                {/* cancel button for customer  web booking */}

                {(item.StatusName === 8 ||
                  item.StatusName === 1 ||
                  item.StatusName === 2) &&
                  owner &&
                  (!CreateByApp || (CreateByApp && IsBookingCompleted === 0)) &&
                  dateToMilliSeconds(item.DateTimeStart) >
                    dateToMilliSeconds(getCurrentDate()) && (
                    <View style={styles.buttonWrapper}>
                      <Button
                        onPress={() => updateBookingStatus(4, item.BookingID)}
                        bGcolor={'red'}
                        buttonTitle={t('common:cancel')}
                      />
                    </View>
                  )}

                {/* translator buttons section*/}

                {dateToMilliSeconds(item.DateTimeStart) >
                  dateToMilliSeconds(getCurrentDate()) &&
                  !isCustomer(user) &&
                  IsBookingCompleted > 0 &&
                  (StatusName === 8 || StatusName === 1) && (
                    <View style={styles.buttonWrapper}>
                      {(OfferStage === 'initial' ||
                        OfferStage === 'negotiating') &&
                      IsBookingCompleted === 1 ? (
                        // booking respond button for interpreter 4
                        <Button
                          onPress={() =>
                            navigation.navigate('OtherNav', {
                              screen: 'BookingResponse',
                              params: {item: item, path: 'BookingDetails'},
                            })
                          }
                          bGcolor={'green'}
                          buttonTitle={t('common:respond')}
                        />
                      ) : (
                        <Text
                          style={[styles.text, {color: 'red', marginTop: 10}]}>
                          {t('common:awaiting') + ' ' + t('common:response')}
                        </Text>
                      )}
                    </View>
                  )}

                {/* show waiting test for interpreter */}

                {/* <Button
                  onPress={() => updateBookingStatus(2, BookingID)}
                  bGcolor={'green'}
                  buttonTitle={t('common:accept')}
                /> */}

                {(StatusName === 1 || StatusName === 8) &&
                  !owner &&
                  (!CreateByApp ||
                    (CreateByApp && IsBookingCompleted === 0)) && (
                    // accept button for web booking 5
                    <View style={styles.buttonWrapper}>
                      <Button
                        onPress={() => updateBookingStatus(2, BookingID)}
                        bGcolor={'green'}
                        buttonTitle={t('common:accept')}
                      />
                    </View>
                  )}

                {/* reject booking */}

                {(item.StatusName === 8 ||
                  item.StatusName === 1 ||
                  item.StatusName === 2) &&
                  !owner &&
                  (!CreateByApp || (CreateByApp && IsBookingCompleted === 0)) &&
                  dateToMilliSeconds(item.DateTimeStart) >
                    dateToMilliSeconds(getCurrentDate()) && (
                    <View style={styles.buttonWrapper}>
                      <Button
                        onPress={() => updateBookingStatus(6, BookingID)}
                        bGcolor={'#800000'}
                        buttonTitle={t('common:reject')}
                      />
                    </View>
                  )}

                {/* reject */}
                {/*change in time button for customer */}
                {owner && StatusName === 3 && (
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.buttonWrapper}>
                      {/* accept new time button for interpreter 7 */}
                      <Button
                        onPress={() =>
                          changeTimeStatus(1, BookingID, item?.BookingtimeEndID)
                        }
                        bGcolor={'#32CD32'}
                        buttonTitle={
                          t('common:accept') + ' ' + t('common:time')
                        }
                      />
                    </View>

                    <View style={styles.buttonWrapper}>
                      {/* cancel new time for customer 8 */}
                      <Button
                        onPress={() =>
                          changeTimeStatus(0, BookingID, item?.BookingtimeEndID)
                        }
                        bGcolor={'#800000'}
                        buttonTitle={
                          t('common:reject') + ' ' + t('common:time')
                        }
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

// console.log(getStatusName(1));

export default BookingDetailsScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: fonts.medium,
    textAlign: 'justify',
    margin: 5,
    color: colors.black,
  },
  view: {
    borderColor: '#659ED6',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  row: {flexDirection: 'row'},
  filterBox: {
    alignSelf: 'center',
    width: '50%',
    margin: 3,
    padding: 3,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    minWidth: 80,
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: dimention.width * 0.5,
  },
});
