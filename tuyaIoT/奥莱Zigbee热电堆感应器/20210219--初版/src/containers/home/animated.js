import React, { Component } from 'react';

import { View, StyleSheet, Animated } from 'react-native';
import { Utils } from 'tuya-panel-kit';

const { width, convertX: cx, convertY: cy } = Utils.RatioUtils;

const boxWidth = Math.floor(width * 0.9);
const boxHeight = Math.floor(width * 0.9);
const squareWidth = Math.floor(boxWidth / 8);

class MyAnimated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  static defaultProps = {
    // height: squareWidth,
    // width: squareWidth,
    backgroundColor: '#FFFFFF',
    margin: cx(1),
    borderWidth: cx(1),
    borderColor: 'rgba(0,0,0,0.6)',
  };

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 2000,
    }).start();
  }

  // 根据key判断显示对应的颜色 00 -- #FFFFFF , 01 -- #FFEBCD, 10 -- #FFD39B, 11 -- #FF8247
  judge = keyItem => {
    if (!keyItem) return '#FFFFFF';
    if (keyItem === '00') {
      return '#FFFFFF';
    } else if (keyItem === '01') {
      return '#FFEBCD';
    } else if (keyItem === '10') {
      return '#FFD39B';
    } else {
      return '#FF8247';
    }
  };

  render() {
    const { fadeAnim } = this.state;
    const { keyItem } = this.props;
    const originColor = '#FFFFFF'
    const renderColor = this.judge(keyItem);
    return (
        <Animated.View
          style={{
            ...this.props,
            backgroundColor: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [originColor, renderColor],
            }),
          }}
        ></Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyAnimated;
