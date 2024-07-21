import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

import axios from 'axios';

import {fontSize, fonts} from '../../assets/fonts';

import {
  toast,
  getTaskName,
  timeToString,
  priceCalculator,
  dateToMilliSeconds,
  getCurrentDate,
  timeDifferenceInMilliseconds,
  msToTime,
  calculatePrices,
  aalborgMail,
  callNumber,
  BASE_URL,
  isDateGreaterThanCurrentBy24Hours,
  isCustomer,
  defaultPrices,
  sendNotificaion,
  deleteBooking,
  getServices,
  mergeDateTime,
  isTranslatorFree,
} from '../../utils';

import {useTranslation} from 'react-i18next';
import {
  CustomButton,
  CustomLoader,
  EditTimeModal,
  Header,
  SuccessModal,
} from '../../components';
import {colors} from '../../assets/colors';
import moment from 'moment';
import {useAppSelector} from '../../rtk/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/MainNavigation';
import {
  useUpdateBookingMutation,
  useChangeInterpreterToAnonymousMutation,
  useGetBookingQuery,
  useGetFeedBacksQuery,
  useChangeNewTimeStatusMutation,
  useCreateRejectedMutation,
} from '../../rtk/services/bookings';
import {
  useCreateFavourieMutation,
  useGetFavouriesQuery,
} from '../../rtk/services';
import {getUserDetails} from '../../rtk/features/user/userSlice';
import {spacing} from '../../assets/spacing';
import {BookingModel} from '../../types';

type Props = NativeStackScreenProps<RootStackParams, 'BookingDetails'>;

