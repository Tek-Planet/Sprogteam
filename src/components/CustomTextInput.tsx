import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';

interface CustomTextInputProps {
  isSecure?: boolean;
  height?: number;
  showleftIcon?: boolean;
  showRightIcon?: boolean;
  editable?: boolean;
  placeholder?: string;
  onTextChange: Function;
  leftIconName?: string;
  upIconName?: string;
  showUpIcon?: boolean;
  rightIconName?: string;
  value?: string;
  onEnterPress?: Function;
  label?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  isSecure,
  height,
  placeholder,
  onTextChange,
  showUpIcon,
  upIconName,
  showRightIcon,
  rightIconName,
  showleftIcon,
  onEnterPress,
  leftIconName,
  value,
  label,
  ...rest
}) => {
  const [secure, setSecure] = useState(isSecure);

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
      <View
        style={[
          styles.sectionStyle,
          {
            height: height ? height : 56,
            borderColor: value === 'error' ? colors.red : colors.lightGray,
          },
        ]}>
        {showleftIcon && (
          <Feather
            name={leftIconName + ''}
            size={20}
            style={styles.iconStyle}
            color={colors.black}
          />
        )}

        <TextInput
          {...rest}
          style={[
            {
              flex: 1,
              padding: spacing.five,
              textAlignVertical: height ? 'top' : 'center',
              fontSize: fontSize.light,
              color: colors.black,
              fontFamily: fonts.medium,
              height: height ? height : 55,
            },
          ]}
          multiline={height ? true : false}
          numberOfLines={3}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={val => onTextChange(val)}
          placeholder={placeholder}
          secureTextEntry={secure}
          placeholderTextColor={colors.lightGray}
          value={value === 'error' ? '' : value}
          onSubmitEditing={() => {
            if (onEnterPress) onEnterPress();
          }}
        />

        {isSecure && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            {secure ? (
              <Feather
                name="eye-off"
                size={20}
                color={colors.lightGray}
                style={styles.iconStyle}
              />
            ) : (
              <Feather
                name="eye"
                size={20}
                color={colors.lightGray}
                style={styles.iconStyle}
              />
            )}
          </TouchableOpacity>
        )}

        {showRightIcon && (
          <Feather
            name={rightIconName + ''}
            size={20}
            style={styles.iconStyle}
            color={colors.lightGray}
          />
        )}
      </View>
      {value === 'error' && (
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
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    borderRadius: 30,
    marginVertical: spacing.ten,

    // height: spacing.fiften,
  },

  iconStyle: {
    margin: 5,
  },
});
