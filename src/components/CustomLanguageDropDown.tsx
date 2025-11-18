import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
  SafeAreaView,
  Keyboard,
  Modal,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';

import {fonts} from '../assets/fonts';
import {logo} from '../assets/images';
import {colors} from '../assets/colors';
import {SelectOptionType} from '../types';
import {spacing} from '../assets/spacing';
import {height, width} from '../utils';

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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    setItems(props.options);
  }, [props.options]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const styles = getStyles();

  return (
    <View>
      {props.label && <Text style={styles.label}>{props.label}</Text>}

      <View
        style={[
          styles.dropdownContainer,
          {
            borderColor:
              props.value.value === 'error' ? colors.red : colors.lightGray,
          },
        ]}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.dropdownTrigger}>
          <View style={styles.dropdownContent}>
            {props.showImage && (
              <Image
                style={styles.image}
                source={image === null ? logo : {uri: image}}
              />
            )}
            <Text style={styles.selectedText}>
              {props.value.label || props.value.value}
            </Text>
          </View>
          <Fontisto name={'caret-down'} size={14} color={colors.lightGray} />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setFilter('');
          }}>
          <SafeAreaView style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  height: Platform.OS === 'ios'
                    ? height * 0.85
                    : isKeyboardVisible
                    ? height * 0.5
                    : height * 0.85,
                },
              ]}>
              {props.showSearch && (
                <View style={styles.searchContainer}>
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
                    style={styles.searchInput}
                    placeholderTextColor="#adb5bd"
                    placeholder={'search'}
                  />
                </View>
              )}

              <FlatList
                keyExtractor={item => item.value}
                data={items}
                renderItem={({item}) => {
                  const label = item.label || item.value || '';
                  if (label.toLowerCase().includes(filter.toLowerCase())) {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          props.setValue(item);
                          setModalVisible(false);
                          setFilter('');
                        }}
                        style={styles.optionRow}>
                        {item?.image && props.showImage && (
                          <Image
                            style={styles.image}
                            source={{uri: item?.image + ''}}
                          />
                        )}
                        <Text style={styles.optionText}>{label}</Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                }}
              />

              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setFilter('');
                }}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Modal>
      </View>

      {props.value.value === 'error' && (
        <Text style={styles.errorText}>required</Text>
      )}
    </View>
  );
}

export default CustomLanguageDropDown;

const getStyles = () =>
  StyleSheet.create({
    label: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      paddingHorizontal: spacing.five,
    },
    dropdownContainer: {
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 30,
    },
    dropdownTrigger: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
    },
    dropdownContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedText: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      opacity: 0.8,
    },
    image: {
      width: 23,
      height: 23,
      marginEnd: 15,
      borderRadius: 100,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      width: width * 0.9,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 15,
    },
    searchContainer: {
      borderRadius: 10,
      backgroundColor: '#EDF0F9',
      marginVertical: 5,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.ten,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: '#000',
      fontFamily: fonts.light,
      fontSize: 16,
      paddingHorizontal: 10,
    },
    optionRow: {
      flexDirection: 'row',
      margin: 5,
      alignItems: 'center',
    },
    optionText: {
      fontFamily: fonts.medium,
      margin: 5,
    },
    closeButton: {
      marginTop: 10,
      alignSelf: 'center',
      padding: 10,
    },
    closeText: {
      fontFamily: fonts.medium,
      color: colors.main,
    },
    errorText: {
      fontFamily: fonts.bold,
      color: colors.red,
      paddingHorizontal: spacing.five,
    },
  });
