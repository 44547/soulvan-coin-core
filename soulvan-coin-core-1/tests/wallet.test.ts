import { Wallet } from '../src/wallet/wallet';
import { Keys } from '../src/wallet/keys';

describe('Wallet', () => {
    let wallet: Wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    test('should create a new wallet', () => {
        expect(wallet).toBeDefined();
        expect(wallet.getBalance()).toBe(0);
    });

    test('should generate keys', () => {
        const keys = wallet.generateKeys();
        expect(keys).toBeDefined();
        expect(keys.publicKey).toBeDefined();
        expect(keys.privateKey).toBeDefined();
    });

    test('should send transaction', () => {
        const recipient = 'recipient-address';
        const amount = 10;
        wallet.sendTransaction(recipient, amount);
        expect(wallet.getBalance()).toBe(-amount);
    });

    test('should retrieve balance', () => {
        expect(wallet.getBalance()).toBe(0);
        wallet.sendTransaction('recipient-address', 10);
        expect(wallet.getBalance()).toBe(-10);
    });
});