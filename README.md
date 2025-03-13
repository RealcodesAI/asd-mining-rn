# ASD Mining for React Native

A high-performance React Native cryptocurrency mining library for EVM blockchains.

## Features

- ⚡️ Blazing fast mining using native C++ cryptography
- 🏆 Up to 58x faster than JavaScript crypto implementations
- 📱 Optimized for mobile devices
- 🧪 Built on top of battle-tested cryptography libraries
- 🔄 Easy to integrate with your React Native app

## Installation

```bash
# Using npm
npm install asd-mining-rn react-native-quick-crypto react-native-nitro-modules

# Using yarn
yarn add asd-mining-rn react-native-quick-crypto react-native-nitro-modules

# Using bun
bun add asd-mining-rn react-native-quick-crypto react-native-nitro-modules


```



### iOS

```bash
cd ios && pod install
```

### Requirements

- React Native >= 0.75.0

## Usage

```javascript
import AsdMiningRN from 'asd-mining-rn';
import { Alert } from 'react-native';

// Initialize the miner with your license key and API URL
const miner = new AsdMiningRN('your-license-key', 'https://api.example.com');

// Calculate hash rate
miner.calculateHashRate(5000).then(hashRate => {
  Alert.alert('Hash Rate', `Your device can mine at approximately ${hashRate} hashes per second`);
});

// Start mining
miner.start(event => {
  console.log(event); // Log mining events
});

// Stop mining
setTimeout(() => {
  miner.stop();
  console.log('Mining stopped after 1 minute');
}, 60000);
```

## Performance

This library uses [react-native-quick-crypto](https://github.com/margelo/react-native-quick-crypto), which provides native C++ implementations of cryptographic algorithms via JSI. This results in dramatically faster performance compared to JavaScript-based solutions:

- Up to 58x faster than crypto-browserify or react-native-crypto
- Significantly lower battery consumption
- Better overall performance for your application

## Important Notes

- Mining is CPU intensive and will drain the device battery quickly. Consider implementing checks to only mine when the device is charging.
- While this library uses native optimizations, mining on mobile devices is still less efficient than dedicated mining hardware.
- Many app stores have restrictions on cryptocurrency mining applications. Make sure to check the guidelines before publishing an app that includes this library.

## API Reference

### Constructor

```javascript
new AsdMiningRN(license, apiUrl)
```

- `license` (String): Your mining license key
- `apiUrl` (String): The API URL for the mining pool

### Methods

#### start(onEvent)

Starts the mining process.

- `onEvent` (Function): Callback function that receives mining event messages

#### stop()

Stops the mining process.

#### calculateHashRate(interval)

Benchmarks the device's mining performance.

- `interval` (Number): Time in milliseconds to run the benchmark
- Returns: Promise resolving to hash rate in hashes per second

## License

ISC