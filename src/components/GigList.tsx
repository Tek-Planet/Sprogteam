import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';

import {useTranslation} from 'react-i18next';
import {GigType, SelectOptionType} from '../types';
import {getCurrencies} from '../utils';
import {logo} from '../assets/images';
import {useAppSelector} from '../rtk/hooks';

interface Props {
  item: GigType;
  onPress: () => void;
}

const GigList = (props: Props) => {
  const {t} = useTranslation();
  const {defaultLanguage} = useAppSelector(state => state.user);

  const {item, onPress} = props;
  const {title, imgOne, service, CurrencyId} = item;

  const currency: SelectOptionType = getCurrencies()[CurrencyId - 1];

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
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
          height: 100,
          width: 100,
          marginEnd: 20,
        }}
        source={
          imgOne
            ? {
                uri: imgOne,
              }
            : logo
        }
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
          {defaultLanguage?.code === 'dk'
            ? item?.Service?.ServiceNameDK || item?.Service?.ServiceName
            : item?.Service?.ServiceNameDK}
        </Text>

        {item?.Service?.LanguageRequire && (
          <View>
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
                  {item?.FromLanguage?.LanguagesName}
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
                  {item?.ToLanguage?.LanguagesName}
                </Text>
              </View>
            </View>
          </View>
        )}
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
            {currency.label + ' '} {item.ActualCost}
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
