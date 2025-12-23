class Difficulty {
    private static adjustmentInterval: number = 10; // Number of blocks to average for difficulty adjustment
    private static minDifficulty: number = 1; // Minimum difficulty level
    private static maxDifficulty: number = 100; // Maximum difficulty level

    private currentDifficulty: number;

    constructor(initialDifficulty: number) {
        this.currentDifficulty = initialDifficulty;
    }

    public getDifficulty(): number {
        return this.currentDifficulty;
    }

    public adjustDifficulty(blocks: Block[], timeTaken: number): void {
        if (blocks.length < Difficulty.adjustmentInterval) {
            return; // Not enough blocks to adjust difficulty
        }

        const lastBlock = blocks[blocks.length - 1];
        const expectedTime = Difficulty.adjustmentInterval * 60000; // Expected time for 10 blocks (10 minutes)
        const actualTime = timeTaken;

        if (actualTime < expectedTime) {
            this.currentDifficulty = Math.min(this.currentDifficulty + 1, Difficulty.maxDifficulty);
        } else if (actualTime > expectedTime) {
            this.currentDifficulty = Math.max(this.currentDifficulty - 1, Difficulty.minDifficulty);
        }
    }
}