import React, {useContext} from 'react';

import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

import Button from './Button';
import {useTranslation} from 'react-i18next';
import {isCustomer, timeToString} from '../util/util';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthProvider';
import {colors} from '../assets/colors';
import {fonts} from '../assets/fonts';

const Agenda = ({item, navigation}) => {
  const {user} = useContext(AuthContext);
  const {t} = useTranslation();

  const startTime = timeToString(item.DateTimeStart);

  const endTime = timeToString(item.DateTimeEnd);

  return (
    <View
      key={item.Id}
      style={{
        margin: 5,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 10,
      }}>
      {/* top */}
      <View style={{}}>
        <Text style={[styles.text, {color: colors.green}]}>
          BookingID: {item.BookingID}
        </Text>
      </View>

      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={styles.row}>
          <Ionicons name={'watch'} size={16} color={colors.black} />
          <Text style={styles.text}>
            {startTime.time} - {endTime.time}
          </Text>
        </View>
        <View style={styles.row}>
          <Ionicons name={'calendar'} size={16} color={colors.black} />
          <Text style={styles.text}>{startTime.date}</Text>
        </View>
      </View>

      {!isCustomer(user) && (
        <TouchableOpacity
          onPress={() => navigation.navigate('FeedBack', {item: item})}
          style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.row}>
            <Text style={styles.text}>Send Feed Back</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name={'chevron-forward'} size={20} color={colors.black} />
          </View>
        </TouchableOpacity>
      )}

      <Text style={styles.text}>{item.BookingDetails}</Text>
      <View style={{alignItems: 'center'}}>
        <Button
          onPress={() =>
            navigation.navigate('OtherNav', {
              screen: 'BookingDetails',
              params: {item: item},
            })
          }
          bGcolor={'#659ED6'}
          buttonTitle={t('common:details')}
        />
      </View>
    </View>
  );
};

export default Agenda;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: fonts.medium,
    textAlign: 'justify',
    margin: 5,
    color: colors.black,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
});
