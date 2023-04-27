import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Button from './Button';
import axios from 'axios';
import {fonts} from '../assets/fonts';
import {
  baseURL,
  getStatusName,
  getTaskName,
  priceCalculator,
  timeToString,
  toastNew as toast,
  baseCurrency,
  aalborgMail,
  timeDifferenceInMilliseconds,
  calculatePrices,
  defaultPrices,
  msToTime,
  isCustomer,
  getCurrentDate,
} from '../util/util';
import {
  changeInterPreterToAnonymous,
  changeNewTimeStatus,
  deleteBooking,
  getMiniMalUserInfo,
  getSingleUserInfo,
  sendNotificaion,
  updateBooking,
} from '../data/data';
import {AuthContext} from '../context/AuthProvider';
import {useTranslation} from 'react-i18next';
import Loading from './ActivityIndicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../assets/colors';
import moment from 'moment';

const BookingList = props => {
  const navigation = useNavigation();
  const {user, setReload, available_services} = useContext(AuthContext);
  const {t} = useTranslation();
  const {item, index, width} = props;
  const [owner, setOwner] = useState(
    (user?.profile?.Id === item.CreateBy ||
      user?.profile?.Email === item.CreateBy ||
      user?.profile?.Email === item.RekvirantID) &&
      !user.profile.interpreter
      ? true
      : false,
  );

  const {
    BookingID,
    StatusName,
    DateTimeEnd,
    DateTimeStart,
    IsBookingCompleted,
    InterpreterSalary,
    NewEndTime,
    TaskTypeId,
    RequirePolice,
    InterpreterID,
    OfferStage,
    CreateByApp,
    RekvirantID,
    CreateBy,
    ServiceId,
    DeptAdresse,
    DeptCity,
    DeptZipcode,
  } = item;

  // console.log('Mad ', RekvirantID);

  const startTime = timeToString(DateTimeStart);

  const endTime = timeToString(DateTimeEnd);
  // tolkningsupport@aalborg.dk

  const isUser = item.CompanyName.toLowerCase().includes(
    'Aalborg kommune'.toLowerCase(),
  )
    ? false
    : true;

  const requesterMail = isUser ? item.RekvirantID : aalborgMail;

  const rekvirant = item.CompanyName;

  // const address = item.Address !== null ? item.Address : item.OtherAdress;

  const [address, setAddress] = useState(
    item.Address !== null
      ? item.Address
      : item.OtherAdress || DeptAdresse + ' ' + DeptZipcode + ' ' + DeptCity,
  );

  const [loadingAccept, setLoadingAccept] = useState(false);

  const updateBookingStatus = async (status, bookingId) => {
    setLoadingAccept(true);

    var requesterDetails = null;
    try {
      // let id = item.RekvirantID;

      requesterDetails = await getSingleUserInfo(requesterMail);

      if (requesterDetails === null) {
        requesterDetails = user.profile;
      }

      const res = await updateBooking(status, bookingId);

      if (res.data.msg === 'success') {
        setReload(true);

        if (status === 2) {
          console.log('accrting booking');
          const data = {
            InterpreterId: user.profile.Id,
            TaskId: item.TaskTypeId,
            BookingId: item.BookingID,
          };

          // console.log(data);

          axios.post('/tasks', data);

          axios.put(`/orders/BellStatus/1/${bookingId}`);

          // send acceptance mail to customer

          const body = {
            customerName: requesterDetails
              ? requesterDetails.FirstName !== null &&
                requesterDetails.FirstName + ' ' + requesterDetails.LastName !==
                  null &&
                requesterDetails.LastName
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
            interpreterName:
              user.profile.FirstName + ' ' + user.profile.LastName,
            interpreterTelephone: user.profile.PhoneNumber,
            customerMail: requesterMail,
            meetingPoint: address, //splitAddress === 'null' ? 'Nil' : splitAddress[0],
            link: item.VideoApi,
            recipient: [requesterDetails.Email],
            bcc: ['noreply@sprogteam.dk'],
            isUser: isUser,
            rekvirant: rekvirant,
            StatusName: StatusName,
            RekvirantID: RekvirantID,
            isCustomer: true,
            isApproved: true,
            currentDate: moment().format('DD-MM-YYYY HH:mm'),
            translatorEmail: user.profile.Email,
          };

          axios.post(`${baseURL}/mails/confirmbooking`, body);
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
            InterpreterID: user.profile.Id,
            BookingID: item.BookingID,
            StatusName: status,
          };
          axios.post(`/orders/rejected`, rejecedBody);

          // console.log(res.data);

          // put anonymoust for inteipreterId after rejecteion

          changeInterPreterToAnonymous('Anonym', bookingId);
          // console.log('anonymous vallue added ', anomymousRes.data);
        }
        // mail admin of booking cencelation
        if (status === 9) {
          const body = {
            bookingId: item.BookingID,
            customerName: requesterDetails
              ? requesterDetails.FirstName !== null &&
                requesterDetails.FirstName + ' ' + requesterDetails.LastName !==
                  null &&
                requesterDetails.LastName
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
          userId: requesterDetails.Id,
          title: 'Booking Notification',
          text: 'The Status of your booking has been changed',
          bookingId: BookingID.toString(),
        };
        sendNotificaion(body);
      } else {
        toast('Unable to update status please try again ', 'error');
      }
      setLoadingAccept(false);
    } catch (error) {
      console.log(error.message);
      toast('Unable to update status please try again ', 'error');
      setLoadingAccept(false);
    }
  };

  const changeTimeStatus = async (status, bookingId, recordId) => {
    setLoadingAccept(true);
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
        const userDetails = await getSingleUserInfo(InterpreterID);

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
      // console.log(body);
      const res = await changeNewTimeStatus(body);
      console.log(res);
      if (res !== null) {
        toast('success', 'success');
      } else {
        toast('unable to update status', 'error');
      }
      setReload(true);
      setLoadingAccept(false);
    } catch (error) {
      console.log(error);
      setLoadingAccept(false);
    }
  };

  const removeOrder = async () => {
    setLoadingAccept(true);
    const res = await deleteBooking(item.BookingID);
    if (res == 'Deleted') {
      setReload(true);
    } else {
      setLoadingAccept(false);
      toast('Unable to remove Item', 'error');
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        // if (isInterpreter && IsBookingCompleted === 2 && StatusName === 1) {
        //   return;
        // }
        navigation.navigate('OtherNav', {
          screen: 'BookingDetails',
          // params: {reload: true, bookingId: parseInt(item.BookingID)},
          params: {item: item},
        });
      }}
      key={index}
      style={{
        margin: 5,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        width: width ? width : '98%',
        alignSelf: 'center',
        height: width && 260,
      }}>
      {/* top */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={[styles.text, {color: 'green', fontFamily: fonts.bold}]}>
          BookingID: {item.BookingID}
        </Text>

        {/* {IsBookingCompleted === 2 && (
          <Text
            style={[styles.text, {fontFamily: fonts.bold, color: '#659ED6'}]}>
            Direct Request
          </Text>
        )} */}
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
          {owner ? getStatusName(StatusName, true) : getStatusName(StatusName)}
        </Text>
      </View>

      {item.ChangeInterpreter && (
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:new') + ' ' + t('common:time')} :
          </Text>
          <Text style={[styles.text, {width: 220}]}>
            {timeToString(item.NewEndTime).time}
          </Text>
        </View>
      )}

      {owner ? (
        // customer price section
        <View>
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              {t('common:fee')} :{' '}
            </Text>
            <Text style={styles.text}>
              {item.PricesCustomer}{' '}
              {!CreateByApp
                ? ''
                : IsBookingCompleted === 0
                ? ' '
                : baseCurrency.usd}
            </Text>
          </View>
          {item.TaskTypeId === 1 && (
            <View>
              {item.TfareCustomer !== null && (
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:transport_fee')} :
                  </Text>
                  <Text style={styles.text}>
                    {item.TfareCustomer}{' '}
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
                  {(item.TfareCustomer + item.PricesCustomer).toFixed(0)}{' '}
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
                    ? item.PricesCustomer
                    : item.InterpreterSalary}
                  {!CreateByApp
                    ? ''
                    : IsBookingCompleted === 0
                    ? ' '
                    : baseCurrency.usd}
                </Text>
              </View>

              {item.IsBookingCompleted > 0 && item.TaskTypeId !== 1 && (
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:you_get')} :
                  </Text>
                  <Text style={[styles.text, {flex: 1}]}>
                    {item.InterpreterSalary}{' '}
                    {!CreateByApp
                      ? ''
                      : IsBookingCompleted === 0
                      ? ' '
                      : baseCurrency.usd}{' '}
                    ( - 20% service charges)
                  </Text>
                </View>
              )}
              {item.TaskTypeId === 1 && (
                <View>
                  {item.TfareCustomer !== null && (
                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:transport_fee')} :
                      </Text>
                      <Text style={styles.text}>
                        {CreateByApp && IsBookingCompleted > 0
                          ? item.TfareCustomer
                          : item.Tfare}{' '}
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
                      {CreateByApp && IsBookingCompleted > 0
                        ? (item.TfareCustomer + item.PricesCustomer).toFixed(0)
                        : (item.Tfare + item.InterpreterSalary).toFixed(0)}
                      {!CreateByApp
                        ? ''
                        : IsBookingCompleted === 0
                        ? ' '
                        : baseCurrency.usd}
                    </Text>
                  </View>

                  {CreateByApp && IsBookingCompleted > 0 && (
                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:you_get')} :
                      </Text>
                      <Text style={[styles.text, {flex: 1}]}>
                        {priceCalculator(
                          item.TfareCustomer + item.PricesCustomer,
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

                  {/* <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:address')} :{' '}
                    </Text>
                    <Text style={[styles.text, {flex: 1}]}>{address}</Text>
                  </View> */}
                  {/*  {item.kmTilTask !== null && item.kmTilTask > 0 && ( */}
                  {item.kmTilTask !== null && item.kmTilTask > 0 && (
                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:distance')} :{' '}
                      </Text>

                      <Text style={styles.text}>
                        {parseInt(item.kmTilTask)} km ({item.kmTilTask}{' '}
                        {t('common:multiply_by')} 2)
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              {item.BookingForSelf ? t('common:customer') : t('common:citizen')}{' '}
              :
            </Text>
            <Text style={styles.text}> {item.CitizenName}</Text>
          </View>
        </View>
      )}
      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:tasktype')} :
        </Text>
        <Text style={styles.text}>
          {ServiceId === null || ServiceId === 3 || ServiceId === 0
            ? getTaskName(item.TaskTypeId)
            : available_services[ServiceId - 1]?.label}
        </Text>
      </View>

      {item.Remark !== null && item.Remark.length > 0 && (
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:details')} :
          </Text>
          <Text style={[styles.text, {width: 220}]}>
            {item.Remark !== null && item.Remark.length > 60
              ? item.Remark.substr(0, 60).trim() + '...'
              : item.Remark.trim()}
          </Text>
        </View>
      )}

      {TaskTypeId === 1 && (
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:address')} :{' '}
          </Text>
          <Text style={[styles.text, {flex: 1}]}>{address}</Text>
        </View>
      )}

      {ServiceId === null || ServiceId === 2 || ServiceId === 3 ? (
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.row}>
            <Ionicons name={'calendar'} size={16} color={'#000'} />
            <Text style={styles.text}>{startTime.date}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name={'time'} size={16} color={'#000'} />
            <Text style={styles.text}>
              {startTime.time} - {endTime.time}
            </Text>
          </View>
        </View>
      ) : (
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

      {timeDifferenceInMilliseconds(DateTimeStart, getCurrentDate()) > 600000 &&
        !isCustomer(user) && (
          <TouchableOpacity
            onPress={() => navigation.navigate('FeedBack', {item: item})}
            style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={styles.row}>
              <Text style={styles.text}>Send Feed Back</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name={'chevron-forward'} size={20} color={'#000'} />
            </View>
          </TouchableOpacity>
        )}

      {loadingAccept ? (
        <Loading size={'large'} show={loadingAccept} />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: 10,
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

                {(OfferStage === 'initial' || OfferStage === 'negotiating') &&
                  (IsBookingCompleted === 2 ? (
                    <View style={styles.buttonWrapper}>
                      <Button
                        onPress={() =>
                          navigation.navigate('OtherNav', {
                            screen: 'BookingResponse',
                            params: {item: item, path: 'Pending'},
                          })
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
                  <Button
                    onPress={() => removeOrder()}
                    bGcolor={'#800000'}
                    buttonTitle={t('common:cancel')}
                  />
                </View>
              </View>
            )}

          {/* translator buttons section*/}

          {!isCustomer(user) &&
            IsBookingCompleted > 0 &&
            (StatusName === 8 || StatusName === 1) && (
              <View style={styles.buttonWrapper}>
                {(OfferStage === 'initial' || OfferStage === 'negotiating') &&
                IsBookingCompleted === 1 ? (
                  // booking respond button for interpreter 4
                  <Button
                    onPress={() =>
                      navigation.navigate('OtherNav', {
                        screen: 'BookingResponse',
                        params: {item: item, path: 'Pending'},
                      })
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

          {(StatusName === 1 || StatusName === 8) &&
            !owner &&
            (!CreateByApp || (CreateByApp && IsBookingCompleted === 0)) && (
              // accept button for web booking 5
              <View style={styles.buttonWrapper}>
                <Button
                  onPress={() => updateBookingStatus(2, item.BookingID)}
                  bGcolor={'green'}
                  buttonTitle={t('common:accept')}
                />
              </View>
            )}

          {(StatusName === 1 || StatusName === 8) && !owner && (
            <View style={styles.buttonWrapper}>
              {/* reject buttonn for interpreter 6 */}
              <Button
                onPress={() => updateBookingStatus(6, item.BookingID)}
                bGcolor={'#800000'}
                buttonTitle={t('common:reject')}
              />
            </View>
          )}
          {/*change in time button for customer */}
          {owner && item.StatusName === 3 && (
            <View style={{flexDirection: 'row'}}>
              <View style={styles.buttonWrapper}>
                {/* accept new time button for interpreter 7 */}
                <Button
                  onPress={() =>
                    changeTimeStatus(1, item.BookingID, item.BookingtimeEndID)
                  }
                  bGcolor={'#32CD32'}
                  buttonTitle={t('common:accept') + ' ' + t('common:time')}
                />
              </View>

              <View style={styles.buttonWrapper}>
                {/* cancel new time for customer 8 */}
                <Button
                  onPress={() =>
                    changeTimeStatus(0, item.BookingID, item.BookingtimeEndID)
                  }
                  bGcolor={'#800000'}
                  buttonTitle={t('common:reject') + ' ' + t('common:time')}
                />
              </View>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BookingList;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: fonts.medium,
    textAlign: 'justify',
    margin: 5,
    color: colors.black,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  buttonWrapper: {
    width: '50%',
  },
});
