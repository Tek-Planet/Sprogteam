import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Feather';
import {colorTypes} from '../assets/colors';
import baseStyles from '../assets/styles';
import {useTheme} from '@react-navigation/native';
import {spacing} from '../assets/spacing';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppSelector} from '../rtk/hooks';
import {ChatModel, UserModel} from '../types';
import uuid from 'react-native-uuid';
import moment from 'moment';
import {convertToDanishLocalTime, getCurrentDate} from '../utils';

interface ChatInputProps {
  setMessages: (item: any) => void;
  sendMessage: (item: ChatModel) => void;
  InboxId: string;
  setShowFileSheet: (val: Boolean) => void;
  receiver: any;
}

const ChatInput: React.FC<ChatInputProps> = ({
  setMessages,
  sendMessage,
  InboxId,
  setShowFileSheet,
  receiver,
}) => {
  const [message, setMessage] = useState('');

  const {user} = useAppSelector(state => state.user);

  const {colors} = useTheme();
  const styles = getStyles(colors);

  return (
    <Animated.View style={[styles.container]}>
      <View style={styles.innerContainer}>
        <View style={{...styles.inputAndMicrophone, ...baseStyles.elevation}}>
          <TextInput
            multiline
            placeholder={'Type something...'}
            style={styles.input}
            value={message}
            onChangeText={text => setMessage(text)}
          />

          <TouchableOpacity
            onPress={() => setShowFileSheet(true)}
            style={styles.rightIconButtonStyle}>
            <Ionicons name="camera" size={23} color={colors.main} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const newmsg: any = {
                Id: uuid.v4() + '',
                ChannelId: InboxId,
                SenderId: user.Id,
                SenderName: user.FirstName + ' ' + user.LastName,
                ReceiverName: receiver?.FirstName + ' ' + receiver?.LastName,
                SentTime: convertToDanishLocalTime(new Date()), //getCurrentDate().toISOString(),
                MessageTime: moment(
                  convertToDanishLocalTime(new Date()),
                ).format('DD.MM.YYYY HH.mm'),
                Message: message,
                isOffer: null,
                image: null,
                recipient: receiver?.Email,
              };
              setMessages((prevMessages: ChatModel[]) => [
                ...prevMessages,
                newmsg,
              ]);

              sendMessage(newmsg);
              setMessage('');
            }}
            style={styles.sendButton}>
            <Ionicons name={'send'} size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      backgroundColor: colors.white,
    },

    innerContainer: {
      paddingHorizontal: spacing.five,
      marginHorizontal: spacing.ten,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: spacing.twenty,
    },
    inputAndMicrophone: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      flex: 3,
      paddingVertical: Platform.OS === 'ios' ? spacing.ten : 0,
      borderRadius: spacing.ten * 3,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
      backgroundColor: 'transparent',
      paddingLeft: spacing.ten,
      color: colors.black,
      flex: 3,
      fontSize: 15,
      height: 50,
      alignSelf: 'center',
    },
    rightIconButtonStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: spacing.ten,
      paddingLeft: 10,
      borderLeftWidth: 1,
      borderLeftColor: '#fff',
    },

    sendButton: {
      backgroundColor: colors.main,
      borderRadius: 30,
      height: 38,
      width: 38,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.ten,
    },
  });

export default ChatInput;
