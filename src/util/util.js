import Geocoder from 'react-native-geocoder';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, PermissionsAndroid, Dimensions, Platform} from 'react-native';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {useTranslation} from 'react-i18next';
import {mode} from '../environment';

import Geolocation from 'react-native-geolocation-service';

export const decodeLocationByName = async address => {
  try {
    const res = await Geocoder.geocodeAddress(address);
    return res;
  } catch (error) {
    console.log('Decode error', error);
    return null;
  }
};

export const decodeLocationByCoordinates = async position => {
  try {
    const res = await Geocoder.geocodePosition(position);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const calculateDistance = async (pos, pos2) => {
  try {
    const res =
      await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pos}&destinations=${pos2}&key=AIzaSyBTcSF4Z7oDCCEP3_CHH5oNvpgJQAc-JV0
    `);

    return res.data;
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

export const createMeetingLink = async (startDate, endDate, token, method) => {
  var res, response;

  const meetingDetails = {
    startDateTime: startDate,
    endDateTime: endDate,
    subject: 'Sprogteam',
    isEntryExitAnnounced: true,
  };

  try {
    res = await axios.post(
      `https://graph.microsoft.com/v1.0/users/838245b3-141d-4320-8fee-f3aad6d82589/onlineMeetings`,
      meetingDetails,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );

    response = {
      id: res.data.id,
      joinUrl: res.data.joinUrl,
      joinWebUrl: res.data.joinWebUrl,
    };

    // else {
    //   res = await axios.patch(
    //     `https://graph.microsoft.com/v1.0/users/838245b3-141d-4320-8fee-f3aad6d82589/onlineMeetings/${meeting.id}`,
    //     meetingDetails,
    //   );

    //   response = meeting;
    // }

    return response;
  } catch (error) {
    console.log('meeting creation error', error);
    return 'error';
  }
};

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

// get new token form
export const getToken = async () => {
  const params = {
    grant_type: 'client_credentials',
    client_id: '231b0c60-882f-44f6-a9c3-b3e8dc57a2e4',
    scope: 'https://graph.microsoft.com/.default',
    client_secret: 'KrA7Q~RxmBMMURK~aQ9NBanRMmpb~LWKrezyp',
  };

  const data = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  try {
    const options = {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data,
      url: 'https://login.microsoftonline.com/575fed12-7c21-4020-90d0-157f1060573a/oauth2/v2.0/token',
    };

    const response = await axios(options); // wrap in async function

    const token = {
      expires_in: new Date().addHours(2).toISOString(),
      token: response.data.access_token,
    };

    await saveToken(token);

    return token;
  } catch (error) {
    console.log('token creation error', error);
    return null;
  }
};

const saveToken = async token => {
  try {
    const jsonToken = JSON.stringify(token);
    await AsyncStorage.setItem('bookingToken', jsonToken);
  } catch (e) {
    console.log(e);
  }
};

export const getBookingToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('bookingToken');
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      return null;
    }
  } catch (e) {
    // error reading value
    console.log(e);
    return null;
  }
};

export const toast = (msg, type, navigation, goback, nav, screen) => {
  Toast.show({
    type: type,
    position: 'top',
    text1: msg,
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
    onPress: () => {
      Toast.hide();
      console.log('Hiding ');
    },
    onHide: () => {
      if (type === 'success') {
        if (goback) navigation.goBack();
        else {
          navigation.navigate(nav, {
            screen: screen,
          });
        }
      }
    },
  });
};

export const toastNew = (msg, type) => {
  Toast.show({
    type: type,
    position: 'top',
    text1: msg,
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
};

export const setHeaders = (secret, token) => {
  // axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  // axios.defaults.headers.common['secret'] = secret;
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  axios.defaults.headers.common['secret'] = secret;
};

// function to get user data

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
        msg: 'Unable to load profile, please try again',
        profile: {},
      };
  } catch (err) {
    conssole.log(err);
    return {
      msg: err.message,
      profile: {},
    };
  }
};

// get status name from number

