class Blockchain {
    private chain: Block[];
    private difficulty: number;
    private miningReward: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; // Example difficulty
        this.miningReward = 50; // Example mining reward
    }

    private createGenesisBlock(): Block {
        return new Block(0, Date.now(), [], "0");
    }

    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    public addBlock(newBlock: Block): void {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    public isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    public minePendingTransactions(miningRewardAddress: string): void {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.addBlock(new Block(this.chain.length, Date.now(), [rewardTx], this.getLatestBlock().hash));
    }
}