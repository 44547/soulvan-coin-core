export type Transaction = {
    id: string;
    sender: string;
    recipient: string;
    amount: number;
    timestamp: Date;
};

export interface Block {
    index: number;
    transactions: Transaction[];
    previousHash: string;
    timestamp: Date;
    hash: string;
}

export interface Blockchain {
    blocks: Block[];
    addBlock(block: Block): void;
    getLatestBlock(): Block;
}

export type User = {
    id: string;
    balance: number;
};

export interface Wallet {
    user: User;
    transactions: Transaction[];
    addTransaction(transaction: Transaction): void;
}