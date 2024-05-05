import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {spacing} from '../../assets/spacing';
import {
  CustomError,
  CustomLoader,
  Footer,
  Header,
  SuccessModal,
} from '../../components';
import {getServices, isIpad, width} from '../../utils';
import {fonts} from '../../assets/fonts';
import baseStyles from '../../assets/styles';
import {useAppSelector} from '../../rtk/hooks';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {SelectOptionType} from '../../types';
import {useAddServiceMutation} from '../../rtk/services';

type Props = NativeStackScreenProps<AuthStackParams, 'AddServices'>;

const AddServicesScreen = ({route, navigation}: Props) => {
  const {userId} = route.params;
  const [addService] = useAddServiceMutation();

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {authenticated} = useAppSelector(state => state.user);
  const [myServices, setMyServices] = useState<SelectOptionType[]>([]);
  const [erroMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const updateList = (item: SelectOptionType) => {
    // Check if the item with the given ID exists in the list
    const itemExists = myServices.some(service => service.value === item.value);

    if (itemExists) {
      const updatedList = myServices.filter(
        service => service.value !== item.value,
      );
      setMyServices(updatedList);
    } else {
      setMyServices([...myServices, item]);
    }
  };

  const isExist = (item: SelectOptionType) => {
    // Check if the item with the given ID exists in the list
    const itemExists = myServices.some(service => service.value === item.value);

    if (itemExists) {
      return true;
    } else {
      return false;
    }
  };

  const save = async (value: string) => {
    const data: any = {
      InterpreterId: userId,
      ServiceId: value,
    };

    let response: any = await addService(data);
  };

  const onSubmit = () => {
    try {
      setLoading(true);
      for (const service of myServices) {
        save(service.value);
      }
      setMessage('Language Adde');
      setModalVisible(true);
    } catch (error) {
      setLoading(false);
      console.log('error creating account');
      setErrorMessage('Errror creating account');
    }
  };

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        showleftIcon={authenticated ? false : true}
        headerTitle={t('common:services')}
        showRightIcon
      />

      {loading && <CustomLoader color={colors.main} />}

      <View
        style={{
          marginTop: 5,
          justifyContent: 'space-between',
          flex: 1,
          marginBottom: spacing.ten,
        }}>
        <FlatList
          numColumns={2}
          contentContainerStyle={{}}
          keyExtractor={item => item.value}
          data={getServices()}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  updateList(item);
                }}
                style={[
                  styles.filterBox,
                  {backgroundColor: isExist(item) ? colors.main : colors.white},
                ]}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 80,
                  }}
                  source={item.image}
                />
                <Text
                  style={[
                    styles.filterText,
                    {color: isExist(item) ? colors.white : colors.black},
                  ]}>
                  {item.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {erroMessage.length > 0 && <CustomError message={erroMessage} />}

        {myServices.length > 0 && (
          <Footer
            lastPage
            onPressLeftIcon={() => {}}
            onPressRightIcon={() => {
              onSubmit();
            }}
          />
        )}

        {modalVisible && (
          <SuccessModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            message={message}
            closeModal={() => {
              setModalVisible(false);
              navigation.replace('Login');
            }}
          />
        )}
      </View>
    </View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: colors.white,
    },
    filterText: {
      marginTop: 10,
      fontFamily: fonts.bold,
      fontSize: 13,
      textAlign: 'center',
      color: colors.black,
    },
    filterBox: {
      margin: 5,
      borderRadius: 10,
      height: 160,
      width: isIpad ? width * 0.2 : width * 0.45,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
  });

export default AddServicesScreen;
