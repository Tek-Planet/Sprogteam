import {StyleSheet} from 'react-native';
import {spacing} from './spacing';
import {colors} from './colors';

export default StyleSheet.create({
  elevation: {
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  opacity: {
    opacity: 0.5,
  },
  padding: {
    padding: spacing.ten,
  },
});

export const tagsStyles = {
  p: {
    // fontFamily: fonts.bold,
    color: colors.black,
    margin: spacing.ten - 3,
  },
};
