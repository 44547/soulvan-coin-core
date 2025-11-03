/**
 * CLI wrappers for common operations
 */

const { execSync } = require('child_process');

class CLIWrappers {
  exec(command, options = {}) {
    try {
      const output = execSync(command, {
        encoding: 'utf8',
        timeout: options.timeout || 30000,
        ...options
      });
      return { success: true, output: output.trim() };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        output: error.stdout ? error.stdout.toString() : '',
        stderr: error.stderr ? error.stderr.toString() : ''
      };
    }
  }

  git(args) {
    return this.exec(`git ${args}`);
  }

  docker(args) {
    return this.exec(`docker ${args}`);
  }

  npm(args) {
    return this.exec(`npm ${args}`);
  }
}

module.exports = { CLIWrappers };
