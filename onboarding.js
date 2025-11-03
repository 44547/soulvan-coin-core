import { ethers } from "ethers";
import { createSoulvanIdentity } from "./identity";
import { mintSoulvanNFT } from "./minting";

export async function onboardUser(walletAddress, photoHash, preferences) {
  const identity = await createSoulvanIdentity(walletAddress, photoHash, preferences);
  const nftTx = await mintSoulvanNFT(walletAddress, identity.metadataURI);
  return { identity, nftTx };
}