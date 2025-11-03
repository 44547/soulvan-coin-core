export async function hashPhoto(file) {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Placeholder: replace with actual wallet creation logic (e.g., backend API or web3 provider)
export async function createSoulvanWallet(metadata) {
  return {
    address: "0x0000000000000000000000000000000000000000",
    metadata,
  };
}
