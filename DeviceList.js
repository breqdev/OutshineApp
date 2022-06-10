import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

const DeviceList = props => {
  console.log(props.devices);

  return (
    <View style={styles.container}>
      <Text style={styles.hero}>Outshine</Text>
      <Text style={styles.prompt}>Select Device</Text>
      {props.devices.map(device => (
        <Pressable
          style={styles.button}
          key={device.name}
          onPress={() => props.onChoose(device)}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.macAddress}>
            VID {device.vendorId.toString(16)} - PID{' '}
            {device.productId.toString(16)}
          </Text>
        </Pressable>
      ))}
      <Pressable style={styles.back} onPress={() => props.onBack()}>
        <Text style={styles.backText}>Back</Text>
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
    marginTop: 10,
    padding: 10,
  },
  deviceName: {
    color: '#fff',
    fontSize: 22,
  },
  macAddress: {
    color: '#bbb',
    fontSize: 12,
  },
  back: {
    borderColor: '#aaa',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
  },
  backText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DeviceList;
