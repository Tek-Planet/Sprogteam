import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {fonts} from '../assets/fonts';

interface CustomErrorProps {
  message: string;
}

const CustomError = (props: CustomErrorProps) => {
  const {message} = props;

  return (
    <View
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
      <Text style={{fontFamily: fonts.bold, color: 'red', textAlign:"center"}}>{message}</Text>
    </View>
  );
};

export default CustomError;

const styles = StyleSheet.create({
  container: {},
});
