/**
 * External miner orchestration
 * Spawns external miner executables (e.g., XMRig), streams logs, and parses hashrate
 */

const { spawn } = require('child_process');
const path = require('path');

class ExternalMiner {
  constructor() {
    this.process = null;
    this.running = false;
    this.hashrate = 0;
    this.acceptedShares = 0;
    this.rejectedShares = 0;
    this.logs = [];
    this.maxLogs = 1000;
    this.onLog = null;
    this.onStats = null;
    this.startTime = null;
  }

  start(config, onLog = null, onStats = null) {
    if (this.running) {
      throw new Error('External miner is already running');
    }

    this.onLog = onLog;
    this.onStats = onStats;
    this.running = true;
    this.startTime = Date.now();
    this.logs = [];
    this.hashrate = 0;
    this.acceptedShares = 0;
    this.rejectedShares = 0;

    // Build command line arguments
    const args = this.buildArgs(config);
    
    // Spawn the external miner process
    try {
      this.process = spawn(config.executable, args, {
        cwd: path.dirname(config.executable),
        shell: true
      });

      // Handle stdout
      this.process.stdout.on('data', (data) => {
        const text = data.toString();
        this.handleOutput(text);
      });

      // Handle stderr
      this.process.stderr.on('data', (data) => {
        const text = data.toString();
        this.handleOutput(text, true);
      });

      // Handle process exit
      this.process.on('exit', (code, signal) => {
        this.running = false;
        const msg = `Miner exited with code ${code}, signal ${signal}`;
        this.addLog(msg, true);
        if (this.onLog) this.onLog(msg, true);
      });

      // Handle process error
      this.process.on('error', (error) => {
        this.running = false;
        const msg = `Miner error: ${error.message}`;
        this.addLog(msg, true);
        if (this.onLog) this.onLog(msg, true);
      });

      this.addLog(`Started external miner: ${config.executable}`);
      return { success: true, message: 'Miner started successfully' };
    } catch (error) {
      this.running = false;
      throw new Error(`Failed to start miner: ${error.message}`);
    }
  }

  buildArgs(config) {
    const args = [];
    
    // Common args for pool mining
    if (config.pool) {
      args.push('-o', config.pool);
    }
    if (config.username) {
      args.push('-u', config.username);
    }
    if (config.password) {
      args.push('-p', config.password);
    }
    if (config.threads) {
      args.push('-t', config.threads.toString());
    }
    
    // Add extra args if provided
    if (config.extraArgs) {
      const extraArgs = config.extraArgs.trim().split(/\s+/);
      args.push(...extraArgs);
    }

    return args;
  }

  handleOutput(text, isError = false) {
    this.addLog(text, isError);
    
    // Send to log callback
    if (this.onLog) {
      this.onLog(text, isError);
    }

    // Parse hashrate and shares
    this.parseStats(text);
  }

  parseStats(text) {
    // Parse hashrate patterns: H/s, kH/s, MH/s, GH/s
    const hashratePatterns = [
      /speed\s+10s\/60s\/15m\s+([\d.]+)\s+([\w/]+)/i,
      /hashrate.*?([\d.]+)\s*(H\/s|kH\/s|MH\/s|GH\/s)/i,
      /([\d.]+)\s*(H\/s|kH\/s|MH\/s|GH\/s)/i
    ];

    for (const pattern of hashratePatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        
        // Convert to H/s
        let hashrate = value;
        if (unit.includes('kh/s')) hashrate = value * 1000;
        else if (unit.includes('mh/s')) hashrate = value * 1000000;
        else if (unit.includes('gh/s')) hashrate = value * 1000000000;
        
        this.hashrate = hashrate;
        break;
      }
    }

    // Parse accepted shares
    const acceptedMatch = text.match(/accepted.*?(\d+)\/(\d+)/i);
    if (acceptedMatch) {
      this.acceptedShares = parseInt(acceptedMatch[1], 10);
      const total = parseInt(acceptedMatch[2], 10);
      this.rejectedShares = total - this.acceptedShares;
    }

    // Notify stats update
    if (this.onStats) {
      this.onStats(this.getStats());
    }
  }

  addLog(text, isError = false) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      text: text.trim(),
      isError
    };
    
    this.logs.push(logEntry);
    
    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  stop() {
    if (!this.running || !this.process) {
      throw new Error('External miner is not running');
    }

    // Cross-platform process termination
    if (process.platform === 'win32') {
      // Windows: use taskkill for graceful shutdown
      // Validate PID is a positive integer
      const pid = parseInt(this.process.pid, 10);
      if (!pid || pid <= 0) {
        throw new Error('Invalid process ID');
      }
      
      try {
        require('child_process').execSync(`taskkill /pid ${pid} /T /F`, { timeout: 5000 });
      } catch (error) {
        // Fallback to kill
        this.process.kill('SIGTERM');
      }
    } else {
      // Unix-like systems
      this.process.kill('SIGTERM');
    }
    
    this.running = false;
    
    return { success: true, message: 'Miner stopped' };
  }

  getStats() {
    const uptime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    
    return {
      running: this.running,
      hashrate: this.hashrate,
      hashrateFormatted: this.formatHashrate(this.hashrate),
      acceptedShares: this.acceptedShares,
      rejectedShares: this.rejectedShares,
      uptime: uptime,
      uptimeFormatted: this.formatUptime(uptime)
    };
  }

  getLogs(limit = 100) {
    return this.logs.slice(-limit);
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

module.exports = { ExternalMiner };
