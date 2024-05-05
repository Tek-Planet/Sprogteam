import * as React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';
import {AccountType} from '../types';

// interface AccountTypeCardItemProps {}

interface AccountTypeCardItemProps {
  item: AccountType;
  onPress: (item: AccountType) => void;
}

const AccountTypeCardItem = (props: AccountTypeCardItemProps) => {
  const {item, onPress} = props;

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.cardItem}>
      <View style={styles.headerRow}>
        <Image resizeMode="contain" style={styles.image} source={item.image} />
        <Text style={styles.headerRowText}>{item?.title}</Text>
      </View>
      <Text style={styles.cardItemBodyText}>{item?.body}</Text>
    </TouchableOpacity>
  );
};

export default AccountTypeCardItem;

const styles = StyleSheet.create({
  cardItem: {
    padding: spacing.fiften,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: spacing.ten,
    marginVertical: spacing.ten,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.ten,
  },

  image: {
    height: 40,
    width: 40,
    marginEnd: spacing.ten,
  },

  headerRowText: {
    fontSize: fontSize.medium,
    fontFamily: fonts.medium,
  },

  cardItemBodyText: {
    // fontSize: fontSize.light,
    fontFamily: fonts.light,
  },
});
