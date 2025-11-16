import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Header,
  MessagesList,
  ChatInput,
  CustomLoader,
  FilePickerSheet,
} from '../../components';

import {spacing} from '../../assets/spacing';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  useCreateChatsMutation,
  useGetChatsQuery,
  useGetInboxQuery,
} from '../../rtk/services/message';

import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {ChatModel} from '../../types';
import {BASE_URL} from '../../utils';
import {RootStackParams} from '../../navigations/MainNavigation';
import io from 'socket.io-client';
import {changeRoute} from '../../rtk/features/user/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<RootStackParams, 'Chats'>;

const ChatsScreen = ({route, navigation}: Props) => {
  const {user, gigState} = useAppSelector(state => state.user);

  const item: any = route?.params?.item ? route?.params?.item : gigState;

  let recipientId = item?.Id ? item?.Id : item?.userId;

  const channelId = item?.InboxId ? item.InboxId : 'default';

  const [InboxId, setInboxId] = useState<string>(channelId);

  const [skip, setskip] = useState<boolean>(
    InboxId === 'default' ? true : false,
  );

  const {data, error, isLoading} = useGetChatsQuery(InboxId + '', {
    refetchOnMountOrArgChange: true,
    skip: skip,
  });

  const {
    data: fetchInboxId,
    error: inboxError,
    isLoading: isLoadingInbox,
  } = useGetInboxQuery(recipientId, {
    skip: InboxId === 'default' ? false : true,
    refetchOnMountOrArgChange: true,
  });

  const [createChats] = useCreateChatsMutation();

  const dispatch = useAppDispatch();

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [messages, setMessages] = useState<ChatModel[]>([]);
  const [socket, setSocket] = useState<any>();
  const [showFileSheet, setShowFileSheet] = useState<Boolean>(false);

  const makeContactWithServer = () => {
    let conSocket = io(BASE_URL);

    conSocket.emit('joinRoom', {InboxId});

    setSocket(conSocket);

    conSocket.on('chat message', (msg: ChatModel) => {
      if (msg.SenderId !== user.Id) {
        setMessages(prevMessages => [...prevMessages, msg]);
      }
    });

    // Clean up the conSocket when the component unmounts
    return () => {
      conSocket.close();
    };
  };

  const sendMessage = (message: ChatModel) => {
    const body = {
      userId: recipientId,
      title: 'new message from ' + user.FirstName,
      text: message.Message,
      info: {
        Id: user.Id,
        type: '2',
        FirstName: user.FirstName,
        inboxID: InboxId,
      },
    };

    socket.emit('chat message', message, InboxId, body);

    createChats(message);
  };

  useEffect(() => {
    if (data && data.length > 0) setMessages(data);
  }, [data]);
  // console.log(InboxId, fetchInboxId);

  useEffect(() => {
    if (InboxId !== 'default') makeContactWithServer();
  }, [InboxId]);

  useEffect(() => {
    if (fetchInboxId) {
      setInboxId(fetchInboxId);
      setskip(false);
    }
  }, [fetchInboxId]);

  useEffect(() => {
    // Set route name when entering the page
    dispatch(changeRoute(route.name));

    return () => {
      dispatch(changeRoute('General'));
    };
  }, [route.name]);
  // console.log(InboxId);

  return (
    <GestureHandlerRootView style={{...styles.container}}>
      <View style={{...styles.container}}>
        {(isLoading || isLoadingInbox) && <CustomLoader color={colors.main} />}

        <Header
          isProflePage
          showProfileImage
          showleftIcon
          headerTitle={item?.FirstName + ' ' + item?.LastName}
        />

        <KeyboardAwareScrollView
          contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
          <MessagesList messages={messages} />
          <ChatInput
            setShowFileSheet={setShowFileSheet}
            InboxId={InboxId}
            sendMessage={sendMessage}
            setMessages={setMessages}
            receiver={item}
          />
          {showFileSheet && (
            <FilePickerSheet
              InboxId={InboxId}
              sendMessage={sendMessage}
              setMessages={setMessages}
              setShowFileSheet={setShowFileSheet}
            />
          )}
        </KeyboardAwareScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default ChatsScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    image: {
      height: 40,
      width: 40,
      borderRadius: 100,
    },
    iconStyle: {
      margin: spacing.five,
    },
  });
