import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../../assets/fonts';
import {colors} from '../../assets/colors';
import {baseCurrency} from '../../util/util';
import Swiper from 'react-native-swiper';
import {Button, CustomCheckBox, ProfileHeader} from '../../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from '../../context/AuthProvider';
import {useTranslation} from 'react-i18next';

const ViewGigScreen = ({route}) => {
  const {t} = useTranslation();

  const {booking_types} = useContext(AuthContext);

  const {item, returnToChat, customerInfo} = route.params;
  // console.log(returnToChat);
  const {
    description,
    title,
    imgOne,
    imgTwo,
    imgThree,
    faq,
    checkPhone,
    checkVideo,
    checkAttendance,
    checkWritten,
    serviceId,
    languageID,
    languageName,
  } = item;
  var categories = item.package;
  // console.log(item, languageName);

  var images = [{imgUrl: imgOne}, {imgUrl: imgTwo}, {imgUrl: imgThree}];
  const [showMore, setShowMore] = useState(false);

  const [showImage, setShowImage] = useState(true);
  const [selected, setSelected] = useState(0);
  const [checkedP, setCheckedP] = useState(true);
  const [checkedV, setCheckedV] = useState(false);
  const [checkedA, setCheckedA] = useState(false);
  const [checkedW, setCheckedW] = useState(false);

  const {
    PAPrice,
    PPPrice,
    PVPrice,
    PWPrice,
    name,
    duration,
    delivery,
    formatting,
    proofreading,
    revision,
    styling,
    subtitling,
    wordcount,
  } = categories[selected];
  const [selectedPrice, setSelectedPrice] = useState(PPPrice);

  const navigation = useNavigation();

  const setCheckedValue = (type, val) => {
    manageChecking(type, val);
  };

  useEffect(() => {
    changePrice();
  }, [selected]);

  const changePrice = () => {
    if (checkedP) setSelectedPrice(PPPrice);
    if (checkedV) setSelectedPrice(PVPrice);
    if (checkedA) setSelectedPrice(PAPrice);
    if (checkedW) setSelectedPrice(PWPrice);
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
      selectedTask,
    };

    navigation.navigate(
      serviceId === 2 || serviceId === 3 || serviceId === 1
        ? 'GigBooking'
        : 'GigBookingB',
      {
        returnToChat: returnToChat,
        info: item,
        viewer: 'customer',
        otherItem: otherItem,
        customerInfo: customerInfo,
      },
    );
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View style={{flex: 1}}>
          <ScrollView>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
              {showImage && (
                <View style={{height: 300}}>
                  <Swiper autoplay>
                    {images?.map((item, index) => {
                      return (
                        <ImageBackground
                          resizeMode={'stretch'}
                          key={index.toString()}
                          style={{
                            height: 300,
                          }}
                          source={{
                            uri: item.imgUrl,
                          }}
                        />
                      );
                    })}
                  </Swiper>
                </View>
              )}

              <View style={{padding: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}>
                  <Text></Text>
                  <AntDesign
                    name={!showImage ? 'down' : 'up'}
                    color={colors.main}
                    size={25}
                    onPress={() => {
                      setShowImage(!showImage);
                    }}
                  />
                </View>

                <View style={{flex: 1, padding: 10}}>
                  <Text style={styles.title}>{title}</Text>

                  <Text style={styles.description}>
                    {!showMore
                      ? description.substr(0, 100).trim() + '  ....'
                      : description.trim()}{' '}
                    <AntDesign
                      name={!showMore ? 'down' : 'up'}
                      color={colors.main}
                      size={20}
                      onPress={() => {
                        setShowMore(!showMore);
                      }}
                    />
                  </Text>
                  {/* package price header  */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      margin: 10,
                    }}>
                    <TouchableOpacity
                      style={
                        selected === 0 && {
                          borderBottomWidth: 2,
                          alignItems: 'center',
                          borderColor: colors.main,
                        }
                      }
                      onPress={() => {
                        setSelected(0);
                      }}>
                      <Text style={styles.packagePrice}>
                        {item?.package[0]?.PPPrice + ' ' + baseCurrency.usd}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        selected === 1 && {
                          borderBottomWidth: 2,
                          alignItems: 'center',
                          borderColor: colors.main,
                        }
                      }
                      onPress={() => {
                        setSelected(1);
                      }}>
                      <Text style={styles.packagePrice}>
                        {item?.package[1]?.PPPrice + ' ' + baseCurrency.usd}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        selected === 2 && {
                          borderBottomWidth: 2,
                          alignItems: 'center',
                          borderColor: colors.main,
                        }
                      }
                      onPress={() => {
                        setSelected(2);
                      }}>
                      <Text style={styles.packagePrice}>
                        {item?.package[2]?.PPPrice + ' ' + baseCurrency.usd}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* pacjage body */}
                  <View>
                    <Text style={[styles.packageTitle, {marginBottom: 20}]}>
                      {name}
                    </Text>
                    <Text style={styles.description}>
                      {categories[selected]?.description}
                    </Text>

                    {serviceId === 7 && (
                      <View style={{marginTop: 10, marginBottom: 10}}>
                        <View style={styles.rowApart}>
                          <Text style={styles.descriptionBold}>
                            Delivery Period
                          </Text>
                          <Text style={styles.descriptionBold}>
                            {delivery + ' ' + duration}
                          </Text>
                        </View>
                        <View style={styles.rowApart}>
                          <Text style={styles.descriptionBold}>revision</Text>
                          <Text style={styles.descriptionBold}>{revision}</Text>
                        </View>
                        {proofreading && (
                          <View style={styles.rowApart}>
                            <Text style={styles.descriptionBold}>
                              proofreading
                            </Text>
                            <Feather
                              name={'check'}
                              color={colors.main}
                              size={25}
                            />
                          </View>
                        )}
                        {formatting && (
                          <View style={styles.rowApart}>
                            <Text style={styles.descriptionBold}>
                              Document Formating
                            </Text>
                            <Feather
                              name={'check'}
                              color={colors.main}
                              size={25}
                            />
                          </View>
                        )}

                        {styling && (
                          <View style={styles.rowApart}>
                            <Text style={styles.descriptionBold}>
                              Language Style Guide
                            </Text>
                            <Feather
                              name={'check'}
                              color={colors.main}
                              size={25}
                            />
                          </View>
                        )}

                        {subtitling && (
                          <View style={styles.rowApart}>
                            <Text style={styles.descriptionBold}>
                              Subtitling
                            </Text>
                            <Feather
                              name={'check'}
                              color={colors.main}
                              size={25}
                            />
                          </View>
                        )}
                      </View>
                    )}

                    {serviceId === 3 && (
                      <View style={{marginTop: 20}}>
                        <Text style={styles.packageTitle}>
                          {t('common:price')}
                        </Text>

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
                              {PPPrice + ' ' + baseCurrency.usd + ' / hour'}
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
                              {PVPrice + ' ' + baseCurrency.usd + ' / hour'}
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
                              {PAPrice + ' ' + baseCurrency.usd + ' / hour'}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                    {/* {checkWritten && (
                      <View style={styles.rowApart}>
                        <CustomCheckBox
                          mp
                          selector={4}
                          checked={checkedW}
                          setChecked={setCheckedValue}
                          placeholder={booking_types[3].label}
                        />
                        <Text style={styles.description}>
                          {PWPrice + ' ' + baseCurrency.usd + ' / hour'}
                        </Text>
                      </View>
                    )} */}

                    {/* {categories[selected]?.delivery !== null && (
                    <View style={styles.rowApart}>
                      <Text style={styles.description}>Delivery</Text>
                      <Text style={styles.description}>
                        {categories[selected]?.delivery +
                          ' ' +
                          categories[selected]?.duration}
                      </Text>
                    </View>
                  )} */}
                  </View>

                  {/* end of package body */}
                  {faq !== null && (
                    <View style={{marginTop: 20}}>
                      <Text
                        style={[
                          styles.title,
                          {textAlign: 'justify', marginStart: 0},
                        ]}>
                        FAQ
                      </Text>
                      <Text style={styles.description}>{faq}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

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
    </View>
  );
};
export default ViewGigScreen;

const styles = StyleSheet.create({
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
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.black,
    margin: 10,
    marginStart: 0,
  },
  rowApart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
});
