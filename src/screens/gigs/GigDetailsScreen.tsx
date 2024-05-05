import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {CustomButton, Header} from '../../components';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getCurrencies, getServices} from '../../utils';
import {GigStackParams} from '../../navigations/GigNavigation';

import {SelectOptionType} from '../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {logo, placeholder} from '../../assets/images';
import baseStyles from '../../assets/styles';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {setGigState} from '../../rtk/features/user/userSlice';

type Props = NativeStackScreenProps<GigStackParams, 'GigDetails'>;

const GigDetailsScreen = ({route}: Props) => {
  const [item, setItem] = useState(route?.params?.item);

  const navigation: any = useNavigation();
  const {description, title, imgOne, faq, serviceId, ActualCost, CurrencyId} =
    item;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const currency: SelectOptionType = getCurrencies()[CurrencyId - 1];
  const {authenticated, defaultLanguage} = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Header
        showleftIcon
        headerTitle={t('common:gig') + ' ' + t('common:details')}
        showRightIcon
      />

      <View style={{padding: spacing.ten, flex: 1}}>
        <ScrollView>
          <View>
            <Text
              style={{
                ...styles.title,
                marginBottom: spacing.ten,
                fontSize: fontSize.medium,
                fontFamily: fonts.bold,
              }}>
              {title}
            </Text>
            {/* user prfile section */}
            {item?.user && (
              <View style={{flexDirection: 'row'}}>
                <Image
                  resizeMode="contain"
                  style={{...styles.image}}
                  source={
                    item?.user?.ProfilePicture !== 'default'
                      ? {uri: item.user.ProfilePicture}
                      : placeholder
                  }
                />
                <View style={{marginStart: spacing.ten}}>
                  <Text style={styles.title}>
                    {item?.user?.FirstName + ' ' + item?.user?.LastName}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',

                      marginTop: spacing.five - 2,
                    }}>
                    <Ionicons name="star" size={15} color={colors.gold} />

                    <Text
                      style={{
                        ...styles.text,
                        opacity: 0.6,
                        marginStart: spacing.five,
                        fontSize: 12,
                      }}>
                      {`${item?.user?.Rating ? item?.user?.Rating : 0} (${
                        item?.user?.RatingNumber ? item?.user?.RatingNumber : 0
                      } ${t('common:reviews')})`}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View
              style={{
                height: 300,
                ...baseStyles.elevation,
                backgroundColor: colors.white,
                margin: spacing.five - 3,
                borderRadius: spacing.fiften,
                marginVertical: spacing.fiften,
              }}>
              <ImageBackground
                resizeMode="stretch"
                style={{
                  height: 250,
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...styles.title}}>{t('common:service')}: </Text>

              <Text style={{...styles.text}}>
                {defaultLanguage?.code === 'dk'
                  ? item?.Service?.ServiceNameDK || item?.Service?.ServiceName
                  : item?.Service?.ServiceName}
              </Text>
            </View>
            <View style={styles.seperator} />
            {item?.SubService && (
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...styles.title}}>
                    {t('common:category')}:{' '}
                  </Text>

                  <Text style={{...styles.text}}>
                    {defaultLanguage?.code === 'dk'
                      ? item?.SubService?.SubServiceNameDK ||
                        item?.SubService?.SubServiceName
                      : item?.SubService?.SubServiceName}
                  </Text>
                </View>
                <View style={styles.seperator} />
              </View>
            )}

            {item?.Service?.LanguageRequire && (
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...styles.title}}>
                    {t('common:from') + ' ' + t('common:language')}:{' '}
                  </Text>

                  <Text style={{...styles.text}}>
                    {item?.FromLanguage?.LanguagesName}
                  </Text>
                </View>
                <View style={styles.seperator} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...styles.title}}>
                    {t('common:to') + ' ' + t('common:language')}:{' '}
                  </Text>

                  <Text style={{...styles.text}}>
                    {item?.ToLanguage?.LanguagesName}
                  </Text>
                </View>
              </View>
            )}
            <Text style={{...styles.title}}>{t('common:about')}</Text>

            <Text style={{...styles.text, textAlign: 'justify'}}>
              {description}
            </Text>
            <View style={styles.seperator} />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...styles.title, fontSize: 18}}>
                {t('common:price')}:{' '}
              </Text>

              <Text style={{...styles.title, fontSize: 18}}>
                {currency.label + ' '}
                {ActualCost}
              </Text>
            </View>
            <View style={styles.seperator} />

            <Text style={{...styles.title}}>{t('common:FAQ')}</Text>

            <Text style={{...styles.text, textAlign: 'justify'}}>{faq}</Text>
          </View>
        </ScrollView>
      </View>
      <View style={{margin: spacing.ten}}>
        <CustomButton
          onTap={() => {
            // check for authenticated
            if (authenticated)
              navigation.navigate('CreateOffer', {item, itemType: 'gig'});
            else {
              // save the  gig to state
              dispatch(setGigState(item));
              navigation.navigate('Login');
            }
          }}
          buttonTitle={t('common:proceed_next')}
        />
      </View>
    </View>
  );
};

export default GigDetailsScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    text: {
      color: colors.black,
      fontFamily: fonts.medium,
      opacity: 0.6,
    },
    title: {
      color: colors.black,
      fontFamily: fonts.medium,
      fontSize: fontSize.intermediate,
    },
    buttonWrapper: {
      width: '50%',
      margin: 2,
    },
    seperator: {
      marginVertical: spacing.five,
    },
    image: {
      height: 50,
      width: 50,
      borderWidth: 2,
      borderRadius: 100,
      padding: 10,
      borderColor: colors.lightGray,
    },
  });
