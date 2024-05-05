import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {Modal, ModalTitle, ScaleAnimation} from 'react-native-modals';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';

import {fonts} from '../assets/fonts';
import {logo} from '../assets/images';
import {colors} from '../assets/colors';
import {SelectOptionType} from '../types';
import {spacing} from '../assets/spacing';
import {height, isIOS, width} from '../utils';

interface CustomLanguageDropDownProps {
  value: SelectOptionType;
  options: SelectOptionType[];
  setValue: (item: SelectOptionType) => void;
  showSearch?: boolean;
  showImage?: boolean;
  title?: string;
  label?: string;
}

function CustomLanguageDropDown(props: CustomLanguageDropDownProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<SelectOptionType[]>(props.options);
  const [filter, setFilter] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setItems(props.options);
  }, [props.options]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    // Clean up listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
          borderColor:
            props.value.value === 'error' ? colors.red : colors.lightGray,
          // backgroundColor: colors.main,
        }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.showImage && (
              <Image
                style={{
                  width: 23,
                  height: 23,
                  marginEnd: 15,
                  borderRadius: 100,
                }}
                source={image === null ? logo : {uri: image}}
              />
            )}
            <Text
              style={{
                fontFamily: fonts.medium,
                color: colors.black,
                fontSize: 16,
                opacity: 0.8,
              }}>
              {props.value.label || props.value.value}
            </Text>
          </View>
          <Fontisto name={'caret-down'} size={14} color={colors.lightGray} />
        </TouchableOpacity>
        <Modal
          height={
            isIOS ? height : isKeyboardVisible ? height * 0.5 : height * 0.85
          }
          visible={isModalVisible}
          modalAnimation={
            new ScaleAnimation({
              // initialValue: 1,
              useNativeDriver: true,
            })
          }
          //  modalTitle={<ModalTitle title={props.title ? props.title : ''} />}
          onTouchOutside={() => {
            setModalVisible(false);
            setFilter('');
          }}>
          <SafeAreaView style={{flex: 1, width: width}}>
            <View style={{flex: 1}}>
              {props.showSearch && (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#EDF0F9',
                    marginTop: 5,
                    marginBottom: 5,
                    height: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginStart: 5,
                    marginEnd: 5,
                    paddingStart: spacing.ten,
                  }}>
                  <Ionicon
                    onPress={() => {
                      setModalVisible(false);
                      setFilter('');
                    }}
                    name="close"
                    color="#585C5F"
                    size={20}
                  />
                  <TextInput
                    onChangeText={val => setFilter(val)}
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
                    placeholder={'search'}
                  />
                </View>
              )}
              <ScrollView>
                {items.map((item, index) => {
                  const label = item.label || item.value || '';
                  if (label.toLowerCase().includes(filter.toLowerCase())) {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => {
                          props.setValue(item);
                          setModalVisible(false);
                          setFilter('');
                          // setImage(item.image);
                        }}
                        style={{
                          flexDirection: 'row',
                          margin: 5,
                        }}>
                        {item?.image && props.showImage && (
                          <Image
                            style={{
                              width: 23,
                              height: 23,
                              marginEnd: 15,
                              borderRadius: 100,
                            }}
                            source={{uri: item?.image + ''}}
                          />
                        )}
                        <Text
                          style={{fontFamily: fonts.medium, margin: 5}}
                          key={index}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>

      {props.value.value === 'error' && (
        <Text
          style={{
            fontFamily: fonts.bold,
            color: colors.red,
            paddingHorizontal: spacing.five,
          }}>
          required
        </Text>
      )}
    </View>
  );
}

export default CustomLanguageDropDown;
