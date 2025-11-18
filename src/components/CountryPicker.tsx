import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {CountryPicker} from "react-native-country-codes-picker";

import { colors } from "../assets/colors";
import { height } from "../utils";
import Feather from "react-native-vector-icons/Feather";
import { fonts } from "../assets/fonts";
import { spacing } from "../assets/spacing";

interface SelectCountryModalProps {
  setCountry: (country: string) => void;
  country?: string;
  showFLags?: boolean;
  setCountryCallingCode?: (code: string) => void;
  code?: any;
}

export default function SelectCountryModal(props: SelectCountryModalProps) {
  const {country, setCountry, setCountryCallingCode} = props;
  const [show, setShow] = useState(false);
  const [countryFlag, setCountryFlag] = useState('');


  return (
    <View style={styles.container}>
    
      <TouchableOpacity
        onPress={() => {
          setShow(true);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 16,
            color: colors.black,
          }}>
        {country}
        </Text>
        <Feather name={'chevron-down'} size={25} color={colors.lightGray} />
      </TouchableOpacity>

      {country === 'error' && (
        <Text
          style={{
            fontFamily: fonts.bold,
            color: colors.red,
            paddingHorizontal: spacing.five,
          }}>
          required
        </Text>
      )}

      {/* // For showing picker just put show state to show prop */}
      <CountryPicker
        lang="en"
        show={show}
        searchMessage={'search'}
        inputPlaceholder={'Inpurt'}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          setCountry(item.name.en)
         if(setCountryCallingCode) setCountryCallingCode(item.dial_code+"");
          setCountryFlag(item.flag)
          setShow(false);    
        }}

        style={{
          // Styles for whole modal [View]
          modal: {
              height: height*0.8,
             
          },
          // Styles for modal backdrop [View]
          backdrop: {
          
          },
          // Styles for bottom input line [View]
          line: {
          
          },
          // Styles for list of countries [FlatList]
        
          // Styles for input [TextInput]
          textInput: {
                height: 50,
                borderRadius: 0,
          },
          // Styles for country button [TouchableOpacity]
        
  
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: spacing.ten,
    borderRadius: 30,
    borderColor: colors.lightGray,
    marginVertical: spacing.ten,
    justifyContent: 'center',
  },
});