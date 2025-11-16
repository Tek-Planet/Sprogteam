import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';

import {useTranslation} from 'react-i18next';
import {CustomButton, Header} from '../../components';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/MainNavigation';
import moment from 'moment';
import {colors} from '../../assets/colors';
import {fonts, fontSize} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {useAppSelector} from '../../rtk/hooks';
import {
  getFileName,
  getWrittenStatusName,
  startFileDownload,
} from '../../utils';
import Feather from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<RootStackParams, 'WrittenBookingDetails'>;

const WrittenBookingDetailsScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();

  const [item, setItem] = useState(route?.params?.item || null);

  const {user} = useAppSelector(state => state.user);
  const {
    Id,
    CreateByUser,
    FromLanguageName,
    ToLanguageName,
    Status,
    CreateDate,
    Deadline,
    CompanyName,
    Salaryinterpreter,
    InterpreterId,
    Files,
  } = item;

  const files: any = JSON.parse(Files);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        headerTitle={
          t('common:written') +
          ' ' +
          t('common:booking') +
          ' ' +
          t('common:details')
        }
        showleftIcon
      />

      {/* body */}
      <View style={{padding: spacing.ten, flex: 1}}>
        {/* start time */}

        <View style={{...styles.row}}>
          <Text style={{...styles.title}}>ID</Text>

          <Text style={{...styles.text}}>{Id}</Text>
        </View>

        <View style={{...styles.row}}>
          <Text style={{...styles.title}}>
            {t('common:creation') + ' ' + t('common:date')}
          </Text>

          <Text style={{...styles.text}}>
            {moment.utc(CreateDate).format('D/MM/YYYY')}
          </Text>
        </View>

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
            {moment.utc(Deadline).format('D/MM/YYYY HH:mm')}
          </Text>
        </View>

        <View style={{...styles.row}}>
          <Text style={{...styles.title}}>{t('common:cooporation')}</Text>

          <Text style={{...styles.text}}>{CompanyName}</Text>
        </View>

        <View style={{...styles.row}}>
          <Text style={{...styles.title}}>{t('common:price')}</Text>

          <Text style={{...styles.text}}>
            {Salaryinterpreter ? Salaryinterpreter : 0}
          </Text>
        </View>

        <View style={{...styles.row}}>
          <Text style={{...styles.title}}>{t('common:interpreter')}</Text>

          <Text style={{...styles.text}}></Text>
        </View>

        <View style={{...styles.row}}>
          <Text style={{...styles.title}}>
            {t('common:file') +
              ' ' +
              t('common:for') +
              ' ' +
              t('common:translation')}
          </Text>
        </View>
        {files?.FilePaths && files?.FilePaths.length > 0 && (
          <Pressable
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: spacing.ten,
            }}
            onPress={() => {
              startFileDownload(files?.FilePaths[0]);
            }}>
            <Text style={{...styles.title}}>
              {getFileName(files?.FilePaths[0])}
            </Text>
            <Feather name="download" size={25} color={colors.main} />
          </Pressable>
        )}

        {/* <CustomButton
            onTap={() => {
              onPress();
            }}
            buttonTitle={t('common:details')}
          /> */}
      </View>
    </View>
  );
};

export default WrittenBookingDetailsScreen;

const styles = StyleSheet.create({
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
