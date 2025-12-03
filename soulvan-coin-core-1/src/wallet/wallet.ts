export class Wallet {
    private balance: number;
    private transactions: Array<{ recipient: string; amount: number }>;

    constructor() {
        this.balance = 0;
        this.transactions = [];
    }

    public createWallet(): void {
        // Logic to create a new wallet
    }

    public getBalance(): number {
        return this.balance;
    }

    public sendTransaction(recipient: string, amount: number): boolean {
        if (amount > this.balance) {
            console.error("Insufficient balance");
            return false;
        }

        this.transactions.push({ recipient, amount });
        this.balance -= amount;
        return true;
    }

    public getTransactions(): Array<{ recipient: string; amount: number }> {
        return this.transactions;
    }
}