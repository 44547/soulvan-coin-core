import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// TODO: implement real TON signature verification
function verifyTonSignature(walletAddress: string | undefined, signature: string | string[] | undefined): boolean {
  if (!walletAddress || !signature) return false;
  return true;
}

@Injectable()
export class TonSignatureGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const signature = req.headers['x-wallet-signature'] as string | string[] | undefined;
    const wallet = req.body?.walletAddress as string | undefined;
    return verifyTonSignature(wallet, signature);
  }
}
