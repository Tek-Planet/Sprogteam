import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, Alert, Button} from 'react-native';
import {fonts} from '../../assets/fonts';

import {useTranslation} from 'react-i18next';

import {presentPaymentSheet, useStripe} from '@stripe/stripe-react-native';

import {colors} from '../../assets/colors';
import {cashless} from '../../assets/images';
import {getClientSecretKey} from '../../rtk/features/user/userSlice';
import {CustomButton, Header} from '../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/MainNavigation';
import {
  useGetServiceChargeQuery,
  useUpdateQuoteMutation,
} from '../../rtk/services';
import {useNavigation} from '@react-navigation/native';

import {SelectOptionType} from '../../types';
import {customerPercentage, getCurrencies} from '../../utils';

type Props = NativeStackScreenProps<RootStackParams, 'Payment'>;

const PaymentScreen = ({route}: Props) => {
  const navigation: any = useNavigation();
  const {t} = useTranslation();
  const [updateQuote] = useUpdateQuoteMutation();

  const {data: ServiceCharge} = useGetServiceChargeQuery('', {});

  const customerPercentageFee = ServiceCharge
    ? ServiceCharge?.CustomerServiceCharge
    : customerPercentage;

  const {item} = route.params;

  const [amt, setamt] = React.useState<any>(item.TotalAmount);

  const currency: SelectOptionType = getCurrencies()[item.CurrencyId - 1];

  const [clientKey, setClientKey] = useState<string | undefined>(undefined);
  const [customer, setCustomer] = useState<string | undefined>(undefined);
  const [ephemeralKey, setEphemeralKey] = useState<string | undefined>(
    undefined,
  );

  const {initPaymentSheet} = useStripe();

  const fetchData = async () => {
    try {
      const body = {
        amount: parseFloat(amt),
        currrency: currency.label.toLowerCase(),
      };

      const res = await getClientSecretKey(body);

      if (res !== 'error') {
        setClientKey(res.paymentIntent);
        setCustomer(res.customer);
        setEphemeralKey(res.ephemeralKey);
      }
    } catch (error) {
      console.log(error);
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
      merchantDisplayName: 'SprogTeam',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientKey,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      style: 'automatic',
    });
    if (error) {
      console.log(error);
    } else {
      console.log('initialise successfully');
    }
  };

  const openPaymentSheet = async () => {
    const {error, paymentOption} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert(t('common:success'), t('common:success_mgs'));

      // payment conplete todo
      // navigation.navigate('OtherNav', {
      //   screen: 'Success',
      //   params: {amount: amt, item: item, from: from},
      // });
      // updat the quotes tbale
      const quoteBody: any = {
        IsPaymentPaid: true,
        PaymentTransactionId: ephemeralKey,
        recordId: item.QuoteID,
      };

      const response = await updateQuote(quoteBody);
      // console.log(response);
      navigation.navigate('Tab', {screen: 'Quote'});
    }
  };

  return (
    <View style={styles.container}>
      <Header headerTitle={t('common:checkout')} showleftIcon />
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
              {item.AcceptAmount} {currency.label}{' '}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={styles.title}>
              SprogTeam {t('common:fee')}: {'\n'}
              {item.CustomerServiceChargePer
                ? item.CustomerServiceChargePer
                : customerPercentageFee}
              % {t('common:of') + ' '}
              {t('common:booking') + ' ' + t('common:fee')}
            </Text>
            <Text style={styles.title}>
              {item.CustomerServiceChargeAmount &&
                item.CustomerServiceChargeAmount.toFixed(2) + ' '}
              {currency.label}
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
              {amt} {currency.label}
            </Text>
          </View>
          <Text style={[styles.title, {textAlign: 'center', fontSize: 20}]}>
            {t('common:payment1')} {amt} {currency.label} {t('common:payment2')}
          </Text>
        </View>
      </View>

      <View style={{margin: 10}}>
        <CustomButton
          buttonTitle={t('common:proceed')}
          onTap={openPaymentSheet}
        />
      </View>
    </View>
  );
};

export default PaymentScreen;
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
    height: 90,
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

// PaymentTransactionId
// IsPaymentPaid
