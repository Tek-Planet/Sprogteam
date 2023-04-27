import React, { Component } from 'react';
import { View, Text , ScrollView, FlatList} from 'react-native';
import Header from '../../components/Header'
import TitleHeader from '../../components/TitleHeader'
import Body from '../../components/Body'
import Contact from '../../components/Contact'
import {language} from '../../data/data';

const InterpretationScreen= ()=> {

  const listItem = (item,index)=>{
    return(
     <View key= {index} style={{margin:5, padding:3, borderWidth:1, borderColor:'grey', borderRadius:10, width:80 }}> 
        <Text style={{   fontFamily: 'Montserrat-Light', fontSize:12, textAlign:'center'}}>{item.title}</Text>
     </View>
    )
  }
  
    return (
      <ScrollView>
       <Header />
       <View style={{marginStart:8, marginEnd:8}}>
       <TitleHeader title={'About us'}/>
       <Body body={'Aats Aps is a professional and ambitious translation and interpreting agency. We are based in Aalborg, but solve tasks throughout the country.'} />
       <Body body={'Among our employees, we have well-trained translators for tasks at the highest level, interpreters with approval under the Ministry of Justice for tasks within police, integration and the judiciary, as well as interpreters with extensive experience in the municipal and regional area.'} />
       <Body body={'Our interpreters for the municipal area are approved through internal procedures and screenings with regard to language, mother tongue and culture. We always strive to use local interpreters for local tasks for the sake of knowledge and promotion of the local labor market.'} />
       <Body body={'Our IT solutions are based on our own professional booking system, where all activities are encrypted. Our video interpretations are done via Skype for Business, which ensures high quality and security. It is completely free for our customers.'} />
       <Text style={{ marginTop:10, textAlign:'justify'}}>
        <Text style={{   fontFamily: 'Montserrat-Medium', fontSize:16}}>
        Our mission
        </Text>
        <Body body={' is to create high quality translations and offer individual and flexible solutions that provide value for the customer.'} />
        </Text>
        <Text style={{ marginTop:10, textAlign:'justify'}}>
        <Text style={{   fontFamily: 'Montserrat-Medium', fontSize:16}}>
        Our vision
        </Text>
       <Body body={' is to be the most attractive partner for both private companies and municipalities in the North Jutland Region.'} />

        </Text>

        <Text style={{ marginTop:10, textAlign:'justify'}}>
        <Text style={{   fontFamily: 'Montserrat-Medium', fontSize:16}}>
        Our values
        </Text>
        <Body body={' are to be open, listening and co-creative. Everything we do, we do to create results - for ourselves and not least for our partners.'} />

        </Text>
       </View>   
      
     
              <Contact />
      </ScrollView>
    );
  }


export default InterpretationScreen;
