import React, {useContext, useState} from 'react';
import {View, Modal, Image, Text, StyleSheet, Alert} from 'react-native';

import Button from '../components/Button';
import {AuthContext} from '../context/AuthProvider';
import {fonts} from '../assets/fonts';
import {ScrollView, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import {authBaseUrl} from '../util/util';
import {getUser, storeDetails} from '../data/data';
import {ActivityIndicator, ProfileHeader} from '../components';
import {colors} from '../assets/colors';

const GeneralScreen = ({navigation, route}) => {
  const {user, setUser, available_services} = useContext(AuthContext);
  const {profile} = user;
  const [showImageOption, setShowImageOption] = useState(false);
  const [uploading, setUploading] = useState(false);

  // console.log(user);

  const {
    ProfilePicture,
    Country,
    Zipcode,
    DOB,
    PhoneNumber,
    Email,
    KontoNummer,
    State,
    Adresse,
    City,
    About,
    FirstName,
    LastName,
    RatingNumber,
    Rating,
    languages,
    services,
    skills,
    CreateAt,
    interpreter,
    Id,
  } = profile;

  // console.log(Country);

  const {t} = useTranslation();

  const ImageOptionModal = () => {
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
  // wgawant man

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
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <ProfileHeader />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: colors.white,
        }}>
        <ScrollView>
          <View
            style={{
              flex: 1,
            }}>
            <View>
              {/* general insformation section */}
              <View style={{margin: 10}}>
                {/* Imag and name section */}
                <View style={{flexDirection: 'row'}}>
                  {uploading ? (
                    <View style={{width: 70, height: 70, borderRadius: 100}}>
                      <ActivityIndicator
                        size="large"
                        show={uploading}
                        color={'red'}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => setShowImageOption(true)}>
                      <Image
                        source={
                          ProfilePicture !== undefined &&
                          ProfilePicture !== null &&
                          ProfilePicture !== 'null' &&
                          ProfilePicture !== 'default'
                            ? {uri: ProfilePicture}
                            : require('../assets/imgs/paulo.png')
                        }
                        style={{width: 70, height: 70, borderRadius: 100}}
                      />
                      <AntDesign
                        style={{marginTop: 50}}
                        name={'edit'}
                        size={16}
                        color={'#659ED6'}
                      />
                    </TouchableOpacity>
                  )}

                  <View
                    style={{
                      margin: 10,
                      marginTop: 0,
                      marginStart: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View>
                      <Text
                        style={[styles.info, {marginBottom: 5, fontSize: 16}]}>
                        {FirstName + ' ' + LastName}
                      </Text>

                      {interpreter && (
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.info}>
                            <AntDesign
                              name={'star'}
                              size={16}
                              color={'#ECC369'}
                            />{' '}
                            {Rating && Rating !== null
                              ? Rating.toFixed(0) +
                                ' ' +
                                '(' +
                                RatingNumber +
                                ')'
                              : 'N/A'}{' '}
                          </Text>

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('OtherNav', {
                                screen: 'RatingScreen',
                                params: {profile: profile},
                              })
                            }>
                            <Text
                              style={[
                                styles.info,
                                {color: '#659ED6', fontFamily: fonts.bold},
                              ]}>
                              {t('common:overall') + ' ' + t('common:rating')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View>
                  <Text
                    style={[
                      styles.infoHeader,
                      {
                        marginTop: 20,
                        marginBottom: 10,
                        fontSize: 16,
                        fontFamily: fonts.bold,
                      },
                    ]}>
                    {t('common:user') + ' ' + t('common:information')}
                  </Text>
                </View>
                <View style={[styles.divider, {width: '98%'}]} />
                {/* country */}
                <View style={styles.infoContainer}>
                  <Ionicons
                    name={'location'}
                    size={26}
                    color={'#659ED6'}
                    style={{padding: 5}}
                  />
                  <View style={styles.row}>
                    <Text style={styles.infoHeader}>{t('common:address')}</Text>
                    <Text style={styles.info}>
                      {Adresse + ' ' + Zipcode + ' ' + City}
                    </Text>
                    <Text style={styles.info}>
                      {Country !== null ? Country : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />

                {/* date of birt */}
                {interpreter && (
                  <View>
                    <View style={styles.infoContainer}>
                      <AntDesign
                        name={'calendar'}
                        size={26}
                        color={'#659ED6'}
                        style={{padding: 5}}
                      />
                      <View style={styles.row}>
                        <Text style={styles.infoHeader}>
                          {t('common:date_of_birth')}
                        </Text>
                        <Text style={styles.info}>{DOB}</Text>
                      </View>
                    </View>

                    <View style={styles.divider} />
                  </View>
                )}

                {/* phone number */}

                <View style={styles.infoContainer}>
                  <AntDesign
                    name={'phone'}
                    size={26}
                    color={'#659ED6'}
                    style={{padding: 5}}
                  />
                  <View style={styles.row}>
                    <Text style={styles.infoHeader}>
                      {t('common:phone')} {t('common:number')}
                    </Text>
                    <Text style={styles.info}>{PhoneNumber}</Text>
                  </View>
                </View>
                <View style={styles.divider} />

                {/* email */}
                {/* phone number */}

                <View style={styles.infoContainer}>
                  <AntDesign
                    name={'mail'}
                    size={26}
                    color={'#659ED6'}
                    style={{padding: 5}}
                  />
                  <View style={styles.row}>
                    <Text style={styles.infoHeader}>{t('common:email')}</Text>
                    <Text style={styles.info}>{Email}</Text>
                  </View>
                </View>
                <View style={styles.divider} />

                {/* member since  */}

                <View style={styles.infoContainer}>
                  <AntDesign
                    name={'addusergroup'}
                    size={26}
                    color={'#659ED6'}
                    style={{padding: 5}}
                  />
                  <View style={styles.row}>
                    <Text style={styles.infoHeader}>{t('common:member')}</Text>
                    <Text style={styles.info}>
                      {moment(CreateAt).format('MMM Do YYYY')}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />

                {/* interpreter progile */}
                {interpreter && (
                  <View>
                    <View style={styles.infoContainer}>
                      <Ionicons
                        name={'location'}
                        size={26}
                        color={'#659ED6'}
                        style={{padding: 5}}
                      />
                      <View style={styles.row}>
                        <Text style={styles.infoHeader}>
                          {t('common:account')} {t('common:number')}
                        </Text>
                        <Text style={styles.info}>{KontoNummer}</Text>
                      </View>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoContainer}>
                      <AntDesign
                        name={'user'}
                        size={26}
                        color={'#659ED6'}
                        style={{padding: 5}}
                      />
                      <View style={styles.row}>
                        <Text style={styles.infoHeader}>
                          {t('common:about')}
                        </Text>
                        <Text style={[styles.info, {width: 300}]}>{About}</Text>
                      </View>
                    </View>
                    <View style={styles.divider} />

                    {/* Language */}

                    <View style={styles.infoContainer}>
                      <Ionicons
                        name={'language'}
                        size={26}
                        color={'#659ED6'}
                        style={{padding: 5}}
                      />
                      <View style={styles.row}>
                        <Text style={styles.infoHeader}>
                          {t('common:language')}
                        </Text>

                        <ScrollView
                          contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginEnd: 10,
                          }}
                          showsHorizontalScrollIndicator={false}>
                          {languages?.map((item, index) => {
                            return (
                              <Text key={index.toString()} style={styles.info}>
                                {item.label}
                              </Text>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                    <View style={styles.divider} />

                    {/* skills section */}
                    <View style={styles.infoContainer}>
                      <MaterialIcons
                        name={'design-services'}
                        size={26}
                        color={'#659ED6'}
                        style={{padding: 5}}
                      />
                      <View style={styles.row}>
                        <Text style={styles.infoHeader}>
                          {t('common:skills')}
                        </Text>

                        <ScrollView
                          contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginEnd: 10,
                          }}
                          showsHorizontalScrollIndicator={false}>
                          {skills?.map((item, index) => {
                            return (
                              <Text key={index.toString()} style={styles.info}>
                                {item.label}
                              </Text>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                    <View style={styles.divider} />
                    {/* services */}
                    {/* services section */}
                    <View style={styles.infoContainer}>
                      <MaterialIcons
                        name="work-outline"
                        size={26}
                        color={'#659ED6'}
                        style={{padding: 5}}
                      />
                      <View style={styles.row}>
                        <Text style={styles.infoHeader}>
                          {t('common:services')}
                        </Text>

                        <ScrollView
                          contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginEnd: 30,
                          }}
                          showsHorizontalScrollIndicator={false}>
                          {services?.map((item, index) => {
                            return (
                              <Text key={index.toString()} style={styles.info}>
                                {available_services[item.value - 1].label}
                              </Text>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                    <View style={styles.divider} />
                  </View>
                )}
              </View>
            </View>

            {showImageOption && (
              <Modal
                animationType="fade"
                transparent={true}
                visible={showImageOption}
                onRequestClose={() => {
                  setShowImageOption(!showImageOption);
                }}>
                <ImageOptionModal />
              </Modal>
            )}
          </View>
        </ScrollView>

        <View style={{margin: 20}}>
          <Button
            bGcolor={'#659ED6'}
            buttonTitle={t('common:edit') + ' ' + t('common:profile')}
            onPress={() => navigation.navigate('OtherNav', {screen: 'Edit'})}
            // onPress={() => deleteBooking('CreateBy', user.profile.Id)}
          />
        </View>
      </View>
    </View>
  );
};
export default GeneralScreen;

const styles = StyleSheet.create({
  infoHeader: {
    margin: 5,
    color: colors.black,
    fontFamily: fonts.light,
  },
  info: {
    color: colors.black,
    margin: 5,
    fontFamily: fonts.medium,
  },
  row: {
    marginTop: 5,
    paddingBottom: 5,
  },

  // modal styles

  buttonText: {
    textAlign: 'center',
    color: colors.white,
    margin: 5,
    fontSize: 18,
  },

  buttonContainer: {
    width: 100,
    margin: 10,
    borderRadius: 50,
    backgroundColor: '#E43F5A',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: colors.main,
    alignSelf: 'flex-end',
  },
  headerBG: {
    width: 300,
    margin: 10,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: colors.main,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  fromBg: {
    width: 300,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.main,
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
