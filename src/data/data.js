import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseURL, dateToMilliSeconds, getCurrentDate} from '../util/util';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';
import {
  interpreter,
  guider,
  authorised,
  piano,
  proofread,
  translator,
  technical,
  legal,
  health,
  seo,
  writing,
  transcript,
  proofreading,
  lawsuit,
} from '../assets/icons';
// get user details

// services

export const getServices = () => {
  const {t} = useTranslation();

  const services = [
    {
      label: t('common:authorized'),
      value: 1,
      image: authorised,
      backgroundColor: '#D4D4D4',
      textColor: '#000',
    },
    {
      label: t('common:guider'),
      value: 2,
      image: guider,
      backgroundColor: '#4D4C4C',
      textColor: '#fff',
    },
    {
      label: t('common:interpreter'),
      value: 3,
      image: interpreter,
      backgroundColor: '#000',
      textColor: '#fff',
    },
    {
      label: t('common:lyricist'),
      value: 4,
      image: piano,
      backgroundColor: '#d30dde',
      textColor: '#fff',
    },
    {
      label: t('common:proof_reader'),
      value: 5,
      image: proofread,
      backgroundColor: '#F3FF0F',
      textColor: '#000',
    },
    {
      label: t('common:translator'),
      value: 6,
      image: translator,
      backgroundColor: '#659ED6',
      textColor: '#fff',
    },

    // {
    //   label: t('common:written'),
    //   value: 7,
    //   image: written,
    //   backgroundColor: '#659ED6',
    //   textColor: '#fff',
    // },
  ];
  return services;
};

export const getSkills = () => {
  const {t} = useTranslation();

  const skills = [
    {
      label: t('common:label1'),
      value: 1,
      image: technical,
    },
    {
      label: t('common:label2'),
      value: 2,
      image: legal,
    },
    {
      label: t('common:label3'),
      value: 3,
      image: health,
    },
    {label: t('common:label4'), value: 4, image: translator},
    {label: t('common:label5'), value: 5, image: seo},
    {label: t('common:label6'), value: 6, image: writing},
    {label: t('common:label7'), value: 7, image: transcript},
    {label: t('common:label8'), value: 8, image: proofreading},
    {label: t('common:label9'), value: 9, image: lawsuit},
  ];
  return skills;
};

export const getStatusName = (status, customer) => {
  const {t} = useTranslation();

  const statusName = [
    {label: t('common:waiting')},
    {label: t('common:approve')},
    {label: t('common:approve_new_time')},
    {label: t('common:cancelled')},
    {label: t('common:rejected')},
    {label: customer ? t('common:waiting') : t('common:rejected_interpreter')},
    {label: t('common:cancelled_too_late')},
    {
      label: customer
        ? t('common:waiting')
        : t('common:awaiting_approval_interpretor'),
    },
    {label: customer ? t('common:approve') : t('common:canceled_interpretor')},
    {label: customer ? t('common:waiting') : t('common:removed_interpretor')},
    {label: t('common:denied_new_time')},
    {label: t('common:Slet')},
    {label: t('common:unknown')},
  ];

  return statusName[status].label;
};

// task types for booking
export const getBookingTypes = () => {
  const {t} = useTranslation();

  const bookingTypes = [
    {
      label: t('common:attendance'),
      value: 1,
    },
    {
      label: t('common:video'),
      value: 2,
    },
    {
      label: t('common:telephone'),
      value: 3,
    },
    {
      label: t('common:written'),
      value: 4,
    },
  ];
  return bookingTypes;
};

