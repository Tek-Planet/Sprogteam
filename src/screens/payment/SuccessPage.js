import React, {useContext, useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {ActivityIndicator, Button} from '../../components';
import {fonts} from '../../assets/fonts';
import axios from 'axios';
import {
  aalborgMail,
  baseURL,
  getTaskName,
  timeToString,
  toastNew as toast,
} from '../../util/util';
import {
  checkForRejection,
  getSingleUserInfo,
  sendNotificaion,
} from '../../data/data';

import {AuthContext} from '../../context/AuthProvider';

export default function Success({navigation}) {
  const {user, setReload} = useContext(AuthContext);
  const route = useRoute();

  const {item, amount, from} = route.params;

  // console.log('Location ', from);

  const [loading, setLoading] = useState(true);

  const {
    InterpreterID,
    TaskTypeId,
    CompanyName,
    BookingID,
    Address,
    OtherAdress,
    DateTimeStart,
    DateTimeEnd,
    RekvirantID,
    OrdreNumber,
    ToLanguageName,
  } = item;

  const address = Address !== null ? Address : OtherAdress;

  const startTime = timeToString(DateTimeStart);

  const endTime = timeToString(DateTimeEnd);

  const isUser = CompanyName.toLowerCase().includes(
    'Aalborg kommune'.toLowerCase(),
  )
    ? false
    : true;

  const requesterMail = isUser ? RekvirantID : aalborgMail;

  const rekvirant = CompanyName;

  useEffect(() => {
    if (from === 1) {
      fetchData();
    } else {
      postToDB(item);
    }
  }, []);

  const fetchData = async () => {
    const rejected = await checkForRejection(BookingID);

    const userDetails = await getSingleUserInfo(InterpreterID);

    updateBooking(2, userDetails, rejected);
  };

  const updateBooking = async (status, userDetails, rejected) => {
    try {
      const res = await axios.put(`/orders/${status}/${BookingID}`);
      // kommune;
      if (res.data.msg === 'success') {
        // getBookings(user);
        setReload(true);

        if (status === 2) {
          const data = {
            InterpreterId: InterpreterID,
            TaskId: TaskTypeId,
            BookingId: BookingID,
          };

          axios.post('/tasks', data);

          // console.log('Task res', taslRes.data);

          axios.put(`/orders/BellStatus/1/${BookingID}`);

          // console.log('Bell status res', taslRes.data);

          const body = {
            customerName: isUser
              ? user?.profile?.FirstName + ' ' + user?.profile?.LastName
              : rekvirant,
            bookingId: BookingID,
            taskType: getTaskName(TaskTypeId),
            caseNumber:
              OrdreNumber === null || OrdreNumber === 'null'
                ? 'Nil'
                : OrdreNumber, //item.OrdreNumber,

            startDate: startTime.date,
            startTime: startTime.time,
            endTime: endTime.time,

            fromLanguage: 'Danish',
            toLanguage: ToLanguageName,
            interpreterName:
              userDetails?.FirstName + ' ' + userDetails?.LastName,
            interpreterTelephone: userDetails?.PhoneNumber,
            customerMail: requesterMail,
            meetingPoint: address, //splitAddress === 'null' ? 'Nil' : splitAddress[0],
            link: item.VideoApi,
            recipient: [userDetails.Email],
            bcc: ['noreply@sprogteam.dk'],
            isUser: isUser,
            rekvirant: rekvirant,
            StatusName: rejected ? 1 : 0,
          };

          axios.post(
            // testing server
            // `https://aatsapi.herokuapp.com/mails/confirmbooking`,
            // live server
            `${baseURL}/mails/confirmbooking`,
            body,
          );
        }

        const body = {
          userId: InterpreterID,
          title: 'Booking Notification',
          text: 'The Status of your booking has been changed',
        };
        sendNotificaion(body);
      }
      setLoading(false);
      console.log('We made it');
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const postToDB = async newBooking => {
    try {
      const res = await axios.post(`/orders`, newBooking);

      if (res.data.msg === 'success') {
        const body = {
          userId: InterpreterID,
          title: 'Booking Notification',
          text: 'You have a new booking from ' + user.profile.FirstName,
        };
        sendNotificaion(body);

        navigation.navigate('Tab', {screen: 'Pending'});
      } else {
        toast('unable to complete booking please try again', 'error');
        console.log(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast('unable to complete booking', 'error');
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator show={loading} size={'large'} color={'red'} />
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          backgroundColor: '#F5F5F5',
          height: 400,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          // padding:10
        }}>
        <Image
          source={require('./success.png')}
          style={{
            width: 250,
            height: 100,
            resizeMode: 'contain',
            marginBottom: 30,
          }}
        />
        <Text style={{fontFamily: fonts.bold, fontSize: 20, margin: 10}}>
          Payment of {amount} Successful
        </Text>
        <Text style={{fontFamily: fonts.medium, fontSize: 18, margin: 10}}>
          Your booking has been scheduled
        </Text>
      </View>

      <View style={{width: '100%', margin: 10}}>
        <Button
          onPress={() => {
            navigation.replace('Drawer');
          }}
          buttonTitle={'Continue'}
        />
      </View>
    </View>
  );
}
