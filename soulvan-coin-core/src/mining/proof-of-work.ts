class ProofOfWork {
    private difficulty: number;

    constructor(difficulty: number) {
        this.difficulty = difficulty;
    }

    public calculateNonce(blockData: string, maxAttempts: number = 1000000): number {
        let nonce = 0;
        let hash: string;

        do {
            hash = this.hash(blockData + nonce);
            nonce++;
        } while (hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty) && nonce < maxAttempts);

        return nonce - 1; // Return the last valid nonce
    }

    public validateProof(blockData: string, nonce: number): boolean {
        const hash = this.hash(blockData + nonce);
        return hash.substring(0, this.difficulty) === '0'.repeat(this.difficulty);
    }

    private hash(data: string): string {
        // Implement a hashing function (e.g., SHA-256)
        // This is a placeholder for the actual hashing logic
        return require('crypto').createHash('sha256').update(data).digest('hex');
    }
}

export default ProofOfWork;