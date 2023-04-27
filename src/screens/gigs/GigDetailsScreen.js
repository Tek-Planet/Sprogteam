import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../../assets/fonts';
import {colors} from '../../assets/colors';
import {baseCurrency, toastNew} from '../../util/util';
import Swiper from 'react-native-swiper';
import {ActivityIndicator, Button, ProfileHeader} from '../../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import {ScrollView} from 'react-native-gesture-handler';
import {AuthContext} from '../../context/AuthProvider';
import {useTranslation} from 'react-i18next';
import {removeGig} from '../../data/data';

const GigDetailsScreen = ({route}) => {
  const {booking_types, setReloadGigs} = useContext(AuthContext);
  const {t} = useTranslation();

  const {item} = route.params;
  const {
    ID,
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
    userId,
  } = item;
  var categories = item.package;

  var images = [{imgUrl: imgOne}, {imgUrl: imgTwo}, {imgUrl: imgThree}];
  const [showMore, setShowMore] = useState(false);

  const [showImage, setShowImage] = useState(true);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);

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

  // console.log(delivery);
  const navigation = useNavigation();

  const deleteGig = async () => {
    console.log('Clicked');
    setLoading(true);
    const res = await removeGig(ID, userId);
    console.log(res);
    if (res !== null) {
      toastNew('Gig Deleted', 'success');
      setReloadGigs(true);
      navigation.goBack();
    } else {
      setLoading(false);
      toastNew('Unable to Delete Gig', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <View style={{justifyContent: 'space-between', flex: 1, padding: 10}}>
        <View style={{flex: 1}}>
          <ScrollView>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
              {showImage && (
                <View style={{height: 300}}>
                  <Swiper autoplay>
                    {images?.map((item, index) => {
                      return (
                        <ImageBackground
                          resizeMode="stretch"
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
                          width: '30%',
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

                    {
                      <View style={{marginTop: 20}}>
                        <Text style={styles.packageTitle}>
                          {t('common:price')}
                        </Text>

                        {checkPhone && (
                          <View style={styles.rowApart}>
                            <Text style={styles.description}>
                              {booking_types[2].label}
                            </Text>
                            <Text style={styles.description}>
                              {PPPrice + ' ' + baseCurrency.usd + ' / hour'}
                            </Text>
                          </View>
                        )}

                        {checkVideo && (
                          <View style={styles.rowApart}>
                            <Text style={styles.description}>
                              {booking_types[1].label}
                            </Text>
                            <Text style={styles.description}>
                              {PVPrice + ' ' + baseCurrency.usd + ' / hour'}
                            </Text>
                          </View>
                        )}

                        {checkAttendance && (
                          <View style={styles.rowApart}>
                            <Text style={styles.description}>
                              {booking_types[0].label}
                            </Text>
                            <Text style={styles.description}>
                              {PAPrice + ' ' + baseCurrency.usd + ' / hour'}
                            </Text>
                          </View>
                        )}
                      </View>
                    }
                    {/* {checkWritten && (
                      <View style={styles.rowApart}>
                        <Text style={styles.description}>
                          {booking_types[3].label}
                        </Text>
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

            {loading ? (
              <ActivityIndicator size={'large'} show={loading} />
            ) : (
              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonWrapper}>
                  <Button
                    onPress={() => navigation.navigate('EditGig', {item: item})}
                    bGcolor={'green'}
                    buttonTitle={t('common:edit')}
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button
                    onPress={() => {
                      deleteGig();
                    }}
                    bGcolor={'red'}
                    buttonTitle={t('common:delete')}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
export default GigDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  descriptionBold: {
    fontFamily: fonts.bold,
    color: colors.black,
    opacity: 0.8,
    textAlign: 'justify',
    lineHeight: 23,
    fontSize: 15,
  },
  packagePrice: {
    fontFamily: fonts.bold,
    margin: 10,
    fontSize: 20,
    color: colors.main,
    width: 100,
    textAlign: 'center',
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
  },
  buttonWrapper: {
    width: '50%',
  },
});
