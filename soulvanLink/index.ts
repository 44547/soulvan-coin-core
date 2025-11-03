export function linkActionToBlockchain(actionType, wallet, metadata) {
  const tx = sendToSoulvanChain({ actionType, wallet, metadata });
  return tx.hash;
}