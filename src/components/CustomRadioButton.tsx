import * as React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import {CustomInput} from '.';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {colorTypes} from '../assets/colors';
import {TabItem} from '../types';
import {spacing} from '../assets/spacing';
import {width} from '../utils';
import {fontSize, fonts} from '../assets/fonts';
import Ion from 'react-native-vector-icons/Ionicons';

interface CustomRadioButtonProps {
  options: TabItem[];
  selected: any;
  setSelected: (item: any) => void;
  label?: string;
}

const CustomRadioButton = (props: CustomRadioButtonProps) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const {options, selected, setSelected, label} = props;

  const styles = getStyles(colors);
  return (
    <View>
      {label && (
        <Text
          style={{
            fontFamily: fonts.medium,
            color: colors.black,
            fontSize: 16,
            paddingHorizontal: spacing.five,
            marginTop: spacing.ten,
          }}>
          {label}
        </Text>
      )}
      <View style={styles.container}>
        {options.map((item, index) => (
          <Pressable
            onPress={() => {
              if (item?.value !== selected?.value) setSelected(item);
              else setSelected({});
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: spacing.ten,
              marginEnd: spacing.ten - 2,
            }}
            key={index.toString()}>
            <Ion
              name={
                item?.title === selected?.title
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={25}
              style={{marginEnd: spacing.ten}}
              color={
                item?.title === selected?.title ? colors.main : colors.lightGray
              }
            />

            <Text
              style={{
                ...styles.headerRowText,
                color:
                  item?.title === selected?.title ? colors.main : colors.black,
              }}>
              {item?.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default CustomRadioButton;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },

    headerRowText: {
      fontSize: fontSize.light,
      fontFamily: fonts.medium,
      textAlign: 'center',
    },
  });