export const getExtraRatingData = () => {
  const {t} = useTranslation();

  const skills = [
    {
      label: t('common:rating1'),
      value: t('common:rating1'),
      selector: 1,
    },
    {
      label: t('common:rating2'),
      value: t('common:rating2'),
      selector: 2,
    },
    {
      label: t('common:rating3'),
      value: t('common:rating3'),
      selector: 3,
    },
    {
      label: t('common:rating4'),
      value: t('common:rating4'),
      selector: 4,
    },
    {
      label: t('common:rating5'),
      value: t('common:rating5'),
      selector: 4,
    },
    {
      label: t('common:rating6'),
      value: t('common:rating6'),
      selector: 6,
    },
    {
      label: t('common:rating7'),
      value: t('common:rating7'),
      selector: 7,
    },
    {
      label: t('common:rating8'),
      value: t('common:rating8'),
      selector: 8,
    },
    {
      label: t('common:rating9'),
      value: t('common:rating9'),
      selector: 9,
    },
    {
      label: t('common:rating10'),
      value: t('common:rating10'),
      selector: 10,
    },
    {
      label: t('common:rating11'),
      value: t('common:rating11'),
      selector: 11,
    },
    {
      label: t('common:rating12'),
      value: t('common:rating12'),
      selector: 12,
    },
    {
      label: t('common:rating13'),
      value: t('common:rating13'),
      selector: 13,
    },
  ];
  return skills;
};

export const getTranslators = async country => {
  console.log(country);
  let list = [];
  try {
    console.log('started at', new Date());
    const res = await axios.get(`/users/translators/${country}`);
    if (res.data.msg === 'success') {
      // setTranslators(res.data.result);

      // setRefreshing(false);
      // if (MunicipalTasks) {
      //   list = res.data.result?.filter(
      //     translator => translator.info.MunicipalTasks === true,
      //   );
      //   // console.log(list);
      // } else {
      //   list = res.data.result;
      // }
      list = res.data.result;
      // console.log('fetch data ', list.length);
    }
    console.log('fetch data ', list.length);
    return list;
  } catch (error) {
    console.log('Error from translator', error.message);
    return list;
    // setRefreshing(false);
  }
};

// get translators by seriveId and location
export const getTranslatorsByServiceId = async (serviceId, location) => {
  console.log('Fetching By Location');
  let list = [];
  try {
    const res = await axios.get(
      `/users/interpreters/${serviceId}/${location.lat}/${location.lng}`,
    );

    if (res.data.msg === 'success') {
      // setTranslators(res.data.result);

      // setRefreshing(false);
      // if (MunicipalTasks) {
      //   list = res.data.result?.filter(
      //     translator => translator.info.MunicipalTasks === true,
      //   );
      //   // console.log(list);
      // } else {
      //   list = res.data.result;
      // }
      list = res.data.result;
      // console.log('fetch data ', list.length);
      console.log('fetch data ', list.length);
    }
    return list;
  } catch (error) {
    console.log('Error from translator', error.message);
    return list;
    // setRefreshing(false);
  }
};

// get trans lators by Country
export const getTranslatorsByCountry = async (serviceId, country) => {
  console.log('Fetching By Country');
  let list = [];
  try {
    const res = await axios.get(
      `/users/interpretersbycountry/${serviceId}/${country}`,
    );
    if (res.data.msg === 'success') {
      list = res.data.result;
    }
    console.log(res.data, '');

    return list;
  } catch (error) {
    console.log('Error from translator', error.message);
    return list;
  }
};

export const getTranslatorsLocally = async () => {
  let list = [];
  try {
    const jsonValue = await AsyncStorage.getItem('translators');
    if (jsonValue !== null) {
      list = JSON.parse(jsonValue);
    }
    return list;
  } catch (e) {
    // error reading value
    console.log(e);
    return list;
  }
};

