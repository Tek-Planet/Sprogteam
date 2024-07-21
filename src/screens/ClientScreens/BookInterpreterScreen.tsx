import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {
  CustomButton,
  CustomDropDown,
  CustomError,
  CustomInput,
  CustomLoader,
  CustomRadioButton,
  DatePicker,
  Header,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useAppSelector} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {SelectOptionType, TabItem} from '../../types';
import {RootStackParams} from '../../navigations/MainNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  BASE_URL,
  calculatePrices,
  createMeetingLink,
  defaultPrices,
  errorText,
  getBookingToken,
  getMSTeamsToken,
  getTaskName,
  isTranslatorFree,
  mergeDateTime,
  msToTime,
  testModeMeetingUrl,
  timeDifferenceInMilliseconds,
  timeToString,
  toast,
  width,
} from '../../utils';
import moment from 'moment';
import {useCreateBookingMutation} from '../../rtk/services/bookings';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {APIENV} from '../../environment';
import {useGetTranlatorLanguagesQuery} from '../../rtk/services';

type Props = NativeStackScreenProps<RootStackParams, 'BookInterpreter'>;

const BookInterpreterScreen = ({navigation, route}: Props) => {
  const {interpreter, selectedLanguage} = route.params;
  const {user, currency} = useAppSelector(state => state.user);
  const [createBooking, {error: bookingError, isLoading}] =
    useCreateBookingMutation();
  const userId: string = interpreter.Id;
  const email: string = interpreter.Email;
  const [skip, setSkip] = useState<boolean>(true);

  const {data} = useGetTranlatorLanguagesQuery(
    {userId, email},
    {
      skip: skip,
    },
  );

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const radioOption: TabItem[] = [
    {title: t('common:telephone'), value: '3'},
    {
      title: t('common:video'),
      value: '2',
    },
    {
      title: t('common:attendance'),
      value: '1',
    },
  ];

  const singleRadioOption: TabItem = {
    value: 'Yes',
    title: t('common:booking_for_self'),
  };

  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<SelectOptionType>(selectedLanguage);
  const [languages, setLanguages] = useState<SelectOptionType[]>([
    selectedLanguage,
  ]);

  const [startTime, setStartTime] = useState<Date | undefined | 'error'>(
    undefined,
  );
  const [endTime, setEndTime] = useState<Date | undefined | 'error'>(undefined);

  const [date, setDate] = useState<Date | undefined | 'error'>(undefined);
  const [selected, setSelected] = useState<TabItem>(radioOption[0]);

  const [body, setBody] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [rekvirantID, setRekvirantID] = useState(user.Email);
  const [useMyAddress, setUseMyAddress] = useState<TabItem>(singleRadioOption);
  const [self, setSelf] = useState<TabItem>({
    value: '',
    title: '',
  });
  const [messageToCitizen, setMessageToCitizen] = useState(null);
  const [SSN, setSSN] = useState<string>('');
  const [partnerName, setPatnerName] = useState<string>('');
  const [duration, setDuration] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [priceCustomer, setPriceCustomer] = useState<string>();

  const [policeApproved, setPoliceApproved] = useState(false);
  const [citizenPhone, setCitizenPhone] = useState<any>(null);

  const [isFree, setIsFree] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {
    const calculateDuration = async () => {
      if (
        startTime &&
        endTime &&
        date &&
        startTime !== errorText &&
        endTime !== errorText &&
        date !== errorText
      ) {
        const mergedDate = await mergeDateTime(date, startTime, endTime);

        const timeDifInMillsec = timeDifferenceInMilliseconds(
          mergedDate.startTime,
          mergedDate.endTime,
        );

        var timeVariant: any = await msToTime(timeDifInMillsec);
        setDuration(timeVariant.duration);

        // calculate price

        let defaultPriceCustomer, defaultPriceTranslator;

        let taskTypeId = selected.value ? parseInt(selected.value) : 1;

        if (taskTypeId === 2 || taskTypeId === 3) {
          // get the set price for customer
          defaultPriceCustomer = user.VideoPhoneprice
            ? user.VideoPhoneprice
            : defaultPrices.customerPhonePrice;
          // ge

          // get the set price for translator
          defaultPriceTranslator = interpreter.Phonevideo
            ? interpreter.Phonevideo
            : 160;
        } else {
          defaultPriceCustomer = user.AttendancePrice
            ? user.AttendancePrice
            : defaultPrices.customerPhonePrice;
          // get the set price for translator
          defaultPriceTranslator = interpreter.Attendance
            ? interpreter.Attendance
            : 160;
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
          policeApproved,
          startTime,
        );
        console.log(defaultPriceCustomer);
        setPriceCustomer(prices.customerPrice);
        setPrice(prices.translatorPrice);
      }
    };
    if (startTime && endTime && date) {
      calculateDuration();
    }
  }, [startTime, endTime, date]);

  const saveBooking = async () => {
    // console.log(user.profile)

    if (date === undefined) {
      setDate(errorText);
      return;
    }
    if (startTime === undefined) {
      setStartTime(errorText);
      return;
    }
    if (endTime === undefined) {
      setEndTime(errorText);
      return;
    }
    if (!useMyAddress && address.length === 0) {
      setAddress(errorText);
      return;
    }
    if (!self && partnerName.trim().length < 1) {
      setPatnerName(errorText);
      return;
    }
    {
      //08171931956
      setError('');
      setLoading(true);
      let taskTypeId = selected.value ? parseInt(selected.value) : 1;

      // check the task type
      if (taskTypeId === 2 || taskTypeId === 3) {
        checkToken();
      } else {
        bookingObject(null);
      }
    }
  };

  const checkToken = async () => {
    var meeting = null;
    if (BASE_URL === APIENV.production) {
      let tokenLocal = await getBookingToken();
      if (tokenLocal === null) {
        // this will run for the first ime
        console.log('First time run');
        tokenLocal = await getMSTeamsToken();
      } else {
        const expire = moment(tokenLocal.expires_in).subtract(10, 'minutes');
        const now = moment();
        // if token has exoired
        if (now.isSameOrAfter(expire)) {
          console.log('we have token but has expired creating new one');
          tokenLocal = await getMSTeamsToken();
        }
      }
      if (tokenLocal === null) {
        setError('Unable to submit your booking please try again');
        setLoading(false);
        return;
      }

      meeting = await createMeetingLink(
        startTime,
        endTime,
        tokenLocal.token,
        'post',
      );
    } else {
      console.log('using test mode meeting url');
      meeting = testModeMeetingUrl;
    }

    if (meeting !== 'error' && meeting !== null) {
      bookingObject(meeting);
    } else {
      setError('Unable to submit your booking please try again');
      setLoading(false);
    }
  };

  const bookingObject = (meeting: any) => {
    const mergedDate = mergeDateTime(date, startTime, endTime);

    const startTimeLocal = timeToString(startTime || new Date());

    const endTimeLocal = timeToString(endTime || new Date());
    let taskTypeId = selected.value ? parseInt(selected.value) : 1;

    const newBooking = {
      OrderNumber: self ? null : SSN,
      CreateBy: user.Id,
      DateTimeStart: mergedDate.startTime,
      DateTimeEnd: mergedDate.endTime,
      TaskTypeId: taskTypeId,
      FromLanguageID: 75,
      ToLanguageID: parseInt(language.value),
      GenderID: null,
      ToLanguageString: language.label,
      InterpreterID: interpreter.Id,
      RekvirantID: rekvirantID.toLowerCase(),
      CitizenName: self ? user.FirstName + '  ' + user.LastName : partnerName,
      CitizenNumber: citizenPhone,
      Address:
        taskTypeId === 1
          ? useMyAddress
            ? user.Adresse + ' ' + user.City
            : address
          : null,
      OtherAdress:
        taskTypeId === 1
          ? useMyAddress
            ? user.Adresse + ' ' + user.City
            : address
          : null,
      Duration: duration,
      KmTilTask: null,
      Fee: price,
      FeeCustomer: priceCustomer,
      PricesCustomer: priceCustomer,
      Tfare: null,
      TfareCustomer: null,
      Remark: body,
      RemarkBell: null,
      RemarkAdmin: null,
      OnlineMeeting: taskTypeId === 1 ? null : meeting.joinUrl,
      BookingForSelf: self ? 1 : 0,
      RequirePolice: policeApproved ? 1 : 0,
      CompanyName:
        user.CompanyName && user.CompanyName !== null
          ? user.CompanyName
          : user.FirstName + '  ' + user.LastName,
      IsBookingCompleted: 0,
      Attachment: filePath,
      serviceId: null,
      OfferStage: null,
      MessageToCitizen: messageToCitizen,
      DepartmentID: user.DeparmentId ? user.DeparmentId : null,

      // email data
      isCustomer: 0,
      isApproved: 0,
      currentDate: moment().format('DD-MM-YYYY HH:mm'),
      translatorEmail: interpreter.Email,
      taskType: getTaskName(taskTypeId),
      startDate: startTimeLocal.date,
      startTime: startTimeLocal.time,
      endTime: endTimeLocal.time,
      interpreterName: interpreter.FirstName,
      interpreterTelephone: interpreter.PhoneNumber,
      recipient: [interpreter.Email],
      caseNumber: self ? null : SSN,
      toLanguage: selected.title,
      meetingPoint:
        taskTypeId === 1
          ? useMyAddress
            ? user.Adresse + ' ' + user.City
            : address
          : null,
      link: taskTypeId === 1 ? null : meeting.joinUrl,
    };

    setLoading(false);

    postToDB(newBooking);
  };

  const postToDB = async (newBooking: any) => {
    setLoading(true);
    try {
      let response: any = await createBooking(newBooking);

      console.log(response);

      if (response.data) {
        toast('Booking completed', 'success');
        navigation.replace('AwaitingApproval');
      } else {
        setError('Unable to complete booking');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError('Unable to complete booking');
      toast('unable to complete booking', 'error');
    }
  };

  useEffect(() => {
    if (date && endTime && startTime) {
      console.log('Doing this', date);
      isAvailable(date, startTime, endTime);
    }
  }, [endTime, startTime, date]);

  const isAvailable = async (date: any, startTime: any, endTime: any) => {
    const isFree = await isTranslatorFree(
      date,
      startTime,
      endTime,
      interpreter.Id,
    );

    setIsFree(isFree);
  };

  useEffect(() => {
    if (selectedLanguage.value === 'Select') setSkip(false);
  }, [selectedLanguage]);

  useEffect(() => {
    if (data && data.length > 0) setLanguages(data);
  }, [data]);

  // console.log('isFree');
  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        headerTitle={t('common:order') + ' ' + t('interpreter')}
        showleftIcon
        showRightIcon
      />
      {(isLoading || loading) && <CustomLoader />}

      <ScrollView>
        <KeyboardAwareScrollView>
          <View style={{padding: spacing.ten}}>
            <CustomDropDown
              label={t('common:language')}
              value={language}
              options={languages}
              setValue={setLanguage}
              title={t('common:available') + ' ' + t('common:language')}
            />

            <CustomRadioButton
              label={t('common:booking') + ' ' + t('common:type')}
              selected={selected}
              setSelected={setSelected}
              options={radioOption}
            />

            <DatePicker
              label={t('common:date')}
              date={date}
              setDate={setDate}
              title={t('common:date')}
              validate={true}
            />
            <DatePicker
              title={t('common:select') + ' ' + t('common:time')}
              date={startTime}
              setDate={setStartTime}
              label={t('common:start') + ' ' + t('common:time')}
              mode="time"
              validate={true}
              bookingDate={date}
              timeType="start"
            />

            <DatePicker
              title={t('common:select') + ' ' + t('common:time')}
              date={endTime}
              setDate={setEndTime}
              label={t('common:end') + ' ' + t('common:time')}
              mode="time"
              validate={true}
              bookingDate={startTime}
              timeType="end"
            />

            {isFree !== null && (
              <View style={{...styles.row, alignItems: 'center'}}>
                <Text style={[styles.text, {width: 100}]}>
                  {t('common:available')}:{' '}
                </Text>

                <Ionicons
                  style={{marginEnd: 20}}
                  name={isFree ? 'checkmark-done' : 'close'}
                  size={20}
                  color={isFree ? 'green' : 'red'}
                />

                <Text style={[styles.text, {width: width * 0.5}]}>
                  {isFree
                    ? t('common:translator_is_free')
                    : t('common:translator_is_not_free')}
                </Text>
              </View>
            )}

            <View style={styles.rowApart}>
              <Text style={[styles.text, {width: 90}]}>
                {t('common:duration')}:
              </Text>
              <Text style={[styles.text]}>{duration && duration}</Text>
            </View>

            {/* <View style={[styles.rowApart]}>
              <Text style={styles.text}>{t('common:fee')}</Text>
              {selected.value && (
                <Text style={styles.text}>
                  {parseInt(selected.value) === 1
                    ? user.AttendancePrice
                      ? user.AttendancePrice
                      : defaultPrices.customerPhonePrice
                    : user.VideoPhoneprice
                    ? user.VideoPhoneprice
                    : defaultPrices.customerPhonePrice}{' '}
                  / {t('common:hour')}
                </Text>
              )}
            </View> */}

            {/* <View style={[styles.rowApart]}>
              <Text style={styles.text}>
                {t('common:booking') + ' ' + t('common:fee')}:
              </Text>
              <Text style={styles.text}>
                {priceCustomer && priceCustomer + ' ' + currency.dkk}
              </Text>
            </View> */}

            {/* show this if the type is tendency */}
            {selected.value === '1' && (
              <View style={{marginTop: spacing.ten}}>
                <Text style={{...styles.text, textAlign: 'center'}}>
                  {t('common:meeting_point')}
                </Text>

                {/* this has to be changed to one option */}
                <CustomRadioButton
                  label={t('common:use_my_address')}
                  selected={useMyAddress}
                  setSelected={setUseMyAddress}
                  options={[singleRadioOption]}
                />

                {useMyAddress?.value !== 'Yes' && (
                  <CustomInput
                    placeholder={t('common:meeting_point')}
                    onTextChange={setAddress}
                    value={address}
                  />
                )}
              </View>
            )}

            {/* booking for yourself or not */}
            <Text style={[styles.text]}>{t('common:citizen_details')}</Text>

            <CustomInput
              value={partnerName}
              onTextChange={setPatnerName}
              placeholder={t('common:name')}
            />

            {/* booking for yourself or not */}
            <View style={{}}>
              {/* <View>
                <CustomRadioButton
                  selected={self}
                  setSelected={setSelf}
                  options={[singleRadioOption]}
                />
              </View>

              {self.value === 'Yes' && (
                <View>
                  <CustomInput
                    value={citizenPhone}
                    onTextChange={setCitizenPhone}
                    placeholder={t('common:citizen_phone')}
                    label={t('common:citizen_phone')}
                  />

                  <View>
                    <CustomInput
                      onTextChange={setMessageToCitizen}
                      height={80}
                      placeholder={t('common:message_to_citizen')}
                      label={t('common:message_to_citizen')}
                    />
                  </View>
                </View>
              )} */}

              <CustomInput
                value={SSN}
                onTextChange={setSSN}
                placeholder={t('common:case_number')}
                label={t('common:case_number')}
              />

              {/* <CustomInput
              value={rekvirantID}
              onTextChange={setRekvirantID}
              placeholder={t('common:rekvirantID')}
            /> */}
            </View>

            {/* <CustomInput
            label={t('common:the') + ' ' + t('common:citizen')}
            placeholder={t('common:the') + ' ' + t('common:citizen')}
            onTextChange={setZipCode}
            value={zipCode}
          /> */}

            {/* <CustomInput
            label={t('common:case_number')}
            placeholder={t('common:the') + ' ' + t('common:citizen')}
            onTextChange={setZipCode}
            value={zipCode}
          /> */}

            <Text style={[styles.text]}>
              {t('common:task') + ' ' + t('common:information')}
            </Text>
            <CustomInput
              height={100}
              value={body}
              onTextChange={setBody}
              placeholder={t('common:comment')}
            />

            {error.length > 0 && <CustomError message={error} />}

            {isFree && (
              <CustomButton
                buttonTitle={t('common:Order')}
                onTap={() => {
                  saveBooking();
                }}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

export default BookInterpreterScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      paddingBottom: spacing.twenty * 2,
    },
    buttonText: {
      color: '#1f619f',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
    row: {
      flexDirection: 'row',
    },
    text: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      paddingHorizontal: spacing.five,
      marginTop: spacing.ten,
    },

    rowApart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.five,
    },
  });
