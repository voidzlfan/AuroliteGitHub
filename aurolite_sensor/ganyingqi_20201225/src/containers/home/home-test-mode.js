import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { Utils, SwitchButton, Popup, TYText, TYSdk, Dialog } from 'tuya-panel-kit';
import { getEleIcon } from '../../utils';
import Strings from '../../i18n';
import dpCodes from '../../config/dpCodes';
import Res from '../../res';

const { convertX: cx, convertY: cy, width } = Utils.RatioUtils;
const TYDevice = TYSdk.device;

const {
  debugSwitch: debugSwitchCode,
  debugSet1: debugSet1Code,
  debugSet2: debugSet2Code,
  debugSet3: debugSet3Code,
  debugSet4: debugSet4Code,
  debugData1: debugData1Code,
  debugData2: debugData2Code,
  debugData3: debugData3Code,
  debugData4: debugData4Code,
} = dpCodes;

//_scrollView: ScrollView | null | undefined;

function zeroFilling(str, len) {
  let zero = new Array(len + 1).join('0');
  return (zero + str).slice(str.length, str.length + len + 1);
}

class TestMode extends Component {
  static propTypes = {
    debugSwitch: PropTypes.bool,
    debugSet1: PropTypes.number,
    debugSet2: PropTypes.number,
    debugSet3: PropTypes.number,
    debugSet4: PropTypes.number,
    debugData1: PropTypes.number,
    debugData2: PropTypes.number,
    debugData3: PropTypes.number,
    debugData4: PropTypes.number,
  };

  static defaultProps = {
    debugSet1: 1947483647,
    debugSet2: 1947483647,
    debugSet3: 1947483647,
    debugSet4: 1947483647,
  };

