import React, {useState} from 'react';
import {Text, View, StyleSheet, Pressable, Image} from 'react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {AdsOrderType, RatingType} from '../types';
import Feather from 'react-native-vector-icons/Feather';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {height, width} from '../utils';
import {CustomButton, CustomError, CustomInput, CustomLoader} from '.';
import {Rating} from 'react-native-ratings';
import {useCreateOrderRatingMutation} from '../rtk/services/bookings';
import uuid from 'react-native-uuid';
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
    var response: any;

    response = await createOrderRating(body);

    if (response.data) {
      setMessage(t('common:rating') + ' ' + t('common:successful'));
    } else {
      setErrorMessage('Unable to rate this order, try again later');
    }
  };

  return (
    <Modal
      visible={modalVisible}
      modalAnimation={
        new ScaleAnimation({
          // initialValue: 1,
          useNativeDriver: true,
        })
      }
      // modalTitle={<ModalTitle title={props.title} />}
      onTouchOutside={() => {
        setModalVisible(false);
      }}>
      <ModalContent
        style={{
          width: width * 0.9,
          maxHeight: height * 0.9,
        }}>
        <View style={{position: 'relative'}}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{position: 'absolute', right: 5, zIndex: 10}}>
            <Feather color={colors.main} name={'x-circle'} size={25} />
          </Pressable>
          {isLoading && <CustomLoader color={colors.main} />}
          {message.length === 0 ? (
            <View>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  marginBottom: spacing.fiften,
                  color: colors.black,
                  fontSize: fontSize.regular,
                  textAlign: 'center',
                }}>
                {t('common:rate')}
              </Text>

              <Rating
                // showRating
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
              <View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <View style={{width: width * 0.8}}>
                    <CustomButton
                      buttonTitle={t('common:submit')}
                      textSize={fontSize.light}
                      onTap={() => {
                        onSubmitRating();
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  marginBottom: spacing.fiften,
                  color: colors.black,
                  fontSize: fontSize.regular,
                  textAlign: 'center',
                }}>
                {t('common:rate')}
              </Text>

              <Image style={styles.image} source={success} />
              <Text
                style={{
                  opacity: 0.6,
                  fontFamily: fonts.regular,
                  marginBottom: spacing.fiften,
                  color: colors.black,
                  fontSize: fontSize.regular,
                  textAlign: 'center',
                }}>
                {message}
              </Text>
              <View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <View style={{width: width * 0.8}}>
                    <CustomButton
                      buttonTitle={t('common:Continue')}
                      textSize={fontSize.light}
                      onTap={() => {
                        onPress();
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ModalContent>
    </Modal>
  );
}

export default RatingModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    profileText: {
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      color: colors.black,
      marginStart: spacing.twenty,
    },
    iconBg: {
      height: 45,
      width: 45,
      backgroundColor: colors.ash,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.black,
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
    },
    image: {
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
      height: 100,
      width: 100,
    },
  });
