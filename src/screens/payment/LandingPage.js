import {parse} from '@babel/core';
import React from 'react';
import {View, TextInput, StyleSheet, Text, Image} from 'react-native';
import {fonts} from '../../assets/fonts';
import {Button, ProfileHeader} from '../../components';
import {useTranslation} from 'react-i18next';
import {baseCurrency} from '../../util/util';

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

  const pay = () => {
    if (amt != '') {
      // navigation.navigate('Payment', {amt: amt});
      navigation.navigate('OtherNav', {
        screen: 'Payment',
        params: {item: item, amt: amt, from: from},
      });
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader navigation={navigation} />
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#F5F5F5',
            height: 400,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            // padding:10
          }}>
          <Image source={require('./paypal.png')} style={styles.img} />
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
              {charges} {baseCurrency.usd}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={[styles.title, {fontFamily: fonts.medium}]}>
              {t('common:total_fee')}
            </Text>
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

      {/* <TextInput
        placeholder="Enter Amount"
        style={styles.textinput}
        value={amt}
        onChangeText={val => setamt(val)}
        keyboardType="number-pad"
      /> */}
      <View style={{margin: 10}}>
        <Button buttonTitle={t('common:proceed')} onPress={pay} />
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
  },
});
