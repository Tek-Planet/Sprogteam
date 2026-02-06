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

interface MultiSelectDropDownProps {
  values: SelectOptionType[]; // multiple selected
  options: SelectOptionType[];
  setValues: (items: SelectOptionType[]) => void;
  showSearch?: boolean;
  showImage?: boolean;
  title?: string;
  label?: string;
}

function MultiSelectDropDown(props: MultiSelectDropDownProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<SelectOptionType[]>(props.options);
  const [filter, setFilter] = useState('');
  const {defaultLanguage} = useAppSelector(state => state.user);

  useEffect(() => {
    setItems(props.options);
  }, [props.options]);

  const styles = getStyles();

  const toggleSelect = (item: SelectOptionType) => {
    const exists = props.values.find(v => v.value === item.value);
    if (exists) {
      props.setValues(props.values.filter(v => v.value !== item.value));
    } else {
      props.setValues([...props.values, item]);
    }
  };

  const removeItem = (item: SelectOptionType) => {
    props.setValues(props.values.filter(v => v.value !== item.value));
  };

  const selectedLabels = props.values.map(v =>
    defaultLanguage?.code === 'dk' ? v.labeldk || v.label : v.label || v.value,
  );

  return (
    <View>
      {props.label && <Text style={styles.label}>{props.label}</Text>}

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.dropdownTrigger}>
          <View style={styles.dropdownContent}>
            <Text style={styles.selectedText}>
              {selectedLabels.length > 0
                ? selectedLabels.join(', ')
                : 'Select...'}
            </Text>
          </View>
          <Fontisto name={'caret-down'} size={14} color={colors.lightGray} />
        </TouchableOpacity>

        {/* Show chips for selected items with remove button */}
        <View style={styles.selectedChips}>
          {props.values.map(item => {
            const label =
              defaultLanguage?.code === 'dk'
                ? item.labeldk || item.label
                : item.label || item.value;
            return (
              <View key={item.value} style={styles.chip}>
                <Text style={styles.chipText}>{label}</Text>
                <Pressable onPress={() => removeItem(item)}>
                  <Text style={styles.removeText}>×</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

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
                    const selected = props.values.some(
                      v => v.value === item.value,
                    );
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => toggleSelect(item)}
                        style={styles.optionRow}>
                        {item?.image && props.showImage && (
                          <Image
                            style={styles.image}
                            source={{uri: item?.image + ''}}
                          />
                        )}
                        <Text style={styles.optionText}>
                          {selected ? '✓ ' : ''}
                          {label}
                        </Text>
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
    </View>
  );
}

export default MultiSelectDropDown;

const getStyles = () =>
  StyleSheet.create({
    label: {fontFamily: fonts.medium, color: colors.black, fontSize: 16},
    dropdownContainer: {
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 30,
      borderColor: colors.lightGray,
    },
    dropdownTrigger: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
    },
    dropdownContent: {flexDirection: 'row', alignItems: 'center'},
    selectedText: {
      fontFamily: fonts.medium,
      color: colors.black,
      fontSize: 16,
      opacity: 0.8,
    },
    selectedChips: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 5},
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EDF0F9',
      borderRadius: 15,
      paddingHorizontal: 10,
      margin: 3,
    },
    chipText: {fontFamily: fonts.medium, marginRight: 5},
    removeText: {color: colors.red, fontSize: 16},
    image: {width: 23, height: 23, marginEnd: 15, borderRadius: 100},
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
    modalTitle: {fontFamily: fonts.medium, fontSize: 18, marginBottom: 10},
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
    optionRow: {flexDirection: 'row', margin: 5, alignItems: 'center'},
    optionText: {fontFamily: fonts.medium, margin: 5},
    closeButton: {marginTop: 10, alignSelf: 'center', padding: 10},
    closeText: {fontFamily: fonts.medium, color: colors.main},
  });
