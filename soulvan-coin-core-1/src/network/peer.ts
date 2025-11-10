class Peer {
    constructor(id, address) {
        this.id = id; // Unique identifier for the peer
        this.address = address; // Network address of the peer
        this.connected = false; // Connection status
    }

    connect() {
        // Logic to connect to the peer
        this.connected = true;
        console.log(`Connected to peer ${this.id} at ${this.address}`);
    }

    disconnect() {
        // Logic to disconnect from the peer
        this.connected = false;
        console.log(`Disconnected from peer ${this.id}`);
    }

    sendMessage(message) {
        // Logic to send a message to the peer
        if (this.connected) {
            console.log(`Sending message to peer ${this.id}: ${message}`);
            // Implement actual message sending logic here
        } else {
            console.log(`Cannot send message, peer ${this.id} is not connected`);
        }
    }

    receiveMessage(message) {
        // Logic to handle receiving a message from the peer
        console.log(`Received message from peer ${this.id}: ${message}`);
        // Implement actual message handling logic here
    }
}

export default Peer;