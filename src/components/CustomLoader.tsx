import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CustomActivityIndicator from './CustomActivityIndicator';
import {colors} from '../assets/colors';

interface CustomLoaderProps {
  color?: string;
}

const CustomLoader = (props: CustomLoaderProps) => {
  const {color} = props;
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        top: 60,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 8,
        }}>
        <CustomActivityIndicator
          show={true}
          size="large"
          color={color ? color : colors.main}
        />
      </View>
    </View>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  container: {},
});
