import React, {useContext} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import {fonts} from '../assets/fonts';
import Button from './Button';
import Indicator from './ActivityIndicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {timeToString} from '../util/util';
import {colors} from '../assets/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AuthContext} from '../context/AuthProvider';

const ConfimScreen = props => {
  const {user} = useContext(AuthContext);

  const navigation = useNavigation();

  const {loading, setConfirm, postToDB, item} = props;
  const {t} = useTranslation();

  const startTime = timeToString(item.DateTimeStart);

  const endTime = timeToString(item.DateTimeEnd);

  const taskTypeId = item.TaskTypeId;

  return (
    <View style={{justifyContent: 'space-between', flex: 1, paddingTop: 20}}>
      <ScrollView>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            textAlign: 'center',
            fontFamily: fonts.bold,
            color: colors.black,
          }}>
          {t('common:order_overview')}
        </Text>
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:type_of_interpretation')} :{' '}
          </Text>
          <Text style={styles.text}>
            {taskTypeId === 1 && t('common:attendance')}
            {taskTypeId === 2 && t('common:video')}
            {taskTypeId === 3 && t('common:phone')}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:start_time')} :{' '}
          </Text>
          <Text style={styles.text}>
            {/* {dayjs(item.DateTimeStart).format('DD-MM-YYYY HH:mm')} */}
            {startTime.date + ' ' + startTime.time}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:end_time')} :{' '}
          </Text>
          <Text style={styles.text}>{endTime.date + ' ' + endTime.time}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:duration')} :{' '}
          </Text>
          <Text style={styles.text}>{item.Duration}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:price')} :{' '}
          </Text>
          <Text style={styles.text}>{item.FeeCustomer} kr</Text>
        </View>

        {taskTypeId === 1 && item.KmTilTask > 0 && (
          <View>
            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:distance')} :{' '}
              </Text>
              <Text style={styles.text}>
                {item.KmTilTask} km ({parseInt(item.KmTilTask) / 2} hver vej 2)
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:transport_fee')} :{' '}
              </Text>
              <Text style={styles.text}>{item.TfareCustomer} kr</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:total_fee')}:{' '}
              </Text>
              <Text style={styles.text}>
                {(
                  parseFloat(item.TfareCustomer) + parseFloat(item.FeeCustomer)
                ).toFixed(0)}{' '}
                kr
                {/* {(item.TfareCustomer + item.FeeCustomer).toFixed(2)} kr */}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                {t('common:meeting_point')} :{' '}
              </Text>
              <Text style={[styles.text, {flex: 1}]}>{item.Address}</Text>
            </View>
            {/* <View style={styles.row}>
              <Text style={[styles.text, {fontFamily: fonts.bold, width: 100}]}>
                Translator Location :{' '}
              </Text>
              <Text style={[styles.text, {flex: 1}]}>
                {address.destination_addresses}
              </Text>
            </View> */}
          </View>
        )}
        {item.Remark !== null && (
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              {t('common:comment')} :{' '}
            </Text>
            <Text style={[styles.text, {flex: 1}]}>{item.Remark}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:translated_from')}:{' '}
          </Text>
          <Text style={styles.text}> Dansk</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            {t('common:translated_to')}:{' '}
          </Text>
          <Text style={styles.text}>{item.ToLanguageString}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setConfirm(false)}
          style={[styles.row, {marginTop: 20}]}>
          <Ionicons
            style={{marginEnd: 10}}
            name={'chevron-back'}
            size={20}
            color={colors.main}
          />
          <Text style={[styles.text, {fontFamily: fonts.medium}]}>
            {t('common:make') + ' ' + t('common:changes')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* the bottom butoon */}
      <View>
        {loading ? (
          <Indicator color={'#659ED6'} show={loading} size={'large'} />
        ) : (
          <View
            style={{
              marginTop: 10,
              justfifyContent: 'space-evenly',
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            {/* <View style={{width: '50%'}}>
              <Button
                bGcolor={'green'}
                buttonTitle={t('common:proceed')}
                onPress={() => {
                  navigation.navigate('OtherNav', {
                    screen: 'LandingPage',
                    params: {item: item, from: 2},
                  });
                }}
              />
            </View> */}

            <View style={{width: '50%'}}>
              <Button
                bGcolor={colors.main}
                buttonTitle={t('common:submit')}
                onPress={() => postToDB(item)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ConfimScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },

  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  checkRow: {
    flexDirection: 'row',
    marginTop: -20,
    alignItems: 'center',
  },

  dateRow: {
    marginStart: 15,
    margin: 10,
    flexDirection: 'row',
    alignContent: 'center',
  },
  wrapper: {
    paddingStart: 10,
    paddingEnd: 10,
    flex: 1,
  },
  row: {flexDirection: 'row', marginBottom: 10},
});
