import * as React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

interface CustomActivityIndicatorProps {
  show: boolean;
  color: string;
  size: number | 'small' | 'large';
}

const CustomActivityIndicator = (props: CustomActivityIndicatorProps) => {
  const {show, color, size} = props;
  return <View>{show && <ActivityIndicator color={color} size={size} />}</View>;
};

export default CustomActivityIndicator;

const styles = StyleSheet.create({
  container: {},
});
