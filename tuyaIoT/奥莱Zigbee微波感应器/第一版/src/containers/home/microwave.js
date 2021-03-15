import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { SwitchButton, TYText, TYSdk, Utils } from 'tuya-panel-kit';
import { connect } from 'react-redux';

import dpCodes from '../../config/dpCodes';
import Strings from '../../i18n';
import Res from '../../res';

const TYDevice = TYSdk.device;
const { width } = Utils.RatioUtils;

const { pirState: pirStateCode, switchPir: switchPirCode } = dpCodes;

class Microwave extends Component {
  static propTypes = {
    pirState: PropTypes.oneOf(['pir', 'none']),
    switchPir: PropTypes.bool,
  };

  static defaultProps = {
    pirState: 'none',
    switchPir: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      switchPir: props.switchPir,
    };
  }

  componentWillReceiveProps(nextProps){
    const { switchPir } = nextProps;
    this.setState({
      switchPir
    })
  }

  render() {
    const { pirState } = this.props;
    const { switchPir } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.logo} >
          <Image source={Res.logo}/>
        </View>

        <View style={styles.layout}>
          <TYText style={styles.text}>{Strings.getDpLang(switchPirCode)}</TYText>
          <SwitchButton
            tintColor="#FAEBD7"
            value={switchPir}
            onValueChange={power => {
              TYDevice.putDeviceData({
                [switchPirCode]: power,
              });
              this.setState({
                switchPir: power,
              });
            }}
          />
        </View>
        <View style={styles.layout}>
          <TYText style={styles.text}>{Strings.getDpLang(pirStateCode)}</TYText>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TYText style={styles.text}>{Strings.getDpLang(pirStateCode, pirState)}</TYText>
            <Image style={styles.arrow} source={Res.arrow} />
          </View>
        </View>

        <View style={styles.center}>
          <View style={styles.centerImage}>
            <ImageBackground source={pirState === 'pir' ? Res.someone : Res.nobody} style={styles.bg}>
              {/* <Image
                style={{ width: 160, height: 160 }}
                source={pirState === 'pir' ? Res.users : Res.siren}
              /> */}
            </ImageBackground>
          </View>
        </View>
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

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerImage: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  bg: {
    width: width * 0.8,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(({ dpState }) => ({
  pirState: dpState[pirStateCode],
  switchPir: dpState[switchPirCode],
}))(Microwave);
