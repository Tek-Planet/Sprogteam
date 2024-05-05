import * as React from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import {colors} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';
import {UserModel} from '../types';
import {CustomButton} from '.';
import {useTranslation} from 'react-i18next';
import {gender, location, placeholder, user} from '../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {width} from '../utils';
import Feather from 'react-native-vector-icons/Ionicons';

// interface AccountTypeCardItemProps {}

interface UserCardItemProps {
  item: UserModel;
  onPress: () => void;
  onContact?: () => void;
  onClickFavourite: () => void;
  isFavourite?: boolean;
  title?: string;
}

const UserCardItem = (props: UserCardItemProps) => {
  const {item, onPress, isFavourite, onClickFavourite, title, onContact} =
    props;
  const {t} = useTranslation();

  return (
    <View style={styles.cardItem}>
      {/* <Pressable
        onPress={() => {
          // onClickFavourite();
        }}
        style={{position: 'absolute', right: 10, top: 10, zIndex: 10}}>
        <Ionicons
          name={'heart'}
          size={25}
          color={isFavourite ? colors.red : colors.black}
        />
      </Pressable> */}
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
        }}>
        <Feather name="star" size={15} color={colors.gold} />

        <Text
          style={{
            ...styles.text,
            opacity: 0.6,
            marginStart: spacing.five,
            fontSize: 12,
          }}>
          {`${item.RatingNumber ? item.RatingNumber : 0}(${
            item.Rating ? item.Rating : 0
          })`}
        </Text>
      </View>

      {/* gender section RatingNumber */}
      <View style={{marginVertical: spacing.twenty}}>
        {/* gender */}
        <View style={styles.itemView}>
          <Image style={styles.itemIcon} resizeMode="contain" source={gender} />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:gender')}
            </Text>
            <Text style={styles.text}>
              {item?.GenderId === 0 ? t('common:female') : t('common:male')}
            </Text>
          </View>
        </View>
        {/* from */}
        <View style={styles.itemView}>
          <Image
            style={styles.itemIcon}
            resizeMode="contain"
            source={location}
          />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:from')}
            </Text>
            <Text style={styles.text}>{item?.Country}</Text>
          </View>
        </View>
        {/* about */}
        <View style={styles.itemView}>
          <Image style={styles.itemIcon} resizeMode="contain" source={user} />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:about')}
            </Text>
            <Text style={{...styles.text, fontSize: 13, marginEnd: 10}}>
              {item?.About?.substring(0, 50)}
            </Text>
          </View>
        </View>
      </View>

      <CustomButton
        buttonTitle={t('common:contact')}
        onTap={() => {
          if (onContact) onContact();
        }}
        textSize={14}
        padding={2}
      />

      <CustomButton
        buttonTitle={title ? title : t('common:book')}
        onTap={() => {
          onPress();
        }}
        bGcolor={colors.white}
        testColor={colors.main}
        borderWidth={1}
        textSize={14}
        padding={2}
      />
    </View>
  );
};

export default UserCardItem;

const styles = StyleSheet.create({
  cardItem: {
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: spacing.ten,
    padding: spacing.ten,
    width: width * 0.46,
    margin: spacing.five - 2,
  },

  image: {
    height: 70,
    width: 70,
    borderWidth: 2,
    borderRadius: 100,
    padding: 10,
    borderColor: colors.lightGray,
    alignSelf: 'center',
  },

  headerRowText: {
    fontSize: fontSize.regular,
    fontFamily: fonts.medium,
    textAlign: 'center',
    marginTop: spacing.five,
    color: colors.main,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: spacing.ten,
    borderBottomColor: colors.gray,
  },
  itemIcon: {height: 15, width: 15, marginEnd: spacing.ten},
});
