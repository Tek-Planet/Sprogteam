import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, Alert} from 'react-native';
import {fonts} from '../../assets/fonts';
import {Button, ProfileHeader} from '../../components';
import {useTranslation} from 'react-i18next';
import {baseCurrency} from '../../util/util';
import {presentPaymentSheet, useStripe} from '@stripe/stripe-react-native';
import {getClientSecretKey} from '../../data/payment';
import {cashless} from '../../assets/icons';
import {colors} from '../../assets/colors';

export default function LandingPage(props) {
  const {t} = useTranslation();

  const {navigation, route} = props;
  const {item, from} = route.params;

  const {PricesCustomer, TfareCustomer} = item;
  var price =
    PricesCustomer !== null && PricesCustomer > 0
      ? parseInt(PricesCustomer)
      : 0;
  var tfare =
    TfareCustomer !== null && parseInt(TfareCustomer) > 0 ? TfareCustomer : 0;

  var total = price + tfare;
  var charges = 0.1 * total;

  const [amt, setamt] = React.useState(total + charges);

  const [clientKey, setClientKey] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [ephemeralKey, setEphemeralKey] = useState(null);

  const {initPaymentSheet} = useStripe();

  const pay = () => {
    if (amt != '') {
      // navigation.navigate('Payment', {amt: amt});
      navigation.navigate('OtherNav', {
        screen: 'Payment',
        params: {item: item, amt: amt, from: from},
      });
    }
  };

  const fetchData = async () => {
    const res = await getClientSecretKey(amt);

    if (res !== 'error') {
      setClientKey(res.paymentIntent);
      setCustomer(res.customer);
      setEphemeralKey(res.ephemeralKey);
      console.log(res.paymentIntent);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (clientKey) {
      initialisePaymentSheet();
    }
  }, [clientKey]);
  const initialisePaymentSheet = async () => {
    if (!clientKey) return;
    const {error} = await initPaymentSheet({
      merchantDisplayName: 'WoofMatchDog',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientKey,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
    });
    if (error) {
      console(error);
    } else {
      console.log('initialise successfully');
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert(t('common:success'), t('common:success_mgs'));

      navigation.navigate('OtherNav', {
        screen: 'Success',
        params: {amount: amt, item: item, from: from},
      });
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#F5F5F5',
            height: 400,
            alignItems: 'center',
            // justifyContent: 'center',
            paddingTop: 20,
            width: '100%',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            // padding:10
          }}>
          <Image source={cashless} style={styles.img} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={styles.title}>
              {t('common:booking') + ' ' + t('common:fee')}
            </Text>
            <Text style={styles.title}>
              {total} {baseCurrency.usd}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={styles.title}>
              SprogTeam {t('common:fee')}: {'\n'}10% {t('common:of') + ' '}
              {t('common:booking') + ' ' + t('common:fee')}
            </Text>
            <Text style={styles.title}>
              {charges.toFixed(2)} {baseCurrency.usd}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={[styles.title]}>{t('common:total_fee')}</Text>
            <Text style={styles.title}>
              {amt} {baseCurrency.usd}
            </Text>
          </View>
          <Text style={[styles.title, {textAlign: 'center', fontSize: 20}]}>
            {t('common:payment1')} {amt} {baseCurrency.usd}{' '}
            {t('common:payment2')}
          </Text>
        </View>
      </View>

      <View style={{margin: 10}}>
        <Button buttonTitle={t('common:proceed')} onPress={openPaymentSheet} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textinput: {
    borderWidth: 1,
    width: '100%',
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 15,
    marginBottom: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  img: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    padding: 10,
    color: colors.black,
  },
});
