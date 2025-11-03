/**
 * System diagnostics utility
 * Detects OS, CPU, memory, and GPU information
 */

const os = require('os');
const { execSync } = require('child_process');

class Diagnostics {
  constructor() {
    this.platform = os.platform();
  }

  async runAll() {
    return {
      os: this.getOSInfo(),
      cpu: this.getCPUInfo(),
      memory: this.getMemoryInfo(),
      gpu: this.getGPUInfo()
    };
  }

  getOSInfo() {
    return {
      platform: this.platform,
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      hostname: os.hostname(),
      uptime: os.uptime()
    };
  }

  getCPUInfo() {
    const cpus = os.cpus();
    return {
      model: cpus[0]?.model || 'Unknown',
      cores: cpus.length,
      speed: cpus[0]?.speed || 0,
      details: cpus.map(cpu => ({
        model: cpu.model,
        speed: cpu.speed
      }))
    };
  }

  getMemoryInfo() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    
    return {
      total: total,
      free: free,
      used: used,
      totalGB: (total / (1024 ** 3)).toFixed(2),
      freeGB: (free / (1024 ** 3)).toFixed(2),
      usedGB: (used / (1024 ** 3)).toFixed(2),
      usagePercent: ((used / total) * 100).toFixed(2)
    };
  }

  getGPUInfo() {
    try {
      if (this.platform === 'win32') {
        return this.getWindowsGPUInfo();
      } else if (this.platform === 'linux') {
        return this.getLinuxGPUInfo();
      } else {
        return { detected: false, message: 'GPU detection not supported on this platform' };
      }
    } catch (error) {
      return { detected: false, error: error.message };
    }
  }

  getWindowsGPUInfo() {
    try {
      // Try NVIDIA first
      // Note: execSync with shell execution - validated for diagnostics only
      // In production, consider sanitizing paths and limiting commands
      const nvidiaOutput = execSync('nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader', { encoding: 'utf8', timeout: 5000 });
      const lines = nvidiaOutput.trim().split('\n');
      const gpus = lines.map(line => {
        const [name, memory, driver] = line.split(',').map(s => s.trim());
        return { name, memory, driver, vendor: 'NVIDIA' };
      });
      return { detected: true, gpus };
    } catch (nvidiaError) {
      // Fallback to wmic
      try {
        const wmicOutput = execSync('wmic path win32_VideoController get name,AdapterRAM,DriverVersion /format:csv', { encoding: 'utf8', timeout: 5000 });
        const lines = wmicOutput.trim().split('\n').slice(1); // Skip header
        const gpus = lines.filter(line => line.trim()).map(line => {
          const parts = line.split(',');
          return {
            name: parts[2] || 'Unknown',
            memory: parts[1] || 'Unknown',
            driver: parts[3] || 'Unknown',
            vendor: 'Unknown'
          };
        });
        return { detected: true, gpus };
      } catch (wmicError) {
        return { detected: false, message: 'No GPU detected or tools not available' };
      }
    }
  }

  getLinuxGPUInfo() {
    try {
      const nvidiaOutput = execSync('nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader', { encoding: 'utf8', timeout: 5000 });
      const lines = nvidiaOutput.trim().split('\n');
      const gpus = lines.map(line => {
        const [name, memory, driver] = line.split(',').map(s => s.trim());
        return { name, memory, driver, vendor: 'NVIDIA' };
      });
      return { detected: true, gpus };
    } catch (error) {
      return { detected: false, message: 'nvidia-smi not found' };
    }
  }
}

// CLI mode
if (require.main === module) {
  const diagnostics = new Diagnostics();
  diagnostics.runAll().then(results => {
    console.log(JSON.stringify(results, null, 2));
  });
}

module.exports = { Diagnostics };
