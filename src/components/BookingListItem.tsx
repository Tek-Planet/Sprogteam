import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import {fontSize, fonts} from '../assets/fonts';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

import {spacing} from '../assets/spacing';
import {colorTypes} from '../assets/colors';
import {BookingModel, UserModel} from '../types';
import moment from 'moment';
import {
  BASE_URL,
  aalborgMail,
  calculatePrices,
  dateToMilliSeconds,
  defaultPrices,
  getCurrentDate,
  getStatusName,
  getTaskName,
  isCustomer,
  isTranslatorFree,
  mergeDateTime,
  msToTime,
  noreplyemail,
  priceCalculator,
  sendNotificaion,
  timeDifferenceInMilliseconds,
  timeToString,
  toast,
} from '../utils';
import {useAppSelector} from '../rtk/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton, CustomLoader} from '.';
import axios from 'axios';
import {getUserDetails} from '../rtk/features/user/userSlice';
import {
  useUpdateBookingMutation,
  useChangeInterpreterToAnonymousMutation,
  useChangeNewTimeStatusMutation,
} from '../rtk/services/bookings';

interface Props {
  item: BookingModel;
  onPress: () => void;
}

const BookingListItem = (props: Props) => {
  const {item, onPress} = props;

  const [updateBooking] = useUpdateBookingMutation();

  const [changeNewTimeStatus, {isLoading}] = useChangeNewTimeStatusMutation();

  const [changeInterpreterToAnonymous] =
    useChangeInterpreterToAnonymousMutation();

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user, currency} = useAppSelector(state => state.user);
  const {
    StatusName,
    BookingID,
    DateTimeStart,
    DateTimeEnd,
    Duration,
    TaskTypeId,
    ToLanguageName,
    CreateByApp,
    IsBookingCompleted,
    TfareCustomer,
    CreateBy,
    RekvirantID,
    PricesCustomer,
    InterpreterSalary,
    Tfare,
    kmTilTask,
    BookingForSelf,
    CitizenName,
    ServiceId,
    OfferStage,
    DeptAdresse,
    DeptZipcode,
    DeptCity,
    CompanyName,
    NewEndTime,
    InterpreterID,
  } = item;

  const [owner, setOwner] = useState(
    (user?.Id === CreateBy ||
      user?.Email === CreateBy ||
      user?.Email === RekvirantID) &&
      !user.interpreter
      ? true
      : false,
  );

  const startTime = timeToString(DateTimeStart);

  const endTime = timeToString(DateTimeEnd);

  const isUser =
    CompanyName &&
    CompanyName.toLowerCase().includes('Aalborg kommune'.toLowerCase())
      ? false
      : true;

  const requesterMail = isUser ? item.RekvirantID + '' : aalborgMail;

  const rekvirant = item.CompanyName;

  const [address, setAddress] = useState(
    item.Address !== null
      ? item.Address
      : item.OtherAdress || DeptAdresse + ' ' + DeptZipcode + ' ' + DeptCity,
  );

  const updateBookingStatus = async (status: number, bookingId: number) => {
    var requesterDetails: UserModel;
    setLoading(true);
    try {
      // let id = item.RekvirantID;

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

      requesterDetails = await getUserDetails(requesterMail);

      if (requesterDetails === null) {
        requesterDetails = user;
      }

      const body: any = {
        StatusNameId: owner
          ? status
          : status === 6 || status === 9
          ? 1
          : status,
        recordId: bookingId,
      };

      if (item.InterpreterID === 'Anonym') {
        // here we need to check the type of booking and wether this interpreter has salary set to determine final fee
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

      if (res.data) {
        if (status === 2) {
          console.log('accrting booking');
          const data = {
            InterpreterId: user.Id,
            TaskId: item.TaskTypeId,
            BookingId: item.BookingID,
          };

          // console.log(data);

          axios.post('/tasks', data);

          axios.put(`/orders/BellStatus/1/${bookingId}`);

          // send acceptance mail to customer

          let body = {
            customerName: requesterDetails
              ? requesterDetails?.FirstName !== null &&
                requesterDetails?.FirstName +
                  ' ' +
                  requesterDetails?.LastName !==
                  null &&
                requesterDetails?.LastName
              : '',
            bookingId: item.BookingID,
            taskType: getTaskName(item.TaskTypeId),
            caseNumber:
              item.OrdreNumber === null || item.OrdreNumber === 'null'
                ? 'Nil'
                : item.OrdreNumber, //item.OrdreNumber,

            startDate: startTime.date,
            startTime: startTime.time,
            endTime: endTime.time,
            fromLanguage: 'Danish',
            toLanguage: item.ToLanguageName,
            interpreterName: user.FirstName + ' ' + user.LastName,
            interpreterTelephone: user.PhoneNumber,
            customerMail: requesterMail,
            meetingPoint: address, //splitAddress === 'null' ? 'Nil' : splitAddress[0],
            link: item.VideoApi,
            recipient: isUser
              ? [requesterDetails?.Email]
              : [requesterDetails?.Email, noreplyemail],
            bcc: [noreplyemail, 'oluwabishefiu@gmail.com'],
            isUser: isUser,
            rekvirant: rekvirant,
            StatusName: StatusName,
            RekvirantID: RekvirantID,
            isCustomer: true,
            isApproved: true,
            currentDate: moment().format('DD-MM-YYYY HH:mm'),
            translatorEmail: user.Email,
          };

          axios.post(`${BASE_URL}mails/confirmbooking`, body);

          body.customerName = user.FirstName + ' ' + user.LastName;
          body.isCustomer = false;
          body.recipient = [user.Email];

          axios.post(`${BASE_URL}mails/confirmbookingtranslator`, body);
        }

        if (status === 3) {
          // update a column
          axios.put(
            `/orders/InterpreterSalary/${item.InterpreterSalaryPending}/${bookingId}`,
          );
          // console.log(res);
        }

        if (status === 6 || status === 9) {
          console.log('rejecting booking');
          // update a column
          const rejecedBody = {
            InterpreterID: user.Id,
            BookingID: item.BookingID,
            StatusName: status,
          };
          axios.post(`/orders/rejected`, rejecedBody);

          // console.log(res.data);

          // put anonymoust for inteipreterId after rejecteion

          let body: any = {
            InterpreterID: 'Anonym',
            BookingID: bookingId,
          };
          changeInterpreterToAnonymous(body);
          // console.log('anonymous vallue added ', anomymousRes.data);
        }
        // mail admin of booking cencelation
        if (status === 9) {
          const body = {
            bookingId: item.BookingID,
            customerName: requesterDetails
              ? requesterDetails?.FirstName !== null &&
                requesterDetails?.FirstName +
                  ' ' +
                  requesterDetails?.LastName !==
                  null &&
                requesterDetails?.LastName
              : '',
            taskType: getTaskName(item.TaskTypeId),
            caseNumber:
              item.OrdreNumber === null || item.OrdreNumber === 'null'
                ? 'Nil'
                : item.OrdreNumber, //item.OrdreNumber,

            startDate: startTime.date,
            startTime: startTime.time,
            endTime: endTime.time,

            fromLanguage: 'Danish',
            toLanguage: item.ToLanguageName,
            interpreterName: user.FirstName + ' ' + user.LastName,
            interpreterTelephone: user.PhoneNumber,
            customerMail: requesterMail,
            recipient: [noreplyemail],
            bcc: [],
            RekvirantID: RekvirantID,
          };

          axios.post(
            // testing server
            // `https://aatsapi.herokuapp.com/mails/confirmbooking`,
            // live server
            `${BASE_URL}mails/cancelation`,
            body,
          );

          // console.log('mail response', mailResponse.data);
        }

        const body = {
          userId: requesterDetails?.Id,
          title: 'Booking Notification',
          text: 'The Status of your booking has been changed',
          bookingId: BookingID.toString(),
        };
        sendNotificaion(body);
        setLoading(false);
      } else {
        console.log(res.error);
        toast('issue to update status please try again ', 'error');
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
      toast('error to update status please try again ', 'error');
      setLoading(false);
    }
  };

  const changeTimeStatus = async (status: number) => {
    var body: any;
    // get trans lators details to get the price of the tranlator
    try {
      if (status === 0) {
        body = {
          status,
          recordId: BookingID,
        };
      } else {
        const userDetails = await getUserDetails(InterpreterID);

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
          false,
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
      // {"customerPrice": "2676", "translatorPrice": "1338"}
      console.log(body);
      const res: any = await changeNewTimeStatus(body);

      if (res.data) {
        toast('success', 'success');
      } else {
        toast('unable to update status', 'error');
      }
      //   setReload(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <View>
        {(loading || isLoading) && <CustomLoader color={colors.main} />}
        <Pressable
          onPress={() => setShowDetails(!showDetails)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.ten,
          }}>
          <View>
            <Text
              style={{
                color: colors.black,
                fontFamily: fonts.medium,
                fontSize: fontSize.light,
              }}>
              {BookingID}
            </Text>

            <Text
              style={{
                color: colors.black,
                fontSize: 17,
                opacity: 0.6,
              }}>
              Date: {startTime.date}
            </Text>
          </View>

          <Feather
            name={showDetails ? 'chevron-down' : 'chevron-right'}
            size={20}
            color={colors.black}
          />
        </Pressable>

        {showDetails && (
          <View style={{}}>
            <View style={{borderWidth: 0.5, borderColor: colors.lightGray}} />

            {/* body */}
            <View style={{padding: spacing.ten, flex: 1}}>
              {/* start time */}
              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {t('common:start') + ' ' + t('common:time')}
                </Text>

                <Text style={{...styles.text}}>
                  {moment.utc(DateTimeStart).format('HH:mm')}
                </Text>
              </View>
              {/* end time */}
              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {t('common:end') + ' ' + t('common:time')}
                </Text>

                <Text style={{...styles.text}}>
                  {moment.utc(DateTimeEnd).format('HH:mm')}
                </Text>
              </View>

              {/*duration */}
              {Duration && (
                <View style={{...styles.row}}>
                  <Text style={{...styles.title}}>{t('common:duration')}</Text>

                  <Text style={{...styles.text}}>{Duration}</Text>
                </View>
              )}

              {/* price section */}

              {owner ? (
                // customer price section
                <View>
                  <View style={{}}>
                    {/* <Text style={[styles.title]}>{t('common:fee')}</Text> */}
                    {/* <Text style={styles.text}>
                      {PricesCustomer}
                      {!CreateByApp
                        ? currency.dkk
                        : IsBookingCompleted === 0
                        ? currency.dkk
                        : currency.usd}
                    </Text> */}
                  </View>
                  {TaskTypeId === 1 && (
                    <View>
                      {TfareCustomer !== null && (
                        <View style={{}}>
                          {/* <Text style={[styles.title]}>
                            {t('common:transport_fee')} :
                          </Text>
                          <Text style={styles.text}>
                            {TfareCustomer}{' '}
                            {!CreateByApp
                              ? ''
                              : IsBookingCompleted === 0
                              ? ' '
                              : currency.usd}
                          </Text> */}
                        </View>
                      )}
                      {/* <View style={styles.row}>
                        <Text style={[styles.title]}>
                          {t('common:total_fee')} :
                        </Text>

                        <Text style={styles.text}>
                          {(TfareCustomer + PricesCustomer).toFixed(0)}{' '}
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
                        <Text style={[styles.title]}>{t('common:fee')} :</Text>

                        <Text style={styles.text}>
                          {CreateByApp &&
                          IsBookingCompleted !== null &&
                          IsBookingCompleted > 0
                            ? PricesCustomer
                            : InterpreterSalary}
                          {!CreateByApp
                            ? ''
                            : IsBookingCompleted === 0
                            ? ' '
                            : currency.usd}
                        </Text>
                      </View>

                      {IsBookingCompleted !== null &&
                        IsBookingCompleted > 0 &&
                        TaskTypeId !== 1 && (
                          <View style={styles.row}>
                            <Text style={[styles.title]}>
                              {t('common:you_get')} :
                            </Text>
                            <Text style={[styles.text, {flex: 1}]}>
                              {InterpreterSalary}{' '}
                              {!CreateByApp
                                ? ''
                                : IsBookingCompleted === 0
                                ? ' '
                                : currency.usd}{' '}
                              ( - 20% service charges)
                            </Text>
                          </View>
                        )}
                      {TaskTypeId === 1 && (
                        <View>
                          {TfareCustomer !== null && (
                            <View style={styles.row}>
                              <Text style={[styles.title]}>
                                {t('common:transport_fee')} :
                              </Text>
                              <Text style={styles.text}>
                                {CreateByApp &&
                                IsBookingCompleted !== null &&
                                IsBookingCompleted > 0
                                  ? TfareCustomer
                                  : Tfare}{' '}
                                {!CreateByApp
                                  ? ''
                                  : IsBookingCompleted === 0
                                  ? ' '
                                  : currency.usd}
                              </Text>
                            </View>
                          )}
                          <View style={styles.row}>
                            <Text style={[styles.title]}>
                              {t('common:total_fee')} :
                            </Text>
                            <Text style={styles.text}>
                              {CreateByApp &&
                              IsBookingCompleted !== null &&
                              IsBookingCompleted > 0
                                ? (TfareCustomer + PricesCustomer).toFixed(0)
                                : (Tfare + InterpreterSalary).toFixed(0)}
                              {!CreateByApp
                                ? ''
                                : IsBookingCompleted === 0
                                ? ' '
                                : currency.usd}
                            </Text>
                          </View>

                          {CreateByApp &&
                            IsBookingCompleted !== null &&
                            IsBookingCompleted > 0 &&
                            TfareCustomer &&
                            PricesCustomer && (
                              <View style={styles.row}>
                                <Text style={[styles.text, ,]}>
                                  {t('common:you_get')} :
                                </Text>
                                <Text style={[styles.text, {flex: 1}]}>
                                  {priceCalculator(
                                    TfareCustomer + PricesCustomer,
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

                          {/*  {kmTilTask !== null && kmTilTask > 0 && ( */}
                          {kmTilTask !== null && kmTilTask > 0 && (
                            <View style={styles.row}>
                              <Text style={[styles.title]}>
                                {t('common:distance')} :{' '}
                              </Text>

                              <Text style={styles.text}>
                                {kmTilTask} km ({kmTilTask}{' '}
                                {t('common:multiply_by')} 2)
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.row}>
                    <Text style={[styles.title]}>
                      {BookingForSelf
                        ? t('common:customer')
                        : t('common:citizen')}{' '}
                      :
                    </Text>
                    <Text style={styles.text}> {CitizenName}</Text>
                  </View>
                </View>
              )}

              {/* type */}
              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:type')}</Text>

                <Text style={{...styles.text}}>
                  {getTaskName(TaskTypeId ? TaskTypeId : 1)}
                </Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:language')}</Text>

                <Text style={{...styles.text}}>{ToLanguageName}</Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:status')}</Text>

                <Text
                  style={{
                    ...styles.text,
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
                  }}>
                  {user.interpreter
                    ? getStatusName(StatusName ? StatusName : 0, true)
                    : getStatusName(StatusName ? StatusName : 0, false)}
                </Text>
              </View>

              {TaskTypeId === 1 &&
                address !== 'null' &&
                address !== 'null null null' && (
                  <View style={styles.row}>
                    <Text style={[styles.title]}>{t('common:address')} : </Text>
                    <Text style={[styles.text]}>{address}</Text>
                  </View>
                )}

              {ServiceId !== null && ServiceId !== 2 && ServiceId !== 3 && (
                <View style={[styles.row, {justifyContent: 'space-between'}]}>
                  <Text style={styles.text}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:deadline')} :{' '}
                    </Text>
                  </Text>
                  <View style={styles.row}>
                    <Ionicons name={'calendar'} size={16} color={'#000'} />
                    <Text style={styles.text}>{startTime.date}</Text>
                  </View>
                  <View style={styles.row}>
                    <Ionicons name={'time'} size={16} color={'#000'} />
                    <Text style={styles.text}>{startTime.time}</Text>
                  </View>
                </View>
              )}

              {/* buttins section */}
              {!isCustomer(user) &&
                IsBookingCompleted !== null &&
                IsBookingCompleted > 0 &&
                (StatusName === 8 || StatusName === 1) && (
                  <View style={styles.buttonWrapper}>
                    {(OfferStage === 'initial' ||
                      OfferStage === 'negotiating') &&
                    IsBookingCompleted === 1 ? (
                      // booking respond button for interpreter 4
                      <CustomButton
                        onTap={
                          () => {}
                          // navigation.navigate('OtherNav', {
                          //   screen: 'BookingResponse',
                          //   params: {item: item, path: 'Pending'},
                          // })
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

              <View style={{flexDirection: 'row'}}>
                {(StatusName === 1 || StatusName === 8 || StatusName === 9) &&
                  !owner &&
                  dateToMilliSeconds(item.DateTimeEnd) >
                    dateToMilliSeconds(getCurrentDate().toString()) &&
                  (!CreateByApp ||
                    (CreateByApp && IsBookingCompleted === 0)) && (
                    // accept button for web booking 5
                    <View style={styles.buttonWrapper}>
                      <CustomButton
                        onTap={() => updateBookingStatus(2, item.BookingID)}
                        bGcolor={'green'}
                        buttonTitle={t('common:accept')}
                      />
                    </View>
                  )}

                {(StatusName === 1 || StatusName === 8) &&
                  !owner &&
                  dateToMilliSeconds(item.DateTimeEnd) >
                    dateToMilliSeconds(getCurrentDate().toString()) &&
                  item.InterpreterID !== 'Anonym' && (
                    <View style={styles.buttonWrapper}>
                      {/* reject buttonn for interpreter 6 */}
                      <CustomButton
                        onTap={() => updateBookingStatus(6, item.BookingID)}
                        bGcolor={'#800000'}
                        buttonTitle={t('common:reject')}
                      />
                    </View>
                  )}
              </View>
              {/*change in time button for customer */}
              {owner && item.StatusName === 3 && (
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
                        padding={3}
                        textSize={14}
                        onTap={() => changeTimeStatus(1)}
                        bGcolor={'#32CD32'}
                        buttonTitle={
                          t('common:accept') + ' ' + t('common:time')
                        }
                      />
                    </View>

                    <View style={styles.buttonWrapper}>
                      {/* cancel new time for customer 8 */}
                      <CustomButton
                        padding={3}
                        textSize={14}
                        onTap={() => changeTimeStatus(0)}
                        bGcolor={'#800000'}
                        buttonTitle={
                          t('common:reject') + ' ' + t('common:time')
                        }
                      />
                    </View>
                  </View>
                </View>
              )}

              <CustomButton
                onTap={() => {
                  onPress();
                }}
                buttonTitle={t('common:details')}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: spacing.ten * 3,
      marginBottom: spacing.ten,
      flex: 1,
    },

    row: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: spacing.ten,
    },
    text: {
      color: colors.black,
      fontFamily: fonts.medium,
    },
    title: {
      color: colors.black,
      opacity: 0.6,
      fontFamily: fonts.medium,
    },
    buttonWrapper: {
      // width: '50%',
      flex: 1,
      margin: 2,
    },
  });

export default BookingListItem;
