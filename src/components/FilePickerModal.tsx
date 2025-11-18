import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {
  chooseDocument,
  choosePhotoFromCamera,
  choosePhotoFromLibrary,
  height,
  width,
} from '../utils';
import baseStyles from '../assets/styles';

interface FilePickerModalProps {
  isProfile?: boolean;
  showCam?: boolean;
  closeModal?: () => void;
  onFileSelected: (val: any) => void;
  choosenFile?: any;
  label?: string;
}

function FilePickerModal(props: FilePickerModalProps) {
  const {closeModal, onFileSelected, isProfile, showCam, choosenFile, label} =
    props;

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const chooseImageFromPhotos = async () => {
    const selectedImage: any = await choosePhotoFromLibrary();

  
    if (selectedImage) {
      onFileSelected(selectedImage);
    }
    setModalVisible(false);
  };

  const chooseImageFromCamera = async () => {
    const selectedImage: any = await choosePhotoFromCamera();
    if (selectedImage) {
      onFileSelected(selectedImage);
    }
    setModalVisible(false);
  };

  const chooseFile = async () => {
    const selectedFile: any = await chooseDocument();
    if (selectedFile) {
      const file: any = {
        path: selectedFile.uri,
        filename: selectedFile.name,
      };
      onFileSelected(file);
    }
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.title}>
        {label ? label : t('common:upload') + ' ' + t('common:file')}
      </Text>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.trigger}>
        <Text style={[styles.title, {marginTop: 0}]}>
          {choosenFile
            ? choosenFile?.filename
            : t('common:select') + ' ' + t('common:file')}
        </Text>
        <Ionicon color={colors.lightGray} name={'attach-outline'} size={25} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalView}>
              <Pressable
                onPress={() => {
                  if (closeModal) closeModal();
                  else setModalVisible(false);
                }}
                style={styles.closeIcon}>
                <Feather color={colors.main} name={'close'} size={25} />
              </Pressable>

              <Text style={styles.subtitle}>
                {t('common:file') + ' ' + t('common:picker')}
              </Text>

              <View style={styles.iconRow}>
                {showCam && (
                  <Pressable
                    onPress={chooseImageFromCamera}
                    style={[baseStyles.elevation, styles.iconBg]}>
                    <Feather color={'#266EF1'} name={'photo-camera'} size={40} />
                  </Pressable>
                )}
                <Pressable
                  onPress={chooseImageFromPhotos}
                  style={[baseStyles.elevation, styles.iconBg]}>
                  <Feather color={'#266EF1'} name={'photo-library'} size={40} />
                </Pressable>
                {!isProfile && (
                  <Pressable
                    onPress={chooseFile}
                    style={[baseStyles.elevation, styles.iconBg]}>
                    <Feather color={'#266EF1'} name={'folder'} size={40} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default FilePickerModal;

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
    subtitle: {
      opacity: 0.6,
      fontFamily: fonts.regular,
      marginBottom: spacing.fiften,
      color: colors.black,
      fontSize: fontSize.regular,
      textAlign: 'center',
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.ten,
      gap: spacing.fiften,
    },
    iconBg: {
      height: 60,
      width: 60,
      backgroundColor: colors.white,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.black,
      fontSize: 16,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
      paddingHorizontal: spacing.five,
    },
    trigger: {
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: spacing.ten * 3,
      borderColor: colors.lightGray,
      padding: spacing.ten + 3,
      marginVertical: spacing.five + 3,
    },
  });
