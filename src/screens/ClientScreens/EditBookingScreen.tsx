import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {fontSize, fonts} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  CustomLoader,
  CustomLanguageDropDown,
  CustomRadioButton,
  DatePicker,
  CustomInput,
  CustomError,
  CustomButton,
  Header,
  CustomDropDown,
} from '../../components';
import {
  BASE_URL,
  calculatePrices,
  createMeetingLink,
  defaultPrices,
  getBookingToken,
  getMSTeamsToken,
  getTaskName,
  initialSex,
  mergeDateTime,
  msToTime,
  sexOptions,
  testModeMeetingUrl,
  timeDifferenceInMilliseconds,
  timeToString,
  toast,
} from '../../utils';
import moment from 'moment';
import {interpreter} from '../../assets/images';
import {
  useGetLanguagesQuery,
  useUpdateBookingMutation,
} from '../../rtk/services';
import {TabItem, SelectOptionType, BookingModel} from '../../types';
import {RootStackParams} from '../../navigations/MainNavigation';
import {APIENV} from '../../environment';

type Props = NativeStackScreenProps<RootStackParams, 'EditBooking'>;

const EditBookingScreen = ({navigation, route}: Props) => {
  const {data, isLoading: isLoadingLanguage} = useGetLanguagesQuery('');

  const {user} = useAppSelector(state => state.user);

  const [updateBooking, {isLoading}] = useUpdateBookingMutation();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [item, setItem] = useState<BookingModel>(route?.params?.item || null);

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
  const [language, setLanguage] = useState<SelectOptionType>({
    label: item?.ToLanguageName + '',
    value: item?.ToLanguageID + '',
  });
  const [sex, setSex] = useState<SelectOptionType>(
    item?.GenderID && parseInt(item.GenderID) === 1
      ? sexOptions()[0]
      : item?.GenderID && parseInt(item.GenderID) === 2
      ? sexOptions()[1]
      : initialSex,
  );
  const [startTime, setStartTime] = useState<Date | undefined>(
    new Date(item?.DateTimeStart),
  );
  const [endTime, setEndTime] = useState<Date | undefined>(
    new Date(item?.DateTimeEnd),
  );

  const [date, setDate] = useState<Date | undefined>(
    new Date(item?.DateTimeStart),
  );
  const [selected, setSelected] = useState<TabItem>(
    item?.TaskTypeId === 3
      ? radioOption[0]
      : item?.TaskTypeId === 2
      ? radioOption[1]
      : radioOption[2],
  );
  const [body, setBody] = useState<string>(item?.Remark ? item?.Remark : '');
  const [address, setAddress] = useState<string>('');
  const [rekvirantID, setRekvirantID] = useState(user.Email);
  const [useMyAddress, setUseMyAddress] = useState<TabItem>(singleRadioOption);

  const [messageToCitizen, setMessageToCitizen] = useState(null);
  const [SSN, setSSN] = useState<string>(
    item?.OrdreNumber ? item?.OrdreNumber : '',
  );
  const [partnerName, setPatnerName] = useState<string>(
    item?.CitizenName ? item?.CitizenName : '',
  );
  const [duration, setDuration] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [priceCustomer, setPriceCustomer] = useState<string>();
  const [possibleName, setPossibleName] = useState<string>(
    item?.RemarkAdmin ? item?.RemarkAdmin : '',
  );
  const [billNote, setBillNote] = useState<any>(
    item?.RemarkBell ? item?.RemarkBell : '',
  );
  const [citizenPhone, setCitizenPhone] = useState<any>(null);

  const [policeApproved, setPoliceApproved] = useState(false);

  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {
    const calculateDuration = async () => {
      if (startTime && endTime && date) {
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

        setPriceCustomer(prices.customerPrice);
        setPrice(prices.translatorPrice);
      }
    };
    if (startTime && endTime && date) {
      calculateDuration();
    }
  }, [startTime, endTime, date]);

  const saveBooking = async () => {
    if (date === undefined) setError('Provide start date');
    else if (startTime === undefined) setError('Provide start time');
    else if (endTime === undefined) setError('Provide end time');
    else if (!useMyAddress && address.length === 0)
      setError('Provide meeting venue');
    else {
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

    let taskTypeId = selected.value ? parseInt(selected.value) : 1;

    const newBooking: any = {
      recordId: item.BookingID,
      OrdreNumber: SSN,
      CreateBy: user.Id,
      DateTimeStart: mergedDate.startTime,
      DateTimeEnd: mergedDate.endTime,
      TaskTypeId: taskTypeId,
      ToLanguageID: parseInt(language.value),
      GenderID: sex.value === initialSex().value ? 0 : parseInt(sex.value),
      ToLanguageString: language.label,
      // InterpreterID: 'Anonym',
      RekvirantID: rekvirantID.toLowerCase(),
      CitizenName:
        partnerName.length === 0
          ? user.FirstName + '  ' + user.LastName
          : partnerName,
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
      // KmTilTask: null,
      Fee: price,
      FeeCustomer: priceCustomer,
      PricesCustomer: priceCustomer,
      // Tfare: null,
      // TfareCustomer: null,
      Remark: body,
      RemarkBell: billNote ? billNote : null,
      RemarkAdmin: possibleName ? possibleName : null,
      OnlineMeeting: taskTypeId === 1 ? null : meeting.joinUrl,
      BookingForSelf: 1,
      RequirePolice: policeApproved ? 1 : 0,
      CompanyName:
        user.CompanyName && user.CompanyName !== null
          ? user.CompanyName
          : user.FirstName + '  ' + user.LastName,
      // IsBookingCompleted: 0,
      Attachment: filePath,
      // serviceId: null,
      // OfferStage: null,
      MessageToCitizen: messageToCitizen,
      DepartmentID: user.DeparmentId ? user.DeparmentId : null,
    };

    setLoading(false);

    postToDB(newBooking);
  };

  const postToDB = async (newBooking: any) => {
    setLoading(true);
    try {
      let response: any = await updateBooking(newBooking);

      if (response.data) {
        toast('Booking updated', 'success');

        navigation.replace('AwaitingApproval');
      } else {
        setError('Uable to complete booking');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError('Uable to complete booking');
      toast('unable to complete booking', 'error');
    }
  };

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        headerTitle={t('common:edit') + ' ' + t('common:booking')}
        showleftIcon
        // showRightIcon
      />
      {(isLoading || loading || isLoadingLanguage) && <CustomLoader />}

      <ScrollView>
        <KeyboardAwareScrollView>
          <View style={{padding: spacing.ten}}>
            <CustomLanguageDropDown
              value={language}
              options={data ? data : []}
              setValue={setLanguage}
              title={t('common:available') + ' ' + t('common:language')}
              showSearch
            />

            <CustomDropDown
              label={t('common:prefered_sex')}
              value={sex}
              options={sexOptions()}
              setValue={setSex}
              title={t('common:sex')}
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

            <View style={styles.rowApart}>
              <Text style={[styles.text, {width: 90}]}>
                {t('common:duration')}:
              </Text>
              <Text style={[styles.text]}>{duration && duration}</Text>
            </View>

            {/* <View style={[styles.rowApart]}>
              <Text style={styles.text}>{t('common:price')}</Text>
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

            {/* <View style={[styles.rowApart, {marginBottom: spacing.five}]}>
              <Text style={styles.text}>
                {t('common:booking') + ' ' + t('common:price')}:
              </Text>
              <Text style={styles.text}>
                {priceCustomer && priceCustomer + ' ' + currency.dkk}
              </Text>
            </View> */}

            <CustomInput
              label={t('common:possible_name')}
              value={possibleName}
              onTextChange={setPossibleName}
              placeholder={'John Doe'}
            />

            <CustomInput
              label={t('common:note_on_bill')}
              value={billNote}
              onTextChange={setBillNote}
              placeholder={'John Doe'}
            />

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
              </View> */}

              {/* {self.value === 'Yes' && (
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

            <CustomInput
              height={80}
              label={t('common:task') + ' ' + t('common:information')}
              value={body}
              onTextChange={setBody}
              placeholder={t('common:comment')}
            />

            {error.length > 0 && <CustomError message={error} />}

            <CustomButton
              buttonTitle={t('common:submit')}
              onTap={() => {
                saveBooking();
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

export default EditBookingScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      paddingBottom: spacing.fiften * 2,
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
      marginTop: spacing.five,
      marginBottom: spacing.five,
    },
  });
