import React, {Component} from 'react';
import {View, TouchableOpacity, Dimensions, Image, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
const {width, height} = Dimensions.get('screen');

const KycList = props => {
  const {customer, item} = props;
  const {documentID, status, url, service} = item;

  // console.log(item?.package[0]?.price);

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (customer) {
          navigation.navigate('OtherNav', {
            screen: 'ViewGiG',
            params: {
              item: item,
            },
          });
        } else navigation.navigate('GigDetails', {item: item});
      }}
      style={{
        margin: 5,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        backgroundColor: '#fff',
      }}>
      <Image
        style={{
          height: 100,
          width: 140,
          marginEnd: 20,
        }}
        source={{
          uri: url,
        }}
      />
      <View style={{flex: 1}}>
        <Text
          style={{
            marginTop: 10,
            fontFamily: fonts.bold,
            fontSize: 15,
            color: colors.black,
          }}>
          {documentID}
        </Text>

        <View
          style={{
            flexDirection: 'row-reverse',
            flex: 1,
            alignItems: 'center',
            padding: 10,
          }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 16,
            }}>
            {status}
          </Text>

          <Text
            style={{
              fontFamily: fonts.medium,
              marginEnd: 10,
            }}>
            Status
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default KycList;
