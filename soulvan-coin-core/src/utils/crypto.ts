// src/utils/crypto.ts

import * as crypto from 'crypto';

export function createHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

export function signData(data: string, privateKey: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'hex');
}

export function verifySignature(data: string, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
}