import React from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../assets/fonts';
import {baseCurrency, isIpad} from '../util/util';
import {useTranslation} from 'react-i18next';
import {colors} from '../assets/colors';

const {width} = Dimensions.get('screen');

const GigListFull = props => {
  const {t} = useTranslation();

  const {item, mini, translatorInfo} = props;
  const {title, imgOne, service} = item;

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OtherNav', {
          screen: 'ViewGiG',
          params: {
            item: item,
            translatorInfo,
          },
        });
      }}
      style={[
        {
          borderRadius: 10,
          shadowColor: 'grey',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
          backgroundColor: '#fff',
          width: mini ? width * 0.7 : width * 0.95,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          alignSelf: 'center',
          marginTop: mini ? 20 : 10,
          marginEnd: mini ? 10 : 0,
        },
        Platform.isPad && {width: mini ? width * 0.4 : width * 0.6},
      ]}>
      <Image
        resizeMode="stretch"
        style={{
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          height: isIpad ? 300 : 200,
          width: '100%',
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
            fontFamily: fonts.bold,
            fontSize: 15,
            textAlign: 'center',
            color: colors.black,
          }}>
          {title}
        </Text>

        <View style={{flexDirection: 'row', margin: 5, marginTop: 10}}>
          <Text
            style={{
              fontFamily: fonts.light,
              marginEnd: 10,
              color: colors.black,
            }}>
            {t('common:service')}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: colors.black,
            }}>
            {service}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: fonts.medium,
            color: colors.black,
            margin: 5,
          }}>
          {t('common:translating')}
        </Text>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            margin: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: fonts.light,
                color: colors.black,
              }}>
              {t('common:from')} :
            </Text>

            <Text
              style={{
                fontFamily: fonts.medium,
                color: colors.black,
              }}>
              {item?.languageName}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: fonts.light,
                color: colors.black,
              }}>
              {t('common:to')} :
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: colors.black,
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
              fontSize: 18,
              color: colors.black,
            }}>
            {item?.package[0]?.PPPrice} {baseCurrency.usd}
          </Text>

          <Text
            style={{
              fontFamily: fonts.light,
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
export default GigListFull;
