import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from './Button';
import Indicator from './ActivityIndicator';
import dayjs from 'dayjs';
import axios from 'axios';
import {fonts} from '../assets/fonts';
import {
  alborgMail,
  getTaskName,
  mailSender,
  timeToString,
  toastNew as toast,
} from '../util/util';
import {getRegisterDevice, sendNotificaion} from '../data/data';
import {AuthContext} from '../context/AuthProvider';
import {useTranslation} from 'react-i18next';
import {colors} from '../assets/colors';

const RequestList = props => {
  const {t} = useTranslation();

  const {user, setReload} = useContext(AuthContext);
  const {item, index} = props;

  // console.log(item.Remark);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date(item.DateTimeStart));
  const [startDate, setStartDate] = useState(new Date(item.DateTimeStart));
  const [endDate, setEndDate] = useState(new Date(item.DateTimeEnd));
  const [taskTypeId, setTaskTypeId] = useState(item.TaskTypeId);
  const [policeApproved, setPoliceApproved] = useState(
    item.RequirePolice === true || item.RequirePolice === 1 ? true : false,
  );

  const startTime = timeToString(item.DateTimeStart);

  const endTime = timeToString(item.DateTimeEnd);

  const address = item.Address !== null ? item.Address : item.OtherAdress;

  const isUser = item.CompanyName.toLowerCase().includes(
    'Aalborg kommune'.toLowerCase(),
  )
    ? false
    : true;

  const requesterMail = isUser ? item.RekvirantID : alborgMail;

  const rekvirant = item.CompanyName;

  // console.log(address);

  const calculateDuration = (start, end) => {
    var timeStart = dayjs(start);
    var timeEnd = dayjs(end);
    var d = timeEnd.diff(timeStart);
    // 10800000
    return d;
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

    const value = taskTypeId === 2 || taskTypeId === 3 ? min : hrs;

    return value;
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

  const calculatePrices = async (ownerInfo, min) => {
    // decides if its morning or
    const hour = startDate.getHours();
    const day = date.getDay();

    let customerPrice,
      translatorPrice,
      defaultPriceCustomer,
      defaultPriceTranslator;

    if (taskTypeId === 2 || taskTypeId === 3) {
      // get the set price for customer
      defaultPriceCustomer =
        ownerInfo.VideoPhoneprice !== null ? ownerInfo.VideoPhoneprice : 320;
      // get the set price for translator
      defaultPriceTranslator =
        user.profile.Phonevideo !== null ? user.profile.Phonevideo : 160;
    } else {
      defaultPriceCustomer =
        ownerInfo.AttendancePrice !== null ? ownerInfo.AttendancePrice : 320;
      // get the set price for translator
      defaultPriceTranslator =
        user.profile.Attendance !== null ? user.profile.Attendance : 170;
    }
    console.log(defaultPriceCustomer, 'Kr');
    // weekday and morning price
    if (hour >= 8 && hour <= 16 && day > 0 && day < 6) {
      // check task type if its either audio or telephone
      if (taskTypeId === 2 || taskTypeId === 3) {
        console.log('weekday morning price telephone / video');
        if (policeApproved) {
          // get 50% incremanet for police approved translators during the day
          // charge customer  50% incremanet for police approved translators during the day
          customerPrice = min * (defaultPriceCustomer / 60);
          customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
          translatorPrice = min * (defaultPriceTranslator / 60);
          translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(
            2,
          );
        } else {
          console.log('min', min, 'price', defaultPriceCustomer);
          customerPrice = (min * (defaultPriceCustomer / 60)).toFixed(0);
          translatorPrice = (min * (defaultPriceTranslator / 60)).toFixed(0);
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
          // get 50% incremanet for police approved translators during the day
          // charge customer  50% incremanet for police approved translators during the day
          customerPrice = min * (defaultPriceCustomer / 60);
          customerPrice = (customerPrice + customerPrice).toFixed(0);
          translatorPrice = min * (defaultPriceTranslator / 60);
          translatorPrice = (translatorPrice + translatorPrice).toFixed(0);
        } else {
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
          // get 50% incremanet for police approved translators during the day
          // charge customer  50% incremanet for police approved translators during the day
          customerPrice = min * defaultPriceCustomer;
          customerPrice = (customerPrice + customerPrice).toFixed(0);
          translatorPrice = min * defaultPriceTranslator;
          translatorPrice = (translatorPrice + translatorPrice).toFixed(0);
        } else {
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

    const prices = {
      customerPrice,
      translatorPrice,
    };
    return prices;
  };

  const apply = async () => {
    setLoading(true);
    var deviceId = [];
    var requesterDetails = null;
    try {
      let id = item.CreateBy;
      const userDetails = await getSingleUserInfo(id);

      if (userDetails === null) {
        toast('Unable to apply, please try again', 'error');
        setLoading(false);
        return;
      }

      if (userDetails.Email === requesterMail) requesterDetails = userDetails;
      else requesterDetails = await getSingleUserInfo(requesterMail);

      if (requesterDetails === null) requesterDetails = userDetails;

      deviceId = await getRegisterDevice(userDetails.Id);

      // get the details of the customer that posted the request

      // convert duration to millisencond
      const durationL = await calculateDuration(startDate, endDate);

      // convert duration in millisencon to minutes or hour
      const minutes = await msToTime(durationL);

      //calculate price base on minutes or hours for tranlation
      const price = await calculatePrices(userDetails, minutes);

      // check the task type, do this if its is attendance translation

      let bookingObject = null;

      bookingObject = {
        BookingID: item.BookingID,
        InterpreterID: user.profile.Id,
        Fee: price.translatorPrice,
        FeeCustomer: price.customerPrice,
        Tfare: null,
        TfareCustomer: null,
        KmTilTask: null,
        StatusNameId: 2,
      };

      // this part will be useful in future when the distance is added
      // if (taskTypeId === 1) {
      // decode the meeting point address
      // let decodeMeetingAddress = await decodeLocationByName(address);

      // if (decodeMeetingAddress === null) {
      //   toast('Uable to apply', 'error');
      //   return;
      // }

      // decodeMeetingAddress = decodeMeetingAddress[0];

      // // decdoe the translator address
      // const transAddress = user.profile.Adresse + ' ' + user.profile.City;

      // let decodeTranslatorAddress = await decodeLocationByName(transAddress);

      // if (decodeTranslatorAddress === null) {
      //   toast('Uable to apply', 'error');
      //   return;
      // }

      // decodeTranslatorAddress = decodeTranslatorAddress[0];

      // distance calculation area
      // imitialise the distance prices for both customer and translator
      // let translatorKmPrice =
      //   user.profile.KmPrice !== null ? user.profile.KmPrice : 2.44;
      // let customerKmPrice =
      //   ownerInfo.KmPrice !== null ? ownerInfo.KmPrice : 3.44;

      // let fareTranslator, fareCustomer;

      // calculate distance betwen the two decoded addresses
      // const res = await calculateDistance(
      //   decodeTranslatorAddress.formattedAddress,
      //   decodeMeetingAddress.formattedAddress,
      // );

      // if (res === 'error') {
      //   toast('unable to apply', 'error');
      //   return;
      // }

      // const distance = (res.rows[0].elements[0].distance.value / 1000).toFixed(
      //   0,
      // );

      // use the distnace to calculate transportation fee
      // if (distance * 2 > 12) {
      //   fareTranslator = ((distance * 2 - 12) * translatorKmPrice).toFixed(0);
      // } else fareTranslator = 0;
      // //  setFare(fareTranslator);
      // fareCustomer = (distance * customerKmPrice * 2).toFixed(0);

      // console.log(price);
      // construct booking object to use for the database update
      //   bookingObject = {
      //     BookingID: item.BookingID,
      //     InterpreterID: user.profile.Id,
      //     Fee: price.translatorPrice,
      //     FeeCustomer: price.customerPrice,
      //     Tfare: null,
      //     TfareCustomer: null,
      //     KmTilTask: null,
      //   };
      // }// else {
      // this is a telephone / video booking
      // bookingObject = {
      //   BookingID: item.BookingID,
      //   InterpreterID: user.profile.Id,
      //   Fee: price.translatorPrice,
      //   FeeCustomer: price.customerPrice,
      //   Tfare: null,
      //   TfareCustomer: null,
      //   KmTilTask: null,
      // };
      //   }
      // update the booking with the neccesary details
      const responseBooking = await axios.put(
        `/orders/request/accept`,
        bookingObject,
      );

      if (responseBooking.data.msg !== 'success') {
        toast('unable to apply', 'error');
        console.log(responseBooking.data.error.originalError);
        setLoading(false);
        return;
      }

      // once booking as been updated mark is as closed
      await axios.put(`/request/Closed/${item.BookingID}`);

      // construct task table object
      const data = {
        InterpreterId: user.profile.Id,
        TaskId: item.TaskTypeId,
        BookingId: item.BookingID,
      };

      // save booking to task table
      const taskRespose = await axios.post('/tasks', data);

      console.log('Task Response', taskRespose.data);

      // send confirmastion mail
      // constructing body of the mail

      const mailBody = {
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
        interpreterName: user.profile.FirstName + ' ' + user.profile.LastName,
        interpreterTelephone: user.profile.PhoneNumber,
        customerMail: requesterMail,
        meetingPoint: address, //splitAddress === 'null' ? 'Nil' : splitAddress[0],
        // postal_city:
        //   splitAddress === 'null'
        //     ? 'Nil'
        //     : splitAddress.length > 0
        //     ? splitAddress[1]
        //     : 'Nil',
        recipient: [requesterMail],
        // bcc: ['noreply@sprogteam.dk'],
        bcc: ['noreply@sprogteam.dk', 'techplanet49@gmail.com'],
        isUser: isUser,
        rekvirant: rekvirant,
        StatusName: 2,
      };
      // // send the confirmation mail to the customer
      const mailResponse = await mailSender(mailBody);

      console.log(mailResponse.data);

      // send notification
      if (deviceId.length > 0 && deviceId !== null) {
        const body = {
          tokens: deviceId,
          title: 'Booking Notification',
          text: 'Your request has been accepted',
        };
        const notres = await sendNotificaion(body);
        console.log('from notification', notres);
      }

      // if we get to this point evrything works fine
      toast('application successful', 'success');
      setLoading(false);

      // refresh the list
      setReload(true);
    } catch (error) {
      console.log(error);
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
        <Text
          style={[styles.text, {color: colors.green, fontFamily: fonts.bold}]}>
          BookingID: {item.BookingID}
        </Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>Status: </Text>

        <Text
          style={[
            styles.text,
            {
              color:
                item.StatusName === 1 ||
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
          {getStatusName(item.StatusName)}
        </Text>
      </View> */}

      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:tasktype')}:
        </Text>
        <Text style={styles.text}>{getTaskName(item.TaskTypeId)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:translated_from')} :
        </Text>
        <Text style={styles.text}>Dansk</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:translated_to')} : :
        </Text>
        <Text style={styles.text}>{item.ToLanguageName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:date')} :
        </Text>
        <Text style={styles.text}>{startTime.date}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:start_time')} :
        </Text>
        <Text style={styles.text}>{startTime.time}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:end_time')} :
        </Text>
        <Text style={styles.text}>{endTime.time}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {t('common:duration')} :
        </Text>
        <Text style={styles.text}>{item.Duration}</Text>
      </View>

      {taskTypeId === 1 && (
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:address')} :{' '}
          </Text>
          <Text style={[styles.text, {flex: 1}]}>{address}</Text>
        </View>
      )}

      {item.Remark !== null && item.Remark.length > 0 && (
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:details')} :
          </Text>
          <Text style={[styles.text, {flex: 1}]}>{item.Remark}</Text>
        </View>
      )}
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <View style={{width: '60%'}}>
          {loading ? (
            <Indicator color={'#659ED6'} show={loading} size={'small'} />
          ) : (
            <Button
              onPress={() => apply()}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:accept')}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default RequestList;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: fonts.medium,
    textAlign: 'justify',
    margin: 5,
    color: colors.black,
  },
  row: {flexDirection: 'row'},
});
