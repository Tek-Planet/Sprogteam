import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {fonts} from '../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import {dimention} from '../util/util';
import {colors} from '../assets/colors';
import {useTranslation} from 'react-i18next';

const SignUpHeader = props => {
  const {page} = props;
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        {/* personal details */}
        <View style={styles.outer}>
          <View style={styles.inner}>
            <View style={{...styles.circle, opacity: page === 1 ? 1 : 0.5}}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colors.white,
                }}>
                1
              </Text>
            </View>

            <View style={styles.line} />
          </View>
        </View>

        {/* kyc */}

        <View style={styles.outer}>
          <View style={styles.inner}>
            <View style={{...styles.circle, opacity: page === 2 ? 1 : 0.5}}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colors.white,
                }}>
                2
              </Text>
            </View>

            <View style={styles.line} />
          </View>
        </View>

        {/* services */}

        <View style={styles.outer}>
          <View style={styles.inner}>
            <View style={{...styles.circle, opacity: page === 3 ? 1 : 0.5}}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colors.white,
                }}>
                3
              </Text>
            </View>

            <View style={styles.line} />
          </View>
        </View>

        {/* language */}
        <View style={{}}>
          <View style={styles.inner}>
            <View style={styles.line} />
            <View style={{...styles.circle, opacity: page === 4 ? 1 : 0.5}}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colors.white,
                }}>
                4
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* headings  */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          marginTop: 5,
        }}>
        <Text
          style={{
            fontFamily: page === 1 ? fonts.bold : fonts.light,
            color: colors.black,
          }}>
          {t('common:profile')}
        </Text>
        <Text
          style={{
            fontFamily: page === 2 ? fonts.bold : fonts.light,
            marginStart: 20,
            color: colors.black,
          }}>
          KYC
        </Text>
        <Text
          style={{
            fontFamily: page === 3 ? fonts.bold : fonts.light,
            marginStart: 20,
            color: colors.black,
          }}>
          {t('common:services')}
        </Text>
        <Text
          style={{
            fontFamily: page === 4 ? fonts.bold : fonts.light,
            color: colors.black,
          }}>
          {t('common:language')}
        </Text>
      </View>
    </View>
  );
};

export default SignUpHeader;

const styles = StyleSheet.create({
  line: {
    height: 2,
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  circle: {
    height: 25,
    width: 25,
    backgroundColor: colors.main,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    flex: 1,
    width: dimention.width * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
