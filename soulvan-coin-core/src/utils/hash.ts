import { createHash } from 'crypto';

export function hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
}

export function hashBlock(index: number, previousHash: string, timestamp: number, data: string): string {
    const blockData = `${index}${previousHash}${timestamp}${data}`;
    return hash(blockData);
}

export function hashTransaction(sender: string, recipient: string, amount: number): string {
    const transactionData = `${sender}${recipient}${amount}`;
    return hash(transactionData);
}