export const getStatusName = (status, customer) => {
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

// get the task type
export const getTaskName = status => {
  let statusName;
  switch (status) {
    case 1:
      statusName = 'Fremmøde';
      break;
    case 2:
      statusName = 'Video';
      break;
    case 3:
      statusName = 'Telephone';
      break;
    case 4:
      statusName = 'Skriftlige';
      break;
    default:
      statusName = 'unknown status';
  }
  return statusName;
};

// get skilss
export const getSkills = async () => {
  try {
    let res = await axios.get(`/skills`);

    if (res.data.msg === 'success') {
      return {
        msg: res.data.msg,
        skills: res.data.result,
      };
    } else
      return {
        msg: 'Unable to load profile, please try again',
        profile: {},
      };
  } catch (err) {
    console.log(err);
    return {
      msg: err.message,
      profile: {},
    };
  }
};

export const storeLanguage = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('selectedLanguage', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getStoredLanguage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('selectedLanguage');
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      console.log('empty');
      return {code: 'en', label: 'English'};
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

export const mailSender = async mailBody => {
  try {
    const mailResponse = await axios.post(
      // testing server
      // `https://aatsapi.herokuapp.com/mails/confirmbooking`,
      // live server
      `${baseURL}/mails/confirmbooking`,
      mailBody,
    );
    return mailResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const timeToString = time => {
  const date = new Date(time);
  // console.log(date.toISOString().split('T')[0]);
  var dateToString = date.toISOString().split('T');

  const onlyDate = dateToString[0];
  var splitDate = onlyDate.split('-');
  var onlyTime = dateToString[1];

  onlyTime = onlyTime.split(':');
  var hours = onlyTime[0];
  var minutes = onlyTime[1];

  return {
    date: onlyDate,
    time: hours + ':' + minutes,
    year: parseInt(splitDate[0]),
    month: parseInt(splitDate[1]),
    day: parseInt(splitDate[2]),
    hours: parseInt(hours),
    minutes: parseInt(minutes),
  };
};

// needed in the future
export function getTimeZone() {
  var offset = new Date().getTimezoneOffset(),
    o = Math.abs(offset);
  return (
    (offset < 0 ? '+' : '-') +
    ('00' + Math.floor(o / 60)).slice(-2) +
    ':' +
    ('00' + (o % 60)).slice(-2)
  );
}

export const mergeDateTime = (time, start, end) => {
  const date = new Date(time).toISOString().split('T')[0];
  const sTime = new Date(start).toISOString().split('T')[0];
  const eTime = new Date(end).toISOString().split('T')[0];
  const rSTime = new Date(start).toISOString().replace(sTime, date);
  const rETime = new Date(end).toISOString().replace(eTime, date);
  return {startTime: rSTime, endTime: rETime};
};

export const priceCalculator = price => {
  return price - price * 0.2;
};

export const gigPriceCalculator = (price, duration) => {
  return price * duration;
};

export const normalizePath = async path => {
  if (Platform.OS === 'ios') {
    const filePrefix = 'file://';
    if (path.startsWith(filePrefix)) {
      path = path.substring(filePrefix.length);
      try {
        path = decodeURI(path);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return path;
};

export const dateToMilliSeconds = someDate => {
  var date = new Date(someDate);
  return date.getTime();
};

export const offsetCalculator = () => {
  var offset = moment().utcOffset() / 60;
  return offset;
};

// get current date in denmark time
export const getCurrentDate = () => {
  let offset = offsetCalculator();
  if (offset > -1) return moment(new Date()).add(offset, 'h');
  else {
    return moment(new Date()).subtract(-1 * offset, 'h');
  }
};

export const baseCurrency = {usd: '$', dkk: 'DKK'};

// upload file to azure blobexport
export const uploadFIle = async image => {
  var fileUrl = null;
  try {
    const imageData = {
      uri: image.path,
      name: image?.filename,
      type: 'image/jpeg',
      originalname: image?.filename,
    };

    const res = await axios.post('/chats/upload', imageData);
    // console.log(res.data);

    if (res.data.code === 200) {
      fileUrl = res.data.url;
    }
    return fileUrl;
  } catch (error) {
    console.log(error);
    return fileUrl;
  }
};

// method to download file using RNfetchBlob
export const downloadFile = fileUrl => {
  // Get today's date to add the time suffix in filename
  // console.log(fileUrl);
  let date = new Date();
  // File URL which we want to download
  let FILE_URL = fileUrl;
  // Function to get extention of the file url
  let file_ext = getFileExtention(FILE_URL);

  file_ext = '.' + file_ext[0];

  // config: To get response by passing the downloading related options
  // fs: Root directory path to download
  const {config, fs} = RNFetchBlob;

  const isIOS = Platform.OS == 'ios';

  const aPath = Platform.select({
    ios: fs.dirs.DocumentDir,
    android: fs.dirs.DownloadDir,
  });

  const fPath =
    aPath + '/' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext;

  const configOptions = Platform.select({
    ios: {
      fileCache: true,
      path: fPath,
      // mime: 'application/xlsx',
      // appendExt: 'xlsx',
      //path: filePath,
      //appendExt: fileExt,
      notification: true,
    },

    android: {
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fPath,
        description: 'Downloading file...',
      },
    },
  });

  if (isIOS) {
    config(configOptions)
      .fetch('GET', FILE_URL)
      .then(res => {
        // this.setState({overLoader: false});
        // this.onResumeCall();
        console.log('File download successfully');
        setTimeout(() => {
          // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
          RNFetchBlob.ios.openDocument(res.data); //<---Property to display downloaded file on documaent viewer
          // Alert.alert(CONSTANTS.APP_NAME,'File download successfully');
        }, 300);
      })
      .catch(errorMessage => {
        Alert.alert(errorMessage);
        console.log(errorMessage);
        // this.setState({overLoader: false});
        // this.refs.toast.show(errorMessage, 2000);
      });
  } else {
    config(configOptions)
      .fetch('GET', FILE_URL)
      .then(res => {
        RNFetchBlob.android.actionViewIntent(res.path());
        // this.setState({overLoader: false});
        console.log('File download successfully', 2000);
      })
      .catch((errorMessage, statusCode) => {
        Alert.alert(errorMessage);
        // this.setState({overLoader: false});
        // this.refs.toast.show(errorMessage, 2000);
      });
  }
};

const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

export const checkStoragePermission = async url => {
  // Function to check the platform
  // If Platform is Android then check for permissions.

  if (Platform.OS === 'ios') {
    downloadFile(url);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile(url);
        console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        Alert.alert('Error', 'Storage Permission Not Granted');
      }
    } catch (err) {
      // To handle permission related exception
      console.log('++++' + err);
    }
  }
};

export const timeDifferenceInMilliseconds = (start, end) => {
  var d = dateToMilliSeconds(end) - dateToMilliSeconds(start);
  return d;
};

export const msToTime = async duration => {
  var minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  var min = hours * 60 + minutes;

  // calculate the actual hour attendance calculation
  var hrs;
  if (minutes <= 0) hrs = hours;
  else if (minutes >= 1 && minutes <= 30) hrs = hours + 1;
  else hrs = hours + 1;

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return {
    duration: hours + ':' + minutes,
    milliSecToMins: min,
    milliSecToHours: hrs,
  };
};

export const calculatePrices = async (
  min,
  taskTypeId,
  defaultPriceCustomer,
  defaultPriceTranslator,
  policeApproved,
  startDate,
) => {
  // decides if its morning or
  const hour = new Date(startDate).getHours();
  const day = new Date(startDate).getDay();

  let customerPrice, translatorPrice;

  // weekday and morning price
  if (hour >= 8 && hour <= 16 && day > 0 && day < 6) {
    // check task type if its either audio or telephone
    if (taskTypeId === 2 || taskTypeId === 3) {
      console.log('weekday morning price telephone / video');
      if (policeApproved) {
        console.log('police approved');

        // get 50% incremanet for police approved translators during the day
        // charge customer  50% incremanet for police approved translators during the day
        customerPrice = min * (defaultPriceCustomer / 60);
        customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
        translatorPrice = min * (defaultPriceTranslator / 60);
        translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(2);
      } else {
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
        translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(0);
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
        console.log('police approved');
        // get 50% incremanet for police approved translators during the day
        // charge customer  50% incremanet for police approved translators during the day
        customerPrice = min * (defaultPriceCustomer / 60);
        customerPrice = (customerPrice + customerPrice).toFixed(0);
        translatorPrice = min * (defaultPriceTranslator / 60);
        translatorPrice = (translatorPrice + translatorPrice).toFixed(0);
      } else {
        console.log('non  approved');
        // get 30% incremanet for police approved translators during the day
        // charge customer  30% incremanet for police approved translators during the day
        customerPrice = min * (defaultPriceCustomer / 60);
        customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
        translatorPrice = min * (defaultPriceTranslator / 60);
        translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(0);
      }
    } else {
      // calculate weekend price for attendace booking
      console.log('weekend night price attendance');
      if (policeApproved) {
        console.log('police approved');
        // get 50% incremanet for police approved translators during the day
        // charge customer  50% incremanet for police approved translators during the day
        customerPrice = min * defaultPriceCustomer;
        customerPrice = (customerPrice + customerPrice).toFixed(0);
        translatorPrice = min * defaultPriceTranslator;
        translatorPrice = (translatorPrice + translatorPrice).toFixed(0);
      } else {
        console.log('non approved');
        // get 30% incremanet for police approved translators during the day
        // charge customer  30% incremanet for police approved translators during the day
        customerPrice = min * defaultPriceCustomer;
        customerPrice = (customerPrice + customerPrice * 0.3).toFixed(0);
        translatorPrice = min * defaultPriceTranslator;
        translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(0);
      }
    }
  }

  const prices = {
    customerPrice,
    translatorPrice,
  };
  return prices;
};

export const defaultPrices = {
  customerPhonePrice: 320,
  translatorVideoPrice: 160,
  translatorAttendancePrice: 170,
};

export const aalborgMail =
  mode === 'testing' ? 'hsn@sprogteam.dk' : 'tolkningsupport@aalborg.dk';

const hasPermissionIOS = async () => {
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    console.log(
      `Permission Denied  go into Setting and enable location for Sprogteam`,
    );
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow Sprogteam to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: Linking.openSettings()},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  return false;
};

export const hasLocationPermission = async () => {
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
    Alert.alert(
      `Permission Denied  go into Setting and enable location for "${appConfig.displayName}"`,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert(
      `Permission revoked by user go into Setting and enable location for "${appConfig.displayName}"`,
    );
  }

  return false;
};

export const dimention = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
};

export const isIpad = dimention.width >= 768 ? true : false;

export const isCustomer = user => {
  return !user.profile.interpreter ? true : false;
};

export async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Reuest',
        message: 'SprogTeam want to access your storage',
        buttonNegative: 'Cancel',
        buttonPositive: 'Ok',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can access storage');
      return true;
    } else {
      console.log('storage permission denied');
      return false;
    }
  } catch (error) {
    console.warn(error);
  }
}

