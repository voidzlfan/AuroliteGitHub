import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Utils, SwitchButton, TYText, TYSdk } from 'tuya-panel-kit';
import { connect } from 'react-redux';

import Anim from './animated';
import dpCodes from '../../config/dpCodes';
import Strings from '../../i18n';
import Res from '../../res';
import splitData from '../../utils/splitData';

const { width, convertX: cx, convertY: cy } = Utils.RatioUtils;
const TYDevice = TYSdk.device;

const boxWidth = Math.floor(width * 0.9);
const boxHeight = Math.floor(width * 0.9);
const squareWidth = Math.floor(boxWidth / 8);

const {
  switchLed: switchLedCode,
  switchSensor: switchSensorCode,
  bodyState: bodyStateCode,
  temperatureData: temperatureDataCode,
} = dpCodes;

function zeroFilling(str, len) {
  let zero = new Array(len + 1).join('0');
  return (zero + str).slice(str.length, str.length + len + 1);
}

class Thermopile extends Component {
  static propTypes = {
    switchLed: PropTypes.bool,
    switchSensor: PropTypes.bool,
    bodyState: PropTypes.oneOf(['NOBODY', 'SOMEBODY']),
  };

  static defaultProps = {
    switchSensor: false,
    bodyState: 'NOBODY',
  };

  constructor(props) {
    super(props);
    this.state = {
      data:
        '' ||
        '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      switchSensor: props.switchSensor,
    };
  }

  componentWillReceiveProps(nextProps){
    const { temperatureData: data, switchSensor } = nextProps;
    let arr = [];
    let index = 0;
    let result = '';        // 处理透传型数据后的结果，为0和1组成的字符串，长度128
    if(data !== undefined){
      for(let a of data){
        arr.push(a);
      }
      while(index < arr.length){
        let temp = '0x' + arr[index] + arr[index+1];
        let strTemp = (+temp).toString(2);
        result += zeroFilling(strTemp,8); //补0
        index += 2;
      }  
    }
    
    this.setState({
      data: result || '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      switchSensor: switchSensor,
    })
  }

  // 显示测试用，正式发布删除
  test = () => {
    const { temperatureData: data } = this.props;
    let arr = [];
    let index = 0;
    let result = '';
    if(data !== undefined){
      for(let a of data){
        arr.push(a);
      }
      while(index < arr.length){
        let temp = '0x' + arr[index] + arr[index+1];
        let strTemp = (+temp).toString(2);
        result += zeroFilling(strTemp,8); //补0
        index += 2;
      }
    }
    return result;
  }

  render() {
    const { data,  } = this.state;
    const { switchLed, bodyState, switchSensor } = this.props;

    const arr = splitData(data); // 按两个字符分割成一个数组，长度64

    return (
      <View style={styles.container}>
        <View style={styles.logo} >
          <Image source={Res.logo}/>
        </View>

        <View style={styles.layout}>
          <TYText style={styles.text}>{Strings.getDpLang(switchSensorCode)}</TYText>
          <SwitchButton
            tintColor="#FAEBD7"
            value={switchSensor}
            //defaultValue={this.state.switchSensor}
            onValueChange={power => {
              TYDevice.putDeviceData({
                [switchSensorCode]: power,
              });
              this.setState({
                switchSensor: power,
              });
            }}
          />
        </View>

        <View style={styles.layout}>
          <TYText style={styles.text}>{Strings.getDpLang(bodyStateCode)}</TYText>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TYText style={styles.text}>{Strings.getDpLang(bodyStateCode, bodyState)}</TYText>
            <Image style={styles.arrow} source={Res.arrow} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.box}>
            {arr.map(item => {
              return <Anim keyItem={item} height={squareWidth} width={squareWidth} />;
            })}
          </View>
        </View>

        {/* <View style={styles.footer}>
          <TouchableOpacity onPress={this.onClick} style={styles.bottomView}>
            <Text>重新采集</Text>
          </TouchableOpacity>
        </View> */}
        {/* <ScrollView>
          <View><Text>{"接收到的switchLed:"+switchLed}</Text></View>
          <View><Text>{"接收到的switchSensor:"+switchSensor}</Text></View>
          <View><Text>{"接收到的temper_data_daw:"+this.props.temperatureData}</Text></View>
          <View><Text>{"接收到的temper_data_daw类型:"+ typeof this.props.temperatureData}</Text></View>
          <View><Text>{typeof this.props.temperatureData === 'string' ? this.test() : '不是字符型' }</Text></View>
        </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#CAE1FF',
  },

  text: {
    fontSize: 18,
    color: '#000',
  },

  arrow: {
    marginLeft: 5,
  },

  content: {
    flex: 3,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    width: boxWidth + 40,
    height: boxHeight + 40,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  // bottomView: {
  //   width: cx(100),
  //   height: cx(50),
  //   borderRadius: cx(15),
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginHorizontal: cx(10),
  //   backgroundColor: '#0099FF',
  // },
});

export default connect(({ dpState }) => ({
  switchLed: dpState[switchLedCode],
  switchSensor: dpState[switchSensorCode],
  bodyState: dpState[bodyStateCode],
  temperatureData: dpState[temperatureDataCode],
}))(Thermopile);
