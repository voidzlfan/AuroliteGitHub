import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Utils, Popup, TYText } from 'tuya-panel-kit';
import { connect } from 'react-redux';

import Anim from './animated';
import dpCodes from '../../config/dpCodes';
import Strings from '../../i18n';
import Res from '../../res';
import splitData from '../../utils/splitData';

const { width, convertX: cx, convertY: cy } = Utils.RatioUtils;

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

class Test extends Component {

  static propTypes = {
    switchLed: PropTypes.bool,
    switchSensor: PropTypes.bool,
    bodyState: PropTypes.oneOf(['NOBODY','SOMEONE_NORMAL','SOMEONE_ABNORMAL']),
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: '' || '00011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011',
    };
  }

  
  componentWillReceiveProps(nextProps){
    const { temperatureData: data } = nextProps;
    let arr = [];
    let index = 0;
    let result = '';        // 处理透传型数据后的结果，为0和1组成的字符串，长度128
    for(let a of data){
      arr.push(a);
    }
    while(index < arr.length){
      let temp = '0x' + arr[index] + arr[index+1];
      let strTemp = (+temp).toString(2);
      result += zeroFilling(strTemp,8); //补0
      index += 2;
    }

    this.setState({
      data: result || '00011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011',
    })
  }

  // 产生随机数
  onClick = () => {
    let str = '';
    for (let i = 0; i < 128; i++) {
      str += Math.floor(Math.random() + 0.5);
    }
    this.setState({
      data: str,
    });
  };

  onLog = () => {
    let range = ['1', '2', '3', '4', '5', '6'];
    const rangeStrings = range.map(v => ({
      key: v,
      title: v,
      value: v,
    }));

    Popup.list({
      title: 'title',
      footerType: 'singleCancel',
      cancelText: '取消',
      value: '1',
      dataSource: rangeStrings,
      onSelect: v => {
        // TYDevice.putDeviceData({
        //   [cdsCode]: v,
        // });
        Popup.close();
      },
    });
  };

  // 显示测试用，正式发布删除
  test = () => {
    const { temperatureData: data } = this.props;
    let arr = [];
    let index = 0;
    let result = '';
    for(let a of data){
      arr.push(a);
    }
    while(index < arr.length){
      let temp = '0x' + arr[index] + arr[index+1];
      let strTemp = (+temp).toString(2);
      result += zeroFilling(strTemp,8); //补0
      index += 2;
    }
    return result;
  }

  // 无用，后续删除
  _onDelayStatePress = () => {

  }


  render() {
    const { data } = this.state;
    const { switchLed, switchSensor, bodyState } = this.props;

    const arr = splitData(data);  // 按两个字符分割成一个数组，长度64

    return (
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <Text style={{ color: '#000', fontSize: 30 }}>当前状态：{Strings.getDpName(bodyStateCode,bodyState)}</Text>
        </View> */}

        <TouchableOpacity style={styles.buttomlayout} onPress={this._onDelayStatePress}>
          <TYText style={styles.text}>{Strings.getDpLang(bodyStateCode)}</TYText>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TYText style={styles.text}>
              {Strings.getDpLang(bodyStateCode, bodyState)}
            </TYText>
            <Image style={styles.arrow} source={Res.arrow} />
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.box}>
            {/* {arr.map(item => {
              if (item === '00') {
                return <View style={styles.square_00}></View>;
              } else if (item === '01') {
                return <View style={styles.square_01}></View>;
              } else if (item === '10') {
                return <View style={styles.square_10}></View>;
              } else {
                return <View style={styles.square_11}></View>;
              }
            })} */}
            {arr.map(item => {
              return <Anim keyItem={item} height={squareWidth} width={squareWidth} />;
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={this.onClick} style={styles.buttonView}>
            <Text>产生随机数</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLog} style={styles.buttonView}>
            <Text>弹出异常日志</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View><Text>{"接收到的temper_data_daw:"+this.props.temperatureData}</Text></View>
          <View><Text>{"接收到的temper_data_daw类型:"+ typeof this.props.temperatureData}</Text></View>
          <View><Text>{typeof this.props.temperatureData === 'string' ? this.test() : '不是字符型' }</Text></View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flex: 1,
    height: cx(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  content: {
    flex: 3,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    width: boxWidth + 20,
    height: boxHeight + 20,
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

  buttonView: {
    width: cx(100),
    height: cx(50),
    borderRadius: cx(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: cx(10),
    backgroundColor: '#0099FF',
  },

  // square_00: {
  //   width: squareWidth,
  //   height: squareWidth,
  //   backgroundColor: '#FFFFFF',
  //   margin: cx(1),
  //   borderWidth: cx(1),
  //   borderColor: 'rgba(0,0,0,0.6)',
  // },

  // square_01: {
  //   width: squareWidth,
  //   height: squareWidth,
  //   backgroundColor: '#FFEBCD',
  //   margin: cx(1),
  //   borderWidth: cx(1),
  //   borderColor: 'rgba(0,0,0,0.6)',
  // },

  // square_10: {
  //   width: squareWidth,
  //   height: squareWidth,
  //   backgroundColor: '#FFD39B',
  //   margin: cx(1),
  //   borderWidth: cx(1),
  //   borderColor: 'rgba(0,0,0,0.6)',
  // },

  // square_11: {
  //   width: squareWidth,
  //   height: squareWidth,
  //   backgroundColor: '#FF8247',
  //   margin: cx(1),
  //   borderWidth: cx(1),
  //   borderColor: 'rgba(0,0,0,0.6)',
  // },

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

});

export default connect(({ dpState }) => ({
  switchLed: dpState[switchLedCode],
  switchSensor: dpState[switchSensorCode],
  bodyState: dpState[bodyStateCode],
  temperatureData: dpState[temperatureDataCode],
}))(Test);

