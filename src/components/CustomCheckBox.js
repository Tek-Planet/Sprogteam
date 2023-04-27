import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {fonts} from '../assets/fonts';

import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../assets/colors';

const CustomCheckBox = props => {
  const {checked, setChecked, selector, placeholder, mp} = props;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: mp ? 0 : 15,
        marginStart: 10,
      }}>
      <TouchableOpacity
        onPress={() => {
          if (selector) {
            setChecked(selector, !checked);
          } else setChecked(!checked);
        }}
        style={{flexDirection: 'row', alignContent: 'center'}}>
        {checked ? (
          <Feather
            name={'check-circle'}
            size={25}
            color={'#659ED6'}
            style={styles.iconStyle}
          />
        ) : (
          <Feather
            name={'circle'}
            size={25}
            color={'#659ED6'}
            style={styles.iconStyle}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.placeholder}>{placeholder}</Text>
    </View>
  );
};

export default CustomCheckBox;

const styles = StyleSheet.create({
  placeholder: {
    fontSize: 16,
    fontFamily: fonts.medium,
    marginStart: 10,
    color: colors.black,
  },
  iconStyle: {},
});
