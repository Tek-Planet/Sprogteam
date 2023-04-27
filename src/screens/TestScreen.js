import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import TextBox from '../components/TextInput';
import io from 'socket.io-client';

const App = ({}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket = io('http://192.168.0.106:3000');
    socket.on('chat message', msg => {
      const engine = socket.io.engine;
      console.log(engine.transport.name);
      engine.on('packetCreate', ({id, data}) => {
        console.log(id);
      });
      setChatMessages(chatMessages => [...chatMessages, msg]);
    });
  }, []);

  const display = () => {
    return <Text>{'helo'}</Text>;
  };

  const submitChatMessage = () => {
    // console.log(chatMessage);
    socket.emit('chat message', chatMessage);
    setChatMessage('');
    console.log(chatMessages);
  };

  return (
    <View>
      <TextBox
        keyboardType={'email-address'}
        value={chatMessage}
        onChangeText={val => setChatMessage(val)}
        placeholderTextColor="#fafafa"
        autoCapitalize={'none'}
        onSubmitEditing={() => submitChatMessage()}
        autoCompleteType={'email'}
      />

      <Text>Hello {JSON.stringify(chatMessages)}</Text>

      {display}
    </View>
  );
};

export default App;
