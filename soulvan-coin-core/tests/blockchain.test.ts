import { Blockchain } from '../src/blockchain/blockchain';
import { Block } from '../src/blockchain/block';
import { Transaction } from '../src/blockchain/transaction';

describe('Blockchain', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    test('should create a new blockchain with the genesis block', () => {
        expect(blockchain.getLatestBlock()).toEqual(blockchain.chain[0]);
    });

    test('should add a new block to the blockchain', () => {
        const transaction = new Transaction('senderAddress', 'recipientAddress', 100);
        const newBlock = blockchain.addBlock(transaction);
        expect(blockchain.chain.length).toBe(2);
        expect(blockchain.getLatestBlock()).toEqual(newBlock);
    });

    test('should validate the blockchain', () => {
        const transaction1 = new Transaction('senderAddress1', 'recipientAddress1', 50);
        blockchain.addBlock(transaction1);
        const transaction2 = new Transaction('senderAddress2', 'recipientAddress2', 75);
        blockchain.addBlock(transaction2);
        expect(blockchain.isChainValid()).toBe(true);
    });

    test('should invalidate the blockchain if a block is tampered with', () => {
        const transaction = new Transaction('senderAddress', 'recipientAddress', 100);
        blockchain.addBlock(transaction);
        blockchain.chain[1].transactions[0].amount = 200; // Tampering with the block
        expect(blockchain.isChainValid()).toBe(false);
    });
});