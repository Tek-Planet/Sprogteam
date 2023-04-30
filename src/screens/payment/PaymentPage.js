import React, {useContext, useEffect, useState} from 'react';
import {View, Dimensions, Image} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthProvider';
import {ActivityIndicator, ProfileHeader} from '../../components';
import {baseURL} from '../../util/util';
import {presentPaymentSheet, useStripe} from '@stripe/stripe-react-native';

const {width, height} = Dimensions.get('screen');

export default function Payment({navigation}) {
  const {setReload} = useContext(AuthContext);

  const route = useRoute();

  const {item} = route.params;

  const {BookingID} = item;

  const [clientKey, setClientKey] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [ephemeralKey, setEphemeralKey] = useState(null);

  const {initPaymentSheet} = useStripe();

  const stateChng = navState => {
    //  console.log(navState);
    const {url, title} = navState;
    if (title === 'Success' || title === 'Redirect') {
      setReload(true);
      console.log('url', url);
      // let spliturl = url.split('?');
      // console.log("spliturl",spliturl);
      // let splitotherhalf = spliturl[1].split('&');
      // console.log('splitotherhalf', splitotherhalf);
      // let paymentId = splitotherhalf[0].replace('paymentId=', '');
      // let token = splitotherhalf[1].replace('token=', '');
      // let PayerID = splitotherhalf[2].replace('PayerID=', '');
      navigation.navigate('Success', {
        // payId: paymentId,
        // token: token,
        // payerId: PayerID,
        amount: route.params.amt,
        item: item,
        from: route.params.from,
      });
    }
  };

  const fetchData = async () => {
    const res = await getClientSecretKey(route.params.amt);

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

      // update user profile
      let profileUpade = userProfile;
      setPremium(true);
      setPackageEndDate(moment().add(days, 'days').toISOString());
      profileUpade.premium = true;
      profileUpade.days = moment().add(days, 'days').toISOString();
      setUserProfile(profileUpade);
      let body = {
        userId: userProfile?.userId,
        premium: true,
        expiryDate: moment().add(days, 'days').toISOString(),
        packageName,
      };
      await updateUserDetails(body);

      body = {
        userId: userProfile?.userId,
        email: userProfile?.email,
        price,
        expiryDate: moment().add(days, 'days').toISOString(),
        packageName,
        provider: 'Stripe',
      };

      addPayment(body);

      // update the payment table

      navigation.navigate('BottomTabs');
    }
  };

  return (
    <View style={{flex: 1}}>
      <ProfileHeader navigation={navigation} />
      {/* <WebView
        startInLoadingState={true}
        onNavigationStateChange={stateChng}
        renderLoading={() => <Loading />}
        source={{
          uri: `${baseURL}/auth/payment/${route.params.amt}/${BookingID}`,
        }}
      /> */}
    </View>
  );
}

const Loading = () => {
  return (
    <View
      style={{
        height: height,
        width: width,
        paddingTop: 50,
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('./paypal.png')}
        style={{width: 250, height: 100, resizeMode: 'contain'}}
      />
      <ActivityIndicator size="large" show={true} color={'#009DE1'} />
    </View>
  );
};
