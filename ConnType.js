import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

const ConnType = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.hero}>Outshine</Text>
      <Text style={styles.prompt}>Select Connection Type</Text>
      <Pressable style={styles.button} onPress={() => props.onChoose('USB')}>
        <Text style={styles.buttonText}>USB</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => props.onChoose('BLE')}>
        <Text style={styles.buttonText}>Bluetooth</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#000',
  },
  hero: {
    fontSize: 40,
    color: '#fff',
    marginTop: 10,
  },
  prompt: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 20,
    width: '100%',
    marginVertical: 20,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
  },
});

export default ConnType;
