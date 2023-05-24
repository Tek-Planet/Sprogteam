import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
import {baseCurrency, dimention, isIpad} from '../util/util';
import {Button, CustomCheckBox, CustomDropDown} from '.';
import {AuthContext} from '../context/AuthProvider';
import {useTranslation} from 'react-i18next';

const GigListPrice = props => {
  const {t} = useTranslation();

  const {booking_types} = useContext(AuthContext);

  const [selected, setSelected] = useState(0);
  const [checkedP, setCheckedP] = useState(true);
  const [checkedV, setCheckedV] = useState(false);
  const [checkedA, setCheckedA] = useState(false);
  const [checkedW, setCheckedW] = useState(false);
  // const [selected, setSelected] = useState(0);

  const {item, translatorInfo} = props;
  const {
    title,
    imgOne,
    checkPhone,
    checkVideo,
    checkAttendance,
    serviceId,
    languageID,
    toLanguageName,
    languageName,
    service,
  } = item;

  var categories = item.package;

  const {PAPrice, PPPrice, PVPrice, PWPrice} = categories[selected];
  const [selectedPrice, setSelectedPrice] = useState(PPPrice);

  const packages = [
    {
      label: categories[0].name,
      value: 0,
    },
    {
      label: categories[1].name,
      value: 1,
    },
    {
      label: categories[2].name,
      value: 2,
    },
  ];

  const [value, setValue] = useState(packages[0]);

  // console.log(item?.package[0]?.PPPrice);

  const navigation = useNavigation();

  const setCheckedValue = (type, val) => {
    manageChecking(type, val);
  };

  const manageChecking = (type, val) => {
    if (type === 1) {
      setCheckedP(val);
      setCheckedV(false);
      setCheckedA(false);
      setCheckedW(false);
      setSelectedPrice(PPPrice);
    } else if (type === 2) {
      setCheckedP(false);
      setCheckedV(val);
      setCheckedA(false);
      setCheckedW(false);
      setSelectedPrice(PVPrice);
    } else if (type === 3) {
      setCheckedP(false);
      setCheckedV(false);
      setCheckedA(val);
      setCheckedW(false);
      setSelectedPrice(PAPrice);
    } else {
      setCheckedP(false);
      setCheckedV(false);
      setCheckedA(false);
      setCheckedW(val);
      setSelectedPrice(PWPrice);
    }
  };

  const continueToBooking = () => {
    // temporaty task type Id
    var selectedTask = 3;
    if (checkedA) selectedTask = 1;
    if (checkedV) selectedTask = 2;

    var otherItem = {
      selectedPrice: selectedPrice,
      checkPhone: checkedP,
      checkVideo: checkedV,
      checkAttendance: checkedA,
      serviceId: serviceId,
      languageId: languageID,
      toLanguageName: toLanguageName,
      languageName: languageName,
      selectedTask,
      service,
    };

    navigation.navigate('OtherNav', {
      screen:
        serviceId === 2 || serviceId === 3 || serviceId === 1
          ? 'GigBooking'
          : 'GigBookingB',
      params: {
        info: item,
        viewer: 'customer',
        otherItem: otherItem,
        translatorInfo: translatorInfo,
      },
    });
  };

  useEffect(() => {
    setSelected(value.value);
  }, [value]);

  useEffect(() => {
    changePrice();
  }, [selected]);

  const changePrice = () => {
    if (checkedP) setSelectedPrice(PPPrice);
    if (checkedV) setSelectedPrice(PVPrice);
    if (checkedA) setSelectedPrice(PAPrice);
    if (checkedW) setSelectedPrice(PWPrice);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OtherNav', {
          screen: 'ViewGiG',
          params: {
            item: item,
            translatorInfo: translatorInfo,
          },
        });
      }}
      style={[styles.sectionStyle]}>
      <View style={{flexDirection: 'row'}}>
        <Image
          resizeMode="cover"
          style={{
            height: 60,
            width: 60,
            marginEnd: 20,
          }}
          source={{
            uri: imgOne,
          }}
        />
        <View style={{flex: 1}}>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: colors.black,

              // width: dimention.width * 0.6,
            }}>
            {title}
          </Text>

          {/* <Text
            style={{
              marginTop: 5,
              fontFamily: fonts.medium,
            }}>
            {service}
          </Text> */}
        </View>
      </View>

      <Text
        style={{
          fontFamily: fonts.medium,
          marginTop: 10,
          marginBottom: 5,
          color: colors.black,
        }}>
        {t('common:translating')}
      </Text>

      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            flex: 1,
            color: colors.black,
          }}>
          {t('common:from')} : {languageName}
        </Text>

        <Text
          style={{
            fontFamily: fonts.medium,
            color: colors.black,
          }}>
          {t('common:to')} : {toLanguageName}
        </Text>
      </View>
      <View style={{height: 60, marginTop: 10}}>
        <CustomDropDown
          title={t('common:package')}
          value={value}
          language={packages}
          setValue={setValue}
        />
      </View>
      {(serviceId === 3 || serviceId == 1) && (
        <View style={{marginTop: 5}}>
          {/* <Text style={styles.packageTitle}>Prices</Text> */}

          {checkPhone && (
            <View style={styles.rowApart}>
              <CustomCheckBox
                mp
                selector={1}
                checked={checkedP}
                setChecked={setCheckedValue}
                placeholder={booking_types[2].label}
              />
              <Text style={styles.description}>
                {PPPrice + ' ' + baseCurrency.usd + ' / ' + t('common:hour')}
              </Text>
            </View>
          )}

          {checkVideo && (
            <View style={styles.rowApart}>
              <CustomCheckBox
                mp
                selector={2}
                checked={checkedV}
                setChecked={setCheckedValue}
                placeholder={booking_types[1].label}
              />
              <Text style={styles.description}>
                {PVPrice + ' ' + baseCurrency.usd + ' / ' + t('common:hour')}
              </Text>
            </View>
          )}

          {checkAttendance && (
            <View style={styles.rowApart}>
              <CustomCheckBox
                mp
                selector={3}
                checked={checkedA}
                setChecked={setCheckedValue}
                placeholder={booking_types[0].label}
              />
              <Text style={styles.description}>
                {PAPrice + ' ' + baseCurrency.usd + ' / ' + t('common:hour')}
              </Text>
            </View>
          )}
        </View>
      )}
      <View style={{margin: 10}}>
        <Button
          onPress={() => {
            continueToBooking();
          }}
          buttonTitle={
            t('common:start') +
            ' ' +
            t('common:from') +
            ' (' +
            selectedPrice +
            baseCurrency.usd +
            ')'
          }
        />
      </View>
    </TouchableOpacity>
  );
};
export default GigListPrice;

const styles = StyleSheet.create({
  sectionStyle: {
    width: isIpad ? dimention.width * 0.4 : dimention.width * 0.8,
    margin: 5,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.black,
    textAlign: 'center',
    margin: 10,
  },
  description: {
    fontFamily: fonts.medium,
    color: colors.black,
    textAlign: 'justify',
    lineHeight: 23,
    fontSize: 15,
  },
  packagePrice: {
    fontFamily: fonts.bold,
    margin: 10,
    fontSize: 20,
    color: colors.main,
  },
  packageTitle: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.black,
    margin: 10,
    marginStart: 0,
  },
  rowApart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    alignItems: 'center',
  },
});
