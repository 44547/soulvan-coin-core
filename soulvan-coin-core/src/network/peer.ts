class Peer {
    constructor(id, address) {
        this.id = id;
        this.address = address;
        this.connectedPeers = new Set();
    }

    connect(peer) {
        this.connectedPeers.add(peer);
        console.log(`Connected to peer: ${peer.id}`);
    }

    disconnect(peer) {
        this.connectedPeers.delete(peer);
        console.log(`Disconnected from peer: ${peer.id}`);
    }

    handleIncomingConnection(peer) {
        console.log(`Incoming connection from peer: ${peer.id}`);
        this.connect(peer);
    }

    sendMessage(message, peer) {
        console.log(`Sending message to ${peer.id}: ${message}`);
        // Logic to send message to the peer
    }

    receiveMessage(message, peer) {
        console.log(`Received message from ${peer.id}: ${message}`);
        // Logic to handle received message
    }

    broadcastMessage(message) {
        this.connectedPeers.forEach(peer => {
            this.sendMessage(message, peer);
        });
    }
}