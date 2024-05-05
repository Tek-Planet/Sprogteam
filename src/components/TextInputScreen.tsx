import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SPACING from './SPACING';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '../assets/colors';
import {spacing} from '../assets/spacing';

const TextInputScreen = () => {
  const styles = getStyles(colors);
  const {t} = useTranslation();
  // const {colors} = useTheme();

  return (
    <View>
      <View style={styles.View}>
        <TextInput
          placeholder={t('commonfontLanguage')}
          autoCapitalize="none"
          placeholderTextColor={colors.black}
          style={[styles.textInput]}
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
      <View style={styles.View}>
        <TextInput
          placeholder={t('commonfont08/20/2023')}
          autoCapitalize="none"
          placeholderTextColor={colors.black}
          style={[styles.textInput]}
        />
        <TouchableOpacity>
          <Feather
            name="calendar"
            size={20}
            color={colors.black}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.View}>
        <TextInput
          placeholder={t('commonfontPostnumber')}
          autoCapitalize="none"
          placeholderTextColor={colors.black}
          style={[styles.textInput]}
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

const getStyles = () =>
  StyleSheet.create({
    containerfont: {
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
      padding: spacing.fiften,
      // fontSize: fontSize.light,
      fontWeight: '500',
      color: '#05375a',
    },
    View: {
      marginVertical: spacing.ten,
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
    leftIcon: {
      marginLeft: SPACING * 2.5,
      marginTop: SPACING * 2,
    },
    displayText: {
      fontSize: 18,
    },
  });

export default TextInputScreen;
