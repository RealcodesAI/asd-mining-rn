# ASD Mining for React Native

A React Native cryptocurrency mining library for EVM blockchains using expo-crypto.

## Features

- ✅ Compatible with both Expo and React Native
- 🔄 Easy integration with React Native apps
- 🛡️ Uses native crypto implementations through expo-crypto
- 📱 Works on Android and iOS
- 💰 Made for cryptocurrency mining applications

## Installation

```bash
# Using npm
npm install asd-mining-rn expo-crypto

# Using yarn
yarn add asd-mining-rn expo-crypto

# Using Expo
expo install asd-mining-rn expo-crypto
```

## Usage

```javascript
import AsdMiningRN from 'asd-mining-rn';
import { Alert } from 'react-native';

// Initialize the miner with your license key and API URL
const miner = AsdMiningRN.getInstance('your-license-key', 'https://api.example.com');

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

## Important Notes

- Mining is CPU intensive and will drain the device battery quickly. Consider implementing checks to only mine when the device is charging.
- While this library uses native crypto implementations through expo-crypto, mining on mobile devices is still less efficient than dedicated mining hardware.
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

## Expo Compatibility

This library uses expo-crypto, making it compatible with Expo projects without requiring ejection. It works in both Expo Go and in standalone builds.

## Performance Considerations

The mining performance will vary based on the device. Modern devices will perform better, but keep in mind that mobile mining is significantly less efficient than dedicated hardware.

## License

ISC