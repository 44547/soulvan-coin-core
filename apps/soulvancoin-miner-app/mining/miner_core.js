/**
 * Built-in demo CPU miner for Soulvan Coin
 * Generates synthetic hashrate and shares for UI testing
 */

class DemoMiner {
  constructor() {
    this.running = false;
    this.hashrate = 0;
    this.totalHashes = 0;
    this.acceptedShares = 0;
    this.rejectedShares = 0;
    this.startTime = null;
    this.interval = null;
    this.threads = 1;
  }

  start(threads = 1, onStats = null) {
    if (this.running) {
      throw new Error('Miner is already running');
    }

    this.running = true;
    this.threads = threads;
    this.startTime = Date.now();
    this.hashrate = 0;
    this.totalHashes = 0;
    this.acceptedShares = 0;
    this.rejectedShares = 0;

    // Simulate mining activity
    this.interval = setInterval(() => {
      if (!this.running) return;

      // Generate random hashrate (100-500 H/s per thread)
      const baseHashrate = (100 + Math.random() * 400) * this.threads;
      this.hashrate = Math.floor(baseHashrate);
      
      // Update total hashes
      this.totalHashes += this.hashrate;

      // Randomly accept shares (90% acceptance rate)
      if (Math.random() < 0.05) {
        if (Math.random() < 0.9) {
          this.acceptedShares++;
        } else {
          this.rejectedShares++;
        }
      }

      // Call stats callback if provided
      if (onStats) {
        onStats(this.getStats());
      }
    }, 1000);

    return this.getStats();
  }

  stop() {
    if (!this.running) {
      throw new Error('Miner is not running');
    }

    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    return this.getStats();
  }

  getStats() {
    const uptime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    
    return {
      running: this.running,
      hashrate: this.hashrate,
      hashrateFormatted: this.formatHashrate(this.hashrate),
      totalHashes: this.totalHashes,
      acceptedShares: this.acceptedShares,
      rejectedShares: this.rejectedShares,
      threads: this.threads,
      uptime: uptime,
      uptimeFormatted: this.formatUptime(uptime)
    };
  }

  formatHashrate(hashrate) {
    if (hashrate >= 1000000000) {
      return `${(hashrate / 1000000000).toFixed(2)} GH/s`;
    } else if (hashrate >= 1000000) {
      return `${(hashrate / 1000000).toFixed(2)} MH/s`;
    } else if (hashrate >= 1000) {
      return `${(hashrate / 1000).toFixed(2)} kH/s`;
    } else {
      return `${hashrate.toFixed(2)} H/s`;
    }
  }

  formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

module.exports = { DemoMiner };
