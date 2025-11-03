#!/usr/bin/env node

const axios = require('axios');

const GATEWAY_URL = process.env.SOULVAN_GATEWAY_URL || 'http://127.0.0.1:5050';
const API_KEY = process.env.SOULVAN_API_KEY || '';

const headers = API_KEY ? { 'X-API-Key': API_KEY } : {};

async function getBlockchainInfo() {
  try {
    const response = await axios.get(`${GATEWAY_URL}/blockchain/info`, { headers });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function getMiningInfo() {
  try {
    const response = await axios.get(`${GATEWAY_URL}/mining/info`, { headers });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function getBlockTemplate() {
  try {
    const response = await axios.get(`${GATEWAY_URL}/mining/template`, { headers });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function getBlockInfo(height) {
  try {
    const response = await axios.get(`${GATEWAY_URL}/block/byheight/${height}?verbosity=2`, { headers });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

function printUsage() {
  console.log(`
Soulvan Miner CLI v2.0.0

Usage:
  node soulvan-miner-cli.js <command> [args]

Commands:
  info              Get blockchain info
  block info <n>    Get block info at height n
  mining info       Get mining info (alias: info)
  template          Get block template

Environment Variables:
  SOULVAN_GATEWAY_URL   Gateway URL (default: http://127.0.0.1:5050)
  SOULVAN_API_KEY       API key for authentication
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  const command = args[0];
  const subcommand = args[1];

  if (command === 'info' || (command === 'mining' && subcommand === 'info')) {
    await getMiningInfo();
  } else if (command === 'block' && subcommand === 'info') {
    const height = args[2];
    if (!height) {
      console.error('Error: Block height required');
      process.exit(1);
    }
    await getBlockInfo(height);
  } else if (command === 'template') {
    await getBlockTemplate();
  } else if (command === 'blockchain' && subcommand === 'info') {
    await getBlockchainInfo();
  } else {
    console.error(`Unknown command: ${args.join(' ')}`);
    printUsage();
    process.exit(1);
  }
}

main();
