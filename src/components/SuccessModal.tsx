import React, {useEffect} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';

import {fontSize, fonts} from '../assets/fonts';
import {check} from '../assets/images';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';

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
    const delay = 1500; // 5 seconds in milliseconds

    const timeoutId = setTimeout(() => {
      closeModal();
    }, delay);
    // Clear the timeout if the component unmounts to prevent memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Modal
      visible={modalVisible}
      modalAnimation={
        new ScaleAnimation({
          // initialValue: 1,
          useNativeDriver: true,
        })
      }
      // modalTitle={<ModalTitle title={props.title} />}
      onTouchOutside={() => {
        setModalVisible(false);
      }}>
      <ModalContent
        style={{
          width: width * 0.9,
          maxHeight: height * 0.9,
        }}>
        <View style={{position: 'relative'}}>
          <Image style={styles.image} source={check} />

          <View>
            <Text
              style={{
                opacity: 0.6,
                fontFamily: fonts.regular,
                marginBottom: spacing.fiften,
                color: colors.black,
                fontSize: fontSize.regular,
                textAlign: 'center',
              }}>
              {message}
            </Text>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
}

export default SuccessModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    profileText: {
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      color: colors.black,
      marginStart: spacing.twenty,
    },
    iconBg: {
      height: 45,
      width: 45,
      backgroundColor: colors.ash,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
      height: 100,
      width: 100,
    },
  });
