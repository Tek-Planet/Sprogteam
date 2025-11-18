import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';

import {fonts} from '../assets/fonts';
import {logo} from '../assets/images';
import {colors} from '../assets/colors';
import {SelectOptionType} from '../types';
import {spacing} from '../assets/spacing';
import {useAppSelector} from '../rtk/hooks';

interface CustomDropDownProps {
  value: SelectOptionType;
  options: SelectOptionType[];
  setValue: (item: SelectOptionType) => void;
  showSearch?: boolean;
  showImage?: boolean;
  title?: string;
  label?: string;
}

function CustomDropDown(props: CustomDropDownProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<SelectOptionType[]>(props.options);
  const [filter, setFilter] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const {defaultLanguage} = useAppSelector(state => state.user);

  useEffect(() => {
    setItems(props.options);
  }, [props.options]);

  const styles = getStyles();

  return (
    <View>
      {props.label && (
        <Text style={styles.label}>{props.label}</Text>
      )}

      <View
        style={[
          styles.dropdownContainer,
          {
            borderColor:
              props?.value?.value === 'error' ? colors.red : colors.lightGray,
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
              {defaultLanguage?.code === 'dk'
                ? props?.value?.labeldk || props?.value?.label
                : props?.value?.label || props?.value?.value}
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {props.title && (
                <Text style={styles.modalTitle}>{props.title}</Text>
              )}

              {props.showSearch && (
                <View style={styles.searchContainer}>
                  <Ionicon name="search" color="#585C5F" size={20} />
                  <TextInput
                    onChangeText={val => setFilter(val)}
                    style={styles.searchInput}
                    placeholderTextColor="#adb5bd"
                    placeholder={'search'}
                  />
                </View>
              )}

              <ScrollView>
                {items.map((item, index) => {
                  const label =
                    defaultLanguage?.code === 'dk'
                      ? item.labeldk || item.label
                      : item.label || item.value || '';
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
                })}
              </ScrollView>

              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setFilter('');
                }}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>

      {props?.value?.value === 'error' && (
        <Text style={styles.errorText}>required</Text>
      )}
    </View>
  );
}

export default CustomDropDown;

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
      width: 300,
      maxHeight: 300,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 15,
    },
    modalTitle: {
      fontFamily: fonts.medium,
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
    },
    searchContainer: {
      borderRadius: 10,
      backgroundColor: '#EDF0F9',
      marginVertical: 5,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
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
