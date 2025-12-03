// src/network/protocol.ts

import { Block } from '../blockchain/block';
import { Transaction } from '../blockchain/transaction';
import { Node } from './node';
import { Peer } from './peer';

export class Protocol {
    private node: Node;

    constructor(node: Node) {
        this.node = node;
    }

    public sendBlock(block: Block): void {
        const message = JSON.stringify({ type: 'block', data: block });
        this.node.broadcast(message);
    }

    public sendTransaction(transaction: Transaction): void {
        const message = JSON.stringify({ type: 'transaction', data: transaction });
        this.node.broadcast(message);
    }

    public onMessage(message: string): void {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case 'block':
                this.handleBlock(parsedMessage.data);
                break;
            case 'transaction':
                this.handleTransaction(parsedMessage.data);
                break;
            default:
                console.error('Unknown message type:', parsedMessage.type);
        }
    }

    private handleBlock(block: Block): void {
        // Logic to handle incoming block
        console.log('Received block:', block);
        // Validate and add block to the blockchain
    }

    private handleTransaction(transaction: Transaction): void {
        // Logic to handle incoming transaction
        console.log('Received transaction:', transaction);
        // Validate and add transaction to the mempool
    }
}