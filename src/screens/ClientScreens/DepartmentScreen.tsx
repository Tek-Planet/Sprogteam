/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {fontSize, fonts} from '../../assets/fonts';
import SPACING from '../../components/SPACING';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import DepartmentsInput from '../../components/DepartmentsInput';

type Props = NativeStackScreenProps<AuthStackParams>;

const DepartmentScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  return (
    <ScrollView>
      <View style={{...styles.container, ...baseStyles.padding}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 4,
            marginTop: spacing.ten,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              name="chevron-left"
              size={24}
              color={colors.black}
              style={{marginTop: 4}}
            />
          </TouchableOpacity>
          <Text style={styles.Text}>{t('common:Departments')}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DepartmentOverlay')}>
              <MaterialIcons
                name="add-circle-outline"
                size={30}
                color={colors.black}
                style={{marginHorizontal: 4}}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign
                name="message1"
                size={26}
                color={colors.black}
                style={{marginTop: 2, marginHorizontal: 4}}
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
        <View style={{padding: spacing.ten}}>
          <View>
            <DepartmentsInput />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DepartmentScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#fff',
      padding: 10,
      borderColor: '#2260A6',
      borderWidth: 2,
      borderRadius: 30,
      width: '100%',
      height: spacing.fiften * 4.3,
      marginBottom: 10,
    },
    buttonText: {
      color: '#2260A6',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
    Text: {
      color: colors.black,
      marginLeft: SPACING,
      fontSize: 18,
      fontFamily: fonts.bold,
      alignSelf: 'center',
    },
  });
