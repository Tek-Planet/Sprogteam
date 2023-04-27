import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

// radio-btn-active
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextBox from './TextInput';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const ModalPicker = props => {
  const onPress = () => {
    props.changeModalVisibility(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.modal, {width: WIDTH - 20, height: HEIGHT / 1.5}]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <Text style={[styles.text, {fontSize: 16}]}>{props.title}</Text>
          <TouchableOpacity onPress={() => props.changeModalVisibility(false)}>
            <Ionicons name="close" color={'grey'} size={20} />
          </TouchableOpacity>
        </View>

        <View style={{paddingStart: 10, paddingEnd: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={props.info.image}
              style={{width: 70, height: 70, borderRadius: 100}}
            />
            <View style={{marginStart: 15, marginTop: 10}}>
              <Text style={{fontFamily: 'Montserrat-Bold'}}>TekPlanet</Text>
              <Text style={{fontFamily: 'Montserrat-Bold'}}>Male</Text>
            </View>
          </View>

          <TextInput
            multiline={true}
            numberOfLines={5}
            style={{
              textAlignVertical: 'top',
              borderColor: '#adb5bd',
              color: '#000',
              borderWidth: 1,
              fontSize: 16,
              padding: 5,
              margin: 5,
              borderRadius: 10,
            }}
            placeholder={'Booking Details'}
            placeholderTextColor="#adb5bd"
          />

          <View style={{marginStart: 15, marginTop: 10, flexDirection: 'row'}}>
            <Text style={{fontFamily: 'Montserrat-Bold'}}>Start Date: </Text>
            <Text style={{fontFamily: 'Montserrat-Bold'}}> 2020-12-01</Text>
          </View>

          <View style={{marginStart: 15, marginTop: 10, flexDirection: 'row'}}>
            <Text style={{fontFamily: 'Montserrat-Bold'}}>End Date: </Text>
            <Text style={{fontFamily: 'Montserrat-Bold'}}> 2020-12-01</Text>
          </View>

          <TouchableOpacity
          
            style={[
              styles.filterBox,
              {backgroundColor: '#659ED6', marginTop: 5},
            ]}>
            <Text style={[styles.filterText, {color: '#fff'}]}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  text: {
    margin: 20,
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },

  filterBox: {
    margin: 3,
    padding: 3,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    minWidth: 80,
  },
  filterText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ModalPicker;
