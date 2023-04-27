import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

// radio-btn-active
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthProvider';
import {fonts} from '../assets/fonts';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const EditProfileModal = props => {
  const {user, setUser} = useContext(AuthContext);

  const [firstName, setFirstname] = useState('Abbys');
  const [lastName, setLastName] = useState('Doe');
  const [location, setLocation] = useState('unknown');
  const [address, setAddress] = useState('Lagos Nigeria');

  return (
    <View style={styles.container}>
      <View style={[styles.modal, {width: WIDTH, height: HEIGHT}]}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View>
            <View style={styles.heading}>
              <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                <Ionicons name="close" color={'grey'} size={20} />
              </TouchableOpacity>
            </View>
            {/* firstname section */}
            <View style={{margin: 10}}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoHeader}>Fist Name</Text>

                <TextInput
                  value={firstName}
                  onChangeText={val => setFirstname(val)}
                  placeholderTextColor="#red"
                />
              </View>
              {/* last name section */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoHeader}>Last Name</Text>

                <TextInput
                  value={lastName}
                  onChangeText={val => setLastName(val)}
                  placeholderTextColor="#red"
                />
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.infoHeader}>Address</Text>

                <TextInput
                  value={address}
                  onChangeText={val => setAddress(val)}
                  placeholderTextColor="#red"
                />
              </View>
              {/* Location section */}

              <View style={styles.infoContainer}>
                <Text style={styles.infoHeader}>Location</Text>

                <TextInput
                  value={location}
                  onChangeText={val => setLocation(val)}
                  placeholderTextColor="#red"
                />
              </View>
            </View>
          </View>
          <View style={{margin: 20}}>
            <Button
              bGcolor={'#659ED6'}
              buttonTitle={'Save'}
              onPress={() => {
                alert('save');
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
  },

  text: {
    margin: 20,
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  heading: {
    flexDirection: 'row',
    paddingRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    justifyContent: 'flex-end',
  },
  infoHeader: {
    marginTop: 5,
    marginStart: 5,
    color: '#000',
    fontSize: 15,
    fontFamily: fonts.medium,
  },
  info: {
    color: '#000',
    fontFamily: fonts.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
});

export default EditProfileModal;
