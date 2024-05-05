import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SPACING from './SPACING';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {flag} from '../assets/images';
import baseStyles from '../../assets/styles';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {colors} from '../assets/colors';
import {spacing} from '../assets/spacing';

const FlagScreen: React.FC = () => {
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
        <Image source={flag} style={styles.Image} />
        <TextInput
          placeholder={t('common:USA')}
          autoCapitalize="none"
          placeholderTextColor={colors.black}
          style={styles.textInput}
        />
        <TouchableOpacity>
          <Feather
            name="chevron-down"
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
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'android' ? 0 : -12,
      padding: spacing.fiften,
      fontSize: 17,
      fontWeight: '500',
      color: '#05375a',
    },
    Image: {
      width: 30,
      height: 20,
      marginTop: SPACING * 1.8,
      marginLeft: SPACING * 2.5,
      borderRadius: 3,
    },
    View: {
      marginVertical: 8,
      flexDirection: 'row',
      height: spacing.twenty * 2.8,
      width: '100%',
      borderWidth: 1,
      borderRadius: SPACING * 9,
      borderColor: '#BBBBBB',
    },
    rightIcon: {
      marginRight: SPACING * 2,
      marginTop: SPACING * 2,
    },
  });

export default FlagScreen;
