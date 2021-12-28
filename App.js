/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ColorWheel} from 'react-native-color-wheel';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello World!</Text>
      <ColorWheel initialColor="#ee0000" style={styles.wheel} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    width: Dimensions.get('window').width,
  },
});

export default App;
