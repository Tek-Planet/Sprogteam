import {useTheme} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {
  ClientProfile,
  InterpreterProfile,
  CustomLoader,
  Header,
  FilePickerModal,
} from '../../components';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {placeholder} from '../../assets/images';
import {height, normalizePath, width} from '../../utils';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {
  changeProfilePicture,
  changeRoute,
  fetchUser,
} from '../../rtk/features/user/userSlice';
import baseStyles from '../../assets/styles';
import {RegisterModel} from '../../types';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {RootStackParams} from '../../navigations/MainNavigation';

interface ProfileScreenProps {}

type Props = NativeStackScreenProps<RootStackParams, 'Profile'>;

const ProfileScreen = (
  {navigation, route}: Props,
  props: ProfileScreenProps,
) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [loading, setLoading] = useState<boolean>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set route name when entering the page
    dispatch(changeRoute(route.name));
    // setRouteName(route.name);

    // Clean up and reset route name when exiting the page
    return () => {
      dispatch(changeRoute('General'));
    };
  }, [route.name]);

  const updateProfilePicture = async (imageFile: any) => {
    setModalVisible(false);

    setLoading(true);
    const path = await normalizePath(imageFile.path);

    let formData = new FormData();
    formData.append('userName', user.Email);
    formData.append('file', {
      uri: path,
      type: 'image/jpeg',
      name: 'profile-picture.jpg',
    });

    var response: any = await dispatch(changeProfilePicture(formData));
    if (response.payload) {
      dispatch(fetchUser());
    }

    console.log(response);

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header
        isProflePage
        showleftIcon
        showRightIcon
        headerTitle={t('common:profile')}
      />
      {/* profile image section */}
      {loading && <CustomLoader color={colors.main} />}

      <View
        style={{
          height: height * 0.3,
          backgroundColor: colors.main,
          alignItems: 'center',
          // justifyContent: 'center',
          borderBottomEndRadius: spacing.twenty * 3,
          borderBottomStartRadius: spacing.twenty * 3,
          position: 'relative',
          zIndex: 10,
        }}>
        <View
          style={{
            borderWidth: 6,
            borderRadius: 100,
            borderColor: colors.white,
            marginTop: spacing.fiften,
          }}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={
              user.ProfilePicture !== 'default'
                ? {uri: user.ProfilePicture}
                : placeholder
            }
          />
        </View>

        <Text
          style={{
            ...styles.headerText,
          }}>
          {user?.FirstName + ' ' + user?.LastName}
        </Text>
        <View
          style={{
            ...styles.row,
            bottom: -10, // Set to 0 to center vertically
            left: 0, // Set to 0 to center horizontally
            right: 0, // Set to 0 to center horizontally
            justifyContent: 'center', // Center horizontally
          }}>
          <Pressable
            onPress={() => navigation.navigate('EditProfile')}
            style={{...baseStyles.elevation, ...styles.iconBg}}>
            <Feather color={colors.main} name={'edit'} size={20} />
          </Pressable>

          <Pressable
            onPress={() => setModalVisible(true)}
            style={{...baseStyles.elevation, ...styles.iconBg}}>
            <Feather color={colors.main} name={'camera'} size={20} />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('EnterPassword')}
            style={{...baseStyles.elevation, ...styles.iconBg}}>
            <Feather color={colors.main} name={'lock'} size={20} />
          </Pressable>
        </View>
      </View>

      {/* profile details section */}

      {user?.interpreter ? <InterpreterProfile /> : <ClientProfile />}

      {modalVisible && (
        <FilePickerModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onFileSelected={updateProfilePicture}
          isProfile
          showCam
        />
      )}
    </View>
  );
};

export default ProfileScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    headerText: {
      fontSize: fontSize.medium,
      marginVertical: spacing.fiften,
      fontFamily: fonts.bold,
      color: colors.white,
    },

    image: {
      height: 120,
      width: 120,
      borderRadius: 100,
    },
    iconBg: {
      height: 50,
      width: 50,
      backgroundColor: colors.white,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: spacing.ten,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width * 0.35,
      marginBottom: -50,
    },
    profileText: {
      fontSize: fontSize.medium,
      fontFamily: fonts.medium,
      color: colors.black,
    },
  });
