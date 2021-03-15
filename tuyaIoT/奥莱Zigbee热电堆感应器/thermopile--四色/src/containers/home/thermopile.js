import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Utils, Popup, TYText, Toast, SwitchButton, Swipeout, TYSdk } from 'tuya-panel-kit';
import { connect } from 'react-redux';

import Anim from './animated';
import dpCodes from '../../config/dpCodes';
import Strings from '../../i18n';
import Res from '../../res';
import splitData from '../../utils/splitData';

const TYDevice = TYSdk.device;
const { width, convertX: cx, convertY: cy } = Utils.RatioUtils;

const boxWidth = Math.floor(width * 0.9);
const boxHeight = Math.floor(width * 0.9);
const squareWidth = Math.floor(boxWidth / 8);

const {
  switchLed: switchLedCode,
  switchSensor: switchSensorCode,
  bodyState: bodyStateCode,
  temperatureData: temperatureDataCode,
  abnormalData: abnormalDataCode,
  time: timeCode,
} = dpCodes;

function zeroFilling(str, len) {
  let zero = new Array(len + 1).join('0');
  return (zero + str).slice(str.length, str.length + len + 1);
}

class Thermopile extends Component {
  static propTypes = {
    switchLed: PropTypes.bool,
    switchSensor: PropTypes.bool,
    bodyState: PropTypes.oneOf(['NOBODY','SOMEBODY']),
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      switchLed: props.switchLed,
      switchSensor: props.switchSensor,
      data:
        '' ||
        '00011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011',
      abnormalTimestamp: [], // 用数组存储异常时间戳
      realTimeFlag: true, // 实时标志
      show: false, // 吐司标志
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      switchLed,
      switchSensor,
      temperatureData: normalData,
      abnormalData: abnormalData,
      time,
    } = nextProps;
    const { abnormalTimestamp: oldTimeArr, realTimeFlag } = this.state;
    // 根据当前状态显示数据
    let data;
    if (realTimeFlag) {
      data = normalData;
    } else {
      data = abnormalData;
    }
    let arr = [];
    let index = 0;
    let result = ''; // result处理透传型数据后的结果，为0和1组成的字符串，长度128
    for (let a of data) {
      arr.push(a);
    }
    while (index < arr.length) {
      let temp = '0x' + arr[index] + arr[index + 1];
      let strTemp = (+temp).toString(2);
      result += zeroFilling(strTemp, 8); //补0
      index += 2;
    }

    // 接收异常时间戳上报
    if (time === undefined || time === null || time === '') {
      // 没有上报则什么也不做
    } else {
      oldTimeArr.push(time); //time时间格式未知，现在直接存储，后续格式待处理
    }

