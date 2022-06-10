import Slider from '@react-native-community/slider';
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useCallback, useEffect, useState} from 'react';

const Swatch = props => {
  return (
    <Pressable
      style={[styles.swatch, {backgroundColor: props.color}]}
      onPress={props.onPress}
    />
  );
};

const Swatches = props => {
  return (
    <View style={styles.swatchGrid}>
      {[
        '#ff0000',
        '#ff8800',
        '#ffff00',
        '#00ff00',
        '#00ffff',
        '#0000ff',
        '#8800ff',
        '#ff00ff',
        '#ff88ff',
        '#000000',
        '#888888',
        '#ffffff',
      ].map(color => (
        <Swatch
          key={color}
          color={color}
          onPress={() => props.onChoose(color)}
        />
      ))}
    </View>
  );
};

const Slot = props => {
  return (
    <Pressable
      style={[
        styles.slot,
        props.active && styles.activeSlot,
        {backgroundColor: props.color || '#000000'},
      ]}
      onPress={props.onPress}>
      {props.color === null && <View style={styles.emptySlot} />}
    </Pressable>
  );
};

const Slots = props => {
  return (
    <View style={styles.slotRow}>
      {Array.from({length: 6}).map((_, i) => (
        <Slot
          key={i}
          color={props.slots[i]}
          active={props.activeSlot === i}
          onPress={
            props.activeSlot === i
              ? () => {
                  const newSlots = [...props.slots];
                  newSlots[i] = null;
                  props.setSlots(newSlots);
                }
              : () => {
                  props.setActiveSlot(i);
                }
          }
        />
      ))}
    </View>
  );
};

const Preset = props => {
  return (
    <Pressable style={styles.preset} onPress={props.onPress}>
      <Text style={styles.presetLabel}>{props.label}</Text>
    </Pressable>
  );
};

const PRESETS = [
  {
    label: '1',
    slots: ['#000000', null, null, null, null, null],
  },
  {
    label: 'Trans',
    slots: ['#1bb3ff', '#ff42a1', '#ffffff', '#ff42a1', '#1bb3ff', null],
  },
  {
    label: 'Gay',
    slots: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0000ff', '#8800ff'],
  },
  {
    label: 'Lesbian',
    slots: ['#ff6600', '#ffaa33', '#ffffff', '#ff88ff', '#ff00aa', null],
  },
];

const Presets = props => {
  return (
    <View style={styles.presetRow}>
      {PRESETS.map(({label, slots}) => (
        <Preset
          key={label}
          label={label}
          onPress={() => props.setSlots(slots)}
        />
      ))}
    </View>
  );
};

const BrightnessSlider = props => {
  return (
    <Slider
      minimumValue={0}
      maximumValue={255}
      step={1}
      value={props.brightness}
      style={styles.slider}
      minimumTrackTintColor="#ffffff"
      maximumTrackTintColor="#cccccc"
      thumbTintColor="#ffffff"
      onSlidingComplete={props.setBrightness}
    />
  );
};

/*
0x0X -- Basics
  0x00: Off
  0x01: Solid Color

0x1X -- Flashes
  0x10: Basic Flash
  0x11: Long Flash (long period on, short period off)
  0x12: Fast Flash
  0x13: Strobe
  0x14: Complex Flash (short period on, then long period on)

0x2X -- Fades
  0x20: Basic Simultaneous Fade In/Out
  0x21: Wipe/Fade

0x3X -- Wipes
  0x30: Basic Color Wipe
  0x31: Fast Color Wipe
  0x32: Larson Scanner
  0x33: Inverted Larson Scanner
  0x34: Circular Scanner
  0x35: Inverted Circular Scanner

0x4X -- Twinkles
  0x40: Basic Theater Chase
  0x41: Running Lights / Wide Theater Chase
  0x42: Random Sparkle
  0x43: Inverted Random Sparkle / Snow Twinkles
  0x44: Paparazzi

0x5X -- Rainbows
  0x50: Rainbow Circle
  0x51: Rainbow Theater Chase
  */
const BANKS = [
  {
    label: 'Basics',
    programs: ['Off', 'Solid Color'],
  },
  {
    label: 'Flashes',
    programs: ['Basic', 'Long', 'Fast', 'Strobe', 'Complex'],
  },
  {
    label: 'Fades',
    programs: ['In/Out', 'Wipe/Fade'],
  },
  {
    label: 'Wipes',
    programs: [
      'Basic',
      'Fast',
      'Larson',
      'Inv Larson',
      'Circular',
      'Inv Circular',
    ],
  },
  {
    label: 'Twinkles',
    programs: [
      'Chase',
      'Running Lights',
      'Random',
      'Inverted Random',
      'Paparazzi',
    ],
  },
  {
    label: 'Rainbows',
    programs: ['Circle', 'Chase'],
  },
];

