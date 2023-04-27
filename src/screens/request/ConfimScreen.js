import React from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';

import dayjs from 'dayjs';
import Button from '../../components/Button';
import Indicator from '../../components/ActivityIndicator';

import {fonts} from '../../assets/fonts';
import {getTaskName, timeToString} from '../../util/util';

const ConfimScreen = props => {
  const {loading, setConfirm, postToDB, item} = props;

  const taskTypeId = item.TaskTypeId;

  const startTime = timeToString(item.DateTimeStart);

  const endTime = timeToString(item.DateTimeEnd);

  return (
    <View style={{justifyContent: 'space-between', flex: 1}}>
      <ScrollView>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            textAlign: 'center',
            fontFamily: fonts.bold,
          }}>
          Ordreoversigt
        </Text>
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            Booking Type :{' '}
          </Text>
          <Text style={styles.text}>{getTaskName(taskTypeId)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            Startdato :{' '}
          </Text>
          <Text style={styles.text}>
            {startTime.date + ' ' + startTime.time}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            Slutdato :{' '}
          </Text>
          <Text style={styles.text}>{endTime.date + ' ' + endTime.time}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            Duration :{' '}
          </Text>
          <Text style={styles.text}>{item.Duration}</Text>
        </View>

        {item.Remark.length > 0 && (
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              Detaljer :{' '}
            </Text>
            <Text style={[styles.text, {flex: 1}]}>{item.Remark}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            Oversat fra:{' '}
          </Text>
          <Text style={styles.text}> Dansk</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.text, {fontFamily: fonts.bold}]}>
            Oversat til:{' '}
          </Text>
          <Text style={styles.text}>{item.ToLanguageString}</Text>
        </View>

        {taskTypeId === 1 && (
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              Address:{' '}
            </Text>
            <Text style={styles.text}>{item.Address}</Text>
          </View>
        )}
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
            }}>
            <View style={{width: '50%'}}>
              <Button
                bGcolor={'red'}
                buttonTitle={'Tilbage'}
                onPress={() => setConfirm(false)}
              />
            </View>
            <View style={{width: '50%'}}>
              <Button
                bGcolor={'green'}
                buttonTitle={'Bekræft'}
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
