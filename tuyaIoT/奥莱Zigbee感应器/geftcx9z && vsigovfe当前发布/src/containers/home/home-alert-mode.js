import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Utils, SwitchButton, Popup, TYText, TYSdk } from 'tuya-panel-kit';
import { getEleIcon } from '../../utils';
import Strings from '../../i18n';
import dpCodes from '../../config/dpCodes';
import Res from '../../res';

const { convertX: cx, convertY: cy } = Utils.RatioUtils;
const TYDevice = TYSdk.device;

const {
  power: powerCode,
  switchPir: switchPirCode,
  sensitivity: sensitivityCode,
  pirState: pirStateCode,
  delayState: delayStateCode,
} = dpCodes;

class AlertMode extends Component {
  static propTypes = {
    power: PropTypes.bool,
    switchPir: PropTypes.bool,
    sensitivity: PropTypes.oneOf(['low', 'middle', 'high']),
    pirState: PropTypes.oneOf(['pir', 'none']),
  };

  static defaultProps = {
    power: false,
    switchPir: false,
    sensitivity: 'low',
    pirState: 'pir',
  };

  constructor(props) {
    super(props);
    const { power, switchPir } = this.props;
    this.state = {
      power: power,
      switchPir: switchPir
    };
  }

  

  _onSensPress = () => {
    const sensitivity = this.props.sensitivity;
    const range = ['low', 'middle', 'high'];
    const rangeStrings = range.map(v => ({
      key: v,
      title: Strings.getDpLang(sensitivityCode, v),
      value: v,
    }));

    Popup.list({
      title: Strings.getDpLang(sensitivityCode),
      footerType: 'singleCancel',
      cancelText: Strings.getLang('cancel'),
      value: sensitivity,
      dataSource: rangeStrings,
      onSelect: v => {
        TYDevice.putDeviceData({
          [sensitivityCode]: v,
        });
        Popup.close();
      },
    });
  };

  _onDelayStatePress = () => {
    const delayState = this.props.delayState;
    const range = ['d1_start', 'd2_start', 'd3_start', 'delay_stop', 'delay_unknown'];
    const rangStrings = range.map(v => ({
      key: v,
      title: Strings.getDpLang(delayStateCode, v),
      value: v,
    }));

    Popup.list({
      title: Strings.getDpLang(delayStateCode),
      footerType: 'singleCancel',
      cancelText: Strings.getLang('cancel'),
      value: delayState,
      dataSource: rangStrings,
      onSelect: v => {
        TYDevice.putDeviceData({
          [delayStateCode]: v,
        });
        Popup.close();
      },
    });
  };

  render() {
    const {  sensitivity, pirState } = this.props;

    let power = this.props.power;
    let switchPir = this.props.switchPir;

    return (
      <View style={styles.container}>
        <View style={styles.top}>
        <View style={styles.layout}>
            <TYText style={styles.text}>{Strings.getDpLang(powerCode)}</TYText>
            <SwitchButton
              value={power}
              //defaultValue={this.state.power}
              onValueChange={power => { 
                TYDevice.putDeviceData({
                  [powerCode]: power,
                });
                this.setState({ 
                  power 
                }); 
              }}
            />
          </View>
          <View style={styles.layout}>
            <TYText style={styles.text}>{Strings.getDpLang(switchPirCode)}</TYText>
            <SwitchButton
              value={switchPir}
              //defaultValue={this.state.switchPir}
              onValueChange={switchPir => { 
                TYDevice.putDeviceData({
                  [switchPirCode]: switchPir,
                });
                this.setState({ 
                  switchPir 
                }); 
              }}
            />
          </View>

          <TouchableOpacity style={styles.layout} onPress={this._onSensPress}>
            <TYText style={styles.text}>{Strings.getDpLang(sensitivityCode)}</TYText>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <TYText style={styles.text}>{Strings.getDpLang(sensitivityCode, sensitivity)}</TYText>
              <Image style={styles.arrow} source={Res.arrow} />
            </View>
          </TouchableOpacity>

          <View style={styles.layout}>
            <TYText style={styles.text}>{Strings.getDpLang(pirStateCode)}</TYText>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <TYText style={styles.text}>{Strings.getDpLang(pirStateCode, pirState)}</TYText>
              <Image style={styles.arrow} source={Res.arrow} />
            </View>
          </View>

          {/* <View style={styles.layout}>
            <TYText style={styles.text}>{Strings.getDpLang(delayStateCode)}</TYText>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Button
                text={Strings.getDpLang(delayStateCode, delayState)}
                textStyle={styles.text}
                onPress={this._onDelayStatePress}
              />
              <Image style={styles.arrow} source={Res.arrow} />
            </View>
          </View> */}
        </View>

        <View style={styles.noContainer}>
          <Image style={styles.noneIcon} source={Res.none} />
          <Text style={styles.noSubtitle}>{Strings.getLang('noMore')}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  top: {},

  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 1,
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#363940',
  },

  buttomlayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#363940',
  },

  text: {
    fontSize: 18,
    color: '#fff',
  },
  arrow: {
    marginLeft: 5,
  },

  noContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  noneIcon: {
    marginTop: cy(150),
  },

  noSubtitle: {
    color: '#999',
    fontSize: 14,
    marginTop: cy(2),
  },
});

export default connect(({ dpState }) => ({
  power: dpState[powerCode],
  switchPir: dpState[switchPirCode],
  sensitivity: dpState[sensitivityCode],
  pirState: dpState[pirStateCode],
  delayState: dpState[delayStateCode],
}))(AlertMode);
