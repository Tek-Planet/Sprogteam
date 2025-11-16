import React, {useState} from 'react';
import SPACING from './SPACING';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fonts} from '../assets/fonts';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';

type Props = NativeStackScreenProps<AuthStackParams>;

const HeaderIcon = ({navigation}: Props) => {
  const [inputText, setInputText] = useState<string>('');
  const handleInputChange = (text: string) => {
    setInputText(text);
  };
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: SPACING,
      }}>
      <TouchableOpacity>
        <MaterialCommunityIcons name="text" size={30} color={colors.black} />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          color: colors.black,
          fontFamily: fonts.medium,
        }}>
        {t('common:Order') + '  ' + t('common:interpreter')}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity>
          <AntDesign
            name="message1"
            size={26}
            color={colors.black}
            style={{marginTop: 2, marginRight: SPACING}}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="bell-badge-outline"
            size={32}
            color={colors.black}
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
      marginVertical: 8,
      flexDirection: 'row',
      width: '100%',
      borderWidth: 1,
      borderRadius: SPACING * 9,
      borderColor: 'grey',
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

export default HeaderIcon;
