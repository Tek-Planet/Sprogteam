import React, {useContext, useState, useEffect} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthProvider';
import {fonts} from '../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import CountryPickerModal from './CountryPickerModal';
import {isIpad} from '../util/util';
import {colors} from '../assets/colors';
import {useTranslation} from 'react-i18next';

const Header = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {
    iconName,
    showSearchBar,
    searchLanguage,
    placeholder,
    showTouchNav,
    doSomething,
    setCountry,
    code,
    locationSearch,
  } = props;
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(user && user.profile.ProfilePicture);
  // console.log(image);
  useEffect(() => {
    setImage(user && user.profile.ProfilePicture);
  }, [user]);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flexDirection: 'row',

        alignItems: 'center',
        paddingStart: 10,
        paddingEnd: 10,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
      }}>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('OtherNav', {screen: 'Profile'});
          navigation.openDrawer();
        }}>
        <Image
          style={{
            height: 40,
            width: 40,

            borderRadius: 100,
          }}
          source={
            image !== undefined && image !== null && image !== 'default'
              ? {uri: image}
              : require('../assets/imgs/paulo.png')
          }
        />
      </TouchableOpacity>

      <View style={{flex: 1}}>
        {showSearchBar && (
          <View
            style={{
              borderRadius: 10,
              backgroundColor: '#EDF0F9',
              marginTop: 5,
              marginBottom: 5,
              height: 40,
              paddingStart: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginStart: 5,
              marginEnd: 5,
            }}>
            <Ionicons name={'search'} color="#585C5F" size={20} />
            <TextInput
              onChangeText={val => searchLanguage(val)}
              style={{
                flex: 1,
                height: 40,
                borderColor: '#adb5bd',
                color: '#000',
                fontFamily: fonts.light,
                fontSize: 16,
                padding: 5,
                margin: 5,
              }}
              placeholderTextColor="#adb5bd"
              placeholder={placeholder ? placeholder : t('common:language')}
            />
          </View>
        )}

        {showTouchNav && (
          <TouchableOpacity
            onPress={() => {
              doSomething();
            }}
            style={{
              borderRadius: 10,
              backgroundColor: '#EDF0F9',
              marginTop: 5,
              marginBottom: 5,
              height: isIpad ? 60 : 50,
              flexDirection: 'row',
              alignItems: 'center',
              marginStart: 5,
              marginEnd: 5,
              paddingStart: 10,
            }}>
            <Ionicons name={'search'} color="#585C5F" size={25} />
            <Text
              style={{
                flex: 1,
                borderColor: '#adb5bd',
                color: '#000',
                fontFamily: fonts.light,
                fontSize: 16,
                padding: 5,

                margin: 5,
              }}>
              {placeholder}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {locationSearch && (
        <TouchableOpacity
          onPress={() => {
            locationSearch();
          }}>
          <Ionicons name={'location'} color={colors.main} size={22} />
        </TouchableOpacity>
      )}
      {setCountry ? (
        <CountryPickerModal
          code={code}
          setCountry={setCountry}
          visisble={false}
          visible={true}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <Ionicons
            name={iconName ? iconName : 'menu'}
            color="#000"
            size={22}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
