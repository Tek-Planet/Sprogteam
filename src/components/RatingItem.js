import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const RatingItem = props => {
  // This array will contain our star tags. We will include this
  // array between the view tag.
  let stars = [];
  // Loop 5 times
  for (var i = 1; i <= 5; i++) {
    // set the path to filled stars
    let name = 'ios-star';
    // If ratings is lower, set the path to unfilled stars
    if (i > props.rating) {
      name = 'ios-star-outline';
    }

    stars.push(<Ionicons name={name} size={15} style={styles.star} key={i} />);
  }

  return <View style={styles.container}>{stars}</View>;
};

export default RatingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FFD54F',
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    color: '#444',
  },
});