    this.setState({
      switchLed: switchLed,
      switchSensor: switchSensor,
      data:
        result ||
        '00011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011000110110001101100011011',
      abnormalTimestamp: oldTimeArr,
    });
  }

  // 切回实时状态
  onClick = () => {
    if (this.state.realTimeFlag) {
      this.setState({
        //realTimeFlag: true,
        show: true,
      });
    } else {
      this.setState({
        realTimeFlag: true,
      });
    }
  };

  // 显示异常日志，点击下发时间戳，并设置实时标志为false，待实现
  onLog = () => {
    //const { abnormalTimestamp: range } = this.state;
    //let range = ['1', '2', '3', '4', '5', '6'];
    // const rangeStrings = range.map(v => ({
    //   key: v,
    //   title: v,
    //   value: v,
    // }));

    Popup.custom({
      title: '异常记录',
      titleTextStyle: styles.textStyle,
      cancelText: '取消',
      cancelTextStyle: styles.textStyle,
      footerType: 'singleCancel',
      content: (
        <ScrollView
          style={{
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <View style={{ marginHorizontal: 10 }}>
            <Swipeout autoClose right={rightBtn}>
              <View style={styles.contentStyle}>
                <TouchableOpacity onPress={()=>Popup.close()}>
                  <TYText style={styles.textStyle}>Custom Content</TYText>
                </TouchableOpacity>
              </View>
            </Swipeout>
          </View>
        </ScrollView>
      ),
      
    });
    
  };

  // 打印测试用，正式发布删除
  test = () => {
    const { temperatureData: data } = this.props;
    let arr = [];
    let index = 0;
    let result = '';
    for (let a of data) {
      arr.push(a);
    }
    while (index < arr.length) {
      let temp = '0x' + arr[index] + arr[index + 1];
      let strTemp = (+temp).toString(2);
      result += zeroFilling(strTemp, 8); //补0
      index += 2;
    }
    return result;
  };

  render() {
    const { switchLed, switchSensor, data } = this.state;
    const { bodyState } = this.props;

    const arr = splitData(data); // 按两个字符分割成一个数组，长度64

    return (
      <View style={styles.container}>
        {/* 开关 */}
        {/* <View style={styles.layout}>
          <TYText style={styles.text}>{Strings.getDpLang(switchLedCode)}</TYText>
          <SwitchButton
            defaultValue={switchLed}
            onValueChange={power => {
              TYDevice.putDeviceData({
                [switchLedCode]: power,
              });
              this.setState({
                switchLed: power,
              });
            }}
          />
        </View> */}
        {/* 感应开关 */}
        {/* <View style={styles.layout}>
          <TYText style={styles.text}>{Strings.getDpLang(switchSensorCode)}</TYText>
          <SwitchButton
            defaultValue={switchSensor}
            onValueChange={power => {
              TYDevice.putDeviceData({
                [switchSensorCode]: power,
              });
              this.setState({
                switchSensor: power,
              });
            }}
          />
        </View> */}
        {/* 人体状态 */}
        <View style={styles.layout}>
          <TYText style={styles.text}>{Strings.getDpLang(bodyStateCode)}</TYText>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TYText style={styles.text}>{Strings.getDpLang(bodyStateCode, bodyState)}</TYText>
            <Image style={styles.arrow} source={Res.arrow} />
          </View>
        </View>

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
          <Toast
            show={this.state.show}
            text="当前已是实时状态"
            onFinish={() => this.setState({ show: false })}
          />
          <TouchableOpacity onPress={this.onClick} style={styles.bottomView}>
            <Text>切回实时状态</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLog} style={styles.bottomView}>
            <Text>弹出异常日志</Text>
          </TouchableOpacity>
        </View>

        {/* 打印测试信息，正式发布删除 */}
        <ScrollView>
          <View><Text>{"bodyState:"+bodyState}</Text></View>
          <View>
            <Text>{'接收到的temper_data_daw:' + this.props.temperatureData}</Text>
          </View>
          <View>
            <Text>{'接收到的temper_data_daw类型:' + typeof this.props.temperatureData}</Text>
          </View>
          <View>
            <Text>
              {typeof this.props.temperatureData === 'string' ? this.test() : '不是字符型'}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  //------ 主体渲染格子64个
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
  //------ end

  //------ 底部切回实时，异常日志按钮
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  bottomView: {
    width: cx(100),
    height: cx(50),
    borderRadius: cx(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: cx(10),
    backgroundColor: '#0099FF',
  },
  //------ end

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

  //------ 人体状态
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 1,
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#c6e2ff',
  },

  text: {
    fontSize: 18,
    color: '#000',
  },
  arrow: {
    marginLeft: 5,
  },
  //------ end

  //------ 自定义弹框
  contentStyle: {
    height: 45,
    width: width,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  textStyle: {
    fontSize: 18,
    color: '#333',
  },
  //------ end

});

export default connect(({ dpState }) => ({
  switchLed: dpState[switchLedCode],
  switchSensor: dpState[switchSensorCode],
  bodyState: dpState[bodyStateCode],
  temperatureData: dpState[temperatureDataCode], // 实时数据
  abnormalData: dpState[abnormalDataCode], // 异常数据
  time: dpState[timeCode],
}))(Thermopile);
