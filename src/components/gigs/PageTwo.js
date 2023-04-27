import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  TextBoxTitle,
  TextInput,
  Button,
  CustomDropDown,
  CustomCheckBox,
  TitleHeader,
} from '..';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {baseCurrency} from '../../util/util';

const PageTwo = props => {
  const {
    nextPage,
    previousPage,

    checkPhone,
    checkVideo,
    checkAttendance,
    checkWritten,
    setError,
    POName,
    setPOName,
    PODescription,
    setPODescription,
    POPPrice,
    setPOPPrice,
    POVPrice,
    setPOVPrice,
    POAPrice,
    setPOAPrice,
    POWPrice,
    setPOWPrice,
    PODelivery,
    setPODelivery,
    PODuration,
    setPODuration,

    // add ons
    POWordCount,
    setPOWordCount,
    PORevision,
    setPORevision,
    POProofReading,
    setPOProofReading,
    POLangStyle,
    setPOLangStyle,
    PODocFormatting,
    setPODocFormatting,
    POSubtitling,
    setPOSubtitling,

    // end of PO
    PTName,
    setPTName,
    PTDescription,
    setPTDescription,
    PTPPrice,
    setPTPPrice,
    PTVPrice,
    setPTVPrice,
    PTAPrice,
    setPTAPrice,
    PTWPrice,
    setPTWPrice,

    PTDelivery,
    setPTDelivery,
    PTDuration,
    setPTDuration,
    // pt add ons

    PTWordCount,
    setPTWordCount,
    PTRevision,
    setPTRevision,
    PTProofReading,
    setPTProofReading,
    PTLangStyle,
    setPTLangStyle,
    PTDocFormatting,
    setPTDocFormatting,
    PTSubtitling,
    setPTSubtitling,

    // end of PT
    PTHName,
    setPTHName,
    PTHDescription,
    setPTHDescription,
    PTHPPrice,
    setPTHPPrice,
    PTHVPrice,
    setPTHVPrice,
    PTHAPrice,
    setPTHAPrice,
    PTHWPrice,
    setPTHWPrice,

    PTHDelivery,
    setPTHDelivery,
    PTHDuration,
    setPTHDuration,
    // PTH add ons
    PTHWordCount,
    setPTHWordCount,
    PTHRevision,
    setPTHRevision,
    PTHProofReading,
    setPTHProofReading,
    PTHLangStyle,
    setPTHLangStyle,
    PTHDocFormatting,
    setPTHDocFormatting,
    PTHSubtitling,
    setPTHSubtitling,
    // end of PTH

    durations,

    // written add ons
    service,
  } = props;
  const {t} = useTranslation();

  const next = () => {
    // package one validation
    if (POName === null || PODescription === null) {
      setError('package one details must be completed');
      return;
    }

    // package two validation
    if (PTName === null || PTDescription === null) {
      setError('package two details must be completed');
      return;
    }
    // paackage 3 validation
    if (PTHName === null || PTHDescription === null) {
      setError('package three details must be completed');
      return;
    }

    // validate phone one price check
    if (POPPrice === null || PTPPrice === null || PTHPPrice === null) {
      setError('enter  price for each package');
      return;
    }

    // validate video one price check
    if (
      checkVideo &&
      (POVPrice === null || PTVPrice === null || PTHVPrice === null)
    ) {
      setError('enter Video price for each package');
      return;
    }

    // validate attendamce price
    if (
      checkAttendance &&
      (POAPrice === null || PTAPrice === null || PTHAPrice === null)
    ) {
      setError('enter attendance price for each package');
      return;
    }

    // validate writen price
    if (
      checkWritten &&
      (POWPrice === null || PTWPrice === null || PTHWPrice === null)
    ) {
      setError('enter written price for each package');
      return;
    }
    // validate delivery for packages
    if (
      checkWritten &&
      (PODelivery === null || PTDelivery === null || PTHDelivery === null)
    ) {
      setError('set delivery period for all package');
      return;
    }

    setError(null);

    nextPage('three');
  };
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <ScrollView>
        <View style={{flex: 1}}>
          <TextBoxTitle title={t('common:package')} showAsh />
          {/* basic section */}

          <View style={styles.section}>
            <TitleHeader title={t('common:basic')} showAsh />

            <TextBoxTitle title={t('common:name')} showAsh />
            <TextInput
              value={POName}
              onChangeText={val => setPOName(val)}
              placeholderTextColor="#fafafa"
            />

            <TextBoxTitle title={t('common:description')} showAsh />
            <TextInput
              value={PODescription}
              multiline={true}
              numberOfLines={5}
              height={60}
              placeholderTextColor="#fafafa"
              onChangeText={val => setPODescription(val)}
            />
            {/* Price section in package */}
            <View>
              {/* checked phone */}
              {
                <View>
                  <TextBoxTitle
                    title={
                      service.value === 3 || service.value === 1
                        ? t('common:phone') +
                          ' ' +
                          t('common:price') +
                          ' / ' +
                          t('common:hour') +
                          ' / ' +
                          baseCurrency.usd
                        : t('common:start') +
                          '  ' +
                          t('common:price') +
                          ' / ' +
                          baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={POPPrice}
                    onChangeText={val => setPOPPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              }

              {/* checked VIdep */}
              {checkVideo && (
                <View>
                  <TextBoxTitle
                    title={
                      t('common:video') +
                      ' ' +
                      t('common:price') +
                      ' / ' +
                      t('common:hour') +
                      ' / ' +
                      baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={POVPrice}
                    onChangeText={val => setPOVPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              )}
              {/* checked attendamce */}
              {checkAttendance && (
                <View>
                  <TextBoxTitle
                    title={
                      t('common:attendance') +
                      ' ' +
                      t('common:price') +
                      ' / ' +
                      t('common:hour') +
                      ' / ' +
                      baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={POAPrice}
                    onChangeText={val => setPOAPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              )}
              {/* written */}
              {checkWritten && (
                <View>
                  <View>
                    <TextBoxTitle
                      title={
                        t('common:written') +
                        ' ' +
                        t('common:price') +
                        +' / ' +
                        baseCurrency.usd
                      }
                      showAsh
                    />
                    <TextInput
                      value={POWPrice}
                      onChangeText={val => setPOWPrice(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>
                  <TextBoxTitle title={t('common:Delivery')} showAsh />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <View style={{width: '50%'}}>
                      <TextInput
                        value={PODelivery}
                        onChangeText={val => setPODelivery(val)}
                        mb={-2}
                        placeholderTextColor="#fafafa"
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={{width: '50%'}}>
                      <CustomDropDown
                        value={PODuration}
                        language={durations}
                        setValue={setPODuration}
                      />
                    </View>
                  </View>
                </View>
              )}
              {/* selected service id is 7 */}
              {service.value === 7 && (
                <View>
                  <View>
                    <TextBoxTitle
                      title={t('common:word') + ' ' + t('common:count')}
                      showAsh
                    />
                    <TextInput
                      value={POWordCount}
                      onChangeText={val => setPOWordCount(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>
                  <TextBoxTitle title={t('common:Delivery')} showAsh />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <View style={{width: '50%'}}>
                      <TextInput
                        value={PODelivery}
                        onChangeText={val => setPODelivery(val)}
                        mb={-2}
                        placeholderTextColor="#fafafa"
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={{width: '50%'}}>
                      <CustomDropDown
                        value={PODuration}
                        language={durations}
                        setValue={setPODuration}
                      />
                    </View>
                  </View>
                  <View>
                    <TextBoxTitle title={t('common:revisions')} showAsh />
                    <TextInput
                      value={PORevision}
                      onChangeText={val => setPORevision(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>

                  <CustomCheckBox
                    checked={POProofReading}
                    setChecked={setPOProofReading}
                    placeholder={t('common:proof') + ' ' + t('common:reading')}
                  />

                  <CustomCheckBox
                    checked={POLangStyle}
                    setChecked={setPOLangStyle}
                    placeholder={
                      t('common:language') +
                      ' ' +
                      t('common:style') +
                      ' ' +
                      t('common:guide')
                    }
                  />

                  <CustomCheckBox
                    checked={PODocFormatting}
                    setChecked={setPODocFormatting}
                    placeholder={
                      t('common:document') + ' ' + t('common:formating')
                    }
                  />

                  <CustomCheckBox
                    checked={POSubtitling}
                    setChecked={setPOSubtitling}
                    placeholder={t('common:subtitling')}
                  />
                </View>
              )}
            </View>
          </View>

          {/* begining of  standard */}
          <View style={styles.section}>
            <TitleHeader title={t('common:standard')} showAsh />

            <TextBoxTitle title={t('common:name')} showAsh />
            <TextInput
              value={PTName}
              onChangeText={val => setPTName(val)}
              placeholderTextColor="#fafafa"
            />

            <TextBoxTitle title={t('common:description')} showAsh />
            <TextInput
              value={PTDescription}
              multiline={true}
              numberOfLines={5}
              height={60}
              placeholderTextColor="#fafafa"
              onChangeText={val => setPTDescription(val)}
            />

            {/* Price section in package */}
            <View>
              {/* checked phone */}
              {
                <View>
                  <TextBoxTitle
                    title={
                      service.value === 3 || service.value === 1
                        ? t('common:phone') +
                          ' ' +
                          t('common:price') +
                          ' / ' +
                          t('common:hour') +
                          ' / ' +
                          baseCurrency.usd
                        : t('common:start') +
                          '  ' +
                          t('common:price') +
                          ' / ' +
                          baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={PTPPrice}
                    onChangeText={val => setPTPPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              }

              {/* checked VIdep */}
              {checkVideo && (
                <View>
                  <TextBoxTitle
                    title={
                      t('common:video') +
                      ' ' +
                      t('common:price') +
                      ' / ' +
                      t('common:hour') +
                      ' / ' +
                      baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={PTVPrice}
                    onChangeText={val => setPTVPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              )}
              {/* checked attendamce */}
              {checkAttendance && (
                <View>
                  <TextBoxTitle
                    title={
                      t('common:attendance') +
                      ' ' +
                      t('common:price') +
                      ' / ' +
                      t('common:hour') +
                      ' / ' +
                      baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={PTAPrice}
                    onChangeText={val => setPTAPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              )}
              {/* written */}
              {checkWritten && (
                <View>
                  <View>
                    <TextBoxTitle
                      title={
                        t('common:written') +
                        ' ' +
                        t('common:price') +
                        ' / ' +
                        baseCurrency.usd
                      }
                      showAsh
                    />
                    <TextInput
                      value={PTWPrice}
                      onChangeText={val => setPTWPrice(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>
                  <View>
                    <TextBoxTitle title={t('common:Delivery')} showAsh />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <View style={{width: '50%'}}>
                        <TextInput
                          value={PTDelivery}
                          keyboardType="number-pad"
                          mb={-2}
                          placeholderTextColor="#fafafa"
                          onChangeText={val => setPTDelivery(val)}
                        />
                      </View>
                      <View style={{width: '50%'}}>
                        <CustomDropDown
                          value={PTDuration}
                          language={durations}
                          setValue={setPTDuration}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* selected service id is 7 */}
              {service.value === 7 && (
                <View>
                  <View>
                    <TextBoxTitle
                      title={t('common:word') + ' ' + t('common:count')}
                      showAsh
                    />
                    <TextInput
                      value={PTWordCount}
                      onChangeText={val => setPTWordCount(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>
                  <TextBoxTitle title={t('common:Delivery')} showAsh />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <View style={{width: '50%'}}>
                      <TextInput
                        value={PTDelivery}
                        onChangeText={val => setPTDelivery(val)}
                        mb={-2}
                        placeholderTextColor="#fafafa"
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={{width: '50%'}}>
                      <CustomDropDown
                        value={PTDuration}
                        language={durations}
                        setValue={setPTDuration}
                      />
                    </View>
                  </View>
                  <View>
                    <TextBoxTitle title={t('common:revisions')} showAsh />
                    <TextInput
                      value={PTRevision}
                      onChangeText={val => setPTRevision(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>

                  <CustomCheckBox
                    checked={PTProofReading}
                    setChecked={setPTProofReading}
                    placeholder={t('common:proof') + ' ' + t('common:reading')}
                  />

                  <CustomCheckBox
                    checked={PTLangStyle}
                    setChecked={setPTLangStyle}
                    placeholder={
                      t('common:language') +
                      ' ' +
                      t('common:style') +
                      ' ' +
                      t('common:guide')
                    }
                  />

                  <CustomCheckBox
                    checked={PTDocFormatting}
                    setChecked={setPTDocFormatting}
                    placeholder={
                      t('common:document') + ' ' + t('common:formating')
                    }
                  />

                  <CustomCheckBox
                    checked={PTSubtitling}
                    setChecked={setPTSubtitling}
                    placeholder={t('common:subtitling')}
                  />
                </View>
              )}
            </View>
          </View>

          {/* premium */}
          <View style={styles.section}>
            <TitleHeader title={t('common:premium')} />

            <TextBoxTitle title={t('common:name')} showAsh />
            <TextInput
              value={PTHName}
              onChangeText={val => setPTHName(val)}
              placeholderTextColor="#fafafa"
            />

            <TextBoxTitle title={t('common:description')} showAsh />
            <TextInput
              value={PTHDescription}
              multiline={true}
              numberOfLines={5}
              height={60}
              placeholderTextColor="#fafafa"
              onChangeText={val => setPTHDescription(val)}
            />

            {/* Price section in package */}
            <View>
              {/* checked phone */}
              {
                <View>
                  <TextBoxTitle
                    title={
                      service.value === 3 || service.value === 1
                        ? t('common:phone') +
                          ' ' +
                          t('common:price') +
                          ' / ' +
                          t('common:hour') +
                          ' / ' +
                          baseCurrency.usd
                        : t('common:start') +
                          '  ' +
                          t('common:price') +
                          ' / ' +
                          baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={PTHPPrice}
                    onChangeText={val => setPTHPPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              }

              {/* checked VIdep */}
              {checkVideo && (
                <View>
                  <TextBoxTitle
                    title={
                      t('common:video') +
                      ' ' +
                      t('common:price') +
                      ' / ' +
                      t('common:hour') +
                      ' / ' +
                      baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={PTHVPrice}
                    onChangeText={val => setPTHVPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              )}
              {/* checked attendamce */}
              {checkAttendance && (
                <View>
                  <TextBoxTitle
                    title={
                      t('common:attendance') +
                      ' ' +
                      t('common:price') +
                      ' / ' +
                      t('common:hour') +
                      ' / ' +
                      baseCurrency.usd
                    }
                    showAsh
                  />
                  <TextInput
                    value={PTHAPrice}
                    onChangeText={val => setPTHAPrice(val)}
                    placeholderTextColor="#fafafa"
                    keyboardType="number-pad"
                  />
                </View>
              )}
              {/* written */}
              {checkWritten && (
                <View>
                  <View>
                    <TextBoxTitle
                      title={
                        t('common:written') +
                        ' ' +
                        t('common:price') +
                        ' / ' +
                        baseCurrency.usd
                      }
                      showAsh
                    />
                    <TextInput
                      value={PTHWPrice}
                      onChangeText={val => setPTHWPrice(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>

                  <View>
                    <TextBoxTitle title={t('common:Delivery')} showAsh />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <View style={{width: '50%'}}>
                        <TextInput
                          value={PTHDelivery}
                          keyboardType="number-pad"
                          mb={-2}
                          placeholderTextColor="#fafafa"
                          onChangeText={val => setPTHDelivery(val)}
                        />
                      </View>
                      <View style={{width: '50%'}}>
                        <CustomDropDown
                          value={PTHDuration}
                          language={durations}
                          setValue={setPTHDuration}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* selected service id is 7 */}
              {service.value === 7 && (
                <View>
                  <View>
                    <TextBoxTitle
                      title={t('common:word') + ' ' + t('common:count')}
                      showAsh
                    />
                    <TextInput
                      value={PTHWordCount}
                      onChangeText={val => setPTHWordCount(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>
                  <TextBoxTitle title={t('common:Delivery')} showAsh />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <View style={{width: '50%'}}>
                      <TextInput
                        value={PTHDelivery}
                        onChangeText={val => setPTHDelivery(val)}
                        mb={-2}
                        placeholderTextColor="#fafafa"
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={{width: '50%'}}>
                      <CustomDropDown
                        value={PTHDuration}
                        language={durations}
                        setValue={setPTHDuration}
                      />
                    </View>
                  </View>
                  <View>
                    <TextBoxTitle title={t('common:revisions')} showAsh />
                    <TextInput
                      value={PTHRevision}
                      onChangeText={val => setPTHRevision(val)}
                      placeholderTextColor="#fafafa"
                      keyboardType="number-pad"
                    />
                  </View>

                  <CustomCheckBox
                    checked={PTHProofReading}
                    setChecked={setPTHProofReading}
                    placeholder={t('common:proof') + ' ' + t('common:reading')}
                  />

                  <CustomCheckBox
                    checked={PTHLangStyle}
                    setChecked={setPTHLangStyle}
                    placeholder={
                      t('common:language') +
                      ' ' +
                      t('common:style') +
                      ' ' +
                      t('common:guide')
                    }
                  />

                  <CustomCheckBox
                    checked={PTHDocFormatting}
                    setChecked={setPTHDocFormatting}
                    placeholder={
                      t('common:document') + ' ' + t('common:formating')
                    }
                  />

                  <CustomCheckBox
                    checked={PTHSubtitling}
                    setChecked={setPTHSubtitling}
                    placeholder={t('common:subtitling')}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Button
          buttonTitle={t('common:previous')}
          bGcolor={'#800000'}
          onPress={() => {
            previousPage('one');
          }}
        />
        <Button
          buttonTitle={t('common:next')}
          onPress={() => {
            next();
          }}
        />
      </View>
    </View>
  );
};
export default PageTwo;

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
});
