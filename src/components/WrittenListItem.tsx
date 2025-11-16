import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import {fontSize, fonts} from '../assets/fonts';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

import {spacing} from '../assets/spacing';
import {colorTypes} from '../assets/colors';
import {WrittenBooking} from '../types';
import moment from 'moment';
import {getWrittenStatusName} from '../utils';
import {useAppSelector} from '../rtk/hooks';
import {CustomButton, CustomLoader} from '.';

interface Props {
  item: WrittenBooking;
  onPress: () => void;
}

const WrittenListItem = (props: Props) => {
  const {item, onPress} = props;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user} = useAppSelector(state => state.user);
  const {
    Id,
    CreateByUser,
    FromLanguageName,
    ToLanguageName,
    Status,
    CreateDate,
    Deadline,
  } = item;

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <View>
        {loading && <CustomLoader color={colors.main} />}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.ten,
          }}>
          <View>
            <Text
              style={{
                color: colors.black,
                fontFamily: fonts.medium,
                fontSize: fontSize.light,
              }}>
              ID: {Id}
            </Text>

            <Text
              style={{
                color: colors.black,
                opacity: 0.6,
              }}>
              {moment(CreateDate).format('D/MM/YYYY')}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              // onPress()
              setShowDetails(!showDetails)
            }>
            <Feather name="chevron-right" size={20} color={colors.black} />
          </Pressable>
        </View>

        {showDetails && (
          <View style={{}}>
            <View style={{borderWidth: 0.5, borderColor: colors.lightGray}} />

            {/* body */}
            <View style={{padding: spacing.ten, flex: 1}}>
              {/* start time */}
              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {t('common:from') + ' ' + t('common:language')}
                </Text>

                <Text style={{...styles.text}}>{FromLanguageName}</Text>
              </View>
              {/* end time */}
              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {t('common:to') + ' ' + t('common:language')}
                </Text>

                <Text style={{...styles.text}}>{ToLanguageName}</Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:status')}</Text>

                <Text
                  style={{
                    ...styles.text,
                    color:
                      Status === 1 ||
                      Status === 3 ||
                      Status === 4 ||
                      Status === 5 ||
                      Status === 6 ||
                      Status === 7 ||
                      Status === 8 ||
                      Status === 9
                        ? 'red'
                        : 'green',
                  }}>
                  {user.interpreter
                    ? getWrittenStatusName(Status ? Status : 0, true)
                    : getWrittenStatusName(Status ? Status : 0, false)}
                </Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:deadline')}</Text>

                <Text style={{...styles.text}}>
                  {moment(Deadline).format('D/MM/YYYY')}
                </Text>
              </View>

              <CustomButton
                onTap={() => {
                  onPress();
                }}
                buttonTitle={t('common:details')}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: spacing.ten * 3,
      marginBottom: spacing.ten,
      flex: 1,
    },

    row: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: spacing.ten,
    },
    text: {
      color: colors.black,
      fontFamily: fonts.medium,
    },
    title: {
      color: colors.black,
      opacity: 0.6,
      fontFamily: fonts.medium,
    },
  });

export default WrittenListItem;
