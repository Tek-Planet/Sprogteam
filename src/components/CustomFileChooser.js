import React, {Component} from 'react';
import {View, Modal, Platform, Alert, StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  normalizePath,
  requestCameraPermission,
  requestStoragePermission,
} from '../util/util';
import Button from './Button';
import RNFetchBlob from 'rn-fetch-blob';

const CustomFileChooser = props => {
  const {showImageOption, setShowImageOption, processImage} = props;
  const choosePhotoFromLibrary = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        alert('You need to enable storage permission to continue');
        return;
      }
    }
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      multiple: false,
    })
      .then(async image => {
        const path = await normalizePath(image?.path);

        const pathToBase64 = await RNFetchBlob.fs.readFile(path, 'base64');

        const imageData = {
          pathUrl: image.path,
          path: pathToBase64,
          filename:
            image.filename && image.filename !== undefined
              ? image.filename
              : new Date().getTime().toString(),
          type: image.mime,
        };

        processImage(imageData);
        setShowImageOption(!showImageOption);
      })
      .catch(err => {
        Alert.alert(err.message);
        console.log(err);
        setShowImageOption(!showImageOption);
      });
  };

  const takePhotoFromCamera = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        alert('You need to enable storage permission to continue');
        return;
      }
    }

    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
    })
      .then(async image => {
        const path = await normalizePath(image.path);

        const pathToBase64 = await RNFetchBlob.fs.readFile(path, 'base64');

        const imageData = {
          pathUrl: image.path,
          path: pathToBase64,
          filename:
            image.filename && image.filename !== undefined
              ? image.filename
              : new Date().getTime().toString(),
          type: image.mime,
        };

        processImage(imageData);

        setShowImageOption(!showImageOption);
      })
      .catch(err => {
        Alert.alert(err.message);
        console.log(err.message);
        setShowImageOption(!showImageOption);
      });
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showImageOption}
      onRequestClose={() => {
        setShowImageOption(!showImageOption);
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.headerBG}>
          <Ionicons
            name="close"
            size={18}
            color="#E43F5A"
            onPress={() => {
              setShowImageOption(!showImageOption);
            }}
            style={{
              position: 'absolute',
              right: 5,
              backgroundColor: '#fff',
              borderRadius: 100,
              margin: 5,
            }}
          />
        </View>

        <View style={styles.fromBg}>
          <Button
            onPress={() => {
              choosePhotoFromLibrary();
            }}
            bGcolor={'#659ED6'}
            buttonTitle={'Gallery'}
          />

          <Button
            onPress={() => {
              takePhotoFromCamera();
            }}
            bGcolor={'#659ED6'}
            buttonTitle={'Camera'}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CustomFileChooser;

const styles = StyleSheet.create({
  headerBG: {
    width: 300,
    margin: 10,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#659ED6',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  fromBg: {
    width: 300,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#659ED6',
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
