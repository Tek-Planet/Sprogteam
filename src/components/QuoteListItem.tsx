import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import {fontSize, fonts} from '../assets/fonts';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

import {spacing} from '../assets/spacing';
import {colorTypes} from '../assets/colors';
import {QuoteType, SelectOptionType} from '../types';
import moment from 'moment';
import {useAppSelector} from '../rtk/hooks';
import {CustomButton, CustomLoader} from '.';
import {getCurrencies, getServices, getStatusName} from '../utils';

interface Props {
  item: QuoteType;
  onPress: () => void;
}

const QuoteListItem = (props: Props) => {
  const {item, onPress} = props;
  const {user, defaultLanguage} = useAppSelector(state => state.user);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    QuoteID,
    CreateDate,
    Title,

    EstimatedBudget,
    QuoteStatusId,
    DeadlineDate,
    DeadlineNewTime,
    DeadlineTime,
    DeadlineNewDate,
    CurrencyId,
    ServiceNameDK,
    ServiceName,
  } = item;

  const currency: SelectOptionType = getCurrencies()[CurrencyId - 1];

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <View>
        {loading && <CustomLoader color={colors.main} />}
        <Pressable
          onPress={() => setShowDetails(!showDetails)}
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
              ID: {QuoteID}
            </Text>

            <Text
              style={{
                color: colors.black,
                fontSize: 17,
                opacity: 0.6,
              }}>
              {moment(CreateDate).format('D/MM/YYYY')}
            </Text>
          </View>
          <Pressable onPress={() => setShowDetails(!showDetails)}>
            <Feather
              name={showDetails ? 'chevron-down' : 'chevron-right'}
              size={20}
              color={colors.black}
            />
          </Pressable>
        </Pressable>

        {showDetails && (
          <View style={{}}>
            <View style={{borderWidth: 0.5, borderColor: colors.lightGray}} />
            <View style={{padding: spacing.ten, flex: 1}}>
              {/* start time */}
              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {user.Id !== item.ClientId
                    ? t('common:customer')
                    : t('common:translator')}
                </Text>

                {item.FirstName && (
                  <Text style={{...styles.text}}>
                    {item.FirstName + ' ' + item.LastName}
                  </Text>
                )}
              </View>
              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {t('common:created') + ' ' + t('common:on')}
                </Text>

                <Text style={{...styles.text}}>
                  {moment.utc(CreateDate).format('DD:MM:YYYY')}
                </Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:deadline')}</Text>

                <Text style={{...styles.text}}>
                  {moment
                    .utc(DeadlineNewDate ? DeadlineNewDate : DeadlineDate)
                    .format('DD:MM:YYYY')}
                  :
                  {moment
                    .utc(DeadlineNewTime ? DeadlineNewTime : DeadlineTime)
                    .format('HH:mm')}
                </Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:title')}</Text>

                <Text style={{...styles.text}}>{Title}</Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {t('common:service') + ' ' + t('common:required')}
                </Text>

                <Text style={{...styles.text}}>
                  {' '}
                  {defaultLanguage?.code === 'dk'
                    ? ServiceNameDK || ServiceName
                    : ServiceName}
                </Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>
                  {t('common:estimated') + ' ' + t('common:budget')}
                </Text>

                <Text style={{...styles.text}}>
                  {' '}
                  {currency.label + ' '} {EstimatedBudget}
                </Text>
              </View>

              <View style={{...styles.row}}>
                <Text style={{...styles.title}}>{t('common:status')}</Text>

                <Text
                  style={{
                    ...styles.text,
                    color: QuoteStatusId === 2 ? colors.green : colors.red,
                  }}>
                  {getStatusName(QuoteStatusId, true)}
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
    buttonWrapper: {
      width: '50%',
      margin: 2,
    },
  });

export default QuoteListItem;
