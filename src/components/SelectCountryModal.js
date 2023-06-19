import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
import {Icon} from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: colors.main,
    marginBottom: 15,
    justifyContent: 'center',
    flex: 1,
  },
});

export default function SelectCountryModal(props) {
  const {setCountry, country, showFLag, visible, setCountryCallingCode, code} =
    props;

  const [countryCode, setCountryCode] = useState(
    code.length === 0 ? code : 'DK',
  );
  const [withCountryNameButton, setWithCountryNameButton] = useState(true);
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
          style={{fontFamily: fonts.medium, fontSize: 16, color: colors.black}}>
          Country
        </Text>
        <Icon
          type={'fontisto'}
          name={'caret-down'}
          size={14}
          color={'#659ED6'}
        />
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity onPress={() => {}} style={[styles.container, {flex: 1}]}>
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
      {/* Other content */}
      <View style={{position: 'absolute', right: 10, zIndex: -10}}>
        <Icon
          type={'fontisto'}
          name={'caret-down'}
          size={14}
          color={'#659ED6'}
        />
      </View>
    </TouchableOpacity>
  );
}
