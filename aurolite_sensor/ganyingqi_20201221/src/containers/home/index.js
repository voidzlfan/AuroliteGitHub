import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeTopView from './home-top-view';

const HomeScene = () => (
  <View style={styles.container}>
    <HomeTopView style={styles.content} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});

export default HomeScene;
