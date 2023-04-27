import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import Header from '../../components/Header'
import TitleHeader from '../../components/TitleHeader'
import Body from '../../components/Body'
import Contact from '../../components/Contact'
import TextBox from '../../components/TextInput'
import TextBoxTitle from '../../components/TextBoxTitle'
import Ionicons from 'react-native-vector-icons/Ionicons';

const InterpretationScreen= ()=> {

    return (
      <ScrollView>
       <Header />
       <View style={{marginStart:8, marginEnd:8}}>
       <TitleHeader title={'Job'}/>
       <Body body={'We are always looking for new interpreters to expand our team. Would you like a job as an interpreter or translator, please fill out the form below, which we will review and then get back to you.'} />
      
        <View>
        {/* firstname */}
        <TextBoxTitle title = 'First Name' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />
        {/* Last name */}
        <TextBoxTitle title = 'Last Name' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />

          {/* email */}
          <TextBoxTitle title = 'Email' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />

          {/* Telephone*/}
        <TextBoxTitle title = 'Telephone' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />

          {/* Address */}
          <TextBoxTitle title = 'Address' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />

          {/* sex*/}
          <TextBoxTitle showAsh={true} title = 'sex' />
          <View style={{marginStart:5, flexDirection:'row'}}>
          <Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

          <Text style={{margin:3}}>
            Man
          </Text>

<Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

<Text style={{margin:3}}>
           Woman
          </Text>
          </View> 
          {/* Education */}
          <TextBoxTitle title = 'Education' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />

          {/* language */}
          <TextBoxTitle title = 'Language' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />
{/* police approved */}
<TextBoxTitle showAsh={true} title = 'Are you police approved in some languages?' />
<View style={{marginStart:5, flexDirection:'row'}}>
          <Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

          <Text style={{margin:3}}>
            Yes
          </Text>

<Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

<Text style={{margin:3}}>
          No
          </Text>
          </View>
        {/* language experience */}
<TextBoxTitle showAsh={true} title = 'If so, which languages? And how much experience with each language?' />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />

         {/*Area of experience */}
<TextBoxTitle title = 'Areas of experience' showAsh={true} />
          <View style={{marginStart:5,}}>
          <View style={{flexDirection:'row'}}>
          <Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

          <Text style={{margin:3}}>
          Kommunal
          </Text>
          </View>
          <View style={{flexDirection:'row'}}>
          <Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

          <Text style={{margin:3}}>
          Family cases
          </Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

          <Text style={{margin:3}}>
          Lawyer
          </Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

          <Text style={{margin:3}}>
          Medicine / psychiatry
          </Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Ionicons
                name="square-outline"
                size={20}
                color="#7A7A7A"
                onPress={() => changeList(checkList.indexOf(item))}
              />

          <Text style={{margin:3}}>
          Interpretation in court (must be police approved)
          </Text>
          </View>
          </View>


         {/*Other area of experience */}
        <TextBoxTitle title = 'Other areas of experience' showAsh={true}/>
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />

           {/*Possibly. remarke */}
<TextBoxTitle title = 'Possibly. remark' showAsh={true} />
        <TextBox
          onChangeText={val => console.log(val)}
          placeholderTextColor="#fafafa"
        />


<TouchableOpacity  style={{backgroundColor:'#7A7A7A', margin:20, padding:10, borderWidth:1, borderColor:'grey', borderRadius:10, width:'60%', alignSelf:'center' }}> 
      <Text style={{   fontFamily: 'Montserrat-Medium', fontSize:14, color:'#fff', textAlign:'center'}}>Submit Form</Text>
    
      </TouchableOpacity>

        </View>
   
       </View>   
      
     
              <Contact />
      </ScrollView>
    );
  }


export default InterpretationScreen;
