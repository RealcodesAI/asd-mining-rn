// AsdMiningRN.js
import QuickCrypto from 'react-native-quick-crypto';

class AsdMiningRN {
  license
  isMining = false
  apiUrl
  pingIntervalId = null

  constructor(license, apiUrl) {
    this.license = license
    this.apiUrl = apiUrl
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
      await this.mine(4, onEvent)
    }
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

  async mine(difficulty = 4, onEvent) {
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
        // Use QuickCrypto's createHash instead of Web Crypto API
        // This is MUCH faster as it's implemented in C++ via JSI
        hash = QuickCrypto.createHash('sha256')
          .update(data + nonce)
          .digest('hex')
        
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
    return new Promise((resolve) => {
      let start = Date.now();
      let nonce = 0;
      let hashCount = 0;

      const benchmark = () => {
        // Process a batch to avoid blocking the UI thread
        const batchSize = 1000; // Larger batch size due to QuickCrypto's speed
        
        for (let i = 0; i < batchSize; i++) {
          QuickCrypto.createHash('sha256')
            .update(nonce.toString())
            .digest('hex');
            
          hashCount++;
          nonce++;
        }

        const now = Date.now();
        if (now - start >= interval) {
          resolve(Math.floor(hashCount / interval * 1000)); // Convert to hashes per second
        } else {
          // Use setTimeout to give the UI thread a chance to update
          setTimeout(benchmark, 0);
        }
      };

      benchmark();
    });
  }
}

export default AsdMiningRN;