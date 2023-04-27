import React, {Component} from 'react';
import {View, Text} from 'react-native';
import TitleHeader from '../components/TitleHeader';
import Body from '../components/Body';
import dayjs from 'dayjs';

const NewsDetaislScreen = ({navigation, route}) => {
  const {info} = route.params;

  return (
    <View style={{marginStart: 5, marginEnd: 5}}>
      <Text
        style={{
          fontFamily: 'Montserrat-Medium',
          margin: 10,
          marginStart: 5,
          marginEnd: 5,
          textAlign: 'justify',
          fontSize: 16,
        }}>
        {info.Heading}
      </Text>
      <Text
        style={{
          fontFamily: 'Montserrat-Medium',
          marginStart: 5,
          marginEnd: 5,
          textAlign: 'justify',
        }}>
        {dayjs(info.createdAt).format('YYYY-MM-DD HH:mm A')}
      </Text>
      <Body body={info.Body} />
    </View>
  );
};

export default NewsDetaislScreen;
