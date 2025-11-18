import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Rating} from 'react-native-ratings';
import uuid from 'react-native-uuid';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {height, width} from '../utils';
import {AdsOrderType, RatingType} from '../types';
import {CustomButton, CustomError, CustomInput, CustomLoader} from '.';
import {useCreateOrderRatingMutation} from '../rtk/services/bookings';
import {success} from '../assets/images';

interface RatingModalProps {
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  onPress: () => void;
  item: AdsOrderType;
}

function RatingModal(props: RatingModalProps) {
  const [createOrderRating, {error, isLoading}] =
    useCreateOrderRatingMutation();

  const {modalVisible, setModalVisible, onPress, item} = props;
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();

  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [erroMessage, setErrorMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const onSubmitRating = async () => {
    if (rating === 0) {
      setErrorMessage('Rating is required');
      return;
    }

    const body: RatingType = {
      Id: uuid.v4() + '',
      OrderId: item.Order.Id,
      Review: comment,
      CompanyId: item.Order.CompanyId,
      UserId: item.Order.ReceiverId,
      Created: new Date(),
      Rating: rating,
    };

    setErrorMessage('');
    const response: any = await createOrderRating(body);

    if (response.data) {
      setMessage(t('common:rating') + ' ' + t('common:successful'));
    } else {
      setErrorMessage('Unable to rate this order, try again later');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}>
              <Feather color={colors.main} name={'x-circle'} size={25} />
            </Pressable>

            {isLoading && <CustomLoader color={colors.main} />}

            {message.length === 0 ? (
              <View>
                <Text style={styles.header}>{t('common:rate')}</Text>

                <Rating
                  onFinishRating={setRating}
                  style={{paddingVertical: spacing.fiften}}
                  imageSize={35}
                  startingValue={rating}
                />

                <Text style={styles.title}>
                  {t('common:write') + ' ' + t('common:review')}
                </Text>
                <CustomInput
                  placeholder={t('common:write') + ' ' + t('common:review')}
                  height={120}
                  onTextChange={setComment}
                  value={comment}
                />
                {erroMessage !== '' && <CustomError message={erroMessage} />}

                <View style={styles.buttonRow}>
                  <View style={styles.buttonWrapper}>
                    <CustomButton
                      buttonTitle={t('common:submit')}
                      textSize={fontSize.light}
                      onTap={onSubmitRating}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.header}>{t('common:rate')}</Text>
                <Image style={styles.image} source={success} />
                <Text style={styles.message}>{message}</Text>
                <View style={styles.buttonRow}>
                  <View style={styles.buttonWrapper}>
                    <CustomButton
                      buttonTitle={t('common:Continue')}
                      textSize={fontSize.light}
                      onTap={onPress}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default RatingModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
      width: width * 0.9,
      maxHeight: height * 0.9,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      paddingTop: 40,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeIcon: {
      position: 'absolute',
      right: 5,
      top: 5,
      zIndex: 10,
    },
    header: {
      fontFamily: fonts.medium,
      marginBottom: spacing.fiften,
      color: colors.black,
      fontSize: fontSize.regular,
      textAlign: 'center',
    },
    title: {
      color: colors.black,
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
    },
    message: {
      opacity: 0.6,
      fontFamily: fonts.regular,
      marginBottom: spacing.fiften,
      color: colors.black,
      fontSize: fontSize.regular,
      textAlign: 'center',
    },
    image: {
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
      height: 100,
      width: 100,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonWrapper: {
      width: width * 0.8,
    },
  });
