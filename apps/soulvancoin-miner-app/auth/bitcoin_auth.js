const { Verifier } = require('bip322');
const bitcoinMessage = require('bitcoinjs-message');

/**
 * Verify Bitcoin login signature
 * Uses BIP-322 verification first, falls back to legacy format
 * @param {string} address - Bitcoin address
 * @param {string} message - Message that was signed
 * @param {string} signature - Signature to verify
 * @returns {Promise<{success: boolean, method?: string, error?: string}>}
 */
async function verifyBitcoinLogin(address, message, signature) {
  try {
    // Try BIP-322 verification first
    try {
      const isValid = await Verifier.verifySignature(address, message, signature);
      if (isValid) {
        return { success: true, method: 'BIP-322' };
      }
    } catch (bip322Error) {
      console.log('BIP-322 verification failed, trying legacy format:', bip322Error.message);
    }

    // Fallback to legacy Bitcoin message verification
    try {
      const isValid = bitcoinMessage.verify(message, address, signature);
      if (isValid) {
        return { success: true, method: 'Legacy' };
      }
      return { success: false, error: 'Invalid signature' };
    } catch (legacyError) {
      return { success: false, error: `Verification failed: ${legacyError.message}` };
    }
  } catch (error) {
    return { success: false, error: `Error: ${error.message}` };
  }
}

module.exports = { verifyBitcoinLogin };
