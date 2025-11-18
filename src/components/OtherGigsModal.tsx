import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';

import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
import {GigType, SelectOptionType} from '../types';
import {spacing} from '../assets/spacing';
import {getCurrencies, width, height} from '../utils';
import {useTranslation} from 'react-i18next';
import {logo} from '../assets/images';

interface OtherGigsModalProps {
  value: GigType;
  setValue: (val: GigType) => void;
  label?: string;
  data: GigType[];
}

function OtherGigsModal(props: OtherGigsModalProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();
  const styles = getStyles();

  return (
    <View>
      {props.label && <Text style={styles.label}>{props.label}</Text>}

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.dropdownTrigger}>
          <View style={styles.dropdownContent}>
            <Text style={styles.selectedText}>{t('common:select')}</Text>
          </View>
          <Fontisto name={'caret-down'} size={14} color={colors.lightGray} />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <SafeAreaView style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeIcon}>
                <Ionicon name="close" color="#585C5F" size={25} />
              </Pressable>

              <ScrollView>
                {props.data.map((item, index) => {
                  const currency: SelectOptionType =
                    getCurrencies()[item.CurrencyId - 1];

                  return (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => {
                        props.setValue(item);
                        setModalVisible(false);
                      }}
                      style={styles.optionRow}>
                      <Image
                        resizeMode="contain"
                        style={styles.image}
                        source={item?.imgOne ? {uri: item?.imgOne} : logo}
                      />
                      <View style={{flex: 1}}>
                        <Text style={styles.optionTitle}>{item.title}</Text>
                        <View style={styles.priceRow}>
                          <Text style={styles.priceLabel}>
                            {t('common:price')}:{' '}
                          </Text>
                          <Text style={styles.priceValue}>
                            {currency.label + ' '}
                            {item.ActualCost}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </View>
  );
}

export default OtherGigsModal;

const getStyles = () =>
  StyleSheet.create({
    label: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      paddingHorizontal: spacing.five,
    },
    dropdownContainer: {
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 30,
      borderColor: colors.lightGray,
    },
    dropdownTrigger: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
    },
    dropdownContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedText: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      opacity: 0.8,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      width: width,
      maxHeight: height * 0.85,
      backgroundColor: 'white',
      padding: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    closeIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
    },
    optionRow: {
      flexDirection: 'row',
      margin: 5,
      alignItems: 'center',
      marginTop: spacing.fiften,
    },
    image: {
      height: 70,
      width: 70,
      marginRight: spacing.ten,
    },
    optionTitle: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      paddingHorizontal: spacing.five,
    },
    priceRow: {
      flexDirection: 'row',
    },
    priceLabel: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      paddingHorizontal: spacing.five,
    },
    priceValue: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      paddingHorizontal: spacing.five,
    },
  });
