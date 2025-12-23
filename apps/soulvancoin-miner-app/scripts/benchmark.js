/**
 * Simple hashing benchmark utility
 */

const crypto = require('crypto');

class Benchmark {
  async run(iterations = 1000000) {
    const results = {
      iterations,
      startTime: Date.now()
    };

    // SHA-256 benchmark
    results.sha256 = await this.benchmarkSHA256(iterations);
    
    // SHA-512 benchmark
    results.sha512 = await this.benchmarkSHA512(iterations);
    
    results.endTime = Date.now();
    results.totalTime = results.endTime - results.startTime;

    return results;
  }

  async benchmarkSHA256(iterations) {
    const start = Date.now();
    const data = Buffer.from('Soulvan Coin benchmark data');
    
    for (let i = 0; i < iterations; i++) {
      crypto.createHash('sha256').update(data).digest();
    }
    
    const end = Date.now();
    const duration = (end - start) / 1000;
    const hashesPerSecond = Math.floor(iterations / duration);
    
    return {
      algorithm: 'SHA-256',
      iterations,
      duration: duration.toFixed(3),
      hashesPerSecond
    };
  }

  async benchmarkSHA512(iterations) {
    const start = Date.now();
    const data = Buffer.from('Soulvan Coin benchmark data');
    
    for (let i = 0; i < iterations; i++) {
      crypto.createHash('sha512').update(data).digest();
    }
    
    const end = Date.now();
    const duration = (end - start) / 1000;
    const hashesPerSecond = Math.floor(iterations / duration);
    
    return {
      algorithm: 'SHA-512',
      iterations,
      duration: duration.toFixed(3),
      hashesPerSecond
    };
  }

  formatResults(results) {
    return {
      summary: `Completed ${results.iterations} iterations in ${results.totalTime}ms`,
      sha256: `${results.sha256.hashesPerSecond.toLocaleString()} hashes/sec`,
      sha512: `${results.sha512.hashesPerSecond.toLocaleString()} hashes/sec`
    };
  }
}

// CLI mode
if (require.main === module) {
  const benchmark = new Benchmark();
  const iterations = parseInt(process.argv[2]) || 1000000;
  
  console.log(`Running benchmark with ${iterations} iterations...`);
  benchmark.run(iterations).then(results => {
    console.log(JSON.stringify(results, null, 2));
    console.log('\nFormatted:');
    console.log(benchmark.formatResults(results));
  });
}

module.exports = { Benchmark };
