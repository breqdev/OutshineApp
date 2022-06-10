import React from 'react';
import {
  Platform,
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

export function useBle() {
  const [device, setDevice] = React.useState(null);
  const [devices, setDevices] = React.useState([]);

  React.useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
          // this.retrieveConnected()
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then(res => {
            if (res) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    BleManager.start({showAlert: false, forceLegacy: true}).then(() => {
      // Success code
      console.log('Module initialized');
    });
  }, []);

  React.useEffect(() => {
    const stateListener = bleManagerEmitter.addListener(
      'BleManagerDidUpdateState',
      args => {
        console.log('BLE update state', args.state);
      },
    );

    const discoveryListener = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      args => {
        console.log('Discover Peripheral:', args);
        setDevices(prevDevices => [...prevDevices, args]);
      },
    );

    const scanStopListener = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        console.log('Scan stopped');
      },
    );

    return () => {
      stateListener.remove();
      discoveryListener.remove();
      scanStopListener.remove();
    };
  }, []);

  const getDevices = React.useCallback(() => {
    console.log('Retrieving connected devices...');
    BleManager.scan([], 5)
      .then(() => {
        console.log('Scanning...');
      })
      .catch(error => {
        console.log('error', error);
      });
  }, []);

  const write = React.useCallback(data => {}, []);

  return {
    connect: device => {},
    write,
    device: null,
    devices,
    getDevices,
    disconnect: () => {},
  };
}
