import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button';
import {AuthContext} from '../context/AuthProvider';
import {fonts} from '../assets/fonts';
import ImagePicker from 'react-native-image-crop-picker';

import axios from 'axios';
import {ScrollView} from 'react-native';
import {getUser, storeDetails} from '../data/data';
import ShowIndicator from '../components/ActivityIndicator';
import Selector from '../components/LanguageSelector';
import {useTranslation} from 'react-i18next';
import {authBaseUrl} from '../util/util';
const ProfileScreen = ({navigation}) => {
  const {user, setUser, setAuth, logout, onlineStatus} =
    useContext(AuthContext);
  const {t} = useTranslation();

  // console.log(user); 273059a0-6f11-4fd6-9a64-298b2db041bf
  const [avaiable, setAvailAble] = useState(
    user && user !== null ? true : false,
  );
  const [showImageOption, setShowImageOption] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [image, setImage] = useState(user ? user.profile.ProfilePicture : null);

  // console.log(image);

  useEffect(() => {
    setImage(user && user.profile.ProfilePicture);
  }, [user]);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
    })
      .then(async image => {
        const imageUri = Platform.OS === 'ios' ? image.path : image.path;

        //   Alert.alert('sourceUrl ' + image.sourceURL);

        // Alert.alert('path ' + image.path);

        saveImageToDB(image);

        setShowImageOption(false);
        // if (imageUri !== null)
        // else alert('Unable to get image path please try again');
      })
      .catch(err => {
        Alert.alert(err.message);
        console.log(err.message);
        setUploading(false);
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
    })
      .then(async image => {
        const imageUri = Platform.OS === 'ios' ? image.path : image.path;

        saveImageToDB(image);
        setShowImageOption(false);
      })
      .catch(err => {
        Alert.alert(err.message);
        console.log(err);
        setUploading(false);
      });
  };

  // Image option modal display
  const imageOptionModal = () => {
    return (
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
              setShowImageOption(false);
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
    );
  };

  const normalizePath = async path => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const filePrefix = 'file://';
      if (path.startsWith(filePrefix)) {
        path = path.substring(filePrefix.length);
        try {
          path = decodeURI(path);
        } catch (error) {
          console.log(error);
        }
      }
    }
    return path;
  };

  const saveImageToDB = async image => {
    setUploading(true);
    const imageData = {
      uri: image.path,
      name: image.filename,
      type: 'image/jpeg',
    };

    // console.log(imageData);

    let formdata = new FormData();
    formdata.append('userName', user.profile.Email);
    formdata.append('image', imageData);

    try {
      var res = await fetch(`${authBaseUrl}/upload`, {
        method: 'post',
        body: formdata,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      });

      // console.log(res);

      const resUser = await getUser(user.profile.Email);
      await storeDetails(resUser);
      setUser(resUser);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#7A7A7A'}}>
      <View
        style={{
          marginTop: 120,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#fff',
          flex: 1,
          justifyContent: 'space-between',
        }}>
        {/* show editing form form */}

        {/* show image upload option modal */}
        {showImageOption && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showImageOption}
            onRequestClose={() => {
              setShowImageOption(!showImageOption);
            }}>
            {imageOptionModal()}
          </Modal>
        )}
        {/* Show calenda */}

        <View style={{}}>
          {/* Profile Details */}
          <TouchableOpacity onPress={() => setShowImageOption(true)}>
            <Image
              style={{
                height: 150,
                width: 150,
                borderRadius: 100,
                margin: -80,
                marginBottom: 10,
                alignSelf: 'center',
              }}
              source={
                image !== undefined && image !== null && image !== 'default'
                  ? {uri: image}
                  : require('../assets/imgs/paulo.png')
              }
            />
            <ShowIndicator show={uploading} color={'red'} />
          </TouchableOpacity>
          {/* general insformation section */}
          <ScrollView>
            <View style={{margin: 10, paddingBottom: 100}}>
              {/* firstname section */}
              <View style={styles.infoContainer}>
                {/* services section */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtherNav', {screen: 'Services'})
                  }
                  style={styles.row}>
                  <View style={styles.innerRow}>
                    <Ionicons
                      name="person"
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                    <Text style={styles.infoHeader}>
                      {t('navigate:services')}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    color="#000"
                    size={20}
                    style={{marginEnd: 10}}
                  />
                </TouchableOpacity>
                {/* this will be comment out for now  */}
                {/* profile section */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtherNav', {screen: 'General'})
                  }
                  style={styles.row}>
                  <View style={styles.innerRow}>
                    <Ionicons
                      name="person"
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                    <Text style={styles.infoHeader}>
                      {t('common:my_profile')}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    color="#000"
                    size={20}
                    style={{marginEnd: 10}}
                  />
                </TouchableOpacity>

                {/* news section */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtherNav', {screen: 'News'})
                  }
                  style={styles.row}>
                  <View style={styles.innerRow}>
                    <Ionicons
                      name="person"
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                    <Text style={styles.infoHeader}>{t('navigate:news')}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    color="#000"
                    size={20}
                    style={{marginEnd: 10}}
                  />
                </TouchableOpacity>

                {/* post a request section */}
                {/* for the translation to view list of available  request */}
                {user &&
                user !== null &&
                (user.profile.interpreter ||
                  user.profile.interpreter === true) ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('RequestNav', {
                        screen: 'Requests',
                      })
                    }
                    style={styles.row}>
                    <View style={styles.innerRow}>
                      <Ionicons
                        name="git-pull-request"
                        color="#000"
                        size={20}
                        style={{marginEnd: 10}}
                      />
                      <Text style={styles.infoHeader}>
                        {t('common:buyers')} {t('common:requests')}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        showRequest
                          ? 'chevron-down-outline'
                          : 'chevron-forward-outline'
                      }
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowRequest(!showRequest)}
                    style={styles.row}>
                    <View style={styles.innerRow}>
                      <Ionicons
                        name="git-pull-request"
                        color="#000"
                        size={20}
                        style={{marginEnd: 10}}
                      />
                      <Text style={styles.infoHeader}>
                        {t('common:requests')}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        showRequest
                          ? 'chevron-down-outline'
                          : 'chevron-forward-outline'
                      }
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                  </TouchableOpacity>
                )}
                {showRequest && (
                  <View>
                    {/* Menu Item One */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('RequestNav', {
                          screen: 'Request',
                        })
                      }
                      style={[styles.row, {height: 40, marginStart: 20}]}>
                      <View style={styles.innerRow}>
                        <MaterialIcons
                          name="privacy-tip"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                        <Text style={styles.infoHeader}>
                          {t('common:post_request')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/* menu item two */}

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('RequestNav', {
                          screen: 'RequestList',
                        })
                      }
                      style={[styles.row, {height: 40, marginStart: 20}]}>
                      <View style={styles.innerRow}>
                        <MaterialIcons
                          name="my-library-books"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                        <Text style={styles.infoHeader}>
                          {t('common:manage_request')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/* menu item three */}
                  </View>
                )}

                {/* end of post a  request section  */}

                {/* contact section */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtherNav', {screen: 'Contact'})
                  }
                  style={styles.row}>
                  <View style={styles.innerRow}>
                    <Ionicons
                      name="call"
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                    <Text style={styles.infoHeader}>{t('common:contact')}</Text>
                  </View>
                  <Ionicons
                    onPress={() =>
                      navigation.navigate('OtherNav', {screen: 'Contact'})
                    }
                    name="chevron-forward-outline"
                    color="#000"
                    size={20}
                    style={{marginTop: 10, marginEnd: 10}}
                  />
                </TouchableOpacity>
                {/* end of contact section */}

                {/* colapse menu side */}
                <TouchableOpacity
                  onPress={() => setShowMenu(!showMenu)}
                  style={styles.row}>
                  <View style={styles.innerRow}>
                    <MaterialIcons
                      name="rule"
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                    <Text style={styles.infoHeader}>{t('common:terms')}</Text>
                  </View>
                  <Ionicons
                    name={
                      !showMenu
                        ? 'chevron-forward-outline'
                        : 'chevron-down-outline'
                    }
                    color="#000"
                    size={20}
                    style={{marginTop: 10, marginEnd: 10}}
                  />
                  {/* the submenu function */}
                </TouchableOpacity>
                {showMenu && (
                  <View>
                    {/* Menu Item One */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OtherNav', {
                          screen: 'PrivatePolice',
                        })
                      }
                      style={[styles.row, {height: 40, marginStart: 20}]}>
                      <View style={styles.innerRow}>
                        <MaterialIcons
                          name="privacy-tip"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                        <Text style={styles.infoHeader}>
                          {t('common:privacy_policy')}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward-outline"
                        color="#000"
                        size={20}
                        style={{marginEnd: 10}}
                      />
                    </TouchableOpacity>
                    {/* menu item two */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OtherNav', {
                          screen: 'BehaviorPolice',
                        })
                      }
                      style={[styles.row, {height: 40, marginStart: 20}]}>
                      <View style={styles.innerRow}>
                        <MaterialIcons
                          name="my-library-books"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                        <Text style={styles.infoHeader}>
                          {t('common:consumer_terms')}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward-outline"
                        color="#000"
                        size={20}
                        style={{marginEnd: 10}}
                      />
                    </TouchableOpacity>
                    {/* menu item three */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OtherNav', {
                          screen: 'TranslateHandbook',
                        })
                      }
                      style={[styles.row, {height: 40, marginStart: 20}]}>
                      <View style={styles.innerRow}>
                        <MaterialIcons
                          name="translate"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                        <Text style={styles.infoHeader}>
                          {t('common:interpreter_castle')}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward-outline"
                        color="#000"
                        size={20}
                        style={{marginEnd: 10}}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* translator availability setter  */}
                {user &&
                  (user.profile.interpreter ||
                    (user && user.profile.interpreter === 1)) && (
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('OtherNav', {
                            screen: 'AddLanguage',
                            params: {email: user.profile.Id},
                          })
                        }
                        style={styles.row}>
                        <View style={styles.innerRow}>
                          <Ionicons
                            name="person"
                            color="#000"
                            size={20}
                            style={{marginEnd: 10}}
                          />
                          <Text style={styles.infoHeader}>
                            {t('common:language')}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward-outline"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('OtherNav', {
                            screen: 'Skills',
                            params: {email: user.profile.Id},
                          })
                        }
                        style={styles.row}>
                        <View style={styles.innerRow}>
                          <Ionicons
                            name="person"
                            color="#000"
                            size={20}
                            style={{marginEnd: 10}}
                          />
                          <Text style={styles.infoHeader}>
                            {t('common:skills')}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward-outline"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('OtherNav', {
                            screen: 'ManageServices',
                            params: {email: user.profile.Id},
                          })
                        }
                        style={styles.row}>
                        <View style={styles.innerRow}>
                          <Ionicons
                            name="person"
                            color="#000"
                            size={20}
                            style={{marginEnd: 10}}
                          />
                          <Text style={styles.infoHeader}>
                            {t('common:services')}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward-outline"
                          color="#000"
                          size={20}
                          style={{marginEnd: 10}}
                        />
                      </TouchableOpacity> */}

                      <View style={styles.row}>
                        <View style={styles.innerRow}>
                          <MaterialIcons
                            name="event-busy"
                            color="#000"
                            size={20}
                            style={{marginEnd: 10}}
                          />
                          <Text style={styles.infoHeader}>
                            {t('common:available')}
                          </Text>
                        </View>
                        <Switch
                          value={avaiable}
                          onValueChange={val => {
                            setAvailAble(val);
                            const status = val ? 1 : 0;
                            onlineStatus(
                              user.profile.Email,
                              'Available',
                              status,
                            );
                          }}
                          trackColor={{false: 'grey', true: 'green'}}
                        />
                      </View>
                    </View>
                  )}
                {/* language selection section */}
                <View>
                  <Text style={styles.text}>
                    {t('common:languageSelector')}
                  </Text>
                  <Selector />
                </View>

                <View
                  style={[
                    styles.row,
                    {marginBottom: 10, marginStart: 10, marginEnd: 10},
                  ]}>
                  <TouchableOpacity
                    onPress={async () => {
                      await logout();
                      // setAuth(false);

                      // setTimeout(() => {
                      //   navigation.dispatch(
                      //     CommonActions.reset({
                      //       index: 0,
                      //       routes: [{name: 'Auth'}],
                      //     }),
                      //   );
                      // }, 1500);
                    }}
                    style={styles.innerRow}>
                    <Ionicons
                      name="log-out-outline"
                      color="#000"
                      size={20}
                      style={{marginEnd: 10}}
                    />
                    <Text style={styles.infoHeader}>{t('common:logout')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  infoHeader: {
    marginStart: 5,
    color: '#000',
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  info: {
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    elevation: 1,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    backgroundColor: '#F3F3F3',
  },

  infoContainer: {marginTop: 10},

  // modal styles

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

  headerBGCal: {
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#ccc',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },

  innerRow: {flexDirection: 'row', alignItems: 'center'},

  text: {
    fontFamily: fonts.medium,
    margin: 10,
    fontSize: 16,
  },
});
