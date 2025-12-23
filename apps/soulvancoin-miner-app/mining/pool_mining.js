/**
 * Pool mining helpers and utilities
 */

class PoolMining {
  constructor() {
    this.pools = [];
  }

  addPool(pool) {
    this.pools.push({
      url: pool.url,
      username: pool.username,
      password: pool.password,
      addedAt: Date.now()
    });
  }

  getPools() {
    return this.pools;
  }

  validatePoolConfig(config) {
    const errors = [];
    
    if (!config.pool || !config.pool.includes(':')) {
      errors.push('Pool URL must be in format hostname:port');
    }
    
    if (!config.username) {
      errors.push('Username/wallet address is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  parsePoolUrl(url) {
    const parts = url.split(':');
    return {
      hostname: parts[0],
      port: parts[1] ? parseInt(parts[1], 10) : 3333
    };
  }
}

module.exports = { PoolMining };
