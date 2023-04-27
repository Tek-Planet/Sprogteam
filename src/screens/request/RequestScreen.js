import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {getBookingRequests} from '../../data/data';
import {Header, RequestList} from '../../components';
import {useTranslation} from 'react-i18next';
import {colors} from '../../assets/colors';

const RequestListScreen = ({navigation}) => {
  const {t} = useTranslation();

  const {bookings, setReload, user} = useContext(AuthContext);
  const [request, setRequest] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = async () => {
    setRefreshing(true);
    setReload(true);
    //fetchData();
  };
  // console.log(user.profile.languages);
  async function fetchData() {
    let country = user?.profile?.Country ? user?.profile?.Country : 'Denmark';
    const requestList = await getBookingRequests(user.profile.Id, country);

    setRequest(requestList);

    setRefreshing(false);
  }

  const sortRequest = (myapplication, requestList) => {
    for (let application of myapplication) {
      for (var i = 0; i < requestList.length; i++) {
        if (application.BookingID === requestList[i].BookingID) {
          requestList.splice(requestList[i], 1);
        }
      }
    }

    setRequest(requestList);
    // console.log(res);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [bookings]);

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Header navigation={navigation} />

      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={{marginBottom: 50}}
        ListEmptyComponent={
          !refreshing && (
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                margin: 10,
                marginTop: 20,
                fontFamily: fonts.light,
              }}>
              {t('common:list_empty')}
            </Text>
          )
        }
        keyExtractor={item => item.BookingID}
        data={request}
        renderItem={({item, index}) => {
          if (item.TranslatorId !== user.profile.Id)
            return (
              <RequestList
                item={item}
                index={index}
                setRefreshing={setRefreshing}
              />
            );
        }}
      />
    </View>
  );
};

export default RequestListScreen;
