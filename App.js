/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Main from './Main';
import DeviceList from './DeviceList';
import ConnType from './ConnType';
import {useSerial} from './useSerial';
import {useBle} from './useBle';

const App = () => {
  const [mode, setMode] = React.useState(null);

  const serial = useSerial();
  const ble = useBle();

  const device = mode === 'BLE' ? ble.device : serial.device;
  const devices = mode === 'BLE' ? ble.devices : serial.devices;

  return (
    <SafeAreaView style={styles.container}>
      {device ? (
        <Main
          onDisconnect={() => {
            console.log('disconnect');
            if (mode === 'BLE') {
            } else {
              serial.disconnect();
            }
            setMode(null);
          }}
          write={mode === 'BLE' ? () => {} : serial.write}
        />
      ) : mode && devices ? (
        <DeviceList
          onBack={() => setMode(null)}
          devices={devices}
          mode={mode}
          onChoose={
            mode === 'BLE'
              ? newDevice => ble.connect(newDevice)
              : newDevice => serial.connect(newDevice)
          }
        />
      ) : (
        <ConnType
          onChoose={newMode => {
            if (newMode === 'BLE') {
              setMode('BLE');
              ble.getDevices();
            } else {
              setMode('USB');
              serial.getDevices();
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
});

export default App;
