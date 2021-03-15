import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Utils, Tab, TYSdk, GlobalToast, TYText } from 'tuya-panel-kit';
import { getEleIcon } from '../../utils';
import Strings from '../../i18n';
//import Res from '../../res';
import dpCodes from '../../config/dpCodes';
import SavingMode from './home-saving-mode';
import GeneralMode from './home-general-mode';
import AlertMode from './home-alert-mode';

const { width, convertX: cx, convertY: cy } = Utils.RatioUtils;
const TYDevice = TYSdk.device;
const { mode: modeCode } = dpCodes;

class HomeTopView extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(['power_saving_mode', 'general_mode', 'alert_mode']),
  };

  static defaultProps = {
    mode: 'general_mode',
  };

  constructor(props) {
    super(props);
    this.state = {
      stateMode: props.mode
    };
  }

  _tabOnChange = value => {
    //切换感应器模式
    TYDevice.putDeviceData({
      [modeCode]: value,
    });
    GlobalToast.show({
      text: Strings.getLang('toggleMode'),
      onFinish: () => {
        GlobalToast.hide();
      },
    });
  };

  componentWillReceiveProps(props){
    this.setState({
      stateMode: props.mode
    })
  }

  render() {
    let mode = this.props.mode;

    const savingMode = Strings.getDpLang('mode', 'power_saving_mode');
    const generalMode = Strings.getDpLang('mode', 'general_mode');
    const alertMode = Strings.getDpLang('mode', 'alert_mode');

    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <Tab
          defaultActiveKey={this.state.stateMode}
          //activeKey={mode}
          onChange={this._tabOnChange}
          tabStyle={{ backgroundColor: '#363940' }}
          tabBarUnderlineStyle={{ backgroundColor: '#fff' }}
          tabTextStyle={{ color: '#fff', fontSize: 18 }}
          tabBarStyle={{ height: 70, backgroundColor: 'transparent' }}
          style={{ backgroundColor: 'transparent' }}
          tabBarPosition="bottom"
        >
          <Tab.TabPane key={'power_saving_mode'} tab={savingMode} style={{ flex: 1 }}>
            <SavingMode />
          </Tab.TabPane>
          <Tab.TabPane key={'general_mode'} tab={generalMode} style={{ flex: 1 }}>
            <GeneralMode />
          </Tab.TabPane>
          <Tab.TabPane key={'alert_mode'} tab={alertMode} style={{ flex: 1 }}>
            <AlertMode />
          </Tab.TabPane>
        </Tab>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(({ dpState }) => ({
  mode: dpState[modeCode],
}))(HomeTopView);
