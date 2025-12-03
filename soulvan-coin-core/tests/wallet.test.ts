import { Wallet } from '../src/wallet/wallet';
import { Address } from '../src/wallet/address';
import { Transaction } from '../src/blockchain/transaction';

describe('Wallet', () => {
    let wallet: Wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    test('should create a new wallet', () => {
        expect(wallet).toBeDefined();
        expect(wallet.getAddresses()).toHaveLength(1);
    });

    test('should generate a new address', () => {
        const initialAddressCount = wallet.getAddresses().length;
        wallet.generateNewAddress();
        expect(wallet.getAddresses()).toHaveLength(initialAddressCount + 1);
    });

    test('should create a transaction', () => {
        const recipient = 'recipient-address';
        const amount = 10;
        const transaction = wallet.createTransaction(recipient, amount);
        
        expect(transaction).toBeInstanceOf(Transaction);
        expect(transaction.sender).toEqual(wallet.getAddresses()[0].address);
        expect(transaction.recipient).toEqual(recipient);
        expect(transaction.amount).toEqual(amount);
    });

    test('should validate an address', () => {
        const address = wallet.getAddresses()[0];
        expect(wallet.validateAddress(address.address)).toBe(true);
    });

    test('should not validate an invalid address', () => {
        const invalidAddress = 'invalid-address';
        expect(wallet.validateAddress(invalidAddress)).toBe(false);
    });
});