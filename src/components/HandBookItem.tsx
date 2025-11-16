import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {useTheme} from '@react-navigation/native';

import {spacing} from '../assets/spacing';
import {colorTypes} from '../assets/colors';
import {fonts, fontSize} from '../assets/fonts';
import {SelectOptionType} from '../types';
import {width} from '../utils';

interface Props {
  item: SelectOptionType;
}

const HandBookInput = ({item}: Props) => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          // onPress()
          setShowDetails(!showDetails)
        }
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: spacing.ten,
          marginVertical: spacing.ten,
          flex: 1,
        }}>
        <Text
          style={{
            color: colors.black,
            fontFamily: fonts.medium,
            fontSize: fontSize.light,
            width: width * 0.8,
          }}>
          {item.label}
        </Text>

        <Feather
          name={showDetails ? 'chevron-down' : 'chevron-right'}
          size={20}
          color={colors.black}
        />
      </Pressable>
      {showDetails && (
        <View style={{}}>
          <View style={{borderWidth: 0.5, borderColor: colors.lightGray}} />
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.light,
              fontSize: fontSize.intermediate,
              padding: spacing.ten,
              textAlign: 'justify',
            }}>
            {item.value}
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: spacing.ten * 3,
      marginBottom: spacing.ten,
    },
  });

export default HandBookInput;
