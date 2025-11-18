import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {height, width} from '../utils';
import {CustomButton} from '.';

interface DeleteAccountModalProps {
  isModalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  title: string;
  question: string;
  cancelText: string;
  continueText: string;
  onContinue: () => void;
}

function DeleteAccountModal(props: DeleteAccountModalProps) {
  const {
    isModalVisible,
    setModalVisible,
    title,
    question,
    cancelText,
    continueText,
    onContinue,
  } = props;

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}>
              <Feather color={colors.main} name={'x-circle'} size={25} />
            </Pressable>

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.question}>{question}</Text>

            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <CustomButton
                  buttonTitle={cancelText}
                  textSize={fontSize.light}
                  onTap={() => setModalVisible(false)}
                  bGcolor={colors.white}
                  testColor={colors.main}
                  borderWidth={1}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <CustomButton
                  buttonTitle={continueText}
                  textSize={fontSize.light}
                  onTap={onContinue}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default DeleteAccountModal;

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
      padding: 20,
      paddingTop: 40,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeIcon: {
      position: 'absolute',
      right: 5,
      top: 5,
      zIndex: 10,
    },
    title: {
      fontFamily: fonts.medium,
      marginBottom: spacing.fiften,
      color: colors.black,
      fontSize: fontSize.regular,
      textAlign: 'center',
    },
    question: {
      opacity: 0.6,
      fontFamily: fonts.regular,
      marginBottom: spacing.fiften,
      color: colors.black,
      fontSize: fontSize.regular,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    buttonWrapper: {
      width: width * 0.3,
    },
  });
