import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';

import {fontSize, fonts} from '../assets/fonts';

import {colorTypes} from '../assets/colors';
import Feather from 'react-native-vector-icons/Feather';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {height, width} from '../utils';
import {CustomButton} from '.';

interface DeleteAccountModalProps {
  isModalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  title: string;
  question: string;
  cancelText: string;
  continueText: string;
  onContinue: () => void;
}

function DeleteAccountModal(props: DeleteAccountModalProps) {
  const {
    isModalVisible,
    setModalVisible,
    title,
    question,
    cancelText,
    continueText,
    onContinue,
  } = props;

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();

  return (
    <Modal
      visible={isModalVisible}
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

          <Text
            style={{
              fontFamily: fonts.medium,
              marginBottom: spacing.fiften,
              color: colors.black,
              fontSize: fontSize.regular,
              textAlign: 'center',
            }}>
            {title}
          </Text>

          <View>
            <Text
              style={{
                opacity: 0.6,
                fontFamily: fonts.regular,
                marginBottom: spacing.fiften,
                color: colors.black,
                fontSize: fontSize.regular,
                textAlign: 'center',
              }}>
              {question}
            </Text>

            {/* action buttond  */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <View style={{width: width * 0.3}}>
                <CustomButton
                  buttonTitle={cancelText}
                  textSize={fontSize.light}
                  onTap={() => {
                    setModalVisible(false);
                  }}
                  bGcolor={colors.white}
                  testColor={colors.main}
                  borderWidth={1}
                />
              </View>
              <View style={{width: width * 0.3}}>
                <CustomButton
                  buttonTitle={continueText}
                  textSize={fontSize.light}
                  onTap={() => {
                    onContinue();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
}

export default DeleteAccountModal;

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
    image: {
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
    },
  });
