import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Button, ActivityIndicator, ProfileHeader} from '../../components';

import axios from 'axios';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  getStatusName,
  toastNew as toast,
  getTaskName,
  timeToString,
  baseCurrency,
  priceCalculator,
  isCustomer,
} from '../../util/util';

import {useTranslation} from 'react-i18next';
import {ErrorMsg} from '../../components';
import {colors} from '../../assets/colors';

const BookingResponseScreen = ({navigation, route}) => {
  const {user, setReload, available_services} = useContext(AuthContext);
  const {t} = useTranslation();

  const {item, path} = route.params;
  const {
    StatusName,
    TaskTypeId,
    BookingID,
    PricesCustomer,
    TfareCustomer,
    Tfare,
    ServiceId,
    InterpreterSalary,
  } = item;

  // console.log(path);

  const [userDetails, setUserDetails] = useState(null);
  const [price, setPrice] = useState(PricesCustomer.toString());
  const [interpreterFee, setInterpreterFee] = useState(0);
  const [customerFee, setCustomerFee] = useState(0);
  const [total, setTotal] = useState(0);

  const [tfare, setTfare] = useState(
    TfareCustomer === null ? 0 : TfareCustomer,
  );
  const [requesterDetails, setRequesterDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [owner, setOwner] = useState(
    user?.profile?.Id === item.CreateBy ? true : false,
  );
  const [error, setError] = useState(null);

  // if (requesterDetails) console.log(requesterDetails?.Email, 'ello');

  const startTime = timeToString(item.DateTimeStart);

  const endTime = timeToString(item.DateTimeEnd);

  const address = item.Address !== null ? item.Address : item.OtherAdress;

  // update booking status
  const updateBooking = async (status, lastResponded) => {
    if (price <= 4) {
      setError('Minimum charge is 5 ' + baseCurrency.usd);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const bookingObject = {
        BookingID: BookingID,
        InterpreterID: user.profile.Id,
        Fee:
          status === 'negotiating'
            ? parseInt(priceCalculator(price))
            : InterpreterSalary,
        FeeCustomer:
          status === 'negotiating' ? parseInt(price) : PricesCustomer,
        Tfare:
          status === 'negotiating'
            ? tfare > 0
              ? parseInt(priceCalculator(tfare))
              : null
            : Tfare,
        TfareCustomer:
          status === 'negotiating'
            ? tfare > 0
              ? parseInt(tfare)
              : null
            : TfareCustomer,
        KmTilTask: null,
        OfferStage: status,
        IsBookingCompleted: lastResponded,
      };

      // console.log(bookingObject);

      const responseBooking = await axios.put(`/orders/apply`, bookingObject);
      if (responseBooking.data.msg === 'success') {
        setReload(true);
        toast('response sent', 'success');
        navigation.navigate({
          name: path,
          params: {
            reload: 'Yes',
            bookingId: item.BookingID,
          },
          merge: true,
        });
      } else {
        console.log(responseBooking.data);
        toast('unable to submit your response', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      console.log(address);
      toast('Unable to update status please try again ', 'error');
      setLoading(false);
    }
  };

  // calculate price

  const changeInPrice = () => {
    if (price <= 4) {
      setInterpreterFee(0);
      setError('Minimum charge is 5 ' + baseCurrency.usd);
      return;
    }
    setError(null);
    var total = parseInt(price) + parseInt(tfare);
    var translatorIncome = priceCalculator(total);
    setInterpreterFee(translatorIncome);
    setTotal(total);

    console.log(total, 'et', translatorIncome);
  };

  useEffect(() => {
    if (price > 0) changeInPrice();
  }, [price, tfare]);

  // 86400000

  return (
    <KeyboardAwareScrollView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <ProfileHeader navigation={navigation} />
      <View
        style={{
          marginTop: 1,
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <ScrollView>
          {/* top */}

          <View style={styles.view}>
            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                BookingID :
              </Text>
              <Text style={[styles.text, {color: 'green'}]}>
                {item.BookingID}
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
                {owner
                  ? getStatusName(StatusName, true)
                  : getStatusName(StatusName)}
              </Text>
            </View>

            {owner ? (
              // the customer price section
              <View>
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:fee')} :{' '}
                  </Text>
                  <Text style={styles.text}>
                    {item.PricesCustomer} {baseCurrency.usd}
                  </Text>
                </View>

                {item.TaskTypeId === 1 && (
                  <View>
                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:transport_fee')} :
                      </Text>
                      <Text style={styles.text}>
                        {' '}
                        {item.TfareCustomer} {baseCurrency.usd}
                      </Text>
                    </View>

                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:total_fee')} :
                      </Text>
                      <Text style={styles.text}>
                        {(item.TfareCustomer + item.PricesCustomer).toFixed(2)}{' '}
                        {baseCurrency.usd}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              // this is shown to translators
              <View>
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:fee')} :{' '}
                  </Text>
                  <Text style={styles.text}>
                    {item.PricesCustomer} {baseCurrency.usd}
                  </Text>
                </View>

                {item.IsBookingCompleted === 2 && item.TaskTypeId !== 1 && (
                  <View style={styles.row}>
                    <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                      {t('common:you_get')} :
                    </Text>
                    <Text style={[styles.text, {flex: 1}]}>
                      {item.InterpreterSalary} {baseCurrency.usd} ( - 20%
                      service charge)
                    </Text>
                  </View>
                )}

                {item.TaskTypeId === 1 && (
                  <View>
                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:transport_fee')} :
                      </Text>
                      <Text style={styles.text}>
                        {' '}
                        {item.Tfare} {baseCurrency.usd}
                      </Text>
                    </View>

                    <View style={styles.row}>
                      <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                        {t('common:total_fee')} :
                      </Text>
                      <Text style={styles.text}>
                        {(item.Tfare + item.InterpreterSalary).toFixed(2)}{' '}
                        {baseCurrency.usd}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {ServiceId === 2 || ServiceId === 3 ? (
              <View>
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:start_time')} :
                  </Text>
                  <Text style={styles.text}>
                    {/* {dayjs(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                    {/* {moment(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                    {startTime.date + ' ' + startTime.time}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:end_time')} :
                  </Text>
                  <Text style={styles.text}>
                    {/* {dayjs(item?.DateTimeEnd).format('DD-MM-YYYY HH:mm')} */}
                    {endTime.date + ' ' + endTime.time}
                  </Text>
                  {!owner &&
                    item?.StatusName === 2 &&
                    dateToMilliSeconds(getCurrentDate()) >
                      dateToMilliSeconds(item?.DateTimeEnd) && (
                      <TouchableOpacity
                        onPress={() => {
                          if (userDetails === null) {
                            toast('loading user details', 'info');
                            return;
                          }
                          navigation.navigate('EditTime', {
                            info: item,
                            userDetails: userDetails,
                            deviceId: deviceId,
                          });
                        }}
                        style={{
                          marginStart: 10,
                          width: 30,
                          height: 30,
                          borderRadius: 100,
                          backgroundColor: '#fff',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          type="Ionicons"
                          name="edit"
                          size={20}
                          color="#659ED6"
                        />
                      </TouchableOpacity>
                    )}
                </View>
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:duration')} :
                  </Text>
                  <Text style={styles.text}>{item?.Duration} Timer </Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.row}>
                  <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                    {t('common:deadline')} :
                  </Text>
                  <Text style={styles.text}>
                    {/* {dayjs(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                    {/* {moment(item?.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
                    {startTime.date + ' ' + startTime.time}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:translated_from')} :
              </Text>
              <Text style={styles.text}>Dansk</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:translated_to')} :
              </Text>
              <Text style={styles.text}>{item.ToLanguageName}</Text>
            </View>
            {/* TaskTypeId */}
            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:tasktype')} :
              </Text>
              <Text style={styles.text}>
                {' '}
                {ServiceId === null || ServiceId === 3 || ServiceId === 0
                  ? getTaskName(item?.TaskTypeId)
                  : available_services[ServiceId - 1]?.label}
              </Text>
            </View>
            {item.TaskTypeId === 1 && address !== null && (
              <View>
                {/* <View style={styles.row}>
                <Text
                  style={[styles.text, {fontFamily: fonts.bold, width: 100}]}>
                  Translator Location :
                </Text>
                <Text style={[styles.text, {flex: 1}]}>
                  {address.origin_addresses}
                </Text>
              </View> */}
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
          </View>

          <View style={{width: '100%', marginTop: 20}}>
            <Button
              onPress={() =>
                updateBooking('concluded', item.IsBookingCompleted)
              }
              bGcolor={'green'}
              buttonTitle={
                t('common:accept') +
                ' ' +
                t('common:current') +
                ' ' +
                t('common:terms')
              }
            />
          </View>

          {(item.StatusName === 1 || item.StatusName === 8) && (
            <View style={styles.view}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:review') + ' ' + ' ' + t('common:terms')}
              </Text>

              <View style={styles.dateRow}>
                <Text style={[styles.text, {flex: 1, fontFamily: fonts.bold}]}>
                  Price
                </Text>
                <TextInput
                  value={price}
                  keyboardType="numeric"
                  onChangeText={val => {
                    setPrice(val);
                  }}
                  style={[styles.offertextinput, {width: 100}]}
                  placeholderTextColor="#adb5bd"
                />
              </View>

              {TaskTypeId === 1 && (
                <View style={styles.dateRow}>
                  <Text
                    style={[styles.text, {flex: 1, fontFamily: fonts.bold}]}>
                    Transportation Fee
                  </Text>
                  <TextInput
                    onChangeText={val => {
                      setTfare(val);
                    }}
                    style={[styles.offertextinput, {width: 100}]}
                    placeholderTextColor="#adb5bd"
                    value={tfare + ''}
                  />
                </View>
              )}

              <View style={styles.dateRow}>
                <Text style={[styles.text, {flex: 1, fontFamily: fonts.bold}]}>
                  {t('common:total_fee')}
                </Text>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  {total > 1 && total.toFixed(0)} {baseCurrency.usd}
                </Text>
              </View>

              {!isCustomer(user) && interpreterFee > 1 && (
                <View>
                  <View style={styles.dateRow}>
                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.text,
                          {fontFamily: fonts.bold, flex: 1},
                        ]}>
                        {t('common:percentage_text')} :
                      </Text>
                      <Text style={styles.text}>
                        {interpreterFee > 1 && interpreterFee.toFixed(0)}{' '}
                        {baseCurrency.usd}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.text, {margin: 10}]}>
                    SprogTeam charges 20% service charge on all transaction
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* display the cancel button if the starus is pending also if the  start date is more than 24hrs */}
        {error !== null && <ErrorMsg error={error} />}
        <View>
          {loading ? (
            <ActivityIndicator show={loading} size={'large'} />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              {(item.StatusName === 1 || item.StatusName === 8) && (
                <View style={{width: '100%', marginTop: 20}}>
                  <Button
                    onPress={() =>
                      updateBooking('negotiating', isCustomer(user) ? 1 : 2)
                    }
                    bGcolor={'green'}
                    buttonTitle={t('common:submit')}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default BookingResponseScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: fonts.medium,
    textAlign: 'justify',
    margin: 5,
  },
  view: {
    borderColor: colors.main,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  row: {flexDirection: 'row'},
  filterBox: {
    alignSelf: 'center',
    width: '50%',
    margin: 3,
    padding: 3,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    minWidth: 80,
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginBottom: 10,
  },

  offertext: {
    fontSize: 16,
    margin: 5,
    color: '#000',
    fontFamily: fonts.bold,
  },
  offertextinput: {
    textAlignVertical: 'top',
    borderColor: '#000',
    color: '#000',
    borderWidth: 1,
    fontSize: 16,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    fontFamily: fonts.medium,
  },
});
