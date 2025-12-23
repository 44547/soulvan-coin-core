class Mempool {
    private transactions: Transaction[];

    constructor() {
        this.transactions = [];
    }

    addTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
    }

    getPendingTransactions(): Transaction[] {
        return this.transactions;
    }

    clear(): void {
        this.transactions = [];
    }
}

export default Mempool;