/**
 * Docker manager for building and running containers
 */

const { execSync } = require('child_process');
const path = require('path');

class DockerManager {
  constructor() {
    this.imageName = 'soulvancoin-miner-app';
    this.dockerfilePath = path.join(__dirname, 'Dockerfile.example');
  }

  build(tag = 'latest') {
    try {
      // Sanitize tag to prevent command injection
      const sanitizedTag = tag.replace(/[^a-zA-Z0-9._-]/g, '');
      if (!sanitizedTag) {
        throw new Error('Invalid tag name');
      }
      
      const command = `docker build -f "${this.dockerfilePath}" -t ${this.imageName}:${sanitizedTag} ..`;
      const output = execSync(command, { 
        encoding: 'utf8',
        cwd: __dirname
      });
      
      return {
        success: true,
        message: `Image built successfully: ${this.imageName}:${sanitizedTag}`,
        output: output.trim()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: error.stdout ? error.stdout.toString() : ''
      };
    }
  }

  run(command = 'npm run tests', tag = 'latest') {
    try {
      // Sanitize tag to prevent command injection
      const sanitizedTag = tag.replace(/[^a-zA-Z0-9._-]/g, '');
      if (!sanitizedTag) {
        throw new Error('Invalid tag name');
      }
      
      const dockerCommand = `docker run --rm ${this.imageName}:${sanitizedTag} ${command}`;
      const output = execSync(dockerCommand, { 
        encoding: 'utf8'
      });
      
      return {
        success: true,
        output: output.trim()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: error.stdout ? error.stdout.toString() : ''
      };
    }
  }

  listImages() {
    try {
      const output = execSync(`docker images ${this.imageName}`, { encoding: 'utf8' });
      return {
        success: true,
        output: output.trim()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  remove(tag = 'latest') {
    try {
      // Sanitize tag to prevent command injection
      const sanitizedTag = tag.replace(/[^a-zA-Z0-9._-]/g, '');
      if (!sanitizedTag) {
        throw new Error('Invalid tag name');
      }
      
      const output = execSync(`docker rmi ${this.imageName}:${sanitizedTag}`, { encoding: 'utf8' });
      return {
        success: true,
        message: `Image removed: ${this.imageName}:${sanitizedTag}`,
        output: output.trim()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  isDockerAvailable() {
    try {
      execSync('docker --version', { encoding: 'utf8', stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = { DockerManager };
