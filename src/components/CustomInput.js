import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

import {fonts} from '../assets/fonts';

import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../assets/colors';

const CustomInput = ({name, image, placeholder, ...rest}) => {
  const [secure, setSecure] = useState(true);

  return (
    <View>
      {placeholder && <Text style={styles.placeholder}>{placeholder}</Text>}
      <View style={styles.sectionStyle}>
        {name && (
          <Feather
            name={name}
            size={20}
            color={'#659ED6'}
            style={styles.iconStyle}
          />
        )}
        {name === 'lock' ? (
          <TextInput
            {...rest}
            style={{
              flex: 1,
              padding: 10,
              fontSize: 15,
              color: '#000',
              fontFamily: font.medium,
            }}
            secureTextEntry={secure}
            underlineColorAndroid="transparent"
          />
        ) : (
          <TextInput
            {...rest}
            style={{
              flex: 1,
              padding: 5,
              margin: 5,
              fontSize: 15,
              color: '#000',
              fontFamily: fonts.medium,
            }}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        )}
        {name && name === 'lock' && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            {secure ? (
              <Feather
                name="eye-off"
                size={20}
                color="#999"
                style={styles.iconStyle}
              />
            ) : (
              <Feather
                name="eye"
                size={20}
                color="#999"
                style={styles.iconStyle}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
    // height: 40,
    borderColor: '#659ED6',
  },
  iconStyle: {
    margin: 5,
  },
  image: {
    margin: 5,
    height: 20,
    width: 20,
  },
  placeholder: {
    marginVertical: 10,
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
