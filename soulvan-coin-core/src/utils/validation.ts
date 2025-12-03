// src/utils/validation.ts

export function validateTransaction(transaction) {
    if (!transaction.sender || !transaction.recipient || !transaction.amount) {
        throw new Error("Invalid transaction: Missing sender, recipient, or amount.");
    }
    if (transaction.amount <= 0) {
        throw new Error("Invalid transaction: Amount must be greater than zero.");
    }
    // Additional validation logic can be added here
    return true;
}

export function validateBlock(block) {
    if (!block.index || !block.timestamp || !block.transactions || !block.previousHash || !block.hash) {
        throw new Error("Invalid block: Missing required properties.");
    }
    // Additional validation logic can be added here
    return true;
}