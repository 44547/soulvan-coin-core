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
        let hash = 0, i, chr;
        for (i = 0; i < data.length; i++) {
            chr = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }

    validateBlock(): boolean {
        const calculatedHash = this.calculateHash();
        return calculatedHash === this.hash;
    }
}