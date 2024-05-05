import {useTheme} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Pressable, ScrollView} from 'react-native';
import {colorTypes} from '../assets/colors';
import {fonts, fontSize} from '../assets/fonts';
import {spacing} from '../assets/spacing';
import {width} from '../utils';
import {TabItem} from '../types';

interface CustomTopTabProps {
  tabItems: TabItem[];
  selected: TabItem;
  setSelected: (item: TabItem) => void;
  isButton?: boolean;
}

const CustomTopTab = (props: CustomTopTabProps) => {
  const {tabItems, selected, setSelected, isButton} = props;
  const {colors} = useTheme();
  const scrollViewRef: any = useRef(null);
  const styles = getStyles(colors);

  const scrollSelectedIntoView = () => {
    if (scrollViewRef.current && selected) {
      const selectedTabIndex = tabItems.findIndex(
        item => item.title === selected.title,
      );
      if (selectedTabIndex !== -1) {
        scrollViewRef.current.scrollTo({
          x: selectedTabIndex * (width * 0.4), // Adjust the scroll position as needed
          animated: true,
        });
      }
    }
  };
  useEffect(() => {
    if (selected) scrollSelectedIntoView();
  }, [selected]);
  return (
    <View style={styles.headerRow}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {tabItems.map((item, index) => (
          <Pressable
            onPress={() => setSelected(item)}
            style={[
              {
                ...styles.listItem,
              },
              isButton === undefined
                ? {
                    width: width * 0.4,
                    borderColor:
                      item.title === selected.title ? colors.main : '#E7EAEA',
                    borderBottomWidth: 1,
                  }
                : {
                    backgroundColor:
                      item.title === selected.title ? colors.main : '#E7EAEA',
                    padding: spacing.five,
                    borderRadius: spacing.ten,
                  },
            ]}
            key={index.toString()}>
            <Text
              style={{
                ...styles.headerRowText,
                color:
                  item.title === selected.title
                    ? isButton
                      ? colors.white
                      : colors.main
                    : colors.lightGray,
              }}>
              {item.title}
            </Text>
            {item?.total && (
              <View
                style={{
                  width: 20,
                  marginStart: spacing.five,
                  borderRadius: spacing.five,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    item.title === selected.title ? colors.main : '#E7EAEA',
                }}>
                <Text
                  style={{
                    ...styles.headerRowText,
                    color:
                      item.title === selected.title ? colors.white : '#6B7280',
                  }}>
                  {item.total}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default CustomTopTab;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },

    headerRowText: {
      fontSize: fontSize.light,
      fontFamily: fonts.medium,
      textAlign: 'center',
    },

    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing.ten,
      paddingBottom: spacing.ten,
      marginRight: spacing.ten,
    },
  });
