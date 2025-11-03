/**
 * Solo mining helpers and utilities
 */

class SoloMining {
  constructor() {
    this.nodeUrl = null;
  }

  setNodeUrl(url) {
    this.nodeUrl = url;
  }

  getNodeUrl() {
    return this.nodeUrl;
  }

  validateSoloConfig(config) {
    const errors = [];
    
    if (!config.nodeUrl) {
      errors.push('Node URL is required for solo mining');
    }
    
    if (!config.walletAddress) {
      errors.push('Wallet address is required for solo mining');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  buildSoloArgs(config) {
    // Build args for solo mining to a local node
    return {
      daemon: true,
      daemonUrl: config.nodeUrl,
      walletAddress: config.walletAddress
    };
  }
}

module.exports = { SoloMining };
