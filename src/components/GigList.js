import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
import {baseCurrency} from '../util/util';
import {useTranslation} from 'react-i18next';

const GigList = props => {
  const {t} = useTranslation();

  const {
    customer,
    customerInfo,
    item,
    setIsVisibleOffer,
    returnToChat,
    closeRef,
  } = props;
  const {title, imgOne, service} = item;

  // console.log(item?.package[0]?.price);

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        closeRef && closeRef.current?.setModalVisible(false);
        setIsVisibleOffer && setIsVisibleOffer(false);
        if (customer) {
          navigation.navigate('OtherNav', {
            screen: 'ViewGiG',
            params: {
              customerInfo: customerInfo,
              item: item,
              returnToChat: returnToChat ? true : false,
            },
          });
        } else navigation.navigate('GigDetails', {item: item});
      }}
      style={{
        margin: 5,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: colors.white,
      }}>
      <Image
        resizeMode="contain"
        style={{
          height: 130,
          width: 130,
          marginEnd: 20,
        }}
        source={{
          uri: imgOne,
        }}
      />
      <View style={{flex: 1}}>
        <Text
          style={{
            marginTop: 10,
            fontFamily: fonts.medium,
            fontSize: 15,
            color: colors.black,
          }}>
          {title}
        </Text>

        <Text
          style={{
            marginTop: 10,
            fontFamily: fonts.medium,
            color: colors.black,
          }}>
          {service}
        </Text>
        <Text
          style={{
            fontFamily: fonts.medium,

            marginTop: 10,
          }}>
          {t('common:translating')}
        </Text>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: fonts.light,
              }}>
              {t('common:from')} :
            </Text>

            <Text
              style={{
                fontFamily: fonts.medium,
              }}>
              {item?.languageName}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: fonts.light,
              }}>
              {t('common:to')} :
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
              }}>
              {item?.toLanguageName}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
            flex: 1,
            alignItems: 'center',
            padding: 10,
          }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 16,
              color: colors.black,
            }}>
            {item?.package[0]?.PPPrice} {baseCurrency.usd}
          </Text>

          <Text
            style={{
              fontFamily: fonts.medium,
              marginEnd: 10,
              color: colors.black,
            }}>
            {t('common:from')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default GigList;
