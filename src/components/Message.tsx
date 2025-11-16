import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Animated, Image, Pressable} from 'react-native';
import {colorTypes} from '../assets/colors';
import moment from 'moment';
import {fontSize, fonts} from '../assets/fonts';
import {CustomButton} from '.';
import {useTranslation} from 'react-i18next';
import {documents} from '../assets/images';
import {ChatModel} from '../types';

interface MessageProps {
  item: ChatModel;
  isLeft: boolean;
}

const Message = ({isLeft, item}: MessageProps) => {
  const {SentTime, Message, isOffer, image, media} = item;
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();

  const isOnLeft = (type: string) => {
    if (isLeft && type === 'messageContainer') {
      return {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 0,
      };
    } else if (isLeft && type === 'message') {
      return {
        color: '#000',
      };
    } else if (isLeft && type === 'time') {
      return {
        color: 'darkgray',
      };
    } else {
      return {
        borderTopRightRadius: 0,
      };
    }
  };

  return (
    <Animated.View style={[styles.container]}>
      <Pressable
        onPress={() => {
          // console.log(imag);
        }}
        style={[styles.messageContainer, isOnLeft('messageContainer')]}>
        <View style={styles.messageView}>
          {image ? (
            <Image
              source={media === 'image' ? {uri: image} : documents}
              style={
                media === 'image'
                  ? {height: 100, width: 100}
                  : {height: 50, width: 50}
              }
              resizeMode={'cover'}
            />
          ) : isOffer ? (
            <View>
              <Text style={[styles.offertext, isOnLeft('message')]}>
                Booking ID:{'\n'}
                {Message}
              </Text>
              <CustomButton
                bGcolor={isLeft ? colors.main : colors.lightGray}
                textSize={12}
                buttonTitle={t('common:details')}
                padding={1}
                onTap={() => {
                  {
                  }
                  // decideResponse(currentMessage.text, currentMessage.user._id);
                }}
              />
            </View>
          ) : (
            <Text style={[styles.message, isOnLeft('message')]}>{Message}</Text>
          )}
        </View>
        <View style={styles.timeView}>
          <Text style={[styles.time, isOnLeft('time')]}>
            {moment(SentTime).utc().format('DD.MM.YY HH.mm')}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingVertical: 10,
      marginVertical: 5,
    },
    messageContainer: {
      backgroundColor: colors.main,
      maxWidth: '80%',
      alignSelf: 'flex-end',
      flexDirection: 'row',
      borderRadius: 15,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      paddingTop: 5,
      paddingBottom: 10,
    },
    messageView: {
      backgroundColor: 'transparent',
      maxWidth: '80%',
    },
    timeView: {
      backgroundColor: 'transparent',
      justifyContent: 'flex-end',
      paddingLeft: 10,
      flex: 1,
    },
    message: {
      color: 'white',
      alignSelf: 'flex-start',
      fontSize: 15,
    },
    time: {
      color: 'lightgray',
      alignSelf: 'flex-end',
      fontSize: 10,
    },
    offertext: {
      fontSize: fontSize.light,
      margin: 5,
      fontFamily: fonts.medium,
      color: colors.white,
    },
  });

export default Message;
