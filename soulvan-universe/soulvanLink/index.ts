type Tx = { hash: string };

// Placeholder declaration; replace with actual client import when available.
// import { sendToSoulvanChain } from "./client";
declare function sendToSoulvanChain(input: {
  actionType: string;
  wallet: string;
  metadata: any;
}): Tx;

export function linkActionToBlockchain(actionType: string, wallet: string, metadata: any): string {
  const tx = sendToSoulvanChain({ actionType, wallet, metadata });
  return tx.hash;
}
