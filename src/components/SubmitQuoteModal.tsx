import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {height, width} from '../utils';
import {CustomButton, CustomError, FilePickerModal} from '.';

interface SubmitQuoteModalProps {
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  closeModal: () => void;
  onSubmit: (val: any) => void;
}

function SubmitQuoteModal(props: SubmitQuoteModalProps) {
  const {t} = useTranslation();
  const {modalVisible, setModalVisible, onSubmit} = props;
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [erroMessage, setErrorMessage] = useState<string>('');

  const onFileSelected = async (imageFile: any) => {
    setSelectedFile(imageFile);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <FilePickerModal
              choosenFile={selectedFile}
              onFileSelected={onFileSelected}
            />
            {erroMessage !== '' && <CustomError message={erroMessage} />}
            <CustomButton
              buttonTitle={t('common:done')}
              onTap={() => {
                if (selectedFile === null) {
                  setErrorMessage('select file to continue');
                  return;
                }
                setErrorMessage('');
                onSubmit(selectedFile);
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default SubmitQuoteModal;

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
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
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
