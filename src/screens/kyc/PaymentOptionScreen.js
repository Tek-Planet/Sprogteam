import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  ActivityIndicator,
  Button,
  CustomInput,
  ErrorMsg,
  ProfileHeader,
} from '../../components';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {useTranslation} from 'react-i18next';
import {toastNew as toast} from '../../util/util';
import {anyRecordUpdate, getUser, storeDetails} from '../../data/data';
import {colors} from '../../assets/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const PaymentOptionScreen = ({navigation}) => {
  const {t} = useTranslation();

  const {user, setUser} = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paymentId, setPaymentId] = useState(user?.profile?.PaymentId);
  const [accountNumber, setAccountNumber] = useState(
    user?.profile?.KontoNummer,
  );

  // console.log(paymentId);
  const [showForm, setShowForm] = useState(false);
  const [showAccount, setshowAccount] = useState(false);

  // console.log(user.profile);

  const savePaymentID = async type => {
    if (type === 1 && paymentId === null) {
      setError('enter your paypal id');
      return;
    }

    if (type === 2 && accountNumber === null) {
      setError('enter your account number');
      return;
    }

    try {
      setLoading(true);

      if (type === 1) {
        await anyRecordUpdate(user.profile.Email, paymentId, 'PaymentId');
        setShowForm(false);
      } else {
        await anyRecordUpdate(user.profile.Email, accountNumber, 'KontoNummer');
        setshowAccount(false);
      }

      toast('Payment Record Updated', 'success');

      setLoading(false);

      const resUser = await getUser(user.profile.Email);
      storeDetails(resUser);
      setUser(resUser);
    } catch (error) {
      setError('unable to add payment id, please try again');
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header navigation={navigation} /> */}
      <ProfileHeader />

      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.paypalBox}>
          <Text style={[styles.text, {fontSize: 18, color: colors.white}]}>
            PayPal
          </Text>
        </View>

        <View style={styles.contentView}>
          {showForm ? (
            <View style={{padding: 10}}>
              <Text style={styles.text}>PayPal {t('common:email')}</Text>

              <View style={{marginHorizontal: 10}}>
                <CustomInput
                  value={paymentId}
                  onChangeText={val => setPaymentId(val)}
                />
              </View>

              {error !== null && <ErrorMsg error={error} />}
              <View style={{}}>
                {loading ? (
                  <ActivityIndicator
                    color={'#659ED6'}
                    show={loading}
                    size={'large'}
                  />
                ) : (
                  // <Text>Loading</Text>
                  <Button
                    onPress={() => {
                      savePaymentID(1);
                    }}
                    bGcolor={'#659ED6'}
                    buttonTitle={t('common:submit')}
                  />
                )}
              </View>
            </View>
          ) : paymentId !== null ? (
            <View style={{padding: 10}}>
              <Text style={styles.text}>PayPal ID</Text>

              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.medium}]}>
                  {paymentId}
                </Text>
                <Ionicons
                  onPress={() => {
                    setShowForm(true);
                  }}
                  name="pencil-outline"
                  color="#000"
                  size={20}
                  style={styles.icon}
                />
              </View>
            </View>
          ) : (
            <View style={styles.row}>
              <Text
                style={[
                  styles.text,
                  {fontFamily: fonts.light, textAlign: 'center', marginTop: 30},
                ]}>
                {t('common:no_payment')}
              </Text>

              <Ionicons
                onPress={() => {
                  setShowForm(true);
                }}
                name="pencil-outline"
                color="#000"
                size={20}
                style={styles.icon}
              />
            </View>
          )}
        </View>

        {/* bank Detaisl */}
        <View style={styles.paypalBox}>
          <Text style={[styles.text, {fontSize: 18, color: colors.white}]}>
            {t('common:bank') + ' ' + t('common:account')}
          </Text>
        </View>

        <View style={styles.contentView}>
          {showAccount ? (
            <View style={{padding: 10}}>
              <Text style={styles.text}>
                {t('common:account') + ' ' + t('common:number')}
              </Text>

              <View style={{marginHorizontal: 10}}>
                <CustomInput
                  value={accountNumber}
                  onChangeText={val => setAccountNumber(val)}
                />
              </View>

              {error !== null && <ErrorMsg error={error} />}
              <View style={{}}>
                {loading ? (
                  <ActivityIndicator
                    color={'#659ED6'}
                    show={loading}
                    size={'large'}
                  />
                ) : (
                  <Button
                    onPress={() => {
                      savePaymentID(2);
                    }}
                    bGcolor={'#659ED6'}
                    buttonTitle={t('common:submit')}
                  />
                )}
              </View>
            </View>
          ) : accountNumber !== null ? (
            <View style={{padding: 10}}>
              <Text style={styles.text}>
                {t('common:account') + ' ' + t('common:number')}
              </Text>

              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.medium}]}>
                  {accountNumber}
                </Text>
                <Ionicons
                  onPress={() => {
                    setshowAccount(true);
                  }}
                  name="pencil-outline"
                  color="#000"
                  size={20}
                  style={styles.icon}
                />
              </View>
            </View>
          ) : (
            <View style={styles.row}>
              <Text
                style={[
                  styles.text,
                  {fontFamily: fonts.light, textAlign: 'center', marginTop: 30},
                ]}>
                {t('common:no_account_number')}
              </Text>
              <Ionicons
                onPress={() => {
                  setshowAccount(true);
                }}
                name="pencil-outline"
                color="#000"
                size={20}
                style={styles.icon}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default PaymentOptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.main,
  },
  text: {
    fontFamily: fonts.bold,
    marginStart: 10,
  },
  paypalBox: {
    height: 80,
    width: 200,
    backgroundColor: '#113984',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 30,
    marginBottom: -40,
    zIndex: 1,
  },
  contentView: {
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: colors.white,
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 40,
    paddingBottom: -40,
  },
  row: {
    marginTop: 20,
  },
  icon: {position: 'absolute', right: 15, top: 100},
});
