import React, {useState} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import Feather from 'react-native-vector-icons/MaterialIcons';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  chooseDocument,
  choosePhotoFromCamera,
  choosePhotoFromLibrary,
  height,
  width,
} from '../utils';
import baseStyles from '../assets/styles';
import Ionicon from 'react-native-vector-icons/Ionicons';

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
    <View
      style={
        {
          // backgroundColor: colors.main,
        }
      }>
      <Text style={styles.title}>
        {label ? label : t('common:upload') + ' ' + t('common:file')}
      </Text>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: spacing.ten * 3,
          borderColor: colors.lightGray,
          padding: spacing.ten + 3,
          marginVertical: spacing.five + 3,
        }}>
        <Text style={{...styles.title, marginTop: 0}}>
          {choosenFile
            ? choosenFile?.filename
            : t('common:select') + ' ' + t('common:file')}
        </Text>
        <Ionicon color={colors.lightGray} name={'attach-outline'} size={25} />
      </Pressable>

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
            <Pressable
              onPress={() => {
                if (closeModal) closeModal();
                else setModalVisible(false);
              }}
              style={{position: 'absolute', right: 5, zIndex: 10}}>
              <Feather color={colors.main} name={'close'} size={25} />
            </Pressable>
            <Text
              style={{
                opacity: 0.6,
                fontFamily: fonts.regular,
                marginBottom: spacing.fiften,
                color: colors.black,
                fontSize: fontSize.regular,
                textAlign: 'center',
              }}>
              {t('common:file') + ' ' + t('common:picker')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: spacing.ten,
              }}>
              {showCam && (
                <Pressable
                  onPress={() => chooseImageFromCamera()}
                  style={{
                    ...baseStyles.elevation,
                    ...styles.iconBg,
                    marginEnd: spacing.fiften,
                  }}>
                  <Feather color={'#266EF1'} name={'photo-camera'} size={40} />
                </Pressable>
              )}
              <Pressable
                onPress={() => chooseImageFromPhotos()}
                style={{
                  ...baseStyles.elevation,
                  ...styles.iconBg,
                  marginEnd: spacing.fiften,
                }}>
                <Feather color={'#266EF1'} name={'photo-library'} size={40} />
              </Pressable>

              {!isProfile && (
                <Pressable
                  onPress={() => chooseFile()}
                  style={{...baseStyles.elevation, ...styles.iconBg}}>
                  <Feather color={'#266EF1'} name={'folder'} size={40} />
                </Pressable>
              )}
            </View>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
}

export default FilePickerModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    profileText: {
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      color: colors.black,
      marginStart: spacing.twenty,
    },
    iconBg: {
      height: 60,
      width: 60,
      backgroundColor: colors.white,
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
    title: {
      color: colors.black,
      fontSize: 16,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
      paddingHorizontal: spacing.five,
    },
  });
