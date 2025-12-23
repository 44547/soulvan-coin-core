class Block {
    index: number;
    timestamp: number;
    transactions: any[];
    previousHash: string;
    hash: string;

    constructor(index: number, transactions: any[], previousHash: string) {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        const data = this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash;
        return this.hashData(data);
    }

    hashData(data: string): string {
        // Implement a hashing function (e.g., SHA-256)
        return require('crypto').createHash('sha256').update(data).digest('hex');
    }
}