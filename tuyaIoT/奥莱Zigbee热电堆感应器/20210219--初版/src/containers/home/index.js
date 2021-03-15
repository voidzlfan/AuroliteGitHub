import React from 'react';
import { View, StyleSheet } from 'react-native';
import Test from './test';
import Anim from './animated'


const HomeScene = () => (
  <View style={styles.container}>
    <Test/>
    {/* <Anim/> */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScene;
