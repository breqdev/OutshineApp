import React from 'react';
import {DeviceEventEmitter} from 'react-native';
import {RNSerialport, actions} from 'react-native-serialport';

export function useSerial() {
  const [device, setDevice] = React.useState(null);
  const [devices, setDevices] = React.useState([]);

  React.useEffect(() => {
    RNSerialport.startUsbService();

    console.log('USB service started');

    return () => {
      RNSerialport.stopUsbService();

      RNSerialport.disconnect();
    };
  }, []);

  const getDevices = React.useCallback(() => {
    // if (RNSerialport.isOpen()) {
    //   console.log('Closing existing connection');
    //   RNSerialport.disconnect();
    // }

    RNSerialport.getDeviceList().then(setDevices);
  }, []);

  const connect = React.useCallback(device => {
    // if (RNSerialport.isOpen()) {
    //   console.log('Closing existing connection');
    //   RNSerialport.disconnect();
    // }

    RNSerialport.connectDevice(device.name, 115200);
    setDevice(device);

    console.log('Connected to', device.name);

    DeviceEventEmitter.addListener(actions.ON_READ_DATA, data => {
      console.log('Data:', data.payload);
    });
  }, []);

  const write = React.useCallback(data => {
    console.log(
      'WRITING',
      data.map(byte => byte.toString(2).padStart(8, '0')).join(' '),
    );
    const hexString = data
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    console.log('Hex:', hexString);

    RNSerialport.writeHexString(hexString);
  }, []);

  const disconnect = React.useCallback(() => {
    RNSerialport.disconnect();
    setDevice(null);
  }, []);

  return {
    connect,
    write,
    device,
    devices,
    getDevices,
    disconnect,
  };
}
