import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Utils, SwitchButton, Popup, TYText, TYSdk } from 'tuya-panel-kit';
import { getEleIcon } from '../../utils';
import Strings from '../../i18n';
import Res from '../../res';
import dpCodes from '../../config/dpCodes';
import MyPicker from '../../components/Picker';

const TYDevice = TYSdk.device;

const {
  power: powerCode,
  switchPir: switchPirCode,
  sensitivity: sensitivityCode,
  delay: delayCode1,
  delay2: delayCode2,
  delay3: delayCode3,
  delayState: delayStateCode,
} = dpCodes;

class GeneralMode extends Component {
  static propTypes = {
    power: PropTypes.bool,
    switchPir: PropTypes.bool,
    sensitivity: PropTypes.oneOf(['low', 'middle', 'high']),
    delay: PropTypes.number,
    delay2: PropTypes.number,
    delay3: PropTypes.number,
    delayState: PropTypes.oneOf([
      'd1_start',
      'd2_start',
      'd3_start',
      'delay_stop',
      'delay_unknown',
    ]),
  };

  static defaultProps = {
    power: false,
    switchPir: false,
    sensitivity: 'low',
    delay: 5,
    delay2: 0,
    delay3: 0,
    delayState: 'd1_start',
  };

  constructor(props) {
    super(props);
    const { power, switchPir } = this.props;
    this.state = {
      power: power,
      switchPir: switchPir,
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
    const {  sensitivity, delay, delay2, delay3, delayState } = this.props;

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
        </View>

        <View style={styles.main}>
          {/* <TYText style={{color:'#fff',fontSize:18}}>{'props接收到的开关值：'+this.props.power + " " +typeof this.props.power}</TYText>
            <TYText style={{color:'#fff',fontSize:18}}>{'props接收到的开关：'+ this.props.switchPir}</TYText>
            <TYText style={{color:'#fff',fontSize:18}}>{'props接收到的delay：'+ this.props.delay}</TYText>
            <TYText style={{color:'#fff',fontSize:18}}>{'props接收到的delay2：'+ this.props.delay2}</TYText>
            <TYText style={{color:'#fff',fontSize:18}}>{'props接收到的delay3：'+ this.props.delay3}</TYText>
            <TYText style={{color:'#fff',fontSize:18}}>{'props接收到的delayState：'+ this.props.delayState}</TYText> */}
          <MyPicker delayName={Strings.getDpLang(delayCode1)} delay={delay} code={delayCode1} />
          <MyPicker delayName={Strings.getDpLang(delayCode2)} delay={delay2} code={delayCode2} />
          <MyPicker delayName={Strings.getDpLang(delayCode3)} delay={delay3} code={delayCode3} />
        </View>

        <TouchableOpacity style={styles.buttomlayout} onPress={this._onDelayStatePress}>
          <TYText style={styles.text}>{Strings.getDpLang(delayStateCode)}</TYText>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TYText style={styles.text}>
              {Strings.getDpLang(delayStateCode, delayState)}
            </TYText>
            <Image style={styles.arrow} source={Res.arrow} />
          </View>
        </TouchableOpacity>
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

  main: {
    flex: 1,
  },
});

export default connect(({ dpState }) => ({
  power: dpState[powerCode],
  switchPir: dpState[switchPirCode],
  sensitivity: dpState[sensitivityCode],
  delay: dpState[delayCode1],
  delay2: dpState[delayCode2],
  delay3: dpState[delayCode3],
  delayState: dpState[delayStateCode],
}))(GeneralMode);
