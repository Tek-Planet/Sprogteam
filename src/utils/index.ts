import {
  Alert,
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {APIENV, AUTHAPIENV, suffix} from '../environment';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {t} from 'i18next';
import {AccountType, LanguageType, SelectOptionType, UserModel} from '../types';
import {useTranslation} from 'react-i18next';
import {
  about_us,
  author,
  authorised,
  check,
  generaltranslation,
  homebg,
  interpreter,
  placeholder,
  proofread,
  seo,
  translator,
} from '../assets/images';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {Keyboard} from 'react-native';
import {checkAvailability} from '../rtk/features/user/userSlice';

export const BASE_URL = APIENV.productionv2;
export const AUTH_BASE_URL = AUTHAPIENV.production;

export const {height, width} = Dimensions.get('screen');

export const toast = (msg: string, type: string) => {
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

export const timeToString = (time: any) => {
  const date = new Date(time);
  // console.log(date.toISOString().split('T')[0]);
  var dateToString = date.toISOString().split('T');

  const onlyDate = dateToString[0];
  var splitDate = onlyDate.split('-');
  var onlyTime: any = dateToString[1];

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

// get current date in denmark time
export const getCurrentDate = () => {
  let offset = offsetCalculator();

  if (offset > -1) return moment(new Date()).add(offset, 'h');
  else {
    return moment(new Date()).subtract(-1 * offset, 'h');
  }
};

export const offsetCalculator = () => {
  var offset = moment().utcOffset() / 60;
  return offset;
};

export const convertToDanishLocalTime = (dateTimeString: any) => {
  const date = new Date(dateTimeString);
  const januaryDate = new Date(date.getFullYear(), 0, 1);
  const julyDate = new Date(date.getFullYear(), 6, 1);
  const isDaylightSavingTime =
    date.getTimezoneOffset() <
    Math.max(januaryDate.getTimezoneOffset(), julyDate.getTimezoneOffset());

  const danishTimeOffset = isDaylightSavingTime ? 2 : 1; // Denmark is usually UTC+2 in daylight saving time, otherwise UTC+1

  // Adjust the date to Danish local time
  date.setHours(date.getHours() + danishTimeOffset);

  // Format the date in ISO 8601 format
  const isoString = date.toISOString();

  return isoString;
};

// validate selected date

export const validateDate = (date: Date) => {
  const today = timeToString(getCurrentDate());
  const bookingTime = timeToString(date);
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

  return date;
};

export const abosoluteTime = (date: any) => {
  let offset = offsetCalculator();

  return (date =
    offset > 0
      ? moment(date).add(offset, 'h')
      : moment(date).subtract(-1 * offset, 'h'));
};

export const validateDateTime = (
  bookingDate: Date,
  date: any,
  timeType: string,
) => {
  // first change tolocal date

  let offset = offsetCalculator();

  date =
    offset > 0
      ? moment(date).add(offset, 'h')
      : moment(date).subtract(-1 * offset, 'h');

  const today = timeToString(getCurrentDate());
  const bookingDay = timeToString(bookingDate);

  const bookingTime = timeToString(date);
  if (timeType === 'start') {
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

    return date;
  } else {
    if (bookingDate && date > bookingDate) {
      return date;
    }
    console.log(date, 'vs', bookingDate);
    toast('Endtime cannot be less than start time', 'error');
    return;
  }
};

export const timeDifferenceInMilliseconds = (start: string, end: string) => {
  var d = dateToMilliSeconds(end) - dateToMilliSeconds(start);
  return d;
};

export const msToTime = async (duration: any) => {
  duration = new Date(duration).toISOString().replace(/\.\d+Z$/, '.000Z');
  duration = new Date(duration);
  var minutes: number | string = Math.floor((duration / (1000 * 60)) % 60),
    hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);
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

export const dateToMilliSeconds = (someDate: string) => {
  var date = new Date(someDate);
  return date.getTime();
};

export const mergeDateTime = (time: any, start: any, end: any) => {
  const date = new Date(time);
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Set seconds to 00
  date.setSeconds(0);
  startDate.setSeconds(0);
  endDate.setSeconds(0);

  const rSTime = startDate
    .toISOString()
    .replace(
      startDate.toISOString().split('T')[0],
      date.toISOString().split('T')[0],
    );
  const rETime = endDate
    .toISOString()
    .replace(
      endDate.toISOString().split('T')[0],
      date.toISOString().split('T')[0],
    );

  return {startTime: rSTime, endTime: rETime};
};

export const calculatePrices = async (
  min: number,
  taskTypeId: number,
  defaultPriceCustomer: any,
  defaultPriceTranslator: any,
  policeApproved: boolean,
  startDate: any,
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
        console.log(translatorPrice, 'boeifre');
        translatorPrice = (translatorPrice + translatorPrice * 0.3).toFixed(2);
        console.log(translatorPrice, 'after ');
      } else {
        console.log('Non police approved price', min, defaultPriceCustomer);
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

export const getMSTeamsToken = async () => {
  const params: any = {
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
      expires_in: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Adding 2 hours in milliseconds
      token: response.data.access_token,
    };

    saveMSTeamsToken(token);

    return token;
  } catch (error) {
    console.log('token creation error', error);
    return null;
  }
};

const saveMSTeamsToken = async (token: any) => {
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

export const createMeetingLink = async (
  startDate: any,
  endDate: any,
  token: string,
  method: string,
) => {
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

    return response;
  } catch (error) {
    console.log('meeting creation error', error);
    return 'error';
  }
};

// get the task type
export const getTaskName = (status: number) => {
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
export const getStatusName = (status: number, customer: boolean) => {
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

export const getWrittenStatusName = (status: number, customer: boolean) => {
  let statusName;
  switch (status) {
    case 3:
      // waiting
      statusName = t('common:awaiting_approval_interpretor');
      break;

    default:
      statusName = 'unknown status';
  }
  return statusName;
};

export const priceCalculator = (price: number) => {
  return price - price * 0.2;
};

export const callNumber = (phone: string) => {
  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
};
export const aalborgMail =
  BASE_URL === APIENV.production || BASE_URL == APIENV.productionv2
    ? 'tolkningsupport@aalborg.dk'
    : 'hsn@sprogteam.dk';

export function isDateGreaterThanCurrentBy24Hours(targetDate: string) {
  const currentMillis = dateToMilliSeconds(getCurrentDate().toISOString()); // Get current date in milliseconds
  const targetMillis = dateToMilliSeconds(targetDate); // Convert target date to milliseconds
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

  return targetMillis > currentMillis + twentyFourHoursInMilliseconds;
}

export const isCustomer = (user: UserModel) => {
  return !user.interpreter ? true : false;
};

export const defaultPrices = {
  customerPhonePrice: 320,
  translatorVideoPrice: 160,
  translatorAttendancePrice: 170,
};

export const sendNotificaion = async (body: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/mails/notification`, body);
    console.log(res.data);
  } catch (error) {
    console.log(error, 'notification error');
  }
};

export const deleteBooking = async (id: number) => {
  console.log(id);
  try {
    let res = await axios.delete(`/orders/${id}`);
    return res.data.msg;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// export const changeNewTimeStatus = async (body: any) => {
//   try {
//     const res = await axios.put(`/orders/newtime`, body);
//     // console.log(res.data);
//     return res.data;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

export const getServices: any = () => {
  const {t} = useTranslation();

  return [
    {
      label: t('common:authorized'),
      value: 1,
      image: authorised,
      backgroundColor: '#D4D4D4',
      textColor: '#000',
    },
    // {
    //   label: t('common:guider'),
    //   value: 2,
    //   image: guider,
    //   backgroundColor: '#4D4C4C',
    //   textColor: '#fff',
    // },
    {
      label: t('common:interpreter'),
      value: 3,
      image: interpreter,
      backgroundColor: '#000',
      textColor: '#fff',
    },
    {
      label: t('common:label4'),
      value: 9,
      image: generaltranslation,
      backgroundColor: '#d30dde',
      textColor: '#fff',
    },

    {
      label: t('common:translator'),
      value: 6,
      image: translator,
      backgroundColor: '#659ED6',
      textColor: '#fff',
    },

    {
      label: t('common:label8'),
      value: 10,
      image: proofread,
      backgroundColor: '#F3FF0F',
      textColor: '#000',
    },

    {
      label: t('common:author'),
      value: 11,
      image: author,
      backgroundColor: '#659ED6',
      textColor: '#fff',
    },
  ];
};

export const getAssignments: any = () => {
  const {t} = useTranslation();

  return [
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
    {
      label: t('common:language') + ' ' + t('common:support'),
      value: 5,
    },
    {
      label: t('common:mentor'),
      value: 6,
    },

    {
      label: t('common:substitute'),
      value: 7,
    },
  ];
};

export const getCurrencies: any = () => {
  return [
    {
      label: 'USD',
      value: 1,
    },
    {
      label: 'DKK',
      value: 2,
    },
    {
      label: 'EUR',
      value: 3,
    },
  ];
};

export const getUserType: any = () => {
  const {t} = useTranslation();
  return [
    {
      label: t('common:person'),
      value: 'Person',
    },
    {
      label: t('common:private') + ' ' + t('common:company'),
      value: 'Private',
    },
    {
      label: t('common:public') + ' ' + t('common:company'),
      value: 'Public',
    },
  ];
};

export const isIpad = width >= 768 ? true : false;
export const isIOS = Platform.OS === 'ios' ? true : false;

export const initialSelect = (): SelectOptionType => {
  return {
    label: t('common:select'),
    value: 'Select',
  };
};

export const errorValue = (): SelectOptionType => {
  return {label: t('common:select'), value: 'error'};
};
export const initialLanguage = (): SelectOptionType => {
  return {
    label: t('common:language'),
    value: 'Select',
  };
};

export const errorText = 'error';

export const initialSex = (): SelectOptionType => {
  return {label: t('common:select'), value: 'Select'};
};

export const sexOptions = (): SelectOptionType[] => {
  return [
    {
      label: t('common:female'),
      value: '1',
    },
    {
      label: t('common:male'),
      value: '2',
    },
  ];
};

export const testModeMeetingUrl = {
  joinUrl:
    'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NThhNGZiNjMtMGM3NC00NjkwLTk5MGQtMDM1N2I3ODk5NmY0%40thread.v2/0?context=%7b%22Tid%22%3a%22575fed12-7c21-4020-90d0-157f1060573a%22%2c%22Oid%22%3a%22838245b3-141d-4320-8fee-f3aad6d82589%22%7d',
};

export async function requestStoragePermission() {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ]);

      if (
        granted['android.permission.READ_MEDIA_IMAGES'] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can access storage');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Request',
          message: 'Sprogteam wants to access your storage',
          buttonNegative: 'Cancel',
          buttonPositive: 'Ok',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can access storage');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    }
  } catch (error) {
    console.warn(error);
    return false;
  }
}

// image picker from file

export const choosePhotoFromLibrary = async () => {
  if (Platform.OS === 'android') {
    console.log('Checking Perm');
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('You need to enable storage permission to continue');
      return null; // Return null to indicate that no image was selected.
    }
  }

  return new Promise(async (resolve, reject) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 500,
        height: 500,
        includeBase64: true,
        cropping: true,
      });

      resolve(image); // Resolve the promise with the selected image data.
    } catch (error) {
      console.log(error);
      reject(error); // Reject the promise if an error occurs.
    }
  });
};

export const choosePhotoFromCamera = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await ImagePicker.openCamera({
        width: 500,
        height: 500,
        cropping: true,
      });

      resolve(image);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const downloadFile = async (fileUrl: string) => {
  try {
    if (!fileUrl) {
      Alert.alert('Invalid URL', 'The file URL is empty or invalid.');
      return null;
    }

    let FILE_URL = fileUrl;

    if (!decodeURI(FILE_URL).includes(' ')) {
      FILE_URL = encodeURI(FILE_URL);
    }

    const {config, fs} = ReactNativeBlobUtil;

    const isIOS = Platform.OS == 'ios';

    const aPath = Platform.select({
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.DownloadDir,
    });

    const fPath = aPath + '/' + getFileName(fileUrl);

    const configOptions: any = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
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

    let completed = null;

    if (isIOS) {
      const res = await config(configOptions).fetch('GET', FILE_URL);

      if (res.respInfo.status !== 404) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        ReactNativeBlobUtil.ios.openDocument(res.data);
      } else {
        Alert.alert('File not found');
      }
    } else {
      const res = await config(configOptions).fetch('GET', FILE_URL);

      if (res.respInfo.status !== 404) {
        ReactNativeBlobUtil.android.actionViewIntent(res.path(), '');
        console.log('File download successfully');
      } else {
        Alert.alert('File not found');
      }
    }

    return completed;
  } catch (error: any) {
    Alert.alert('Error', 'An error occurred: ' + error.message);
    console.log(error);
    return null;
  }
};

const getFileExtention = (fileUrl: string) => {
  // Find the last segment of the URL (the filename) using a regex
  const filenameMatch = /\/([^/?.]+)(\?.*)?$/.exec(fileUrl);

  if (filenameMatch) {
    const filename = filenameMatch[1];
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex !== -1) {
      // Return the part of the filename after the last dot as the extension
      return filename.substring(dotIndex + 1);
    }
  }

  // If no valid extension is found, return undefined
  return '.PNG';
};

export const startFileDownload = async (url: string) => {
  try {
    if (Platform.OS === 'ios') {
      const res = await downloadFile(url);
      return res;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile(url);
        console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        Alert.alert('Error', 'Storage Permission Not Granted');
      }
    }
  } catch (err) {
    // To handle permission related exception
    console.log('++++' + err);
  }
};

export const chooseDocument = async () => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('You need to enable storage permission to continue');
        reject(new Error('Storage permission not granted'));
        return;
      }
    }

    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      let localfile;
      if (Array.isArray(file)) localfile = file[0];
      else localfile = file;

      resolve(localfile);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        reject(new Error('Document picker was canceled'));
      } else {
        reject(err);
      }
    }
  });
};

export const uploadFile = async (image: any) => {
  const path = await normalizePath(image.path);

  const pathToBase64 = await ReactNativeBlobUtil.fs.readFile(path, 'base64');
  var fileUrl = null;

  try {
    const imageData = {
      uri: pathToBase64,
      name: image?.filename,
      type: 'image/jpeg',
      originalname: image?.filename,
    };

    const res = await axios.post(`${BASE_URL}${suffix}chats/upload`, imageData);

    if (res.data.code === 200) {
      fileUrl = res.data.url;
    }
    return fileUrl;
  } catch (error) {
    console.log(error);
    return fileUrl;
  }
};

export const getFileName = (url: string) => {
  const startIndex = url.lastIndexOf('/');
  if (startIndex !== -1) {
    const documentName = url.substring(startIndex + 1);
    return documentName;
  } else {
    return undefined; // or any other value to indicate that "writtentask/" was not found
  }
};

export const normalizePath = async (path: string) => {
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

export const customerPercentage = 20;
export const translatorPercentage = 30;

export const percentageCalculator = (
  amount: number,
  percetage: number,
  increament: boolean,
) => {
  if (increament) {
    return amount + (amount * percetage) / 100;
  } else {
    return amount - (amount * percetage) / 100;
  }
};

export const dismissKeyboard = () => {
  Keyboard.dismiss();
};

export const getHandBook = (): SelectOptionType[] => {
  const {t} = useTranslation();
  return [
    {
      label: t('common:handbook_contact'),
      value: t('common:handbook_contact_details'),
    },

    {
      label: t('common:handbook_linguistic'),
      value: t('common:handbook_linguistic_details'),
    },

    {
      label: t('common:handbook_knowledge'),
      value: t('common:handbook_knowledge_details'),
    },

    {
      label: t('common:handbook_doubt'),
      value: t('common:handbook_doubt_details'),
    },

    {
      label: t('common:handbook_location'),
      value: t('common:handbook_location_details'),
    },

    {
      label: t('common:handbook_ability'),
      value: t('common:handbook_ability_details'),
    },
    // new addtitions
    {
      label: t('common:handbook_drugs_and_tobacco_products'),
      value: t('common:handbook_drugs_details'),
    },

    {
      label: t('common:handbook_dress_code'),
      value: t('common:handbook_dress_code_details'),
    },

    {
      label: t('common:handbook_confidentiality'),
      value: t('common:handbook_confidentiality_details'),
    },
    {
      label: t('common:handbook_neutrality'),
      value: t('common:handbook_neutrality_details'),
    },
    {
      label: t('common:handbook_your_right_as_translator'),
      value: t('common:handbook_your_right_as_translator_details'),
    },
    {
      label: t('common:handbook_right_perspective'),
      value: t('common:handbook_right_perspective_details'),
    },
    {
      label: t('common:handbook_emotional_scenarios'),
      value: t('common:andbook_emotional_scenarios_details'),
    },
    {
      label: t('common:handbook_relational_ethics_therapy_and_treatment'),
      value: t(
        'common:handbook_relational_ethics_therapy_and_treatment_details',
      ),
    },
    {
      label: t(
        'common:handbook_burndens_and_negative_consequences_of_interpretations',
      ),
      value: t(
        'common:handbook_burndens_and_negative_consequences_of_interpretations_details',
      ),
    },
    {
      label: t('common:handbook_password'),
      value: t('common:handbook_password_details'),
    },
  ];
};

export const faqs: SelectOptionType[] = [
  {
    label: t('common:faq_account'),
    value: t('common:faq_account_details'),
  },

  {
    label: t('common:faq_register'),
    value: t('common:faq_register_details'),
  },

  {
    label: t('common:faq_mainservice'),
    value: t('common:faq_mainservice_details'),
  },
];

export const getStoredLanguage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('selectedLanguage');

    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      return {code: 'en', label: 'English'};
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

// store selected language
export const storeLanguage = async (value: LanguageType) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('selectedLanguage', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const blogs = [
  {
    label: 'Our work brings language experts and expertise together',
    value:
      'Lorem ipsum dolor sit amet consectetur. Et a nisi venenatis elementum elementum faucibus at. Euismod cras vitae in enim aliquam condimentum imperdiet. Vitae ut vestibulum est justo id massa cursus nibh. Fermentum amet nunc integer ut suspendisse congue ac sed. Tincidunt eu congue tortor mauris orci. Vestibulum risus facilisis sit sed praesent urna. Imperdiet congue viverra odio malesuada.',
    image: about_us,
  },

  {
    label: 'You stand on our Solid Platform',
    value:
      'Lorem ipsum dolor sit amet consectetur. Et a nisi venenatis elementum elementum faucibus at. Euismod cras vitae in enim aliquam condimentum imperdiet. Vitae ut vestibulum est justo id massa cursus nibh. Fermentum amet nunc integer ut suspendisse congue ac sed. Tincidunt eu congue tortor mauris orci. Vestibulum risus facilisis sit sed praesent urna. Imperdiet congue viverra odio malesuada.',
    image: homebg,
  },

  {
    label: 'Professional solutions',
    value:
      'Lorem ipsum dolor sit amet consectetur. Et a nisi venenatis elementum elementum faucibus at. Euismod cras vitae in enim aliquam condimentum imperdiet. Vitae ut vestibulum est justo id massa cursus nibh. Fermentum amet nunc integer ut suspendisse congue ac sed. Tincidunt eu congue tortor mauris orci. Vestibulum risus facilisis sit sed praesent urna. Imperdiet congue viverra odio malesuada.',
    image: check,
  },
  {
    label: 'Find the best translators',
    value:
      'Lorem ipsum dolor sit amet consectetur. Et a nisi venenatis elementum elementum faucibus at. Euismod cras vitae in enim aliquam condimentum imperdiet. Vitae ut vestibulum est justo id massa cursus nibh. Fermentum amet nunc integer ut suspendisse congue ac sed. Tincidunt eu congue tortor mauris orci. Vestibulum risus facilisis sit sed praesent urna. Imperdiet congue viverra odio malesuada.',
    image: placeholder,
  },

  {
    label: 'Orders and appointments',
    value:
      'Lorem ipsum dolor sit amet consectetur. Et a nisi venenatis elementum elementum faucibus at. Euismod cras vitae in enim aliquam condimentum imperdiet. Vitae ut vestibulum est justo id massa cursus nibh. Fermentum amet nunc integer ut suspendisse congue ac sed. Tincidunt eu congue tortor mauris orci. Vestibulum risus facilisis sit sed praesent urna. Imperdiet congue viverra odio malesuada.',
    image: seo,
  },
];

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const accountOptions = (): AccountType[] => {
  return [
    {
      id: '1',
      title: t('common:interpreter'),
      body: t('common:new_translator_brief'),
      image: translator,
      role: 'interpreter',
    },
    {
      id: '2',
      title: t('common:user'),
      body: t('common:new_user_brief'),
      image: interpreter,
      role: 'user',
    },
  ];
};

export const supportId =
  BASE_URL === APIENV.local || BASE_URL === APIENV.development
    ? 'e94fba7d-f669-49a7-a521-35e0ac3d2db2'
    : 'ff3ead7d-d613-4a60-861c-8d78fceaa8f2';

export const getExtraRatingData = (): any[] => {
  const {t} = useTranslation();

  return [
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
};

export const isTranslatorFree = async (
  date: any,
  startTime: any,
  endTime: any,
  Id: string,
) => {
  var dt: any = new Date(date).toISOString().split('T');
  var st: any = new Date(startTime).toISOString().split('T');
  var et: any = new Date(endTime).toISOString().split('T');

  st = dt[0] + 'T' + st[1];
  et = dt[0] + 'T' + et[1];

  const isFree: boolean = await checkAvailability(st, et, Id);
  return isFree;
};
