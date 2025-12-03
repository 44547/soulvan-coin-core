/**
 * Miner tests
 * Tests the built-in demo miner functionality
 */

const { DemoMiner } = require('../mining/miner_core');

async function runTests() {
  console.log('Running Soulvan Coin Miner Tests...\n');
  
  let passed = 0;
  let failed = 0;

  // Test 1: Create miner instance
  console.log('Test 1: Create miner instance');
  try {
    const miner = new DemoMiner();
    console.log('✓ Miner instance created successfully');
    passed++;
  } catch (error) {
    console.log('✗ Failed to create miner instance:', error.message);
    failed++;
    return;
  }

  // Test 2: Start miner
  console.log('\nTest 2: Start miner');
  const miner = new DemoMiner();
  try {
    const stats = miner.start(2);
    if (stats.running && stats.threads === 2) {
      console.log('✓ Miner started successfully');
      console.log(`  Threads: ${stats.threads}`);
      passed++;
    } else {
      console.log('✗ Miner did not start properly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Failed to start miner:', error.message);
    failed++;
  }

  // Test 3: Wait and check stats
  console.log('\nTest 3: Check mining stats after 3 seconds');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    const stats = miner.getStats();
    if (stats.running && stats.hashrate > 0) {
      console.log('✓ Mining stats updated');
      console.log(`  Hashrate: ${stats.hashrateFormatted}`);
      console.log(`  Total hashes: ${stats.totalHashes}`);
      console.log(`  Accepted shares: ${stats.acceptedShares}`);
      console.log(`  Uptime: ${stats.uptimeFormatted}`);
      passed++;
    } else {
      console.log('✗ Stats not updating properly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Failed to get stats:', error.message);
    failed++;
  }

  // Test 4: Stop miner
  console.log('\nTest 4: Stop miner');
  try {
    const stats = miner.stop();
    if (!stats.running) {
      console.log('✓ Miner stopped successfully');
      passed++;
    } else {
      console.log('✗ Miner did not stop properly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Failed to stop miner:', error.message);
    failed++;
  }

  // Test 5: Verify miner is stopped
  console.log('\nTest 5: Verify miner is stopped');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const stats = miner.getStats();
    if (!stats.running) {
      console.log('✓ Miner confirmed stopped');
      passed++;
    } else {
      console.log('✗ Miner still running');
      failed++;
    }
  } catch (error) {
    console.log('✗ Failed verification:', error.message);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary:');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log('='.repeat(50));

  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests if this is the main module
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