export const storeTranslators = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('translators', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getDetails = async userId => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    if (jsonValue !== null) {
      let localUser = JSON.parse(jsonValue);
      return localUser;
    } else {
      const user = await getUser(userId);
      await storeDetails(user);
      return user;
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

// get user profile
export const getUser = async userId => {
  try {
    const res = await axios.get(`/users/${userId}`);

    if (res.data.msg === 'success') {
      return {
        msg: res.data.msg,
        profile: res.data.result,
      };
    } else
      return {
        msg: res.data.msg,
        profile: {},
      };
  } catch (err) {
    console.log(err, 'Here');
    return {
      msg: 'failed',
      profile: {},
    };
  }
};

export const getSingleUserInfo = async id => {
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

export const getMiniMalUserInfo = async id => {
  try {
    const res = await axios.get(`/users/details/${id}`);

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

export const storeDetails = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    console.log(e);
  }
};
//feetch news
export const getNews = async column => {
  var news = [];
  try {
    const res = await axios.get(`/news/${column}`);
    if (res.data.msg === 'success') {
      news = res.data.result;
    }
    return news;
  } catch (error) {
    console.log(error);
    return [];
  }
};
// fetch terms
export const getTerms = async column => {
  var terms = [];
  try {
    const res = await axios.get(`/rules/${column}`);
    if (res.data.msg === 'success') {
      terms = res.data.result;
    }

    return terms;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBookings = async localUser => {
  // console.log(localUser.profile.Id);

  var bookings = [];
  try {
    const id = localUser.profile.Id;
    const email = localUser.profile.Email;

    const column =
      localUser.profile.interpreter || localUser.profile.interpreter === 1
        ? 'InterpreterID'
        : 'CreateBy';
    const res = await axios.get(`/orders/${column}/${id}/${email}`);
    if (res.data.msg === 'success') {
      bookings = res.data.result;
    }
    console.log('total bookings ', bookings.length);
    return bookings;
  } catch (error) {
    console.log('Booking Log', error.message);
    return [];
  }
};

// get Ratings
export const getRatings = async userId => {
  var ratings = [];
  try {
    const res = await axios.get(`/ratings/${userId}`);
    // console.log(res.data);
    if (res.data.msg === 'success') {
      //    console.log(res.data.result);
      ratings = res.data.result;
    } else {
      console.log(res.data.msg);
      ratings = [];
    }

    return ratings;
  } catch (error) {
    console.log('Rating Log ', error);
    return ratings;
  }
};
// get favourite list
// get favourite list
export const getFavourite = async userId => {
  var favourite = [];
  try {
    const res = await axios.get(`/favourites/${userId}`);
    if (res.data.msg === 'success') {
      favourite = res.data.result;
    }
    return favourite;
  } catch (error) {
    console.log('Favourite Log', error);
    return [];
  }
};

// check for rejection

export const checkForRejection = async bookingId => {
  try {
    const res = await axios.get(`/order/rejection/${bookingId}`);
    if (res.data.msg === 'rejected') {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Rejection Log', error);
    return false;
  }
};

// remove favourite

export const removeFavourite = async (userId, interpreterId) => {
  try {
    await axios.delete(`/favourites/${userId}/${interpreterId}`);
    return 'success';
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get Pending Bookings
export const getPedingCount = (myBookings, user) => {
  // console.log(myBookings);
  var pendingBooking = [];
  if (myBookings.length > 0) {
    // get Only pending for interpreter
    if (user.profile.interpreter || user.profile.interpreter === 1) {
      for (let booking of myBookings) {
        if (
          booking.StatusName === 3 ||
          ((booking.StatusName === 1 || booking.StatusName === 8) &&
            dateToMilliSeconds(booking.DateTimeEnd) >
              dateToMilliSeconds(getCurrentDate()))
          // ||booking.StatusName === 5
        ) {
          pendingBooking.push(booking);
        }
      }

      return pendingBooking;
    }
    //get both pending and rejected for customer
    else {
      let counter = 0;
      for (let booking of myBookings) {
        if (booking.BookingID === 5434) console.log(counter++);
        if (
          booking.StatusName === 3 ||
          ((booking.StatusName === 1 ||
            booking.StatusName === 6 ||
            booking.StatusName === 8 ||
            booking.StatusName === 5) &&
            dateToMilliSeconds(booking.DateTimeEnd) >
              dateToMilliSeconds(getCurrentDate()))
          // booking.InterpreterID !== 'Anonym' //user.profile.Id
        ) {
          pendingBooking.push(booking);
        }
      }
      return pendingBooking;
    }
  }
  return pendingBooking;
};
// get conformed booking
export const getConfirmedCount = myBookings => {
  // console.log(myBookings);
  let confirmed = [];
  if (myBookings.length > 0) {
    // get Only confirmed for interpreter

    for (let booking of myBookings) {
      if (
        booking.StatusName === 2 &&
        dateToMilliSeconds(booking.DateTimeEnd) >
          dateToMilliSeconds(getCurrentDate())
      ) {
        confirmed.push(booking);
      }
    }
    //get both confirmed and rejected for customer
  }
  return confirmed;
};

// get historic bookings
export const getHistoricBookings = (myBookings, isInterpreter) => {
  // console.log(myBookings);
  let historic = [];
  if (myBookings.length > 0) {
    // get Only historic for interpreter

    for (let booking of myBookings) {
      if (
        dateToMilliSeconds(getCurrentDate()) >
          dateToMilliSeconds(booking.DateTimeEnd) ||
        (dateToMilliSeconds(getCurrentDate()) <
          dateToMilliSeconds(booking.DateTimeEnd) &&
          booking.StatusName === 4)

        // &&
        // booking.StatusName === 2 ||
        // booking.StatusName === 3 ||
        // booking.StatusName === 7
      ) {
        // console.log('found match at', j);
        historic.push(booking);
      }
    }
    //get both historic and rejected for customer
  }
  return historic;
};
// get request count

export const getMyRequests = async (myBookings, userId) => {
  var pending = [];

  try {
    const res = await axios.get(`/myrequest/${userId}`);

    const requests = res.data.result;

    for (let request of requests) {
      // console.log(request.info.users.length);
      for (let booking of myBookings) {
        // if (request.info.request.BookingID === 5434) console.log('Matched');
        if (request.info.request.BookingID === booking.BookingID) {
          pending.push({
            booking,
            users: request.info.users,
            request: request.info.request,
          });
          // console.log('match found');
          break;
        }
      }
    }
    // console.log(pending.length);
    return pending;
  } catch (error) {
    console.log('Booking Request Log', error);
    return [];
  }
};

// get available request for translators

export const getBookingRequests = async (userId, country) => {
  try {
    const res = await axios.get(`/request/${userId}/${country}`);
    const requests = res.data.result;
    // console.log(requests);
    return requests;
  } catch (error) {
    console.log('Booking Request Log', error);
    return [];
  }
};

// update booking
export const updateBooking = async (status, bookingId) => {
  try {
    const res = await axios.put(`/orders/${status}/${bookingId}`);

    return res;
    // if (res.data.msg === 'success')
  } catch (error) {
    console.log(error);
    return null;
  }
};

// changeInterPreter; to anonymous

export const changeInterPreterToAnonymous = async (
  InterpreterID,
  BookingID,
) => {
  try {
    const body = {
      InterpreterID,
      BookingID,
    };
    const res = await axios.put(`/orders/anonymous`, body);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const storeUserName = async value => {
  try {
    await AsyncStorage.setItem('userName', value);
  } catch (e) {
    console.log(e);
  }
};

export const getUserName = async () => {
  try {
    const value = await AsyncStorage.getItem('userName');
    if (value !== null) {
      return value;
    }
    return null;
  } catch (e) {
    // error reading value
    console.log(e);
    return null;
  }
};

// get Inbox
export const getInbox = async userId => {
  try {
    const res = await axios.get(`/messages/${userId}`);

    // console.log(res.data);

    if (res.data.msg === 'success') {
      // console.log(res.data.result);

      var list = res.data.result;
      if (list.length > 0) {
        list.sort(function (x, y) {
          return (
            new Date(y?.lastMsg?.createdAt).getTime() -
            new Date(x?.lastMsg?.createdAt).getTime()
          );
        });
      }
      return list;
    } else {
      // console.log(res.data);
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

// get all languages

// get all language
export const getLanguages = async () => {
  try {
    // console.log('languages');
    let res = await axios.get(`/languages`);

    if (res.data.msg === 'success') {
      // quick sort language
      var languages = res.data.result;

      // console.log(languages);

      if (languages.length > 0) {
        languages.sort(function (x, y) {
          let a = x.label,
            b = y.label;
          return a == b ? 0 : a > b ? 1 : -1;
        });
      }

      //
      return languages;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

//get language for an interpreter
export const getInterpreterLanguage = async (userId, email) => {
  var languages = [];
  try {
    // console.log('languages');
    let res = await axios.get(`/languages/${userId}/${email}`);

    if (res.data.msg === 'success') {
      // quick sort language
      var languages = res.data.result;
    }
    return languages;
  } catch (err) {
    console.log(err);
    return [];
  }
};
// get skill for an interpreter
export const getInterpreterSkill = async (userId, email) => {
  var languages = [];
  try {
    // console.log('languages');
    let res = await axios.get(`/skills/${userId}/${email}`);

    if (res.data.msg === 'success') {
      // quick sort language
      var languages = res.data.result;
    }
    return languages;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getServerToken = async (email, secret) => {
  try {
    const data = {
      id: '12345',
      email: email,
    };

    const options = {
      method: 'POST',
      headers: {
        secret,
      },
      data,
      // liver server urls
      url: `${baseURL}/auth/login`,
      // testing server url
      // url: 'https://aatsapi.herokuapp.com/auth/login',
    };

    const response = await axios(options); // wrap in async function

    //  save the tokens
    const authTokens = {
      secret,
      token: response.data.token,
    };

    await storeAuthToken(authTokens);

    return authTokens;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const storeAuthToken = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('authTokens', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getAuthToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('authTokens');
    if (jsonValue !== null) {
      let authTokens = JSON.parse(jsonValue);
      // console.log(authTokens);
      return authTokens;
    } else {
      console.log('booking token is empty');
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

// get single booking record

export const getBooking = async id => {
  try {
    let res = await axios.get(`/order/${id}`);
    console.log(res.data);

    if (res.data.msg === 'success') {
      // quick sort language
      var booking = res.data.result;
      return booking;
    } else return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteBooking = async id => {
  console.log(id);
  try {
    let res = await axios.delete(`/orders/${id}`);
    return res.data.msg;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (err) {
    console.log(err);
  }
};

export const getChats = async id => {
  try {
    let res = await axios.get(`/chats/${id}`);

    if (res.data.msg === 'success') {
      // quick sort language
      var chats = res.data.chats;
      return chats;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};
// add a new chat to db
export const addChat = async chat => {
  try {
    let res = await axios.post(`/chats`, chat);
    // console.log(res.data.msg);
  } catch (err) {
    console.log(err);
  }
};

export const getRegisterDevice = async userId => {
  try {
    const chk = await firestore()
      .collection('tokens')
      .doc(userId)
      .collection('devices')
      // .where('deviceId', '==', body.token)
      .get();

    var tokens = [];
    chk.forEach(doc => {
      tokens.push(doc.data().token);
    });

    return tokens;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const registerDevice = async body => {
  try {
    const res = await axios.post(`/tokens`, body);
    console.log(res.data);
  } catch (error) {
    console.log(error);
    return 'something went wrong';
  }
};

// send notifcation to devices
export const sendNotificaion = async body => {
  console.log(body);
  try {
    const res = await axios.post(`${baseURL}/mails/notification`, body);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const checkFirstLaunch = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('firstLaunch');

    if (jsonValue === null) return true;
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const storeFirstLaunch = async () => {
  try {
    await AsyncStorage.setItem('firstLaunch', 'Yes');
    console.log('language set');
  } catch (e) {
    console.log(e);
  }
};

export const changeNewTimeStatus = async body => {
  try {
    const res = await axios.put(`/orders/newtime`, body);
    // console.log(res.data);
    return res.data.msg;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// save gig

export const addGiG = async body => {
  var id = null;
  try {
    let res = await axios.post(`/gig`, body);
    console.log('response ', res.data);
    if (res.data.msg === 'success') {
      id = res.data.data[0].ID;
    }
    return id;
  } catch (err) {
    console.log('gig error', err);
    return id;
  }
};

//edit gig
export const editGiG = async body => {
  var id = null;
  try {
    let res = await axios.put(`/gig`, body);
    if (res.data.msg === 'success') {
      id = res.data.msg;
    }
    return id;
  } catch (err) {
    console.log('gig error', err);
    return id;
  }
};
// get gigs
export const getGiGs = async userId => {
  let gigs = [];
  try {
    let res = await axios.get(`/gig/${userId}`);
    if (res.data.msg === 'success') {
      gigs = res.data.data;
    }
    // console.log(res.data);
    return gigs;
  } catch (err) {
    console.log(err);
    return gigs;
  }
};

// perform search on gig
export const searchGiGs = async filter => {
  let gigs = [];
  try {
    let res = await axios.get(`/gig/search/${filter}`);
    if (res.data.msg === 'success') {
      gigs = res.data.data;
    }
    // console.log(res.data);
    return gigs;
  } catch (err) {
    console.log(err);
    return gigs;
  }
};
// save packages
export const addPackage = async body => {
  try {
    let res = await axios.post(`/package`, body);
    return res.data.msg;
  } catch (err) {
    console.log(err);
    return null;
  }
};
// EDIT PACKAGE
export const editPackage = async body => {
  try {
    let res = await axios.put(`/package`, body);
    return res.data.msg;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// check if translator is availble for booking
export const checkAvailability = async (st, et, id) => {
  try {
    let res = await axios.get(`/order/available/${st}/${et}/${id}`);
    return res.data.isFree;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// save user location to data base
export const saveLocation = async body => {
  try {
    const res = await axios.post(`/location`, body);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

// send feedback mail
export const sendFeedBackMail = async body => {
  try {
    const res = await axios.post(`${baseURL}/mails/feedback`, body);
    console.log(res.data);
  } catch (error) {
    console.log(`${baseURL}/mails/notification`);
  }
};

// add new document for verification
export const addDocToDb = async body => {
  try {
    const res = await axios.post(`/document`, body);
    console.log(res.data.msg);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get all docs for a user
export const getDocs = async userId => {
  let docs = [];
  try {
    let res = await axios.get(`/document/${userId}`);
    if (res.data.msg === 'success') {
      docs = res.data.data;
    }
    // console.log(res.data);
    return docs;
  } catch (err) {
    console.log(err);
    return docs;
  }
};

// record any columen on use table
export const anyRecordUpdate = async (email, value, column) => {
  try {
    const data = {
      Email: email,
      value: value,
      column: column,
    };

    const res = await axios.put(`/users`, data);

    if (res.data.msg === 'success') {
      console.log('data updated ');
    } else {
      console.log('something went wrong ', res.data);
    }
  } catch (error) {
    console.log(error);
  }
};

// get user availabilty
export const getAvailability = async userId => {
  let docs = [];
  try {
    let res = await axios.get(`/availability/${userId}`);
    if (res.data.msg === 'success') {
      docs = res.data.result;
    }

    return docs;
  } catch (err) {
    console.log(err);
    return docs;
  }
};
// add new day
export const addRemoveAvailability = async body => {
  try {
    const res = await axios.post(`/availability`, body);
    console.log(res.data.msg);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const removeGig = async (gigId, userId) => {
  try {
    const res = await axios.delete(`/gig/${gigId}/${userId}`);
    return res.data.msg;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// save feedback
export const saveFeedBack = async body => {
  try {
    const res = await axios.post(`/feedback`, body);
    console.log(res.data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// retireive feedback
export const getFeedBack = async Id => {
  let docs = [];
  try {
    let res = await axios.get(`/feedback/${Id}`);
    if (res.data.msg === 'success') {
      docs = res.data.result;
    }
    return docs;
  } catch (err) {
    console.log(err);
    return docs;
  }
};
