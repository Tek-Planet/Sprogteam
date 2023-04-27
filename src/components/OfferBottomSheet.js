import React, {useState, useEffect} from 'react';

import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  TextInput,
  Dimensions,
  Modal as InnerModal,
} from 'react-native';
import {Modal, ModalContent} from 'react-native-modals';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fonts} from '../assets/fonts';
import MiniBooking from './MiniBooking';
import {useTranslation} from 'react-i18next';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height - 150;

function ModalTester(props) {
  const {t} = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const {language, showSearch} = props;
  const [items, setItems] = useState(language);
  t('common:select');
  const [filter, setFilter] = useState('');

  const [value, setValue] = useState({
    label: 'select',
    value: 0,
  });

  useEffect(() => {
    setItems(language);
  }, [language]);

  return (
    <View
      style={{
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          height: 30,
          backgroundColor: '#D4D4D4',
          flexDirection: 'row',
          alignItems: 'center',
          paddingStart: 10,
        }}>
        <Ionicons name="flash" size={20} color="#659ED6" />

        <Text style={[{color: '#659ED6', marginStart: 10, fontSize: 16}]}>
          Create Request
        </Text>
      </TouchableOpacity>
      <Modal
        // onSwipeComplete={closeModal}
        propagateSwipe
        scrollOffset={0}
        visible={isModalVisible}
        onTouchOutside={() => {
          setModalVisible(false);
        }}>
        <View style={{maxHeight: windowHeight, width: windowWidth}}>
          <MiniBooking setModalVisible={setModalVisible} language={language} />
        </View>
      </Modal>
    </View>
  );
}

export default ModalTester;
