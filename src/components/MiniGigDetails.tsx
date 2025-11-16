import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {colorTypes} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';
import {GigType} from '../types';
import {width} from '../utils';
import {GigItem} from '.';
import {useGetGigsByUserIdQuery} from '../rtk/services';

interface Props {
  item: GigType;
  serviceId: string;
}

const MiniGigDetails = (props: Props) => {
  const {item, serviceId} = props;

  const {Id} = item;

  const userId: string = Id;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const {data, error, isLoading} = useGetGigsByUserIdQuery(
    {userId, serviceId},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // console.log(data);

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <View style={{padding: spacing.ten}}>
        <ScrollView>
          {/* <GigItem item={item} /> */}
          {/* <Text style={{...styles.title}}>
            {t('common:other') + ' ' + t('common:gig')}
          </Text> */}
          <ScrollView contentContainerStyle={{}} horizontal>
            {data &&
              data?.map((gig, index) => {
                if (gig.ID !== item.ID)
                  return (
                    <GigItem
                      cardWidth={width * 0.8}
                      key={index.toString()}
                      item={gig}
                    />
                  );
              })}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

export default MiniGigDetails;

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

    title: {
      color: colors.black,
      fontFamily: fonts.medium,
      fontSize: fontSize.medium,
      marginStart: spacing.ten,
    },
  });
