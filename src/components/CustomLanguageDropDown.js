import React, {useState, useEffect} from 'react';

import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Modal,
} from 'react-native';
// import {Modal, ModalContent} from 'react-native-modals';
import {Icon} from 'react-native-elements';
import {colors} from '../assets/colors';

import {fonts} from '../assets/fonts';

function CustomLanguageDropDown(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const {value, language, setValue, showSearch} = props;
  const [items, setItems] = useState(language);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setItems(language);
  }, [language]);

  return (
    <View
      style={{
        borderWidth: 1,
        padding: 5,
        margin: 5,
        borderRadius: 10,
        borderColor: colors.main,
      }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}>
        <Text style={{fontFamily: fonts.medium, fontSize: 16}}>
          {value.label}
        </Text>
        <Icon
          type={'fontisto'}
          name={'caret-down'}
          size={14}
          color={colors.main}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        onTouchOutside={() => {
          setModalVisible(false);
          setFilter('');
        }}>
        <SafeAreaView
          style={{
            padding: 50,
            margin: 20,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {!showSearch && (
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
                    padding: 10,
                    flex: 1,
                  }}>
                  <Icon
                    type="ionicons"
                    name="search"
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

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: 'red',
                  borderRadius: 100,
                  height: 25,
                  width: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  type="ionicons"
                  name="close"
                  color={colors.white}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {items.map((item, index) => {
                if (item.label.toLowerCase().includes(filter.toLowerCase())) {
                  return (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => {
                        setValue(item);
                        setModalVisible(false);
                        setFilter('');
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 5,
                      }}>
                      <Text
                        style={{fontFamily: fonts.medium, margin: 5}}
                        key={index}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default CustomLanguageDropDown;