const BookingDetailsScreen = ({navigation, route}: Props) => {
  const {user, currency} = useAppSelector(state => state.user);
  const [changeNewTimeStatus, {isLoading: changeTimeLoading}] =
    useChangeNewTimeStatusMutation();

  const [skip, setskip] = useState<boolean>(true);
  const [reloadBookingId, setReloadBookingId] = useState<any>();

  const [changeInterpreterToAnonymous] =
    useChangeInterpreterToAnonymousMutation();

  const [updateBooking, {isLoading: isLoadingBookingStatus}] =
    useUpdateBookingMutation();

  const {data, error, isLoading} = useGetBookingQuery(reloadBookingId, {
    skip: skip,
    refetchOnMountOrArgChange: true,
  });

  const {t} = useTranslation();

  const [item, setItem] = useState<BookingModel>(route?.params?.item || null);

  // console.log(item);

  const {
    data: feedBackData,
    error: feedBackError,
    isLoading: isLoadingFeedBACKS,
  } = useGetFeedBacksQuery(item.BookingID, {
    refetchOnMountOrArgChange: true,
  });

  // favourites section
  const {data: favourites, error: favouriteError} = useGetFavouriesQuery('');

  const [createFavourie, {isLoading: isAddingFavourites}] =
    useCreateFavourieMutation();

  const [createRejected] = useCreateRejectedMutation();

  const getStatusName = (status: number, customer: boolean) => {
    const {t} = useTranslation();

    // console.log(item);

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
    StatusName = 0,
    DateTimeStart = '',
    NewEndTime = '',
    TaskTypeId = 0,
    RequirePolice = false,
    Attachment = '',
    IsBookingCompleted = '',
    CreateByApp = '',
    MessageToCitizen = '',
    OfferStage = '',
    BookingID = 0,
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

  useEffect(() => {
    if (route.params?.reload) {
      var ID = route.params?.bookingId || BookingID;
      setReloadBookingId(ID);
      setskip(false);
    }
  }, [route.params?.reload]);

  useEffect(() => {
    if (item !== null) {
      getSingleUserInfo();
    }
  }, [item]);

  const meeting = VideoApi;

  const [userDetails, setUserDetails] = useState<any>();
  const [requesterDetails, setRequesterDetails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();
  const [rejected, setRejected] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editTimeModalVisible, setEditTimeModalVisible] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [feedbacks, setFeedBacks] = useState<any>(
    feedBackData ? feedBackData : [],
  );

  const owner =
    (user?.Id === CreateBy ||
      user?.Email === CreateBy ||
      user?.Email === RekvirantID) &&
    !user.interpreter
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

  // console.log(requesterDetails);

  const rekvirant = CompanyName;

  const address =
    Address || OtherAdress || DeptAdresse + ' ' + DeptZipcode + ' ' + DeptCity;

  // function to add translatorF
  const miniFavourite = async () => {
    const newInterpreter = {
      customerIdId: user.Id,
      Interpreter: InterpreterID,
      CreateDate: getCurrentDate(),
    };
    let response: any = await createFavourie(newInterpreter);

    if (!response.payload) {
      toast('Unable to add to favourites', 'error');

      return;
    }
    toast('Translator has been added to favourite', 'success');
  };

  // function to add new translator to favourite
  const addFavourite = () => {
    let exist = false;
    // check if favourite list has data
    if (favourites && favourites.length > 0) {
      // loop through list to see if translator id exist
      for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].Id === InterpreterID) exist = true;
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

      var res = await getUserDetails(id);
      if (!res) {
        setUserDetails(user);
        setDeviceId(user.Id);
      } else {
        setUserDetails(res);
        setDeviceId(res);
      }

      // get the requester details
      const requestDetails = await getUserDetails(id);
      // if the requester details is not null set it
      if (requestDetails) {
        // console.log(requestDetails.data);
        setRequesterDetails(requestDetails);
        // booking from web that has not address
      } else {
        // if the requester details is null then set the requester details to the be the details of one who create it
        setRequesterDetails(res);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // update booking status
  const updateBookingStatus = async (status: number, bookingId: number) => {
    try {
      if (userDetails === null) {
        toast('loading user details plese try again', 'info');
        return;
      }
      setLoading(true);

      // before accepting booking check if translator is free
      if (status === 2) {
        const isFree = await isTranslatorFree(
          item.DateTimeStart,
          item.DateTimeStart,
          item.DateTimeEnd,
          user.Id,
        );

        if (!isFree) {
          toast('You are not free to accept this task', 'info');
          setLoading(false);
          return;
        }
      }

      const body: any = {
        StatusNameId: status,
        recordId: bookingId,
      };

      if (item.InterpreterID === 'Anonym') {
        // here we need to check the type of booking and wether this interpreter has salary set to determine final fee
        console.log('Logging for anonymous');
        let taskTypeId = item.TaskTypeId;

        const mergedDate = await mergeDateTime(
          item.DateTimeStart,
          item.DateTimeStart,
          item.DateTimeEnd,
        );

        const timeDifInMillsec = timeDifferenceInMilliseconds(
          mergedDate.startTime,
          mergedDate.endTime,
        );

        var timeVariant: any = await msToTime(timeDifInMillsec);
        //   setDuration(timeVariant.duration);

        // calculate price
        // Phonevideo Attendance

        let defaultPriceCustomer, defaultPriceTranslator;

        if (taskTypeId === 2 || taskTypeId === 3) {
          // get the set price for customer
          defaultPriceCustomer = item.PricesCustomer;
          // ge

          // get the set price for translator
          defaultPriceTranslator = user.Phonevideo ? user.Phonevideo : 160;
        } else {
          defaultPriceCustomer = item.PricesCustomer;
          // get the set price for translator
          defaultPriceTranslator = user.Attendance ? user.Attendance : 160;
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
          false,
          item.DateTimeStart,
        );

        body.InterpreterID = user.Id;
        if (item.InterpreterSalary === 0)
          body.InterpreterSalary = prices.translatorPrice;
      }

      const res: any = await updateBooking(body);

      // kommune;
      if (res.data) {
        // getBookings(user);
        // setReload(true);

        if (status === 2) {
          const data = {
            InterpreterId: user.Id,
            TaskId: item?.TaskTypeId,
            BookingId: BookingID,
          };

          axios.post('/tasks', data);

          axios.put(`/orders/BellStatus/1/${bookingId}`);

          const body = {
            customerName: isUser
              ? requesterDetails?.FirstName + ' ' + requesterDetails.LastName
              : rekvirant,
            bookingId: BookingID,
            taskType: getTaskName(item.TaskTypeId),
            caseNumber:
              item?.OrdreNumber === null || item?.OrdreNumber === 'null'
                ? 'Nil'
                : item?.OrdreNumber, //item?.OrdreNumber,

            startDate: startTime.date,
            startTime: startTime.time,
            endTime: endTime.time,

            fromLanguage: 'Danish',
            toLanguage: item?.ToLanguageName,
            interpreterName: user.FirstName + ' ' + user.LastName,
            interpreterTelephone: user.PhoneNumber,
            customerMail: requesterDetails.Email,
            meetingPoint: address,
            link: meeting,

            recipient: [requesterDetails.Email],
            bcc: ['noreply@sprogteam.dk'],
            isUser: isUser,
            rekvirant: rekvirant,
            StatusName: rejected ? 1 : 0,
            RekvirantID: RekvirantID,
            isCustomer: true,
            isApproved: true,
            currentDate: moment().format('DD-MM-YYYY HH:mm'),
            translatorEmail: user.Email,
          };

          axios.post(`${BASE_URL}mails/confirmbooking`, body);
          // console.log('Mail Response', mailResponse.data);
        }

        if (status === 3) {
          // update a column
          axios.put(
            `/orders/InterpreterSalary/${item?.InterpreterSalaryPending}/${bookingId}`,
          );
        }

        console.log('Pass 1');
        if (status === 6 || status === 9) {
          console.log('Pass 2');

          // update a column
          const rejecedBody = {
            InterpreterID: user.Id,
            BookingID: BookingID,
            StatusName: status,
          };

          createRejected(rejecedBody);

          let body: any = {
            InterpreterID: 'Anonym',
            BookingID,
          };

          changeInterpreterToAnonymous(body);

          body = {
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
            interpreterName: user.FirstName + ' ' + user.LastName,
            interpreterTelephone: user.PhoneNumber,
            customerMail: requesterMail,
            recipient: ['noreply@sprogteam.dk'],
            bcc: [],
            RekvirantID: RekvirantID,
          };

          axios.post(`${BASE_URL}mails/cancelation`, body);

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
    } catch (error: any) {
      console.log('catch');
      toast('Unable to update status please try again ', 'error');
      setLoading(false);
    }
  };

  // remove an order by user
  const removeOrder = async () => {
    setLoading(true);
    const res = await deleteBooking(BookingID);
    if (res == 'Deleted') {
      //   setReload(true);
      navigation.goBack();
    } else {
      //   setLoadingAccept(false);
      toast('Unable to remove Item', 'error');
    }
  };

  const changeTimeStatus = async (status: number) => {
    setLoading(true);
    var body: any;
    // get trans lators details to get the price of the tranlator
    try {
      if (status === 0) {
        body = {
          status,

          recordId: BookingID,
        };
      } else {
        // const userDetails = await getSingleUserInfo(InterpreterID);

        let defaultPriceCustomer, defaultPriceTranslator;

        if (TaskTypeId === 2 || TaskTypeId === 3) {
          // get the set price for customer
          defaultPriceCustomer =
            user.VideoPhoneprice !== null
              ? user.VideoPhoneprice
              : defaultPrices.customerPhonePrice;

          defaultPriceTranslator =
            userDetails.Phonevideo !== null
              ? userDetails.Phonevideo
              : defaultPrices.translatorVideoPrice;
          // get the set price for translator
        } else {
          defaultPriceCustomer =
            user.AttendancePrice !== null
              ? user.AttendancePrice
              : defaultPrices.customerPhonePrice;

          defaultPriceTranslator =
            userDetails.Attendance !== null
              ? userDetails.Attendance
              : defaultPrices.translatorAttendancePrice;
        }

        const timeDifInMillsec = timeDifferenceInMilliseconds(
          DateTimeStart,
          NewEndTime + '',
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
          recordId: BookingID,
          duration,
          NewEndTime,
          NewFeeCustomer: prices.customerPrice,
          NewFeeTranlator: prices.translatorPrice,
        };
      }

      const res = await changeNewTimeStatus(body);

      if (res !== null) {
        toast('success', 'success');
        navigation.goBack();
      } else {
        toast('unable to update status', 'error');
      }
      //   setReload(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) setItem(data);
  }, [data]);

  // method to change entime

  const onTimeChanged = async (newEndTime: any) => {
    try {
      const body: any = {
        recordId: item.BookingID,
        NewDateTimeEnd: newEndTime,
        StatusNameId: 3,
        InterpreterID: user.Id,
        updateTimeEndTable: true,
      };

      const response: any = await updateBooking(body);
      if (response?.data) {
        setMessage(t('common:request') + ' ' + t('common:sent'));
        setModalVisible(true);
        setItem(response?.data);
      } else {
        console.log(response.error);
        toast('Error sending request', 'error');
      }
    } catch (error: any) {
      console.log(error, 'catch');
      toast('error updating time', 'error');
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        showleftIcon
        headerTitle={t('common:booking') + ' ' + t('common:details')}
      />

      {(isLoading || isLoadingBookingStatus) && (
        <CustomLoader color={colors.main} />
      )}

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
              <Text style={[styles.text, {opacity: 0.6}]}>BookingID :</Text>
              <Text style={[styles.text, {color: 'green'}]}>{BookingID}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.text, {opacity: 0.6}]}>
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
                <Text style={[styles.text, {opacity: 0.6}]}>
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
                {/* <View style={styles.row}>
                  <Text style={[styles.text, {opacity: 0.6}]}>
                    {t('common:fee')} :{' '}
                  </Text>
                  <Text style={styles.text}>
                    {item?.PricesCustomer}{' '}
                    {!CreateByApp
                      ? ''
                      : IsBookingCompleted === 0
                      ? ' '
                      : currency.usd}
                  </Text>
                </View> */}
                {item?.TaskTypeId === 1 && (
                  <View>
                    {/* {item?.TfareCustomer !== null && (
                      <View style={styles.row}>
                        <Text style={[styles.text, {opacity: 0.6}]}>
                          {t('common:transport_fee')} :
                        </Text>
                        <Text style={styles.text}>
                          {item?.TfareCustomer}{' '}
                          {!CreateByApp
                            ? ''
                            : IsBookingCompleted === 0
                            ? ' '
                            : currency.usd}
                        </Text>
                      </View>
                    )} */}
                    {/* <View style={styles.row}>
                      <Text style={[styles.text, {opacity: 0.6}]}>
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
                          : currency.usd}
                      </Text>
                    </View> */}
                  </View>
                )}
              </View>
            ) : (
              // translator price section
              <View>
                {/* this hide the price for trnaslators that has contract Id 13 */}
                {user.ContractID !== 13 && (
                  <View>
                    <View style={styles.row}>
                      <Text style={[styles.text, {opacity: 0.6}]}>
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
                          : currency.usd}
                      </Text>
                    </View>

                    {item?.IsBookingCompleted > 0 && item?.TaskTypeId !== 1 && (
                      <View style={styles.row}>
                        <Text style={[styles.text, {opacity: 0.6}]}>
                          {t('common:you_get')} :
                        </Text>
                        <Text style={[styles.text, {flex: 1}]}>
                          {item?.InterpreterSalary}{' '}
                          {!CreateByApp
                            ? ''
                            : IsBookingCompleted === 0
                            ? ' '
                            : currency.usd}{' '}
                          ( - 20% service charges)
                        </Text>
                      </View>
                    )}
                    {item?.TaskTypeId === 1 && (
                      <View>
                        {item?.TfareCustomer !== null && (
                          <View style={styles.row}>
                            <Text style={[styles.text, {opacity: 0.6}]}>
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
                                : currency.usd}
                            </Text>
                          </View>
                        )}
                        <View style={styles.row}>
                          <Text style={[styles.text, {opacity: 0.6}]}>
                            {t('common:total_fee')} :
                          </Text>
                          <Text style={styles.text}>
                            {CreateByApp && IsBookingCompleted > 0
                              ? (
                                  item?.TfareCustomer + item?.PricesCustomer
                                ).toFixed(0)
                              : (item?.Tfare + item?.InterpreterSalary).toFixed(
                                  0,
                                )}
                            {!CreateByApp
                              ? ''
                              : IsBookingCompleted === 0
                              ? ' '
                              : currency.usd}
                          </Text>
                        </View>

                        {/* charge for Attendance booking in app */}
                        {CreateByApp && IsBookingCompleted > 0 && (
                          <View style={styles.row}>
                            <Text style={[styles.text, {opacity: 0.6}]}>
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
                                : currency.usd}{' '}
                              ( - 20% service charge)
                            </Text>
                          </View>
                        )}

                        {/*  {item?.kmTilTask !== null && item?.kmTilTask > 0 && ( */}
                        {item?.kmTilTask !== null && item?.kmTilTask > 0 && (
                          <View style={styles.row}>
                            <Text style={[styles.text, {opacity: 0.6}]}>
                              {t('common:distance')} :{' '}
                            </Text>

                            <Text style={styles.text}>
                              {parseInt(item?.kmTilTask)} km ({item?.kmTilTask}{' '}
                              {t('common:multiply_by')} 2)
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.row}>
                  <Text style={[styles.text, {opacity: 0.6}]}>
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
                  <Text style={[styles.text, {opacity: 0.6}]}>
                    {t('common:start_time')} :
                  </Text>
                  <Text style={styles.text}>
                    {/* {dayjs(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                    {/* {moment(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                    {startTime.date + ' ' + startTime.time}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.text, {opacity: 0.6}]}>
                    {t('common:end_time')} :
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (userDetails === null) {
                        toast('loading user details', 'info');
                        return;
                      }

                      setEditTimeModalVisible(true);
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
                    <Ionicons name="pencil" size={20} color="#659ED6" />
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row'}}>
                    {!owner &&
                      item?.StatusName === 2 &&
                      dateToMilliSeconds(getCurrentDate().toISOString()) >
                        dateToMilliSeconds(item?.DateTimeEnd) && (
                        <TouchableOpacity
                          onPress={() => {
                            if (userDetails === null) {
                              toast('loading user details', 'info');
                              return;
                            }

                            setEditTimeModalVisible(true);
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
                          <Ionicons name="pencil" size={20} color="#659ED6" />
                        </TouchableOpacity>
                      )}
                    <Text style={styles.text}>
                      {/* {dayjs(item?.DateTimeEnd).format('DD-MM-YYYY HH:mm')} */}
                      {endTime.date + ' ' + endTime.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Text style={[styles.text, {opacity: 0.6}]}>
                    {t('common:duration')} :
                  </Text>
                  <Text style={styles.text}>{item?.Duration} Timer </Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.row}>
                  <Text style={[styles.text, {opacity: 0.6}]}>
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
              <Text style={[styles.text, {opacity: 0.6}]}>
                {t('common:translated_from')} :
              </Text>
              <Text style={styles.text}>
                {item?.FromLanguageName ? item?.FromLanguageName : 'Dansk'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.text, {opacity: 0.6}]}>
                {t('common:translated_to')} :
              </Text>
              <Text style={styles.text}>{item?.ToLanguageName}</Text>
            </View>
            {/* TaskTypeId */}
            <View style={styles.row}>
              <Text style={[styles.text, {opacity: 0.6}]}>
                {t('common:tasktype')} :
              </Text>
              <Text style={styles.text}>
                {ServiceId === null || ServiceId === 3 || ServiceId === 0
                  ? getTaskName(item?.TaskTypeId)
                  : getServices([ServiceId - 1])?.label}
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
                  <Text style={[styles.text, {opacity: 0.6}]}>
                    {t('common:address')} :
                  </Text>
                  <Text style={[styles.text, {flex: 1}]}>{address}</Text>
                </View>
                {item?.kmTilTask !== null && item?.kmTilTask > 0 && (
                  <View style={styles.row}>
                    <Text style={[styles.text, {opacity: 0.6}]}>
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

                        Linking.openURL(url + '');
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
              </View>
            )}
            {Remark !== null && Remark.length > 0 && (
              <View style={styles.row}>
                <Text style={[styles.text, {opacity: 0.6}]}>
                  {t('common:details')} :
                </Text>
                <Text style={[styles.text, {flex: 1}]}>{Remark}</Text>
              </View>
            )}
            {!owner && item.DepartmentName && (
              <View style={styles.row}>
                <Text style={[styles.text, {opacity: 0.6}]}>
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
                  <Text style={[styles.text, {opacity: 0.6}]}>
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
                <Text style={[styles.text, {opacity: 0.6}]}>
                  {t('common:start_meeting')} :
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      dateToMilliSeconds(getCurrentDate().toISOString()) >=
                        dateToMilliSeconds(item?.DateTimeStart) &&
                      dateToMilliSeconds(getCurrentDate().toISOString()) <=
                        dateToMilliSeconds(item?.DateTimeEnd) &&
                      item?.StatusName === 2
                    )
                      Linking.openURL(meeting);
                    else toast('Unable to start meeting at this time', 'error');
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
                  <Ionicons name="call" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.row}>
              <Text style={[styles.text, {opacity: 0.6}]}>
                {t('common:rekvirantID')}:
              </Text>
              <Text style={styles.text}>
                {isUser ? requesterDetails?.FirstName : RekvirantID}
              </Text>
            </View>

            {/* attachment section */}
            {Attachment !== null && Attachment !== 'null' && (
              <TouchableOpacity
                onPress={() => {
                  // checkStoragePermission(Attachment);
                  // showPaths();
                }}
                style={[styles.row, {alignItems: 'center'}]}>
                <Ionicons
                  style={{margin: 10}}
                  name={'attach'}
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
              <Text style={[styles.text, {opacity: 0.6}]}>
                {t('common:citizen_information')}
              </Text>
              <View style={styles.row}>
                <Text style={[styles.text, {opacity: 0.6}]}>
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

          {userDetails && userDetails !== null && item?.StatusName === 2 && (
            <View style={[styles.view, {marginBottom: 15}]}>
              <Text style={[styles.text, {opacity: 0.6}]}>
                {owner
                  ? t('common:interpreter_information')
                  : t('common:customer_information')}
              </Text>

              {/* <Text style={styles.text}>Email: {userDetails.Email}</Text> */}

              {owner &&
                dateToMilliSeconds(getCurrentDate().toISOString()) <
                  dateToMilliSeconds(item?.DateTimeEnd) && (
                  <View>
                    <Text style={[styles.text, {opacity: 0.6}]}>
                      Name: {userDetails.FirstName}
                    </Text>
                    <Text style={[styles.text, {opacity: 0.6}]}>
                      {t('common:phone')}:
                    </Text>
                    <View style={styles.row}>
                      <Text style={styles.text}>{userDetails.PhoneNumber}</Text>

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
                        <Ionicons name="call" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
            </View>
          )}

          {feedbacks.length > 0 && (
            <View style={[styles.view, {marginBottom: 15}]}>
              <Text style={[styles.text, {opacity: 0.6}]}>
                {t('common:translator') +
                  ' ' +
                  t('common:feed') +
                  ' ' +
                  t('common:back')}
              </Text>

              <View style={styles.row}>
                <Text style={[styles.text, {opacity: 0.6}]}>
                  {t('common:title')} :
                </Text>
                <Text style={[styles.text]}>{feedbacks[0].Title}</Text>
              </View>
              <View style={[styles.row]}>
                <Text style={[styles.text, {opacity: 0.6}]}>
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
              dateToMilliSeconds(getCurrentDate().toISOString()) && (
              // (!user.interpreter || user.interpreter === 0)
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <View style={{width: '50%'}}>
                  <CustomButton
                    onTap={() => {
                      if (userDetails === null) {
                        toast(
                          'Fetching translator details, please try again',
                          'info',
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
                    <CustomButton
                      onTap={() => {
                        if (userDetails === null) {
                          toast(
                            'Fetching translator details, please try again',
                            'info',
                          );
                          return;
                        }
                        navigation.navigate('Addrating', {
                          info: item,
                          userDetails: userDetails,
                        });
                      }}
                      bGcolor={'#659ED6'}
                      buttonTitle={t('common:rate')}
                    />
                  </View>
                )}
              </View>
            )}

          {/* <CustomButton
            onPress={() =>
              navigation.navigate('OtherNav', {
                screen: 'LandingPage',
                params: {item: item, from: 1},
              })
            }
            bGcolor={'green'}
            buttonTitle={t('common:proceed')}
          /> */}

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
                      <CustomButton
                        onTap={
                          () => {}
                          //   navigation.navigate('OtherNav', {
                          //     screen: 'LandingPage',
                          //     params: {item: item, from: 1},
                          //   })
                        }
                        bGcolor={'green'}
                        buttonTitle={t('common:proceed')}
                      />
                    </View>
                  )}
                  {/* booking negotiation button for customer 2 */}
                  {(OfferStage === 'initial' || OfferStage === 'negotiating') &&
                    (IsBookingCompleted === 2 ? (
                      <View style={styles.buttonWrapper}>
                        <CustomButton
                          onTap={
                            () => {}
                            // navigation.navigate('OtherNav', {
                            //   screen: 'BookingResponse',
                            //   params: {item: item, path: 'BookingDetails'},
                            // })
                          }
                          bGcolor={'green'}
                          buttonTitle={t('common:respond')}
                        />
                      </View>
                    ) : (
                      <View style={styles.buttonWrapper}>
                        <Text
                          style={[styles.text, {color: 'red', marginTop: 10}]}>
                          {t('common:awaiting') + ' ' + t('common:response')}
                        </Text>
                      </View>
                    ))}
                  <View style={styles.buttonWrapper}>
                    {/* offer cancel button for customer 3 */}
                    <CustomButton
                      onTap={() => removeOrder()}
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
                dateToMilliSeconds(getCurrentDate().toISOString()) && (
                <View style={styles.buttonWrapper}>
                  <CustomButton
                    onTap={() =>
                      updateBookingStatus(
                        isDateGreaterThanCurrentBy24Hours(item.DateTimeStart)
                          ? 4
                          : 7,
                        item.BookingID,
                      )
                    }
                    bGcolor={'red'}
                    buttonTitle={t('common:cancel')}
                  />
                </View>
              )}

            {/* translator buttons section*/}

            {dateToMilliSeconds(item.DateTimeStart) >
              dateToMilliSeconds(getCurrentDate().toISOString()) &&
              !isCustomer(user) &&
              IsBookingCompleted > 0 &&
              (StatusName === 8 || StatusName === 1) && (
                <View style={styles.buttonWrapper}>
                  {(OfferStage === 'initial' || OfferStage === 'negotiating') &&
                  IsBookingCompleted === 1 ? (
                    // booking respond button for interpreter 4
                    <CustomButton
                      onTap={
                        () => {}
                        // navigation.navigate('OtherNav', {
                        //   screen: 'BookingResponse',
                        //   params: {item: item, path: 'BookingDetails'},
                        // })
                      }
                      bGcolor={'green'}
                      buttonTitle={t('common:respond')}
                    />
                  ) : (
                    <Text style={[styles.text, {color: 'red', marginTop: 10}]}>
                      {t('common:awaiting') + ' ' + t('common:response')}
                    </Text>
                  )}
                </View>
              )}

            {/* show waiting test for interpreter */}

            {/* <CustomButton
                onTap={() => updateBookingStatus(1, BookingID)}
                bGcolor={'green'}
                buttonTitle={t('common:accept')}
              /> */}

            {(StatusName === 1 || StatusName === 8 || StatusName === 9) &&
              !owner &&
              dateToMilliSeconds(item.DateTimeEnd) >
                dateToMilliSeconds(getCurrentDate().toString()) &&
              (!CreateByApp || (CreateByApp && IsBookingCompleted === 0)) && (
                // accept button for web booking 5
                <View style={styles.buttonWrapper}>
                  <CustomButton
                    onTap={() => updateBookingStatus(2, BookingID)}
                    bGcolor={'green'}
                    buttonTitle={t('common:accept')}
                  />
                </View>
              )}

            {/* reject booking */}

            {(item.StatusName === 8 ||
              item.StatusName === 1 ||
              item.StatusName === 2) &&
              item.InterpreterID !== 'Anonym' &&
              !owner &&
              (!CreateByApp || (CreateByApp && IsBookingCompleted === 0)) &&
              dateToMilliSeconds(item.DateTimeEnd) >
                dateToMilliSeconds(getCurrentDate().toISOString()) && (
                <View style={styles.buttonWrapper}>
                  <CustomButton
                    onTap={() =>
                      updateBookingStatus(
                        item.StatusName === 1 ? 6 : 9,
                        BookingID,
                      )
                    }
                    bGcolor={'#800000'}
                    buttonTitle={
                      item.StatusName === 1
                        ? t('common:reject')
                        : t('common:cancel')
                    }
                  />
                </View>
              )}

            {/* reject */}
            {/*change in time button for customer */}
            {owner && StatusName === 3 && (
              <View style={{marginTop: spacing.fiften}}>
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: fonts.bold,
                    fontSize: fontSize.intermediate,
                    marginBottom: spacing.five,
                  }}>
                  {t('common:new') +
                    ' ' +
                    t('common:time') +
                    ' ' +
                    t('common:request')}
                </Text>

                <Text style={styles.text}>
                  Translator request to change Ending Time to{' '}
                  {timeToString(NewEndTime).date +
                    ' ' +
                    timeToString(NewEndTime).time}
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <View style={styles.buttonWrapper}>
                    {/* accept new time button for interpreter 7 */}
                    <CustomButton
                      onTap={() => changeTimeStatus(1)}
                      bGcolor={'#32CD32'}
                      buttonTitle={t('common:accept') + ' ' + t('common:time')}
                    />
                  </View>

                  <View style={styles.buttonWrapper}>
                    {/* cancel new time for customer 8 */}
                    <CustomButton
                      onTap={() => changeTimeStatus(0)}
                      bGcolor={'#800000'}
                      buttonTitle={t('common:reject') + ' ' + t('common:time')}
                    />
                  </View>
                </View>
              </View>
            )}

            {modalVisible && (
              <SuccessModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                message={message}
                closeModal={() => {
                  setModalVisible(false);
                  setMessage('');
                }}
              />
            )}

            {editTimeModalVisible && (
              <EditTimeModal
                item={item}
                userDetails={userDetails}
                modalVisible={editTimeModalVisible}
                setModalVisible={setEditTimeModalVisible}
                onSubmit={val => {
                  setEditTimeModalVisible(false);
                  onTimeChanged(val);
                }}
                closeModal={() => {
                  setEditTimeModalVisible(false);
                  // setMessage('');
                }}
              />
            )}
          </View>
        </View>
      </View>
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

    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
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
    flex: 1,
    margin: 2,
  },
});
