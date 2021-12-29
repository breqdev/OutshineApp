import React from 'react';
import {RNSerialport} from 'react-native-serialport';

export default function useSerial() {
  React.useEffect(() => {
    RNSerialport.startUsbService();

    console.log('USB service started');

    return () => {
      RNSerialport.stopUsbService();

      RNSerialport.disconnect();
    };
  }, []);

  const connectSerial = React.useCallback(() => {
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

        console.log('Connected to', raspberrypi[0].name);
      }
    });
  }, []);

  const writeData = React.useCallback(data => {
    RNSerialport.writeHexString(data);
  }, []);

  return {
    connectSerial,
    writeData,
  };
}
