import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';

import {height, width} from '../utils';
import {CustomButton, CustomError, FilePickerModal} from '.';
import {useTranslation} from 'react-i18next';

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
  const [selectedFile, setselectedFile] = useState<any>(null);
  const [erroMessage, setErrorMessage] = useState<string>('');

  const onFileSelected = async (imageFile: any) => {
    setselectedFile(imageFile);
  };
  const styles = getStyles(colors);

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
        <View>
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
      </ModalContent>
    </Modal>
  );
}

export default SubmitQuoteModal;

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
