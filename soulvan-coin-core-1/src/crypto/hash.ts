import { createHash } from 'crypto';

export function hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
}

export function verifyHash(data: string, hash: string): boolean {
    const computedHash = hash(data);
    return computedHash === hash;
}