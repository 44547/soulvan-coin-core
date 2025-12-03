import { Transaction } from '../src/blockchain/transaction';

describe('Transaction', () => {
    let transaction: Transaction;

    beforeEach(() => {
        transaction = new Transaction('senderAddress', 'recipientAddress', 100);
    });

    test('should create a transaction with correct properties', () => {
        expect(transaction.sender).toBe('senderAddress');
        expect(transaction.recipient).toBe('recipientAddress');
        expect(transaction.amount).toBe(100);
    });

    test('should create a valid transaction', () => {
        const isValid = transaction.isValid();
        expect(isValid).toBe(true);
    });

    test('should not create a transaction with negative amount', () => {
        transaction.amount = -50;
        const isValid = transaction.isValid();
        expect(isValid).toBe(false);
    });

    test('should not create a transaction with zero amount', () => {
        transaction.amount = 0;
        const isValid = transaction.isValid();
        expect(isValid).toBe(false);
    });
});