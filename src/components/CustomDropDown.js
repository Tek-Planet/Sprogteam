import React, {useState, useEffect} from 'react';

import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  Modal,
  ModalTitle,
  ModalContent,
  ScaleAnimation,
} from 'react-native-modals';
import {Icon} from 'react-native-elements';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';

function CustomDropDown(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const {value, language, setValue, showSearch, title} = props;
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
        borderRadius: 10,
        borderColor: colors.main,
        margin: 5,
      }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}>
        <Text
          style={{fontFamily: fonts.medium, fontSize: 16, color: colors.black}}>
          {value.label}
        </Text>
        <Icon
          type={'fontisto'}
          name={'caret-down'}
          size={14}
          color={'#659ED6'}
        />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        modalAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        modalTitle={<ModalTitle title={title} />}
        onTouchOutside={() => {
          setModalVisible(false);
          setFilter('');
        }}>
        <ModalContent
          style={{
            width: 300,
            maxHeight: 300,
          }}>
          <View>
            {showSearch && (
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
                }}>
                <Ionicon name="search" color="#585C5F" size={20} />
                <TextInput
                  onChangeText={val => setFilter(val)}
                  style={{
                    flex: 1,
                    height: 40,
                    borderColor: '#adb5bd',
                    color: colors.black,
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
              {items?.map((item, index) => {
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
                        style={{
                          fontFamily: fonts.medium,
                          margin: 5,
                          color: colors.black,
                        }}
                        key={index}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
}

export default CustomDropDown;
