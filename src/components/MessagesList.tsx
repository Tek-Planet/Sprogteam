import React, {useEffect, useRef} from 'react';
import {ScrollView} from 'react-native';

import Message from './Message';
import {useAppSelector} from '../rtk/hooks';
import {ChatModel} from '../types';

interface MessagesListProps {
  // You can replace this with the actual type of onSwipeToReply
  messages: ChatModel[];
}

const MessagesList: React.FC<MessagesListProps> = ({messages}) => {
  const {user} = useAppSelector(state => state.user);

  const scrollView = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollView.current) {
      scrollView.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  return (
    <ScrollView
      style={{backgroundColor: 'white', flex: 1}}
      ref={scrollView}
      onContentSizeChange={() => {
        if (scrollView.current) {
          scrollView.current.scrollToEnd({animated: true});
        }
      }}>
      {messages.map((message, index) => (
        <Message
          key={index}
          item={message}
          isLeft={message.SenderId !== user.Id}
        />
      ))}
    </ScrollView>
  );
};

export default MessagesList;
