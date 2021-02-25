import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, PickerIOS } from 'react-native';
import { TYText, Picker, Utils, TYSdk } from 'tuya-panel-kit';
import Strings from '../i18n';

const { height, convertX: cx, convertY: cy, isIos } = Utils.RatioUtils;
const TYDevice = TYSdk.device;

// 初始化 picker ，若选了60分钟最大值，则秒置0；若感应延迟为1的话，最少延时时间为5秒
function minute_init() {
  let minute = [];
  for (let i = 0; i < 61; i++) {
    minute.push(Number(i));
  }
  return minute;
}
//0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55

function second_init() {
  let second = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  // let second = [];
  // for (let i = 5; i < 60; i++) {
  //   second.push(Number(i));
  // }
  return second;
}

function second_init2() {
  let second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  // let second = [];
  // for (let i = 0; i < 60; i++) {
  //   second.push(Number(i));
  // }
  return second;
}

class MyPicker extends Component {
  static PropTypes = {
    delayName: PropTypes.string,
    delay: PropTypes.number,
    code: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { delayName } = this.props;
    this.state = {
      delayState: delayName,
      second: second_init2(),
      minute: minute_init(),
      currentSecond: 0,
      currentMinute: 0,
    };
  }

  componentWillReceiveProps(props) {
    const delay = props.delay;
    const code = props.code;
    if (Math.floor(delay / 60) === 0 && code === 'pir_delay') {
      this.setState({
        second: second_init(),
        currentSecond: delay % 60,
        currentMinute: Math.floor(delay / 60),
      });
    } else {
      this.setState({
        currentSecond: delay % 60,
        currentMinute: Math.floor(delay / 60),
      });
    }
  }

  _handleMinuteChange = value => {
    const code = this.props.code;
    const tempdelay = this.props.delay;

    //判断是否60分钟，如果是则设置秒数为0
    if (value === Number(60)) {
      this.setState({
        currentMinute: value,
        second: [0],
      });
      TYDevice.putDeviceData({
        [code]: value * 60,
      });
    } else {
      this.setState({
        currentMinute: value,
        second: second_init2(),
      });
      TYDevice.putDeviceData({
        [code]: value * 60 + this.state.currentSecond,
      });
    }

    //判断是否是感应延时1
    if (code === 'pir_delay') {
      if (value === Number(0)) {
        this.setState({
          currentMinute: value,
          currentSecond: Number(5),
          second: second_init(),
        });
        TYDevice.putDeviceData({
          [code]: Number(5),
        });
      } else if (value === Number(60)) {
        this.setState({
          currentMinute: value,
          second: [0],
        });
        TYDevice.putDeviceData({
          [code]: value * 60,
        });
      } else {
        this.setState({
          currentMinute: value,
          second: second_init2(),
        });
        TYDevice.putDeviceData({
          [code]: value * 60 + this.state.currentSecond,
        });
      }
    }
  };

  _handleSecondChange = value => {
    const code = this.props.code;
    this.setState({
      currentSecond: value,
    });
    TYDevice.putDeviceData({
      [code]: this.state.currentMinute * 60 + value,
    });
  };

  render() {
    if (isIos) {
      return (
        <View style={styles.main}>
          <TYText style={styles.text}>{this.state.delayState}</TYText>
          <PickerIOS
            style={[styles.iosPicker]}
            itemStyle={styles.pickerItem}
            selectedValue={this.state.currentMinute}
            onValueChange={this._handleMinuteChange}
            visibleItemCount={1}
            loop={true}
          >
            {this.state.minute.map(value => (
              <PickerIOS.Item key={value} value={value} label={value.toString()} />
            ))}
          </PickerIOS>
          <TYText style={styles.text}>{' m '}</TYText>
          <PickerIOS
            style={[styles.iosPicker]}
            itemStyle={styles.pickerItem}
            selectedValue={this.state.currentSecond}
            onValueChange={this._handleSecondChange}
            visibleItemCount={1}
            loop={true}
          >
            {this.state.second.map(value => (
              <PickerIOS.Item key={value} value={value} label={value.toString()} />
            ))}
          </PickerIOS>
          <TYText style={styles.text}>{' s '}</TYText>
        </View>
      );
    } else {
      return (
        <View style={styles.main}>
          <TYText style={styles.text}>{this.state.delayState}</TYText>
          <Picker
            style={[styles.picker]}
            textSize={20}
            itemTextColor="#fff"
            selectedItemTextColor="#fff"
            selectedValue={this.state.currentMinute}
            onValueChange={this._handleMinuteChange}
            visibleItemCount={2}
            loop={true}
          >
            {this.state.minute.map(value => (
              <Picker.Item key={value} value={value} label={value.toString()} />
            ))}
          </Picker>
          <TYText style={styles.text}>{' m '}</TYText>
          <Picker
            style={[styles.picker]}
            textSize={20}
            itemTextColor="#fff"
            selectedItemTextColor="#fff"
            selectedValue={this.state.currentSecond}
            onValueChange={this._handleSecondChange}
            visibleItemCount={2}
            loop={true}
          >
            {this.state.second.map(value => (
              <Picker.Item key={value} value={value} label={value.toString()} />
            ))}
          </Picker>
          <TYText style={styles.text}>{' s '}</TYText>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 18,
    color: '#fff',
  },

  iosPicker: {
    marginHorizontal: 10,
    height: 30,
    width: '20%',
  },


  picker: {
    marginHorizontal: 10,
    height: 100,
    width: '20%',
  },

  pickerItem: {
    color: '#FFF',
    fontSize: 20,
    height: 50,
    marginTop: -10,
  },
});

export default MyPicker;
