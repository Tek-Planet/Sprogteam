import React, {Component} from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fonts} from '../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {isIpad} from '../util/util';
import {colors} from '../assets/colors';

const ProfileHeader = props => {
  const {name, filter, showSearchBar, placeholder, onsubmit, setValue} = props;
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 10,
        paddingEnd: 10,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <AntDesign
          name={'back'}
          size={26}
          color={'#000'}
          style={{padding: 5}}
        />
      </TouchableOpacity>

      {showSearchBar && (
        <View
          style={{
            flex: 1,
            borderRadius: 10,
            backgroundColor: '#EDF0F9',
            marginTop: 5,
            marginBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
            marginStart: 5,
            marginEnd: 5,
            paddingStart: 10,
          }}>
          <Ionicons name={'search'} color="#585C5F" size={25} />
          <TextInput
            value={filter}
            onChangeText={val => setValue(val)}
            onSubmitEditing={() => {
              onsubmit && onsubmit();
            }}
            style={{
              flex: 1,
              height: isIpad ? 50 : 40,
              borderColor: '#adb5bd',
              color: '#000',
              fontFamily: fonts.light,
              fontSize: 15,
              padding: 5,
              margin: 5,
            }}
            placeholderTextColor="#adb5bd"
            placeholder={placeholder}
          />
        </View>
      )}

      <Text
        style={{
          fontSize: 16,
          fontFamily: fonts.medium,
          marginStart: 15,
          color: colors.black,
        }}>
        {name}
      </Text>
    </View>
  );
};

export default ProfileHeader;
