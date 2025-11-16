import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import  {
  CountryPicker
} from 'react-native-country-codes-picker'; // Make sure to import 'Country' type
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';

import Feather from 'react-native-vector-icons/Feather';
import {spacing} from '../assets/spacing';

interface SelectCountryModalProps {
  setCountry: (country: string) => void;
  country?: string;
  showFLags?: boolean;
  setCountryCallingCode?: (code: string) => void;
  code?: any;
}

export default function SelectCountryModal(props: SelectCountryModalProps) {
  const {
    setCountry,
    country,
    showFLags,

    setCountryCallingCode,
    code,
  } = props;

  const [countryCode, setCountryCode] = useState<any>(
    code ? code : 'DK',
  );
  const [withCountryNameButton, setWithCountryNameButton] = useState(true);
  const [withFlag, setWithFlag] = useState(true);
  const [withEmoji, setWithEmoji] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState(true);
  const [withCallingCode, setWithCallingCode] = useState(false);

  const [show, showPicker] = useState(showFLags ? true : false);

  const onSelect = (country: Country) => {
    setCountry(country.name + '');
    setCountryCode(country.cca2);
    setCountryCallingCode && setCountryCallingCode('+' + country.callingCode);
  };

  return !show ? (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          showPicker(true);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 16,
            color: colors.black,
          }}>
          {country}
        </Text>
        <Feather name={'chevron-down'} size={25} color={colors.lightGray} />
      </TouchableOpacity>

      {country === 'error' && (
        <Text
          style={{
            fontFamily: fonts.bold,
            color: colors.red,
            paddingHorizontal: spacing.five,
          }}>
          required
        </Text>
      )}
    </View>
  ) : (
    <></>
    // <TouchableOpacity
    //   onPress={() => {}}
    //   style={[styles.container, {}]} // Type assertion to fix the typing issue
    // >
    //   <CountryPicker
    //     countryCode={countryCode}
    //     withFilter={withFilter}
    //     withFlag={withFlag}
    //     withCountryNameButton={withCountryNameButton}
    //     withAlphaFilter={withAlphaFilter}
    //     withCallingCode={withCallingCode}
    //     withEmoji={withEmoji}
    //     onSelect={onSelect}
    //     visible={show}
    //   />
    //   {/* Other content */}
    //   <View style={{position: 'absolute', right: 10, zIndex: -10}}>
    //     <Feather name={'chevron-down'} size={25} color={colors.lightGray} />
    //   </View>
    // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: spacing.ten,
    borderRadius: 30,
    borderColor: colors.lightGray,
    marginVertical: spacing.ten,
    justifyContent: 'center',
  },
});
