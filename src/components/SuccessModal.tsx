import React, {useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {fontSize, fonts} from '../assets/fonts';
import {check} from '../assets/images';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {height, width} from '../utils';

interface SuccessModalProps {
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  message: string;
  closeModal: () => void;
}

function SuccessModal(props: SuccessModalProps) {
  const {modalVisible, setModalVisible, message, closeModal} = props;
  const {colors} = useTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    if (modalVisible) {
      const timeoutId = setTimeout(() => {
        closeModal();
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [modalVisible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Image style={styles.image} source={check} />
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default SuccessModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
      width: width * 0.9,
      maxHeight: height * 0.9,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    image: {
      marginBottom: spacing.twenty * 2,
      height: 100,
      width: 100,
      alignSelf: 'center',
    },
    message: {
      opacity: 0.6,
      fontFamily: fonts.regular,
      marginBottom: spacing.fiften,
      color: colors.black,
      fontSize: fontSize.regular,
      textAlign: 'center',
    },
  });
