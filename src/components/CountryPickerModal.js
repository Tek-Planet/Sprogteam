import React, {useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {country} from '../assets/icons';

const styles = StyleSheet.create({
  // ...
});

export default function CountryPickerModal(props) {
  const {setCountry, showFLag, visible, setCountryCallingCode, code} = props;

  const [countryCode, setCountryCode] = useState(
    code.length === 0 ? code : 'DK',
  );
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [withEmoji, setWithEmoji] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState(true);
  const [withCallingCode, setWithCallingCode] = useState(false);
  const [show, showPicker] = useState(showFLag ? true : false);

  const onSelect = country => {
    setCountry(country.name);
    setCountryCode(country.cca2);
    setCountryCallingCode && setCountryCallingCode('+' + country.callingCode);
  };
  return !show ? (
    <TouchableOpacity
      onPress={() => {
        showPicker(true);
      }}>
      <Image
        resizeMode="contain"
        style={{
          height: 25,
          width: 25,
          marginStart: 5,
        }}
        source={country}
      />
    </TouchableOpacity>
  ) : (
    <CountryPicker
      {...{
        countryCode,
        withFilter,
        withFlag,
        withCountryNameButton,
        withAlphaFilter,
        withCallingCode,
        withEmoji,
        onSelect,
      }}
      visible={show}
    />
  );
}
