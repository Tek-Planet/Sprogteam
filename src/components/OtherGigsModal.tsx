import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {Modal, ScaleAnimation} from 'react-native-modals';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
import {GigType, SelectOptionType} from '../types';
import {spacing} from '../assets/spacing';
import {getCurrencies, width} from '../utils';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {logo} from '../assets/images';

interface OtherGigsModalProps {
  value: GigType;
  setValue: (val: GigType) => void;
  label?: string;
  data: GigType[];
}

function OtherGigsModal(props: OtherGigsModalProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const userId: any = props.value.userId;
  const {t} = useTranslation();

  return (
    <View>
      {props.label && (
        <Text
          style={{
            fontFamily: fonts.medium,
            color: colors.black,
            fontSize: 16,
            paddingHorizontal: spacing.five,
          }}>
          {props.label}
        </Text>
      )}

      <View
        style={{
          borderWidth: 1,
          padding: 10,
          marginTop: 10,
          marginBottom: 10,
          borderRadius: 30,
        }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: colors.black,
                fontSize: 16,
                opacity: 0.8,
              }}>
              {t('common:select')}
            </Text>
          </View>
          <Fontisto name={'caret-down'} size={14} color={colors.lightGray} />
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          modalAnimation={
            new ScaleAnimation({
              // initialValue: 1,
              useNativeDriver: true,
            })
          }
          onTouchOutside={() => {
            setModalVisible(false);
          }}>
          <SafeAreaView style={{flex: 1, width: width}}>
            <View>
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}>
                <Ionicon
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  name="close"
                  color="#585C5F"
                  size={25}
                />
              </View>
              <ScrollView>
                {props.data.map((item, index) => {
                  const currency: SelectOptionType =
                    getCurrencies()[item.CurrencyId - 1];

                  return (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => {
                        props.setValue(item);
                        setModalVisible(false);
                        // setFilter('');
                        // setImage(item.image);
                      }}
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        alignItems: 'center',
                        marginTop: spacing.fiften,
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 70, width: 70}}
                        source={item?.imgOne ? {uri: item?.imgOne} : logo}
                      />
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily: fonts.medium,
                            color: colors.black,
                            fontSize: 16,
                            paddingHorizontal: spacing.five,
                          }}>
                          {item.title}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={{
                              fontFamily: fonts.medium,
                              color: colors.black,
                              fontSize: 16,
                              paddingHorizontal: spacing.five,
                            }}>
                            {t('common:price')}:{' '}
                          </Text>

                          <Text
                            style={{
                              fontFamily: fonts.medium,
                              color: colors.black,
                              fontSize: 16,
                              paddingHorizontal: spacing.five,
                            }}>
                            {currency.label + ' '}
                            {item.ActualCost}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </View>
  );
}

export default OtherGigsModal;
