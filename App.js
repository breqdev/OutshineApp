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
import useStateRef from 'react-usestateref';
import MODES from './modes';
import useSerial from './useSerial';
import Slider from '@react-native-community/slider';

const alterBrightness = (hex, brightness) => {
  const hsl = colorsys.hex2Hsl(hex);
  const brightened = {...hsl, l: brightness};
  return colorsys.hsl2Hex(brightened);
};

const App = () => {
  const {connectSerial, writeData, connected} = useSerial();

  const [color, setColor, colorRef] = useStateRef('#ffffff');
  const [brightness, setBrightness, brightnessRef] = useStateRef(1);
  const [activeMode, setActiveMode, activeModeRef] = useStateRef('01');
  const dirty = React.useRef(false);

  const handleColorUpdate = React.useCallback(
    color => {
      const hex = colorsys.hsv2Hex(color);
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

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (dirty.current) {
        const rgb = alterBrightness(colorRef.current, brightnessRef.current);

        const message =
          rgb.replace('#', '').toUpperCase() +
          activeModeRef.current +
          '\n'.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase();
        console.log(message);
        writeData(message);
        dirty.current = false;
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [activeModeRef, colorRef, writeData, brightnessRef]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Outshine</Text>
      <Text style={styles.label}>
        {connected ? 'Connected' : 'Not Connected'}
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
        <Pressable style={styles.button} onPress={connectSerial}>
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
