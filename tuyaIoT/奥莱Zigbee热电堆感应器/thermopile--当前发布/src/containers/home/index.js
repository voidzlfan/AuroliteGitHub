import React from 'react';
import { View, StyleSheet } from 'react-native';
import Thermopile from './thermopile';



const HomeScene = () => (
  <View style={styles.container}>
    <Thermopile/>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScene;
