/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ColorWheel} from 'react-native-color-wheel';
import colorsys from 'colorsys';
import MODES from './modes';
import {useBle, useSerial} from './connections';
import Slider from '@react-native-community/slider';
import useInterval from 'use-interval';

const alterBrightness = (color, brightness) => {
  const clamp = value => {
    if (value < 10) {
      return 0;
    } else if (value > 250) {
      return 255;
    } else {
      return value;
    }
  };

  color = colorsys.hex2Rgb(color);
  color = {r: clamp(color.r), g: clamp(color.g), b: clamp(color.b)};

  color = colorsys.rgb2Hsv(color);
  color = {...color, v: (brightness / 255) * 100};
  color = colorsys.hsv2Hex(color);

  return color;
};

const App = () => {
  const serial = useSerial();
  const ble = useBle();

  const [color, setColor] = React.useState('#ffffff');
  const [brightness, setBrightness] = React.useState(1);
  const [activeMode, setActiveMode] = React.useState('01');
  const dirty = React.useRef(false);

  const handleColorUpdate = React.useCallback(
    newColor => {
      const hex = colorsys.hsv2Hex(newColor);
      setColor(hex);
      dirty.current = true;
    },
    [setColor],
  );

  const handleSliderChange = React.useCallback(
    value => {
      setBrightness(value);
      dirty.current = true;
    },
    [setBrightness],
  );

  const handleModeUpdate = React.useCallback(
    mode => {
      setActiveMode(mode.code);
      dirty.current = true;
    },
    [setActiveMode],
  );

  useInterval(() => {
    if (dirty.current) {
      console.log('in interval', color);
      const rgb = alterBrightness(color, brightness);

      const message =
        rgb.replace('#', '').toUpperCase() +
        activeMode +
        '\n'.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase();
      console.log(message);
      ble.write(message);
      dirty.current = false;
    }
  }, 200);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Outshine</Text>
      <Text style={styles.label}>
        {ble.connected ? 'Connected' : 'Not Connected'}
      </Text>
      <Text style={styles.label}>
        {alterBrightness(color, brightness)} - {activeMode}
      </Text>
      <ColorWheel
        initialColor={color}
        onColorChange={handleColorUpdate}
        style={styles.wheel}
      />
      <Slider
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={255}
        style={styles.slider}
        minimumTrackTintColor="#ffffff"
        maximumTrackTintColor="#cccccc"
        thumbTintColor="#ffffff"
        onValueChange={handleSliderChange}
      />
      <View style={styles.modeButtons}>
        {MODES.map(mode => (
          <Pressable
            style={[
              styles.button,
              activeMode === mode.code && styles.activeButton,
            ]}
            onPress={() => handleModeUpdate(mode)}
            key={mode.code}>
            <Text
              style={[
                styles.buttonText,
                activeMode === mode.code && styles.activeButtonText,
              ]}>
              {mode.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.configButtons}>
        <Pressable style={styles.button} onPress={ble.connect}>
          <Text style={styles.buttonText}>Connect</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  wheel: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modeButtons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  configButtons: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    width: 80,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
  },
  activeButtonText: {
    color: '#000',
  },
});

export default App;
