import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from './Button';
import axios from 'axios';
import {fonts} from '../assets/fonts';
import {
  baseURL,
  getStatusName,
  getTaskName,
  timeToString,
  toastNew as toast,
} from '../util/util';
import {
  changeInterPreterToAnonymous,
  getRegisterDevice,
  sendNotificaion,
  updateBooking,
} from '../data/data';
import {AuthContext} from '../context/AuthProvider';
import {useTranslation} from 'react-i18next';
import Loading from './ActivityIndicator';

const BookingList = props => {
  const {user, setReload} = useContext(AuthContext);
  const {t} = useTranslation();
  const {item, index, navigation} = props;
  const [owner, setOwner] = useState(
    user && user !== null && user.profile.Id === item.CreateBy ? true : false,
  );

  // console.log(item);

  const startTime = timeToString(item.DateTimeStart);

  const endTime = timeToString(item.DateTimeEnd);
  // tolkningsupport@aalborg.dk

  const isUser = item.CompanyName.toLowerCase().includes(
    'Aalborg kommune'.toLowerCase(),
  )
    ? false
    : true;

  const requesterMail = isUser
    ? item.RekvirantID
    : 'tolkningsupport@aalborg.dk';

  const rekvirant = item.CompanyName;

  const address = item.Address !== null ? item.Address : item.OtherAdress;

  const [loadingAccept, setLoadingAccept] = useState(false);

  const updateBookingStatus = async (status, bookingId) => {
    setLoadingAccept(true);
    var deviceId = [];
    try {
      let id = item.CreateBy;
      const userDetails = await getSingleUserInfo(id);

      if (userDetails === null) {
        toast('Unable to submit your request', 'error');
        return;
      }

      var requesterDetails = await getSingleUserInfo(requesterMail);

      if (requesterDetails === null) requesterDetails = userDetails;

      deviceId = await getRegisterDevice(userDetails.Id);

      const res = await updateBooking(status, bookingId);

      if (res.data.msg === 'success') {
        setReload(true);

        if (status === 2) {
          const data = {
            InterpreterId: user.profile.Id,
            TaskId: item.TaskTypeId,
            BookingId: item.BookingID,
          };

          // console.log(data);

          await axios.post('/tasks', data);

          await axios.put(`/orders/BellStatus/1/${bookingId}`);

          // send acceptance mail to customer
          let splitAddress = 'null';
          if (item.TaskTypeId === 1 && address !== 'null' && address !== null) {
            splitAddress = address.split(',');
          }
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
            meetingPoint: splitAddress === 'null' ? 'Nil' : splitAddress[0],
            postal_city:
              splitAddress === 'null'
                ? 'Nil'
                : splitAddress.length > 0
                ? splitAddress[1]
                : 'Nil',
            recipient: [requesterMail],
            // bcc: ['noreply@sprogteam.dk'],
            bcc: ['noreply@sprogteam.dk', 'techplanet49@gmail.com'],
            isUser: isUser,
            rekvirant: rekvirant,
          };

          const mailResponse = await axios.post(
            // testing server
            // `https://aatsapi.herokuapp.com/mails/confirmbooking`,
            // live server
            `${baseURL}/mails/confirmbooking`,
            body,
          );
          console.log('Mail Response', mailResponse.data);
        }

        if (status === 3) {
          // update a column
          const res = await axios.put(
            `/orders/InterpreterSalary/${item.InterpreterSalaryPending}/${bookingId}`,
          );
          console.log(res);
        }

        if (status === 6 || status === 9) {
          // update a column
          const rejecedBody = {
            InterpreterID: user.profile.Id,
            BookingID: item.BookingID,
            StatusName: status,
          };
          const res = await axios.post(`/orders/rejected`, rejecedBody);

          console.log(res.data);

          // put anonymoust for inteipreterId after rejecteion

          const anomymousRes = await changeInterPreterToAnonymous(
            'Anonym',
            bookingId,
          );
          console.log('anonymous vallue added ', anomymousRes.data);
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
          };

          const mailResponse = await axios.post(
            // testing server
            // `https://aatsapi.herokuapp.com/mails/confirmbooking`,
            // live server
            `${baseURL}/mails/cancelation`,
            body,
          );

          console.log('mail response', mailResponse.data);
        }

        if (deviceId.length > 0) {
          const body = {
            tokens: deviceId,
            title: 'Booking Notification',
            text: 'The Status of your booking has been changed',
          };
          await sendNotificaion(body);
        }
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

  const getSingleUserInfo = async id => {
    try {
      const res = await axios.get(`/users/${id}`);

      if (res.data.msg === 'success') {
        // console.log(res.data.result);
        return res.data.result;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <View
      key={index}
      style={{
        margin: 5,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
      }}>
      {/* top */}
      <View style={{}}>
        <Text style={[styles.text, {color: 'green', fontFamily: fonts.bold}]}>
          BookingID: {item.BookingID}
        </Text>
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
                item.StatusName === 1 ||
                item.StatusName === 3 ||
                item.StatusName === 4 ||
                item.StatusName === 5 ||
                item.StatusName === 6 ||
                item.StatusName === 7 ||
                item.StatusName === 8 ||
                item.StatusName === 9
                  ? 'red'
                  : 'green',
            },
          ]}>
          {owner
            ? getStatusName(item.StatusName, true)
            : getStatusName(item.StatusName)}
        </Text>
      </View>

      {owner ? (
        // customer price section
        <View>
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              {t('common:fee')} :{' '}
            </Text>
            <Text style={styles.text}>{item.PricesCustomer} kr</Text>
          </View>
          {item.TaskTypeId === 1 && (
            <View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:transport_fee')} :
                </Text>
                <Text style={styles.text}>{item.TfareCustomer} kr</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:total_fee')} :
                </Text>
                <Text style={styles.text}>
                  {(item.TfareCustomer + item.PricesCustomer).toFixed(0)} kr
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        // translator price section
        <View>
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              {t('common:fee')} :
            </Text>
            <Text style={styles.text}>{item.InterpreterSalary} kr</Text>
          </View>
          {item.TaskTypeId === 1 && (
            <View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:transport_fee')} :
                </Text>
                <Text style={styles.text}>{item.Tfare} kr</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:total_fee')} :
                </Text>
                <Text style={styles.text}>
                  {(item.Tfare + item.InterpreterSalary).toFixed(0)} kr
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {t('common:address')} :{' '}
                </Text>
                <Text style={[styles.text, {flex: 1}]}>{address}</Text>
              </View>
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
        <Text style={styles.text}>{getTaskName(item.TaskTypeId)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:start_time')} :
        </Text>
        <Text style={styles.text}>{startTime.date + ' ' + startTime.time}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:end_time')} :
        </Text>
        <Text style={styles.text}>{endTime.date + ' ' + endTime.time}</Text>
      </View>

      {item.Remark !== null && item.Remark.length > 0 && (
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:details')} :
          </Text>
          <Text style={[styles.text, {flex: 1}]}>
            {item.Remark !== null && item.Remark.length > 80
              ? item.Remark.substr(0, 60) + '...'
              : item.Remark}
          </Text>
        </View>
      )}

      {loadingAccept ? (
        <Loading size={'large'} show={loadingAccept} />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <View style={{width: 110}}>
            <Button
              onPress={() =>
                navigation.navigate('OtherNav', {
                  screen: 'BookingDetails',
                  params: {item: item},
                })
              }
              bGcolor={'#659ED6'}
              buttonTitle={t('common:details')}
            />
          </View>

          {/* {owner && item.StatusName === 8 && (
          <View style={{width: 110}}>
            <Button
              onPress={() => updateBookingStatus(3, item.BookingID)}
              bGcolor={'green'}
              buttonTitle={t('common:accept')}
            />
          </View>
        )} */}

          {(item.StatusName === 1 || item.StatusName === 8) && !owner && (
            <View style={{width: 110}}>
              <Button
                onPress={() => updateBookingStatus(2, item.BookingID)}
                bGcolor={'green'}
                buttonTitle={t('common:accept')}
              />
            </View>
          )}

          {(item.StatusName === 1 || item.StatusName === 8) && !owner && (
            <View style={{width: 110}}>
              <Button
                onPress={() => updateBookingStatus(6, item.BookingID)}
                bGcolor={'#800000'}
                buttonTitle={t('common:reject')}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default BookingList;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'justify',
    margin: 5,
  },
  row: {flexDirection: 'row'},
});