export const logoUrl =
  'https://sprogteamdev.blob.core.windows.net/writtentask/16682253220128196-IMG_0020.PNG';

// live
// export const baseURL = "https://mobileapi.sprogteam.dk"
// export const authBaseUrl = "https://mobile.sprogteam.dk/authenticate"

// local
// http://127.0.0.1:8000
// http://192.168.0.100:8000
// https://devmobile.sprogteam.dk
// now we proceed.33
// devapi.sprogteam.dk
// https://devapi.sprogteam.dk/authenticate/greet

// https://mobile.sweet-meitner.185-208-207-107.plesk.page

//https://srpogteam.onrender.com
// https://api.sweet-meitner.185-208-207-107.plesk.page/authenticate
export const baseURL =
  mode === 'testing'
    ? 'https://mobile.sweet-meitner.185-208-207-107.plesk.page'
    : 'https://mobileapi.sprogteam.dk';

export const authBaseUrl =
  mode === 'testing'
    ? 'https://api.sweet-meitner.185-208-207-107.plesk.page/authenticate'
    : 'https://mobile.sprogteam.dk/authenticate';
// {"info": {"class": 16, "event": "errorMessage", "lineNumber": 1, "message": "Cannot insert the value NULL into column 'BookingID', table 'devSprogteam.dbo.BookingModel'; column does not allow nulls. INSERT fails.", "name": "ERROR", "number": 515, "procName": "", "serverName": "VMI1060141\\MSSQLSERVER2019", "state": 2}}
// sb-xvsu26127952@personal.example.com
