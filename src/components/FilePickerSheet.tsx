import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {Modal, ScaleAnimation} from 'react-native-modals';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';

import {
  chooseDocument,
  choosePhotoFromCamera,
  choosePhotoFromLibrary,
  uploadFile,
  width,
} from '../utils';
import BottomSheet from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import Feather from 'react-native-vector-icons/MaterialIcons';

import baseStyles from '../assets/styles';
import {CustomError, CustomLoader} from '.';
import {ChatModel} from '../types';
import uuid from 'react-native-uuid';
import {useAppSelector} from '../rtk/hooks';

interface LocationSheetProps {
  setMessages: (item: any) => void;
  sendMessage: (item: ChatModel) => void;
  InboxId: string;
  setShowFileSheet: (val: Boolean) => void;
}

function LocationSheet(props: LocationSheetProps) {
  const {InboxId, setMessages, sendMessage, setShowFileSheet} = props;
  const {user} = useAppSelector(state => state.user);

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [erroMessage, setErrorMessage] = useState<string>('');

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['30%', '40%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) setShowFileSheet(false);
  }, []);

  const chooseImageFromPhotos = async () => {
    const selectedImage: any = await choosePhotoFromLibrary();
    if (selectedImage) {
      uploadSelectedFile(selectedImage, 'image');
    }
  };

  const chooseImageFromCamera = async () => {
    const selectedImage: any = await choosePhotoFromCamera();
    if (selectedImage) {
      uploadSelectedFile(selectedImage, 'image');
    }
  };

  const chooseFile = async () => {
    const selectedFile: any = await chooseDocument();

    if (selectedFile) {
      const file: any = {
        path: selectedFile.uri,
        filename: selectedFile.name,
      };

      let filetype: string = selectedFile.type.includes('pdf') ? 'pdf' : 'docs';

      uploadSelectedFile(file, filetype);
    }
  };

  const uploadSelectedFile = async (selectedFile: any, filetype: string) => {
    try {
      if (selectedFile !== null) {
        setErrorMessage('');
        setUploading(true);
        let fileUrl = await uploadFile(selectedFile);
        if (fileUrl === null) {
          setErrorMessage('error uploading file');
          setUploading(false);
          return;
        }

        const newmsg: any = {
          Id: uuid.v4() + '',
          ChannelId: InboxId,
          SenderId: user.Id,
          SentTime: new Date().toISOString(),
          Message: null,
          isOffer: null,
          image: fileUrl,
          media: filetype,
        };

        setMessages((prevMessages: ChatModel[]) => [...prevMessages, newmsg]);
        sendMessage(newmsg);
        setShowFileSheet(false);
        // send message back to the chart with the url
      }
    } catch (error) {
      setErrorMessage('fatal error');
      setUploading(false);
    }
  };

  return (
    <BottomSheet
      backgroundStyle={{...baseStyles.elevation}}
      handleIndicatorStyle={{
        backgroundColor: colors.lightGray,
        width: 60,
        height: 10,
      }}
      enablePanDownToClose={true}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={{...styles.contentContainer}}>
        {uploading ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 1000,
              flex: 1,
              width: width,
            }}>
            <CustomLoader color={colors.main} />
          </View>
        ) : (
          <View style={{position: 'relative'}}>
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
              <Pressable
                onPress={() => chooseImageFromCamera()}
                style={{
                  ...baseStyles.elevation,
                  ...styles.iconBg,
                  marginEnd: spacing.fiften,
                }}>
                <Feather color={'#266EF1'} name={'photo-camera'} size={40} />
              </Pressable>

              <Pressable
                onPress={() => chooseImageFromPhotos()}
                style={{
                  ...baseStyles.elevation,
                  ...styles.iconBg,
                  marginEnd: spacing.fiften,
                }}>
                <Feather color={'#266EF1'} name={'photo-library'} size={40} />
              </Pressable>

              <Pressable
                onPress={() => chooseFile()}
                style={{...baseStyles.elevation, ...styles.iconBg}}>
                <Feather color={'#266EF1'} name={'folder'} size={40} />
              </Pressable>
            </View>
          </View>
        )}

        <View style={{marginTop: spacing.ten}}></View>
        {erroMessage !== '' && <CustomError message={erroMessage} />}
      </View>
    </BottomSheet>
  );
}

export default LocationSheet;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.white,
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
