import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {
  CustomButton,
  CustomTopTab,
  Header,
  MiniGigDetails,
  RatingProfile,
  TranslatorInfo,
} from '../../components';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GigStackParams} from '../../navigations/GigNavigation';
import {TabItem} from '../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {placeholder} from '../../assets/images';
import {changeRoute, setGigState} from '../../rtk/features/user/userSlice';
import {useAppSelector, useAppDispatch} from '../../rtk/hooks';

type Props = NativeStackScreenProps<GigStackParams, 'GigProfileDetails'>;

const GigProfileDetailsScreen = ({route}: Props) => {
  // const [item, setItem] = useState(route?.params?.item);
  const {item, serviceId} = route?.params;

  const {authenticated} = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  const navigation: any = useNavigation();

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const tabItems: TabItem[] = [
    {
      title: t('common:gig') + ' ' + t('common:description'),
      value: 'gig',
    },
    {
      title: t('common:about'),
      value: 'about',
    },

    {
      title: t('common:rating'),
      value: 'rating',
    },
  ];

  const [selected, setSelected] = useState<TabItem>(tabItems[0]);

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Header
        showleftIcon
        headerTitle={t('common:profile') + ' ' + t('common:details')}
        showRightIcon
      />

      {/* <Pressable
        onPress={() => {
          // onClickFavourite();
        }}
        style={{position: 'absolute', right: 10, top: 50, zIndex: 10}}>
        <Ionicons name={'heart'} size={25} color={colors.black} />
      </Pressable> */}
      <ScrollView>
        <View>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={
              item.ProfilePicture !== 'default'
                ? {uri: item.ProfilePicture}
                : placeholder
            }
          />

          <Text style={styles.headerRowText}>{item?.FirstName}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: spacing.five,
              alignItems: 'center',
            }}>
            <Ionicons name="star" size={15} color={colors.gold} />

            <Text
              style={{
                ...styles.text,
                opacity: 0.6,
                marginStart: spacing.five,
              }}>
              {`${item.RatingNumber ? item.RatingNumber : 0}(${
                item.Rating ? item.Rating : 0
              })`}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: spacing.ten,
              justifyContent: 'center',
            }}>
            <View style={styles.buttonWrapper}>
              <CustomButton
                padding={1}
                textSize={14}
                onTap={() => {
                  if (authenticated)
                    navigation.navigate('CreateOffer', {
                      item,
                      itemType: 'user',
                    });
                  else {
                    // save the  gig to state
                    dispatch(setGigState(item));
                    navigation.navigate('Login');
                  }
                }}
                buttonTitle={t('common:get_a_quote')}
              />
            </View>
            {/* button section */}
            <View style={styles.buttonWrapper}>
              <CustomButton
                padding={1}
                textSize={14}
                onTap={() => {
                  if (authenticated)
                    navigation.navigate('Chats', {
                      item,
                    });
                  else {
                    // save the  gig to state
                    dispatch(setGigState(item));
                    dispatch(changeRoute('Chats'));
                    navigation.navigate('Login');
                  }
                }}
                bGcolor={colors.white}
                testColor={colors.main}
                buttonTitle={t('common:contact')}
                borderColor={colors.main}
                borderWidth={1}
              />
            </View>
          </View>

          <CustomTopTab
            selected={selected}
            setSelected={setSelected}
            tabItems={tabItems}
          />

          {selected.value == 'gig' && (
            <MiniGigDetails item={item} serviceId={serviceId} />
          )}
          {selected.value == 'about' && <TranslatorInfo item={item} />}

          {selected.value == 'rating' && <RatingProfile item={item} />}
        </View>
      </ScrollView>
    </View>
  );
};

export default GigProfileDetailsScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
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
      width: '45%',
      margin: 2,
    },
    seperator: {
      marginVertical: spacing.five,
    },
  });
