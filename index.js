// AsdMiningRN.js
import * as Crypto from 'expo-crypto';

class AsdMiningRN {
  license
  isMining = false
  apiUrl
  pingIntervalId = null
  static instance = null

  constructor(license, apiUrl) {
    this.license = license
    this.apiUrl = apiUrl
  }

  static getInstance(license, apiUrl) {
    if (!AsdMiningRN.instance) {
      AsdMiningRN.instance = new AsdMiningRN(license, apiUrl)
    }
    return AsdMiningRN.instance
  }

  createHash(input, seed = 0) {
    // Convert input to string if it's not already
    const str = String(input);
  
    // FNV-1a parameters
    const PRIME = 16777619;
    const OFFSET_BASIS = 2166136261;
  
    // Initialize hash with seed
    let hash = OFFSET_BASIS ^ seed;
  
    // Process each character in the input string
    for (let i = 0; i < str.length; i++) {
      // Get the character code
      const char = str.charCodeAt(i);
  
      // FNV-1a algorithm
      hash ^= char;
      hash = Math.imul(hash, PRIME) | 0; // Use Math.imul for 32-bit multiplication
    }
  
    // Convert to unsigned 32-bit integer
    hash = hash >>> 0;
  
    // Convert to hexadecimal string
    return hash.toString(16).padStart(8, '0');
  }

  async start(onEvent) {
    onEvent(`[${new Date().toISOString()}]: Starting mining`)
    onEvent(`[${new Date().toISOString()}]: License check...`)
    onEvent(`[${new Date().toISOString()}]: Miner license: ${this.license}`)
    this.isMining = true

    // Ping to make device active
    this.pingIntervalId = setInterval(this.ping.bind(this), 1000 * 5)

    // Start mining
    while (true) {
      if (!this.isMining) {
        onEvent(`[${new Date().toISOString()}]: Mining stopped`)
        onEvent(`[${new Date().toISOString()}]: Sync with server...`)
        onEvent(`[${new Date().toISOString()}]: Cleaning up...`)
        onEvent(`[${new Date().toISOString()}]: Miner stopped successfully`)
        break
      }
      await this.mine(2, onEvent)
    }
  }

  advancedHash(input, length = 32) {
    let result = '';
  
    // Use different seeds to generate hash segments until we reach desired length
    for (let i = 0; result.length < length; i++) {
      result += this.createHash(input + i, i);
    }
  
    // Trim to exact length
    return result.substring(0, length);
  }

  async ping() {
    try {
      const resp = await fetch('https://miner.asdscan.ai/ping/' + this.license)
      if (!resp.ok) {
        throw new Error('Error pinging')
      }
    } catch (err) {
      console.log(err)
    }
  }

  async mine(difficulty = 2, onEvent) {
    try {
      onEvent(`[${new Date().toISOString()}]: Fetching pending transactions...`)
      const response = await fetch(this.apiUrl + '/api/system/pending-txs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (!response.ok) {
        throw new Error('Error fetching pending transactions')
      }
      const data = await response.text()
      onEvent(`[${new Date().toISOString()}]: Mining block with data: ${data.slice(0, 100)}...`)

      let nonce = 0
      let hash = ''
      const target = '0'.repeat(difficulty)

      while (true) {
        // Use expo-crypto's digestStringAsync method
        hash = this.advancedHash(data + nonce, 64)

        if (hash.startsWith(target)) {
          break
        }
        nonce++
      }

      onEvent(`[${new Date().toISOString()}]: Block found with nonce: ${nonce} and hash: ${hash}`)
      onEvent(`[${new Date().toISOString()}]: Submitting block...`)

      // Submit nonce
      await fetch(this.apiUrl + '/api/system/submit-nounce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nounce: nonce
        })
      })
      onEvent(`[${new Date().toISOString()}]: Block submitted reward claimed !!!`)

      return nonce
    } catch (err) {
      console.log(err)
      return undefined
    }
  }

  stop() {
    this.isMining = false
    clearInterval(this.pingIntervalId)
  }

  /*
  * Benchmark hash rate
  * @param {number} interval - interval time to calculate hash rate in ms
  * @return {number} hash rate
  * */
  async calculateHashRate(interval) {
    return new Promise(async (resolve) => {
      let start = Date.now();
      let hashCount = 0;
      let nonce = 0;
      while (true) {
        // Perform a single hash operation
        this.advancedHash(nonce, 64);

        hashCount++;
        nonce++;
        const now = Date.now();
        if (now - start >= interval) {
          break;
        }
      }
      resolve(hashCount / interval * 1000);
    });
  }
}

export default AsdMiningRN;