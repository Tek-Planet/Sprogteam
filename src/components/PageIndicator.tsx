import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {width} from '../utils';
import {spacing} from '../assets/spacing';

// import
// const width = height;
interface PageIndicatorProps {
  pageNum: number;
  ofPage: number;
}

const PageIndicator = ({pageNum, ofPage}: PageIndicatorProps) => {
  let bgWidth =
    pageNum === 1
      ? width * 0.19
      : pageNum === 2
      ? ofPage === 3
        ? width * 0.45
        : width * 0.9
      : width * 0.9;

  return (
    <View style={[styles.sectionStyle]}>
      {/*  */}
      <View style={styles.indicatorBg}>
        <View
          style={{
            ...styles.indicator,
            width: bgWidth,
          }}
        />

        <View style={styles.circleRow}>
          <View
            style={{
              ...styles.pageNumberBg,
              backgroundColor: colors.main,
            }}>
            <Text
              style={{
                ...styles.pageNumber,
                color: colors.white,
              }}>
              1
            </Text>
          </View>

          <View
            style={{
              ...styles.pageNumberBg,
              backgroundColor: pageNum === 1 ? colors.gray : colors.main,
            }}>
            <Text
              style={{
                ...styles.pageNumber,
                color: pageNum === 1 ? colors.black : colors.white,
              }}>
              2
            </Text>
          </View>
          {ofPage === 3 && (
            <View
              style={{
                ...styles.pageNumberBg,
                backgroundColor: pageNum === 3 ? colors.main : colors.gray,
              }}>
              <Text
                style={{
                  ...styles.pageNumber,
                  color: pageNum === 3 ? colors.white : colors.black,
                }}>
                3
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default PageIndicator;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    marginVertical: spacing.fiften * 2,
    backgroundColor: colors.gray,
    borderRadius: 10,
    width: width * 0.9,
    // position: 'absolute',
  },

  indicatorBg: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
  },

  indicator: {
    height: 10,
    backgroundColor: colors.main,
    borderRadius: 10,
  },

  circleRow: {
    width: '100%',
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
  },

  headerTitle: {
    fontSize: fontSize.regular,
    color: colors.black,
    alignSelf: 'center',
    fontFamily: fonts.regular,
  },

  pageNumberBg: {
    width: 30,
    height: 30,
    backgroundColor: colors.gray,
    borderRadius: 100,
    alignItems: 'center',
  },

  pageNumber: {
    color: colors.black,
    fontFamily: fonts.medium,
    marginTop: spacing.five,
  },
});
