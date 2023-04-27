import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';

import {fonts} from '../assets/fonts';

import Feather from 'react-native-vector-icons/Ionicons';
import {colors} from '../assets/colors';

const CustoTextInput = ({name, height, image, mb, placeholder, ...rest}) => {
  const [secure, setSecure] = useState(true);

  return (
    <View>
      <View style={[styles.sectionStyle, {marginBottom: mb ? mb : 15}]}>
        {name && (
          <Feather
            name={name}
            size={20}
            color={'#659ED6'}
            style={styles.iconStyle}
          />
        )}
        {name === 'lock-closed' ? (
          <TextInput
            {...rest}
            style={{
              flex: 1,
              padding: 5,
              fontSize: 15,
              color: colors.black,
              fontFamily: fonts.medium,
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
              textAlignVertical: height ? 'top' : 'center',
              fontSize: 15,
              color: colors.black,
              fontFamily: fonts.medium,
            }}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        )}
        {name === 'lock-closed' && (
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

export default CustoTextInput;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,

    // height: 40,
    borderColor: colors.main,
  },
  iconStyle: {
    margin: 5,
  },
  image: {
    margin: 5,
    height: 20,
    width: 20,
  },
});
