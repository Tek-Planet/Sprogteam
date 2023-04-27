import React, { Component } from 'react';
import { View, Text } from 'react-native';

const Body = ({body, ...rest}) =>{

    return (
        <Text 
        { ...rest}
        style={{   fontFamily: 'Montserrat-Light',margin:10, marginStart:5, marginEnd:5,  textAlign:'justify', fontSize:16}}>{body}</Text>
    );
  
}

export default Body;
