import { Block } from '../src/blockchain/block';
import { Blockchain } from '../src/blockchain/blockchain';

describe('Blockchain', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    test('should create a new blockchain with the genesis block', () => {
        const genesisBlock = blockchain.getLatestBlock();
        expect(genesisBlock.index).toBe(0);
        expect(genesisBlock.previousHash).toBe('0');
    });

    test('should add a new block to the blockchain', () => {
        const newBlock = new Block(1, Date.now(), [], blockchain.getLatestBlock().hash);
        blockchain.addBlock(newBlock);
        expect(blockchain.getLatestBlock()).toBe(newBlock);
    });

    test('should validate the blockchain', () => {
        const newBlock1 = new Block(1, Date.now(), [], blockchain.getLatestBlock().hash);
        blockchain.addBlock(newBlock1);
        const newBlock2 = new Block(2, Date.now(), [], blockchain.getLatestBlock().hash);
        blockchain.addBlock(newBlock2);
        expect(blockchain.isChainValid()).toBe(true);
    });

    test('should invalidate the blockchain if a block is tampered with', () => {
        const newBlock = new Block(1, Date.now(), [], blockchain.getLatestBlock().hash);
        blockchain.addBlock(newBlock);
        newBlock.data = 'Tampered Data';
        expect(blockchain.isChainValid()).toBe(false);
    });
});