  constructor(props) {
    super(props);
    this.state = {
      debugSetToString1: '',
      debugSetToString2: '',
      debugSetToString3: '',
      debugSetToString4: '',
      logs: [],
      debugSettings: [
        {
          key: 'debugSet1',
          dpType: '',
          dpOrPin: '',
          reportingType: '',
          cycle: '',
          cycleUnit: '',
          growthRate: '',
          increaseMultiple: '',
          power: '',
          reserve: '',
        },
        {
          key: 'debugSet2',
          dpType: '',
          dpOrPin: '',
          reportingType: '',
          cycle: '',
          cycleUnit: '',
          growthRate: '',
          increaseMultiple: '',
          power: '',
          reserve: '',
        },
        {
          key: 'debugSet3',
          dpType: '',
          dpOrPin: '',
          reportingType: '',
          cycle: '',
          cycleUnit: '',
          growthRate: '',
          increaseMultiple: '',
          power: '',
          reserve: '',
        },
        {
          key: 'debugSet4',
          dpType: '',
          dpOrPin: '',
          reportingType: '',
          cycle: '',
          cycleUnit: '',
          growthRate: '',
          increaseMultiple: '',
          power: '',
          reserve: '',
        },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const ds1 = zeroFilling(nextProps.debugSet1.toString(2), 32);
    const ds2 = zeroFilling(nextProps.debugSet2.toString(2), 32);
    const ds3 = zeroFilling(nextProps.debugSet3.toString(2), 32);
    const ds4 = zeroFilling(nextProps.debugSet4.toString(2), 32);

    let log = '';
    let logs = this.state.logs;
    let list = [ds1, ds2, ds3, ds4];
    list.map((item, index) => {
      let data = 0;
      if (index === 0) data = nextProps.debugData1;
      if (index === 1) data = nextProps.debugData2;
      if (index === 2) data = nextProps.debugData3;
      if (index === 3) data = nextProps.debugData4;
      if (item.substring(8, 10) === '00') {
        let dpCodeName = Strings.getDpLang('debugging', parseInt(item.substring(0, 8), 2));
        if (parseInt(item.substring(0, 8), 2) < 101 || parseInt(item.substring(0, 8), 2) > 110)
          dpCodeName = '未知功能点';
        log = format(new Date(), '-') + ` ${index + 1}-↑↑` + dpCodeName + ' ' + '<上报>：' + data;
        logs.push(log);
      }
      if (item.substring(8, 10) === '01') {
        let dpCodeName = '引脚';
        log = format(new Date(), '-') + ` ${index + 1}-↑↑` + dpCodeName + ' ' + '<上报>：' + data;
        logs.push(log);
      } else if (item.substring(8, 10) === '10' || item.substring(8, 10) === '11') {
        let dpCodeName = '预留';
        log = format(new Date(), '-') + ` ${index + 1}-↑↑` + dpCodeName + ' ' + '<上报>：' + data;
        logs.push(log);
      }
    });

    this.setState({
      debugSetToString1: ds1,
      debugSetToString2: ds2,
      debugSetToString3: ds3,
      debugSetToString4: ds4,
      logs: logs,
      debugSettings: [
        {
          key: debugSet1Code,
          dpType: ds1.substring(8, 10),
          dpOrPin: ds1.substring(0, 8),
          reportingType: ds1.substring(11, 13),
          cycle: ds1.substring(13, 19),
          cycleUnit: ds1.substring(19, 21),
          growthRate: ds1.substring(21, 25),
          increaseMultiple: ds1.substring(25, 27),
          power: ds1.substring(10, 11),
          reserve: ds1.substring(27, 32),
        },
        {
          key: debugSet2Code,
          dpType: ds2.substring(8, 10),
          dpOrPin: ds2.substring(0, 8),
          reportingType: ds2.substring(11, 13),
          cycle: ds2.substring(13, 19),
          cycleUnit: ds2.substring(19, 21),
          growthRate: ds2.substring(21, 25),
          increaseMultiple: ds2.substring(25, 27),
          power: ds2.substring(10, 11),
          reserve: ds2.substring(27, 32),
        },
        {
          key: debugSet3Code,
          dpType: ds3.substring(8, 10),
          dpOrPin: ds3.substring(0, 8),
          reportingType: ds3.substring(11, 13),
          cycle: ds3.substring(13, 19),
          cycleUnit: ds3.substring(19, 21),
          growthRate: ds3.substring(21, 25),
          increaseMultiple: ds3.substring(25, 27),
          power: ds3.substring(10, 11),
          reserve: ds3.substring(27, 32),
        },
        {
          key: debugSet4Code,
          dpType: ds4.substring(8, 10),
          dpOrPin: ds4.substring(0, 8),
          reportingType: ds4.substring(11, 13),
          cycle: ds4.substring(13, 19),
          cycleUnit: ds4.substring(19, 21),
          growthRate: ds4.substring(21, 25),
          increaseMultiple: ds4.substring(25, 27),
          power: ds4.substring(10, 11),
          reserve: ds4.substring(27, 32),
        },
      ],
    });
  }

  // 1.获取要设置的功能点以及数据
  // 2.将数据转化为对应位数的二进制字符串
  // 3.获取绑定功能点的调试功能点debug_data_1，将改变后的值赋值给他
  // 4.调用setState()改变状态
  // 5.将功能点对象所有的属性拼接
  // 6.通过功能点code，parseInt(xxx,2)下发
  // 7.产生日志，格式：new Date() + 功能点${功能点}下发 + debug_data_1，push进去state.logs

  _onDpOrPinPress = items => {
    //  获取key值
    const code = items.key;
    //  获取默认输入框的值
    const value = parseInt(items.dpOrPin, 2).toString();
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = items.key.charAt(items.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }
    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    Dialog.prompt({
      keyboardType: 'numeric',
      title: Strings.getLang('dpOrPin'),
      cancelText: Strings.getLang('cancel'),
      confirmText: Strings.getLang('confirm'),
      defaultValue: value,
      placeholder: '请输入符合要求的数据（0-255）',
      onConfirm: text => {
        //处理不符合要求的输入，均处理为原来的值
        let textToInt = parseInt(text);
        if (isNaN(textToInt) || textToInt > 255 || textToInt < 0) {
          textToInt = parseInt(items.dpOrPin, 2);
        }
        let binaryText = zeroFilling(textToInt.toString(2), 8);

        settings.map(item => {
          if (item.key === items.key) {
            item.dpOrPin = binaryText;
          }
        });

        settings.map(item => {
          if (item.key === items.key) {
            debugSet32String =
              item.dpOrPin +
              item.dpType +
              item.power +
              item.reportingType +
              item.cycle +
              item.cycleUnit +
              item.growthRate +
              item.increaseMultiple +
              item.reserve;
          }
        });

        // 添加日志
        // log = format(new Date(), '-') + ` ${index+1}-` + dpCodeName + ' ' + '<上报>：' + data;
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('dpOrPin') +
          ' <下发>:' +
          parseInt(binaryText, 2);
        logs.push(log);

        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(binaryText, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        Dialog.close();
      },
    });
  };

  _onDpTypePress = item => {
    const code = item.key;
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = item.key.charAt(item.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }
    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    // 弹框选项
    const range = ['00', '01', '10', '11'];
    const rangStrings = range.map(v => ({
      key: v,
      title: Strings.getLang('dp' + v),
      value: v,
    }));

    Popup.list({
      title: Strings.getLang('dpType'),
      footerType: 'singleCancel',
      cancelText: Strings.getLang('cancel'),
      value: item.dpType,
      dataSource: rangStrings,
      onSelect: v => {
        settings.map(it => {
          if (it.key === item.key) {
            it.dpType = v;
          }
        });
        settings.map(it => {
          if (it.key === item.key) {
            debugSet32String =
              it.dpOrPin +
              it.dpType +
              it.power +
              it.reportingType +
              it.cycle +
              it.cycleUnit +
              it.growthRate +
              it.increaseMultiple +
              it.reserve;
          }
        });
        // 添加日志
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('dpType') +
          ' <下发>:' +
          parseInt(v, 2);
        logs.push(log);

        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(v, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        // TYDevice.putDeviceData({
        // });

        Popup.close();
      },
    });
  };

  _onPowerPress = item => {
    //  获取key值
    const code = item.key;
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = item.key.charAt(item.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }
    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    // 弹框选项
    const range = ['0', '1'];
    const rangStrings = range.map(v => ({
      key: v,
      title: Strings.getLang('testPower' + v),
      value: v,
    }));

    Popup.list({
      title: Strings.getLang('testPower'),
      footerType: 'singleCancel',
      cancelText: Strings.getLang('cancel'),
      value: item.power,
      dataSource: rangStrings,
      onSelect: v => {
        settings.map(it => {
          if (it.key === item.key) {
            it.power = v;
          }
        });
        settings.map(it => {
          if (it.key === item.key) {
            debugSet32String =
              it.dpOrPin +
              it.dpType +
              it.power +
              it.reportingType +
              it.cycle +
              it.cycleUnit +
              it.growthRate +
              it.increaseMultiple +
              it.reserve;
          }
        });
        // 添加日志
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('testPower') +
          ' <下发>:' +
          parseInt(v, 2);
        logs.push(log);
        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(v, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        Popup.close();
      },
    });
  };

  _onReportingTypePress = item => {
    //  获取key值
    const code = item.key;
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = item.key.charAt(item.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }

    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    // 弹框选项
    const range = ['00', '01', '10', '11'];
    const rangStrings = range.map(v => ({
      key: v,
      title: Strings.getLang('reportingType' + v),
      value: v,
    }));

    Popup.list({
      title: Strings.getLang('reportingType'),
      footerType: 'singleCancel',
      cancelText: Strings.getLang('cancel'),
      value: item.reportingType,
      dataSource: rangStrings,
      onSelect: v => {
        settings.map(it => {
          if (it.key === item.key) {
            it.reportingType = v;
          }
        });
        settings.map(it => {
          if (it.key === item.key) {
            debugSet32String =
              it.dpOrPin +
              it.dpType +
              it.power +
              it.reportingType +
              it.cycle +
              it.cycleUnit +
              it.growthRate +
              it.increaseMultiple +
              it.reserve;
          }
        });
        // 添加日志
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('reportingType') +
          ' <下发>:' +
          parseInt(v, 2);
        logs.push(log);
        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(v, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        Popup.close();
      },
    });
  };

  _onCyclePress = item => {
    //  获取key值
    const code = item.key;
    //  获取默认输入框的值
    const value = parseInt(item.cycle, 2).toString();
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = item.key.charAt(item.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }
    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    Dialog.prompt({
      keyboardType: 'numeric',
      title: Strings.getLang('cycle'),
      cancelText: Strings.getLang('cancel'),
      confirmText: Strings.getLang('confirm'),
      defaultValue: value,
      placeholder: '请输入符合要求的数据（0-59）',
      onConfirm: text => {
        //处理不符合要求的输入，均处理为原来的值
        let textToInt = parseInt(text);
        if (isNaN(textToInt) || textToInt > 59 || textToInt < 0) {
          textToInt = parseInt(item.cycle, 2);
        }
        let binaryText = zeroFilling(textToInt.toString(2), 6);

        settings.map(it => {
          if (it.key === item.key) {
            item.cycle = binaryText;
          }
        });

        settings.map(it => {
          if (it.key === item.key) {
            debugSet32String =
              it.dpOrPin +
              it.dpType +
              it.power +
              it.reportingType +
              it.cycle +
              it.cycleUnit +
              it.growthRate +
              it.increaseMultiple +
              it.reserve;
          }
        });

        // 添加日志
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('cycle') +
          ' <下发>:' +
          parseInt(binaryText, 2);
        logs.push(log);

        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(binaryText, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        Dialog.close();
      },
    });
  };

  _onCycleUnitPress = item => {
    //  获取key值
    const code = item.key;
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = item.key.charAt(item.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }

    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    // 弹框选项
    const range = ['00', '01', '10', '11'];
    const rangStrings = range.map(v => ({
      key: v,
      title: Strings.getLang('cycleUnit' + v),
      value: v,
    }));

    Popup.list({
      title: Strings.getLang('cycleUnit'),
      footerType: 'singleCancel',
      cancelText: Strings.getLang('cancel'),
      value: item.cycleUnit,
      dataSource: rangStrings,
      onSelect: v => {
        settings.map(it => {
          if (it.key === item.key) {
            it.cycleUnit = v;
            // if( v === '00'){
            //   it.cycle = zeroFilling((parseInt(it.cycle,2) * 0.1).toString(2),6);
            // }
            // if( v === '01'){
            //   it.cycle = zeroFilling((parseInt(it.cycle,2) * 1).toString(2),6);
            // }
            // if( v === '10'){
            //   it.cycle = zeroFilling((parseInt(it.cycle,2) * 60).toString(2),6);
            // }
            // if( v === '11'){
            //   it.cycle = zeroFilling((parseInt(it.cycle,2) * 60 * 60).toString(2),6);
            // }
          }
        });
        settings.map(it => {
          if (it.key === item.key) {
            debugSet32String =
              it.dpOrPin +
              it.dpType +
              it.power +
              it.reportingType +
              it.cycle +
              it.cycleUnit +
              it.growthRate +
              it.increaseMultiple +
              it.reserve;
          }
        });
        // 添加日志
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('cycleUnit') +
          ' <下发>:' +
          parseInt(v, 2);
        logs.push(log);
        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(v, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        Popup.close();
      },
    });
  };

  _onGrowthRatePress = item => {
    //  获取key值
    const code = item.key;
    //  获取默认输入框的值
    const value = parseInt(item.growthRate, 2).toString();
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = item.key.charAt(item.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }
    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    Dialog.prompt({
      keyboardType: 'numeric',
      title: Strings.getLang('growthRate'),
      cancelText: Strings.getLang('cancel'),
      confirmText: Strings.getLang('confirm'),
      defaultValue: value,
      placeholder: '请输入符合要求的数据（1-9）',
      onConfirm: text => {
        //处理不符合要求的输入，均处理为原来的值
        let textToInt = parseInt(text);
        if (isNaN(textToInt) || textToInt > 9 || textToInt < 1) {
          textToInt = parseInt(item.growthRate, 2);
        }
        let binaryText = zeroFilling(textToInt.toString(2), 4);

        settings.map(it => {
          if (it.key === item.key) {
            item.growthRate = binaryText;
          }
        });

        settings.map(it => {
          if (it.key === item.key) {
            debugSet32String =
              it.dpOrPin +
              it.dpType +
              it.power +
              it.reportingType +
              it.cycle +
              it.cycleUnit +
              it.growthRate +
              it.increaseMultiple +
              it.reserve;
          }
        });

        // 添加日志
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('growthRate') +
          ' <下发>:' +
          parseInt(binaryText, 2);
        logs.push(log);

        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(binaryText, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        Dialog.close();
      },
    });
  };

  _onIncreaseMultiplePress = item => {
    //  获取key值
    const code = item.key;
    // 获取key最后一位字符n，用以判断是哪一个调试设置，下发对应的调试数据debug_data_n
    const temp = item.key.charAt(item.key.length - 1);
    let debugDataCode = '';
    switch (temp) {
      case '1':
        debugDataCode = debugData1Code;
        break;
      case '2':
        debugDataCode = debugData2Code;
        break;
      case '3':
        debugDataCode = debugData3Code;
        break;
      case '4':
        debugDataCode = debugData4Code;
        break;
    }

    // 用于拼接32位字符串下发
    let debugSet32String = '';
    // 用于添加日志信息
    let logs = this.state.logs;
    // 获取调试设置对象数组，在弹框时设置值
    const settings = this.state.debugSettings;

    // 弹框选项
    const range = ['00', '01', '10', '11'];
    const rangStrings = range.map(v => ({
      key: v,
      title: Strings.getLang('increaseMultiple' + v),
      value: v,
    }));

    Popup.list({
      title: Strings.getLang('increaseMultiple'),
      footerType: 'singleCancel',
      cancelText: Strings.getLang('cancel'),
      value: item.increaseMultiple,
      dataSource: rangStrings,
      onSelect: v => {
        settings.map(it => {
          if (it.key === item.key) {
            it.increaseMultiple = v;
          }
        });
        settings.map(it => {
          if (it.key === item.key) {
            debugSet32String =
              it.dpOrPin +
              it.dpType +
              it.power +
              it.reportingType +
              it.cycle +
              it.cycleUnit +
              it.growthRate +
              it.increaseMultiple +
              it.reserve;
          }
        });
        // 添加日志
        let log =
          format(new Date(), '-') +
          ` ${temp}-↓↓` +
          Strings.getLang('increaseMultiple') +
          ' <下发>:' +
          parseInt(v, 2);
        logs.push(log);
        TYDevice.putDeviceData({
          [debugDataCode]: parseInt(v, 2),
          [code]: parseInt(debugSet32String, 2),
        });
        this.setState({
          debugSettings: settings,
          logs: logs,
        });

        Popup.close();
      },
    });
  };

  

  render() {
    let list = this.state.debugSettings;

    return (
      <View style={styles.container}>
        <View style={styles.debugSet}>
           {/*<View style={styles.layout}>
            <Text>{'dpOrPin'}</Text>
            <Text>{'dpType'}</Text>
            <Text>{'switch'}</Text>
            <Text>{'rpType'}</Text>
            <Text>{'cycle'}</Text>
            <Text>{'cycleUnit'}</Text>
            <Text>{'amplitude'}</Text>
            <Text>{'AmplitudeRatio'}</Text>
          </View>*/}
          {list.map(item => {
            return (
              <View style={styles.layout}>
                <TouchableOpacity onPress={() => this._onDpOrPinPress(item)}>
                  <Text>{parseInt(item.dpOrPin, 2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onDpTypePress(item)}>
                  <Text>{Strings.getLang('dp' + item.dpType)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onPowerPress(item)}>
                  <Text>{Strings.getLang('testPower' + item.power)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onReportingTypePress(item)}>
                  <Text>{Strings.getLang('reportingType' + item.reportingType)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onCyclePress(item)}>
                  <Text>{parseInt(item.cycle, 2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onCycleUnitPress(item)}>
                  <Text>{Strings.getLang('cycleUnit' + item.cycleUnit)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onGrowthRatePress(item)}>
                  <Text>{parseInt(item.growthRate, 2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onIncreaseMultiplePress(item)}>
                  <Text>{Strings.getLang('increaseMultiple' + item.increaseMultiple)}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <ScrollView
          style={styles.scrollView}
          onContentSizeChange={() => this.ref.scrollToEnd({ animated: true })}
          ref={ref => (this.ref = ref)}
        >
          <Text style={{ fontSize: 16, color: '#fff' }}>上报/下发记录</Text>
          {this.state.logs.map(item => {
            if (item.indexOf('下发') > -1) {
              return <Text style={{ color: 'green' }}>{item}</Text>;
            } else {
              return <Text>{item}</Text>;
            }
          })}
        </ScrollView>
      </View>
    );
  }
}
/*
{list.map(item => {
            return (
              <View style={styles.layout}>
                <TouchableOpacity onPress={() => this._onDpOrPinPress(item)}>
                  <Text>{parseInt(item.dpOrPin, 2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onDpTypePress(item)}>
                  <Text>{Strings.getLang('dp' + item.dpType)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onReportingTypePress(item)}>
                  <Text>{Strings.getLang('reportingType' + item.reportingType)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onCyclePress(item)}>
                  <Text>{parseInt(item.cycle, 2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onCycleUnitPress(item)}>
                  <Text>{Strings.getLang('cycleUnit' + item.cycleUnit)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onGrowthRatePress(item)}>
                  <Text>{parseInt(item.growthRate, 2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onIncreaseMultiplePress(item)}>
                  <Text>{Strings.getLang('increaseMultiple' + item.increaseMultiple)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onPowerPress(item)}>
                  <Text>{Strings.getLang('testPower' + item.power)}</Text>
                </TouchableOpacity>
              </View>
            );
          })}






*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  debugSet: {},

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

  scrollView: {
    marginHorizontal: 10,
    marginVertical: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

// 第一个参数为日期，第二个参数为年月日分割格式 '/'或'-'
function format(Date, str) {
  var obj = {
    Y: Date.getFullYear(),
    M: Date.getMonth() + 1,
    D: Date.getDate(),
    H: Date.getHours(),
    Mi: Date.getMinutes(),
    S: Date.getSeconds(),
  };
  // 拼接时间 hh:mm:ss
  var time = ' ' + supplement(obj.H) + ':' + supplement(obj.Mi) + ':' + supplement(obj.S);
  // yyyy-mm-dd
  if (str.indexOf('-') > -1) {
    return obj.Y + '-' + supplement(obj.M) + '-' + supplement(obj.D) + time;
  }
  // yyyy/mm/dd
  if (str.indexOf('/') > -1) {
    return obj.Y + '/' + supplement(obj.M) + '/' + supplement(obj.D) + time;
  }
}
// 位数不足两位补全0
function supplement(nn) {
  return (nn = nn < 10 ? '0' + nn : nn);
}
//var nowDate = new Date();
//console.log(format(nowDate,'-'));// 2020-12-23 19:53:39

export default connect(({ dpState }) => ({
  debugSwitch: dpState[debugSwitchCode],
  debugSet1: dpState[debugSet1Code],
  debugSet2: dpState[debugSet2Code],
  debugSet3: dpState[debugSet3Code],
  debugSet4: dpState[debugSet4Code],
  debugData1: dpState[debugData1Code],
  debugData2: dpState[debugData2Code],
  debugData3: dpState[debugData3Code],
  debugData4: dpState[debugData4Code],
}))(TestMode);
