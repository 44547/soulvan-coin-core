import { Blockchain } from './blockchain/blockchain';
import { Node } from './network/node';
import { Wallet } from './wallet/wallet';
import { Database } from './storage/database';
import { Config } from './config/config';

const init = async () => {
    // Initialize the blockchain
    const blockchain = new Blockchain();
    
    // Load the blockchain data from the database
    const database = new Database();
    await database.loadBlockchain(blockchain);

    // Start the network node
    const node = new Node(blockchain);
    await node.start();

    // Initialize the wallet
    const wallet = new Wallet();
    await wallet.load();

    console.log('Soulvan Coin node is running...');
};

init().catch(error => {
    console.error('Error initializing the application:', error);
});