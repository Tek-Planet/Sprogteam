import React, {useState, createRef, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {fonts} from '../assets/fonts';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator, GigList} from './index';

import {dimention} from '../util/util';

import {getGiGs} from '../data/data';
import {colors} from '../assets/colors';

import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef = createRef();

const Action = props => {
  const {setIsVisibleOffer, info, route, customerInfo} = props;

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData(Id) {
    // You can await here

    const res = await getGiGs(Id);
    setGigs(res);
    // console.log(res);

    setLoading(false);
  }

  useEffect(() => {
    actionSheetRef.current?.setModalVisible(true);
    if (info !== null) fetchData(info?.Id);
  }, []);

  return (
    <ActionSheet
      onClose={() => {
        setIsVisibleOffer(false);
      }}
      bounceOnOpen={true}
      containerStyle={{height: dimention.height * 0.9}}
      gestureEnabled={true}
      ref={actionSheetRef}>
      {loading ? (
        <View style={{marginTop: 50}}>
          <ActivityIndicator show={loading} size="large" color={colors.main} />
        </View>
      ) : gigs.length > 0 ? (
        <ScrollView>
          {gigs?.map((item, index) => {
            return (
              <GigList
                key={index}
                customer
                customerInfo={customerInfo}
                setIsVisibleOffer={setIsVisibleOffer}
                item={item}
                returnToChat={true}
                closeRef={actionSheetRef}
              />
            );
          })}
        </ScrollView>
      ) : (
        <Text
          style={{
            color: colors.black,
            fontSize: 16,
            fontFamily: fonts.medium,
            textAlign: 'center',
            marginTop: 30,
          }}>
          No Gigs found for this Interpreter
        </Text>
      )}
    </ActionSheet>
  );
};

export default Action;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: colors.black,
    fontFamily: fonts.medium,
  },

  headerBG: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#659ED6',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },

  offertext: {
    fontSize: 18,
    margin: 5,
    color: colors.black,
    fontFamily: fonts.medium,
  },
  offertextinput: {
    textAlignVertical: 'top',
    borderColor: colors.main,
    color: colors.black,
    borderWidth: 1,
    fontSize: 16,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    fontFamily: fonts.medium,
  },

  dateRow: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginBottom: 10,
  },
  innerDateRow: {flex: 1, flexDirection: 'row', marginTop: 5},
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  rowApart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
});
