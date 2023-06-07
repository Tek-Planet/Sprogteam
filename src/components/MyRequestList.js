import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from './Button';
import dayjs from 'dayjs';
import axios from 'axios';
import {fonts} from '../assets/fonts';
import {getTaskName} from '../util/util';
import {updateBooking} from '../data/data';
import {AuthContext} from '../context/AuthProvider';

const MyRequestList = props => {
  const {getBookings, user} = useContext(AuthContext);
  const {item, index, navigation, users, request} = props;
  const [owner, setOwner] = useState(
    user && user !== null && user.profile.Id === item.CreateBy ? true : false,
  );

  // console.log(users);

  const address = item.Address;

  const updateBookingStatus = async (status, bookingId) => {
    await updateBooking(status, bookingId);

    if (status === 2) {
      const data = {
        InterpreterId: user.profile.Id,
        TaskId: item.TaskTypeId,
        BookingId: item.BookingID,
      };

      // console.log(data);

      await axios.post('/tasks', data, {timeout: 3000});

      await axios.put(`/orders/BellStatus/1/${bookingId}`);
    }

    if (status === 3) {
      // update a column
      const res = await axios.put(
        `/orders/InterpreterSalary/${item.InterpreterSalaryPending}/${bookingId}`,
      );
      console.log(res);
    }
    // console.log(res);
    await getBookings(user);
  };

  return (
    <View
      key={index}
      style={{
        margin: 5,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
      }}>
      {/* top */}
      <View style={{}}>
        <Text style={[styles.text, {color: 'green', fontFamily: fonts.bold}]}>
          BookingID: {item.BookingID}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>Status: </Text>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>
          {request.Status}{' '}
        </Text>
        {/* <Text
          style={[
            styles.text,
            {
              color:
                item.StatusName === 1 ||
                item.StatusName === 4 ||
                item.StatusName === 5 ||
                item.StatusName === 6 ||
                item.StatusName === 7 ||
                item.StatusName === 8 ||
                item.StatusName === 9
                  ? 'red'
                  : 'green',
            },
          ]}>
          {getStatusName(item.StatusName)}
        </Text> */}
      </View>

      {owner ? (
        // customer price section
        <View>
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>Fee: </Text>
            <Text style={styles.text}>{item.PricesCustomer} kr</Text>
          </View>
          {item.TaskTypeId === 1 && (
            <View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  Transportgebyr :
                </Text>
                <Text style={styles.text}>{item.TfareCustomer} kr</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  Totalbeløb :
                </Text>
                <Text style={styles.text}>
                  {(item.TfareCustomer + item.PricesCustomer).toFixed(0)} kr
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        // translator price section
        <View>
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>Fee :</Text>
            <Text style={styles.text}>Fee : {item.InterpreterSalary} kr</Text>
          </View>
          {item.TaskTypeId === 1 && (
            <View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  Transportgebyr :
                </Text>
                <Text style={styles.text}>{item.Tfare} kr</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  Totalbeløb :
                </Text>
                <Text style={styles.text}>
                  {(item.Tfare + item.InterpreterSalary).toFixed(0)} kr
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  Adresse:{' '}
                </Text>
                <Text style={[styles.text, {flex: 1}]}>{address}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: fonts.bold}]}>
                  Afstand:{' '}
                </Text>

                <Text style={styles.text}>
                  {parseInt(item.kmTilTask)} km ({item.kmTilTask} hver vej 2)
                </Text>
              </View>
            </View>
          )}
          <View style={styles.row}>
            <Text style={[styles.text, {fontFamily: fonts.bold}]}>
              {item.BookingForSelf ? 'Kunde' : 'borger'} :
            </Text>
            <Text style={styles.text}> {item.CitizenName}</Text>
          </View>
        </View>
      )}
      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>Task Type :</Text>
        <Text style={styles.text}>{getTaskName(item.TaskTypeId)}</Text>
      </View>

      {/* <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>Startdato :</Text>
        <Text style={styles.text}>
          {dayjs(item.DateTimeStart).format('DD-MM-YYYY HH:mm')}
        </Text>
      </View> */}
      <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>Slutdato :</Text>
        <Text style={styles.text}>
          {dayjs(item.DateTimeEnd).format('DD-MM-YYYY HH:mm')}
        </Text>
      </View>

      {/* <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>Response :</Text>
        <Text style={styles.text}>({users.length})</Text>
        <Ionicons
          onPress={() =>
            navigation.navigate('RequestNav', {
              screen: 'AppliedUsers',
              params: {
                users: users,
                info: item,
              },
            })
          }
          name="chevron-forward-outline"
          color="#000"
          size={20}
          style={{alignSelf: 'center', position: 'absolute', right: 5}}
        />
      </View> */}
      {/* <View style={styles.row}>
        <Text style={[styles.text, {fontFamily: fonts.bold}]}>Detaljer :</Text>
        <Text style={[styles.text, {flex: 1}]}>
          {item.Remark !== null && item.Remark.length > 80
            ? item.Remark.substr(0, 60) + '...'
            : item.Remark}
        </Text>
      </View> */}
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <View style={{width: 100}}>
          <Button
            onPress={() =>
              navigation.navigate('OtherNav', {
                screen: 'BookingDetails',
                params: {item: item},
              })
            }
            bGcolor={'#659ED6'}
            // buttonTitle={'Detaljer'}
            buttonTitle={t('common:details')}
          />
        </View>

        {/* {owner && item.StatusName === 8 && (
          <View style={{width: 100}}>
            <Button
              onPress={() => updateBookingStatus(3, item.BookingID)}
              bGcolor={'green'}
              buttonTitle={'Accept'}
            />
          </View>
        )} */}

        {item.StatusName === 1 && !owner && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 100}}>
                <Button
                  onPress={() => updateBookingStatus(2, item.BookingID)}
                  bGcolor={'green'}
                  buttonTitle={'Accept'}
                />
              </View>

              <View style={{width: 100}}>
                <Button
                  onPress={() => updateBookingStatus(6, item.BookingID)}
                  bGcolor={'#800000'}
                  buttonTitle={'Afvist'}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyRequestList;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: fonts.medium,
    textAlign: 'justify',
    margin: 5,
  },
  row: {flexDirection: 'row'},
});
