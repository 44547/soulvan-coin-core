// src/index.ts
import { Blockchain } from './blockchain/blockchain';
import { Miner } from './mining/miner';
import { Wallet } from './wallet/wallet';
import { Node } from './network/node';

// Initialize the blockchain
const blockchain = new Blockchain();

// Initialize the miner
const miner = new Miner(blockchain);

// Initialize the wallet
const wallet = new Wallet();

// Initialize the node
const node = new Node(blockchain, wallet);

// Start the mining process
miner.startMining();

// Export components for external use
export { blockchain, miner, wallet, node };