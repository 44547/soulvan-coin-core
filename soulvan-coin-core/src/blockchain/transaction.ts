class Transaction {
    sender: string;
    recipient: string;
    amount: number;

    constructor(sender: string, recipient: string, amount: number) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
    }

    static createTransaction(sender: string, recipient: string, amount: number): Transaction {
        return new Transaction(sender, recipient, amount);
    }
}

export default Transaction;