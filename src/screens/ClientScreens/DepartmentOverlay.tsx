import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../../assets/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {colorTypes} from '../../assets/colors';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import SPACING from '../../components/SPACING';
import {spacing} from '../../assets/spacing';
import {fontSize} from '../../assets/fonts';
import DepartmentOverlayInput from '../../components/DepartmentOverlayInput';

type Props = NativeStackScreenProps<AuthStackParams>;

const DepartmentOverlay = ({navigation}: Props) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const styles = getStyles(colors);

  return (
    <ScrollView>
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="close"
              color="#2260A6"
              size={30}
              style={{
                marginLeft: spacing.fiften * 19,
                marginTop: spacing.ten,
              }}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            {t('common:Order') +
              ' ' +
              t('common:written') +
              ' ' +
              t('common:translation')}
          </Text>
          <DepartmentOverlayInput />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HandBook')}>
            <Text style={styles.buttonText}>{t('common:Create')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DepartmentOverlay;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertBox: {
      width: 330,
      marginVertical: spacing.fiften,
      backgroundColor: 'white',
      borderRadius: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: fontSize.bold,
      maxWidth: '90%',
      fontWeight: 'bold',
      color: colors.black,
      marginBottom: 15,
      alignSelf: 'center',
    },
    button: {
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#2260A6',
      padding: 10,
      borderRadius: SPACING * 6,
      width: '80%',
      height: spacing.fiften * 4.3,
      marginVertical: SPACING * 2.5,
    },
    buttonText: {
      color: '#fff',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
  });
