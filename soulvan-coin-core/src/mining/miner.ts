class Miner {
    private mining: boolean;
    private block: Block;
    private difficulty: Difficulty;

    constructor(difficulty: Difficulty) {
        this.mining = false;
        this.difficulty = difficulty;
    }

    public startMining(previousBlock: Block): void {
        this.mining = true;
        this.block = new Block(previousBlock.index + 1, Date.now(), [], previousBlock.hash);
        this.mineBlock();
    }

    public stopMining(): void {
        this.mining = false;
    }

    private mineBlock(): void {
        while (this.mining) {
            const nonce = this.difficulty.calculateNonce(this.block);
            const hash = this.block.calculateHash(nonce);

            if (this.difficulty.isValidHash(hash)) {
                this.block.hash = hash;
                this.onBlockMined(this.block);
                break;
            }
        }
    }

    private onBlockMined(block: Block): void {
        // Handle the mined block (e.g., broadcast it to the network)
        console.log(`Block mined: ${block.hash}`);
    }
}