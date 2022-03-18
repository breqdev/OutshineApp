import React from 'react';
import {RNSerialport} from 'react-native-serialport';
import {BleManager} from 'react-native-ble-plx';

export function useSerial() {
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    RNSerialport.startUsbService();

    console.log('USB service started');

    return () => {
      RNSerialport.stopUsbService();

      RNSerialport.disconnect();
    };
  }, []);

  const connect = React.useCallback(() => {
    if (RNSerialport.isOpen()) {
      console.log('Closing existing connection');
      RNSerialport.disconnect();
    }

    RNSerialport.getDeviceList().then(devices => {
      console.log('Devices:', devices);

      const raspberrypi = devices.filter(device => device.vendorId === 0x2e8a);

      if (raspberrypi.length > 0) {
        console.log('Raspberry Pi found on', raspberrypi[0].name);

        RNSerialport.connectDevice(raspberrypi[0].name, 115200);
        setConnected(true);

        console.log('Connected to', raspberrypi[0].name);
      }
    });
  }, []);

  const write = React.useCallback(data => {
    RNSerialport.writeHexString(data);
  }, []);

  return {
    connect,
    write,
    connected,
  };
}

export function useBle() {
  const manager = React.useRef();
  const deviceRef = React.useRef();

  React.useEffect(() => {
    manager.current = new BleManager();

    return () => {
      manager.current.destroy();
    };
  });

  const connect = React.useCallback(() => {
    const subscription = manager.current.onStateChange(state => {
      console.log('BLE state changed', state);

      if (state === 'PoweredOn') {
        subscription.remove();

        manager.current.startDeviceScan(null, null, async (error, device) => {
          if (error) {
            console.log('Error scanning for devices', error);
            return;
          }

          console.log('Found device', device);

          if (device.name === 'Outshine') {
            manager.current.stopDeviceScan();

            device.connect();

            const services =
              await device.discoverAllServicesAndCharacteristics();

            console.log('Services:', services);

            deviceRef.current = device;
          }
        });
      }
    });
  }, []);

  const write = React.useCallback(data => {
    if (deviceRef.current) {
      console.log('TODO: Write data to device', data);
    }
  }, []);

  const connected = !!deviceRef.current;

  return {
    connect,
    write,
    connected,
  };
}
