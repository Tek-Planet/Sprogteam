import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface ButtonIconProps {}

const ButtonIcon = (props: ButtonIconProps) => {
  return (
    <View style={styles.container}>
      <Text>ButtonIcon</Text>
    </View>
  );
};

export default ButtonIcon;

const styles = StyleSheet.create({
  container: {},
});
