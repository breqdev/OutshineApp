import React from 'react';
import {
  Platform,
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const manager = new BleManager();

export function useBle() {
  const [device, setDevice] = React.useState(null);
  const [devices, setDevices] = React.useState([]);
  const seen = React.useRef(new Set());

  React.useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
          // this.retrieveConnected()
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
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
  }, []);

  React.useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, []);

  const getDevices = React.useCallback(() => {
    console.log('Retrieving connected devices...');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error occurred while scanning: ', error);
        // Handle error (scanning will be stopped automatically)
        return;
      }

      if (!seen.current.has(device.id) && device.localName) {
        setDevices(newDevices => [...newDevices, device]);
      }

      seen.current.add(device.id);
    });
  }, []);

  const connect = React.useCallback(device => {
    manager.stopDeviceScan();

    manager
      .connectToDevice(device.id)
      .then(device => {
        console.log('Connected to device: ', device.id);

        device.discoverAllServicesAndCharacteristics().then(device => {
          console.log('Discovered device services and characteristics: ');

          setDevice(device);
        });
      })
      .catch(error => {
        console.log('Error occurred while connecting to device: ', error);
      });
  }, []);

  const write = React.useCallback(
    data => {
      for (let i = 0; i < data.length; i += 8) {
        const b64 = base64.encodeFromByteArray(
          new Uint8Array(data.slice(i, i + 8)),
        );

        console.log(data, b64);

        device
          .writeCharacteristicWithoutResponseForService(
            '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
            '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
            b64,
          )
          .catch(console.error);
      }

      // device
      //   .writeCharacteristicWithoutResponseForService(
      //     '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
      //     '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
      //     b64,
      //   )
      //   .catch(console.error);
    },
    [device],
  );

  const disconnect = React.useCallback(() => {
    manager.cancelDeviceConnection(device.id);
    setDevice(null);
  }, [device]);

  return {
    connect,
    write,
    device,
    devices,
    getDevices,
    disconnect,
  };
}
