import { Miner } from '../src/mining/miner';
import { Blockchain } from '../src/blockchain/blockchain';
import { Block } from '../src/blockchain/block';
import { Transaction } from '../src/blockchain/transaction';
import { ProofOfWork } from '../src/mining/proof-of-work';

describe('Mining Functionality', () => {
    let miner: Miner;
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
        miner = new Miner(blockchain);
    });

    test('should mine a new block', async () => {
        const transaction = new Transaction('address1', 'address2', 50);
        blockchain.addTransaction(transaction);
        
        const minedBlock = await miner.startMining();

        expect(minedBlock).toBeInstanceOf(Block);
        expect(minedBlock.transactions).toContain(transaction);
        expect(minedBlock.index).toBe(blockchain.getLatestBlock().index + 1);
    });

    test('should validate proof of work', () => {
        const block = new Block(1, Date.now(), [], '0');
        const proofOfWork = new ProofOfWork();

        const { nonce, hash } = proofOfWork.mine(block);
        const isValid = proofOfWork.validate(block, nonce, hash);

        expect(isValid).toBe(true);
    });

    test('should adjust mining difficulty', () => {
        const initialDifficulty = miner.getDifficulty();
        miner.adjustDifficulty();
        const newDifficulty = miner.getDifficulty();

        expect(newDifficulty).not.toBe(initialDifficulty);
    });
});