import React from 'react';
import { View, StyleSheet } from 'react-native';
import Microwave from './microwave'



const HomeScene = () => (
  <View style={styles.container}>
    <Microwave/>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScene;