const BankMenu = props => {
  return (
    <View style={styles.bankMenu}>
      {BANKS.map(({label}, i) => (
        <Pressable
          style={i === props.bank ? styles.bankItemSelected : styles.bankItem}
          key={label}
          onPress={() => props.setBank(i)}>
          <Text style={styles.bankText}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const ProgramMenu = props => {
  return (
    <View style={styles.programMenu}>
      {BANKS[props.bank].programs.map((label, i) => {
        const selected =
          // eslint-disable-next-line no-bitwise
          props.pattern >> 3 === props.bank && (props.pattern & 0x7) === i;
        return (
          <Pressable
            style={selected ? styles.programItemSelected : styles.programItem}
            key={label}
            onPress={() => props.onChoose(i)}>
            <Text
              style={
                selected ? styles.programTextSelected : styles.programText
              }>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const PatternMenu = props => {
  const [bank, setBank] = React.useState(0);

  return (
    <View style={styles.patternMenu}>
      <BankMenu bank={bank} setBank={setBank} />
      <ProgramMenu
        bank={bank}
        pattern={props.pattern}
        // eslint-disable-next-line no-bitwise
        onChoose={p => props.onChoose((bank << 3) | p)}
      />
    </View>
  );
};

const DeviceActions = props => {
  return (
    <View style={styles.deviceActions}>
      <Pressable
        style={styles.deviceAction}
        onPress={() => props.onDisconnect()}>
        <Text style={styles.deviceActionText}>Disconnect</Text>
      </Pressable>
    </View>
  );
};

const Main = props => {
  const [pattern, setPattern] = useState(0);
  const [activeSlot, setActiveSlot] = useState(null);
  const [slots, setSlots] = useState([
    '#000000',
    ...Array.from({length: 6}, () => null),
  ]);
  const [brightness, setBrightness] = useState(127);

  const write = props.write;

  const upload = useCallback(() => {
    const message = [];

    // eslint-disable-next-line no-bitwise
    message.push(0x40 | pattern);

    const active = slots.filter(s => s !== null);

    for (const color of active) {
      const r = parseInt(color.substring(1, 3), 16) * (brightness / 255);
      const g = parseInt(color.substring(3, 5), 16) * (brightness / 255);
      const b = parseInt(color.substring(5, 7), 16) * (brightness / 255);

      // eslint-disable-next-line no-bitwise
      const packed = (r << 16) | (g << 8) | b;

      for (const offset of [18, 12, 6, 0]) {
        const prefix = offset === 0 ? 0xc0 : 0x80;

        // eslint-disable-next-line no-bitwise
        message.push(prefix | ((packed >> offset) & 0x3f));
      }
    }

    message.push(0x00);

    write(message);
  }, [pattern, slots, write, brightness]);

  useEffect(() => {
    upload();
  }, [pattern, slots, write, brightness, upload]);

  return (
    <View style={styles.container}>
      <DeviceActions onDisconnect={props.onDisconnect} />
      <Swatches
        onChoose={color => {
          const newSlots = [...slots];
          newSlots[activeSlot] = color;
          setSlots(newSlots);
        }}
      />
      <Slots
        slots={slots}
        activeSlot={activeSlot}
        setActiveSlot={setActiveSlot}
        setSlots={setSlots}
      />
      <Presets setSlots={setSlots} />
      <BrightnessSlider brightness={brightness} setBrightness={setBrightness} />
      <PatternMenu pattern={pattern} onChoose={setPattern} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#000',
  },
  swatch: {
    width: 60,
    height: 60,
    borderRadius: 20,
    margin: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    marginTop: 15,
  },
  slot: {
    width: 10,
    height: 30,
    flexGrow: 1,
    margin: 5,
    borderWidth: 2,
    borderColor: '#aaa',
  },
  activeSlot: {
    borderColor: '#fff',
  },
  emptySlot: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: [{rotate: '45deg'}],
    backgroundColor: '#aaa',
    height: 2,
  },
  slotRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  preset: {
    width: 10,
    height: 40,
    flexGrow: 1,
    margin: 5,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
  },
  presetLabel: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  slider: {
    width: '80%',
    marginTop: 15,
  },
  bankMenu: {
    width: 10,
    flexGrow: 1,
  },
  bankItem: {
    borderRightWidth: 2,
    borderRightColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  bankItemSelected: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: 2,
    borderTopColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  bankText: {
    fontSize: 16,
    color: '#fff',
  },
  programItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  programItemSelected: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#aaa',
  },
  programText: {
    fontSize: 16,
    color: '#fff',
  },
  programTextSelected: {
    fontSize: 16,
    color: '#000',
  },
  programMenu: {
    width: 10,
    flexGrow: 1,
  },
  patternMenu: {
    flexDirection: 'row',
    margin: 20,
    borderColor: '#fff',
    borderWidth: 2,
    paddingVertical: -2,
  },
  deviceActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  deviceAction: {
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
  },
  deviceActionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});

export default Main;
