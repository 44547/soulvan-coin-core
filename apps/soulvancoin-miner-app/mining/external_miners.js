const { spawn } = require('child_process');
const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');

class ExternalMiner extends EventEmitter {
  constructor(minerConfig, options = {}) {
    super();
    this.minerConfig = minerConfig;
    this.options = options;
    this.process = null;
    this.isRunning = false;
    this.stats = {
      hashrate: 0,
      unit: 'H/s',
      accepted: 0,
      rejected: 0,
      uptime: 0
    };
    this.startTime = null;
  }

  /**
   * Build command from template with variable substitution
   */
  buildCommand() {
    const template = this.minerConfig.commandTemplate;
    const vars = {
      EXECUTABLE: this.options.executablePath || this.minerConfig.executable,
      ALGO: this.options.algorithm || 'randomx',
      POOL: this.options.pool || 'pool.example.com:3333',
      WALLET: this.options.wallet || 'YOUR_WALLET_ADDRESS',
      WORKERNAME: this.options.workerName || 'worker1',
      THREADS: this.options.threads || '4'
    };

    let command = template;
    Object.keys(vars).forEach(key => {
      command = command.replace(new RegExp(`\\{${key}\\}`, 'g'), vars[key]);
    });

    // Split command into executable and args
    const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    return {
      executable: parts[0],
      args: parts.slice(1)
    };
  }

  /**
   * Parse hashrate from miner output
   * Supports: H/s, kH/s, MH/s, GH/s, TH/s
   * Also supports Sol/s variants and T-Rex patterns
   */
  parseHashrate(line) {
    const patterns = this.minerConfig.hashRatePatterns || [];
    
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      const match = line.match(regex);
      
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2] || 'H/s';
        
        // Convert to base H/s for consistent comparison
        let hashrate = value;
        if (unit.includes('k')) hashrate = value * 1000;
        else if (unit.includes('M')) hashrate = value * 1000000;
        else if (unit.includes('G')) hashrate = value * 1000000000;
        else if (unit.includes('T')) hashrate = value * 1000000000000;
        
        // Handle Sol/s (solutions per second) - treat same as H/s
        if (unit.includes('Sol')) {
          // Keep as is, Sol/s is similar to H/s in concept
        }
        
        return {
          value,
          unit,
          baseHashrate: hashrate
        };
      }
    }
    
    return null;
  }

  /**
   * Parse shares from miner output
   */
  parseShares(line) {
    // Common patterns for accepted/rejected shares
    const acceptedPatterns = [
      /accepted.*?(\d+)/i,
      /share.*?accepted/i,
      /\[OK\]/i
    ];
    
    const rejectedPatterns = [
      /rejected.*?(\d+)/i,
      /share.*?rejected/i,
      /\[FAIL\]/i,
      /invalid/i
    ];
    
    for (const pattern of acceptedPatterns) {
      if (pattern.test(line)) {
        return { type: 'accepted' };
      }
    }
    
    for (const pattern of rejectedPatterns) {
      if (pattern.test(line)) {
        return { type: 'rejected' };
      }
    }
    
    return null;
  }

  /**
   * Start the miner process
   */
  start() {
    if (this.isRunning) {
      this.emit('error', new Error('Miner is already running'));
      return;
    }

    const { executable, args } = this.buildCommand();
    
    try {
      // Validate executable path to prevent command injection
      const execPath = this.options.executablePath || executable;
      if (!execPath || typeof execPath !== 'string') {
        throw new Error('Invalid executable path');
      }
      
      this.process = spawn(execPath, args.slice(1), {
        shell: false,
        cwd: path.dirname(execPath)
      });

      this.isRunning = true;
      this.startTime = Date.now();
      
      this.emit('start', {
        miner: this.minerConfig.name,
        algorithm: this.options.algorithm,
        worker: this.options.workerName
      });

      // Handle stdout
      this.process.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        
        lines.forEach(line => {
          if (!line.trim()) return;
          
          this.emit('log', { line: line.trim(), type: 'stdout' });
          
          // Parse hashrate
          const hashrate = this.parseHashrate(line);
          if (hashrate) {
            this.stats.hashrate = hashrate.value;
            this.stats.unit = hashrate.unit;
            this.stats.uptime = Math.floor((Date.now() - this.startTime) / 1000);
            
            this.emit('stats', {
              hashrate: this.stats.hashrate,
              unit: this.stats.unit,
              accepted: this.stats.accepted,
              rejected: this.stats.rejected,
              uptime: this.stats.uptime
            });
          }
          
          // Parse shares
          const share = this.parseShares(line);
          if (share) {
            if (share.type === 'accepted') {
              this.stats.accepted++;
            } else if (share.type === 'rejected') {
              this.stats.rejected++;
            }
            
            this.emit('stats', {
              hashrate: this.stats.hashrate,
              unit: this.stats.unit,
              accepted: this.stats.accepted,
              rejected: this.stats.rejected,
              uptime: this.stats.uptime
            });
          }
        });
      });

      // Handle stderr
      this.process.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            this.emit('log', { line: line.trim(), type: 'stderr' });
          }
        });
      });

      // Handle process exit
      this.process.on('exit', (code, signal) => {
        this.isRunning = false;
        this.emit('exit', { code, signal });
      });

      // Handle errors
      this.process.on('error', (err) => {
        this.isRunning = false;
        this.emit('error', err);
      });

    } catch (err) {
      this.emit('error', err);
    }
  }

  /**
   * Stop the miner process
   */
  stop() {
    if (!this.isRunning || !this.process) {
      return;
    }

    try {
      this.process.kill('SIGTERM');
      
      // Force kill after 5 seconds if still running
      setTimeout(() => {
        if (this.isRunning && this.process) {
          this.process.kill('SIGKILL');
        }
      }, 5000);
    } catch (err) {
      this.emit('error', err);
    }
  }

  /**
   * Get current stats
   */
  getStats() {
    return {
      ...this.stats,
      uptime: this.isRunning ? Math.floor((Date.now() - this.startTime) / 1000) : this.stats.uptime
    };
  }
}

/**
 * Load miner configurations from JSON file
 */
function loadMinerConfigs() {
  const configPath = path.join(__dirname, '../config/miners.json');
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(data);
    return config.miners;
  } catch (err) {
    console.error('Failed to load miner configs:', err);
    return {};
  }
}

module.exports = {
  ExternalMiner,
  loadMinerConfigs
};
