import React from 'react';
import {
  View,
  Linking,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {colors} from '../assets/colors';
import {fonts} from '../assets/fonts';
import {facebook, instagram, linkedin, twitter} from '../assets/icons';
import TitleHeader from './TitleHeader';

const Contact = ({title}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        paddingTop: 20,
      }}>
      <TitleHeader title={title} />
      <Text style={styles.contactText}>
        Sprogteam{'\n'} info@sprogteam.dk{'\n'} +4522665421{'\n'} Porsvej 2
        {'\n'} 9000 Aalborg{'\n'} Danmark
      </Text>

      <TitleHeader title={'Follow US'} />
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.linkedin.com/company/15814785/admin/')
          }
          style={{}}>
          <Image resizeMode="contain" style={styles.image} source={linkedin} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://www.facebook.com/Sprogteam-110700277998551',
            )
          }
          style={{}}>
          <Image resizeMode="contain" style={styles.image} source={facebook} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.instagram.com/sprogteam/')
          }
          style={{}}>
          <Image resizeMode="contain" style={styles.image} source={instagram} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  contactText: {
    textAlign: 'center',
    fontFamily: fonts.light,
    margin: 10,
    letterSpacing: 2,
    fontSize: 16,
    color: colors.black,
  },
  image: {
    height: 40,
    width: 40,
    margin: 5,
  },
});
