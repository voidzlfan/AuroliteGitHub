import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Utils, Popup, Popup, Swipeout } from 'tuya-panel-kit';

class CustomPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  delete = () => {
      console.log(1);
  }

  renderPopup = () => {
    const rightBtn = [
      {
        text: '删除',
        onPress: () => this.delete(),
        type: 'delete',
        textStyle: { color: '#fff', fontSize: 16 },
      },
    ];

    Popup.custom({
      title: '异常记录',
      content: (
        <View
          style={{
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Swipeout autoClose right={rightBtn}>
            <View style={{height:60}}>
              <Text style={{ fontSize: 36, color: '#000' }}>Custom Content</Text>
            </View>
          </Swipeout>
        </View>
      ),
      footerType: 'singleCancel',
    });
  };

  render() {
    return <View style={{flex:1}}>{this.renderPopup()}</View>;
  }
}

export default CustomPopup;
