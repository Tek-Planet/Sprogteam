import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SPACING from './SPACING';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import baseStyles from '../../assets/styles';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {colors} from '../assets/colors';
import {spacing} from '../assets/spacing';

const TimeScreen: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const handleInputChange = (text: string) => {
    setInputText(text);
  };
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View>
      <View style={styles.View}>
        <TextInput
          placeholder={t('common:12.00AM')}
          autoCapitalize="none"
          placeholderTextColor={colors.black}
          style={[styles.textInput]}
        />
        <TouchableOpacity>
          <Feather
            name="clock"
            size={20}
            color={colors.black}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.View}>
        <TextInput
          placeholder={t('common:12.00AM')}
          autoCapitalize="none"
          placeholderTextColor={colors.black}
          style={[styles.textInput]}
        />
        <TouchableOpacity>
          <Feather
            name="clock"
            size={20}
            color={colors.black}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 8,
      // marginBottom: 20,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'android' ? 0 : -12,
      padding: SPACING * 1.8,
      fontSize: 17,
      fontWeight: '500',
      color: '#05375a',
    },
    View: {
      marginVertical: spacing.fiften,
      flexDirection: 'row',
      width: '100%',
      borderWidth: 1,
      borderRadius: SPACING * 9,
      height: spacing.twenty * 2.8,
      borderColor: '#BBBBBB',
    },
    rightIcon: {
      marginRight: SPACING * 2,
      marginTop: SPACING * 2,
    },
    leftIcon: {
      marginLeft: SPACING * 2.5,
      marginTop: SPACING * 2,
    },
    displayText: {
      fontSize: 18,
    },
  });

export default TimeScreen;
