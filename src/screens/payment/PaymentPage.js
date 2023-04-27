import React, {useContext} from 'react';
import {View, Dimensions, Image} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthProvider';
import {ActivityIndicator, ProfileHeader} from '../../components';
import {baseURL} from '../../util/util';

const {width, height} = Dimensions.get('screen');

export default function Payment({navigation}) {
  const {setReload} = useContext(AuthContext);

  const route = useRoute();

  const {item} = route.params;

  const {BookingID} = item;

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

  return (
    <View style={{flex: 1}}>
      <ProfileHeader navigation={navigation} />
      <WebView
        startInLoadingState={true}
        onNavigationStateChange={stateChng}
        renderLoading={() => <Loading />}
        source={{
          uri: `${baseURL}/auth/payment/${route.params.amt}/${BookingID}`,
        }}
      />
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
