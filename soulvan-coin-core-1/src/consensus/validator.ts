class Validator {
    validateTransaction(transaction) {
        // Check if the transaction has valid properties
        if (!transaction.sender || !transaction.recipient || !transaction.amount) {
            throw new Error("Invalid transaction: Missing properties");
        }
        // Additional validation logic can be added here
        return true;
    }

    validateBlock(block) {
        // Check if the block has valid properties
        if (!block.index || !block.previousHash || !block.timestamp || !block.transactions) {
            throw new Error("Invalid block: Missing properties");
        }
        // Additional validation logic can be added here
        return true;
    }
}

export default Validator;