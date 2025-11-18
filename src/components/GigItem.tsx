import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import {useNavigation, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';



import {colorTypes} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';
import {GigType, SelectOptionType} from '../types';
import {getCurrencies, getServices, width} from '../utils';
import {CustomButton} from '.';
import baseStyle from '../assets/styles';
import {setGigState} from '../rtk/features/user/userSlice';
import {useAppSelector, useAppDispatch} from '../rtk/hooks';
import {logo} from '../assets/images';

interface Props {
  item: GigType;
  cardWidth?: number;
}

const GigItem = (props: Props) => {
  const {authenticated} = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();
  const navigation: any = useNavigation();
  const {item, cardWidth} = props;
  const {
    ID,
    description,
    title,
    imgOne,
    imgTwo,
    imgThree,
    faq,
    serviceId,
    ActualCost,
    CurrencyId,
    languageName,
    toLanguageName,
  } = item;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const currency: SelectOptionType = getCurrencies()[CurrencyId - 1];

  const onViewDetails = (item: any) => {
    navigation.navigate('GigNav', {screen: 'GigDetails', params: {item}});
  };

  const onGetQuote = (item: any) => {
    if (authenticated)
      navigation.navigate('GigNav', {
        screen: 'CreateOffer',
        params: {item, itemType: 'gig'},
      });
    else {
      // save the  gig to state
      dispatch(setGigState(item));
      navigation.navigate('Login');
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        width: cardWidth ? cardWidth : width,
      }}>
      <View style={{padding: spacing.ten, flex: 1}}>
        <ScrollView>
          <View
            style={{
              ...baseStyle.elevation,
              backgroundColor: colors.white,
              margin: spacing.five,
              padding: spacing.ten,
              paddingBottom: 0,
              borderRadius: spacing.ten,
            }}>
            <View style={{height: 150}}>
              <ImageBackground
                resizeMode="cover"
                style={{
                  height: 150,
                }}
                source={
                  imgOne
                    ? {
                        uri: imgOne,
                      }
                    : logo
                }
              />
            </View>
            <View style={styles.seperator} />
            <Text
              style={{
                ...styles.title,
                fontSize: fontSize.light,
                fontFamily: fonts.bold,
              }}>
              {title}
            </Text>
            <View style={styles.seperator} />

            <Text style={{...styles.title}}>{t('common:about')}</Text>

            <Text style={{...styles.text, textAlign: 'justify'}}>
              {description.substring(0, 60)}
            </Text>
            <View style={styles.seperator} />

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...styles.title, fontSize: fontSize.medium}}>
                {t('common:price')}:{' '}
              </Text>

              <Text style={{...styles.title, fontSize: fontSize.medium}}>
                {currency.label + ' '}
                {ActualCost}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View style={styles.buttonWrapper}>
                <CustomButton
                  padding={1}
                  textSize={14}
                  onTap={() => {
                    onGetQuote(item);
                  }}
                  buttonTitle={
                    t('common:get') +
                    ' ' +
                    t('common:a') +
                    ' ' +
                    t('common:quote')
                  }
                />
              </View>
              {/* button section */}
              <View style={styles.buttonWrapper}>
                <CustomButton
                  padding={1}
                  textSize={14}
                  onTap={() => {
                    onViewDetails(item);
                  }}
                  bGcolor={colors.white}
                  testColor={colors.main}
                  buttonTitle={t('common:view') + ' ' + t('common:details')}
                  borderColor={colors.main}
                  borderWidth={1}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default GigItem;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      alignSelf: 'center',
    },

    image: {
      marginTop: spacing.twenty,
      height: 100,
      width: 100,
      borderWidth: 2,
      borderRadius: 100,
      borderColor: colors.lightGray,
      alignSelf: 'center',
    },

    headerRowText: {
      fontSize: fontSize.medium,
      fontFamily: fonts.medium,
      textAlign: 'center',
      marginTop: spacing.five,
      color: colors.main,
    },

    text: {
      color: colors.black,
      fontFamily: fonts.medium,
      opacity: 0.6,
    },
    title: {
      color: colors.black,
      fontFamily: fonts.medium,
    },
    buttonWrapper: {
      width: '50%',
      margin: 2,
    },
    seperator: {
      marginVertical: spacing.five,
    },
  });
