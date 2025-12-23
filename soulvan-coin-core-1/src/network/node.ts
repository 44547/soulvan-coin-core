export class Node {
    private peers: Set<string>;

    constructor() {
        this.peers = new Set();
    }

    public start(): void {
        console.log("Node is starting...");
        // Logic to start the node
    }

    public broadcastTransaction(transaction: any): void {
        console.log("Broadcasting transaction:", transaction);
        // Logic to broadcast the transaction to peers
    }

    public syncWithPeers(): void {
        console.log("Syncing with peers...");
        // Logic to sync with other nodes
    }

    public addPeer(peer: string): void {
        this.peers.add(peer);
        console.log(`Peer added: ${peer}`);
    }

    public removePeer(peer: string): void {
        this.peers.delete(peer);
        console.log(`Peer removed: ${peer}`);
    }
}