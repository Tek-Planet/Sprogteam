import * as React from 'react';
import {Text, View, StyleSheet, FlatList, Image, Pressable} from 'react-native';
import {colors} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';
import {UserModel} from '../types';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {placeholder} from '../assets/images';
import baseStyles from '../assets/styles';
import {Rating} from 'react-native-ratings';
import {useGetRatingsQuery} from '../rtk/services';
import {useEffect, useState} from 'react';

interface RatingProfileProps {
  item: UserModel;
}

const RatingProfile = (props: RatingProfileProps) => {
  const {item} = props;
  const userId = item.Id ? item.Id : item.userId;
  const {data, error, isLoading, isFetching} = useGetRatingsQuery(userId, {
    // pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });
  const {t} = useTranslation();
  // console.log(data);

  const [aveage, setAverageRting] = useState<number>(0);

  useEffect(() => {
    if (data) {
      let totalRating = 0;
      for (const rating of data) {
        totalRating += rating.Stars;
      }

      setAverageRting(totalRating / data.length);
    }
  }, [data]);

  return (
    <View style={styles.cardItem}>
      {/* rating over view */}
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        {/* left hand side */}
        <View style={styles.itemWrapper}>
          <Text style={{...styles.text}}>
            {t('common:total') + ' ' + t('common:reviews')}
          </Text>
          <Text style={styles.number}>{data ? data.length : 0}</Text>
        </View>
        {/* right hand side */}
        <View style={styles.itemWrapper}>
          <Text style={{...styles.text}}>
            {t('common:average') + ' ' + t('common:rating')}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name="star"
              size={20}
              color={colors.main}
              style={{marginEnd: spacing.ten}}
            />
            <Text style={{...styles.number, alignItems: 'center'}}>
              {aveage.toFixed()}
            </Text>
          </View>
        </View>
      </View>
      {/* review list */}
      <FlatList
        contentContainerStyle={{
          paddingBottom: spacing.twenty * 4,
        }}
        keyExtractor={item => item.RateId.toString()}
        data={data ? data : []}
        renderItem={({item, index}) => {
          return (
            <View style={{...styles.ratingWrapper, ...baseStyles.elevation}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={placeholder}
                />

                <View style={styles.content}>
                  <Text style={styles.name}>{item.CustomerName}</Text>
                  <Rating
                    // showRating
                    readonly={false}
                    style={{paddingVertical: spacing.five}}
                    imageSize={15}
                    startingValue={item.Stars}
                  />
                </View>
              </View>
              <Text style={styles.review}>{item.Remark}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default RatingProfile;

const styles = StyleSheet.create({
  cardItem: {
    padding: spacing.ten,
  },

  text: {
    fontSize: fontSize.light,
    fontFamily: fonts.medium,
    color: colors.black,
    opacity: 0.6,
    marginBottom: spacing.five,
  },

  number: {
    fontSize: fontSize.bold,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  review: {
    fontFamily: fonts.light,
    color: colors.black,
    textAlign: 'justify',
    marginTop: spacing.five,
  },
  content: {
    marginLeft: 16,
  },

  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  ratingWrapper: {
    padding: spacing.ten,
    borderRadius: spacing.twenty,
    margin: spacing.five,
    backgroundColor: colors.white,
  },
});
