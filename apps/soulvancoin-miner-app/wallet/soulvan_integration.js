/**
 * Soulvan Coin wallet integration (demo stub)
 * In production, this would connect to actual Soulvan Coin RPC
 */

// Constants
const SOULVAN_ADDRESS_LENGTH = 40;
const SOULVAN_PRIVATE_KEY_LENGTH = 64;

class SoulvanWallet {
  constructor() {
    this.wallets = new Map();
    this.currentWallet = null;
  }

  createWallet(name = 'default') {
    // Generate a mock wallet address
    const address = 'soulvan_' + this.generateRandomHex(SOULVAN_ADDRESS_LENGTH);
    const privateKey = this.generateRandomHex(SOULVAN_PRIVATE_KEY_LENGTH);
    
    const wallet = {
      name,
      address,
      privateKey,
      balance: 0,
      createdAt: Date.now()
    };

    this.wallets.set(address, wallet);
    this.currentWallet = address;

    return {
      success: true,
      address,
      message: 'Wallet created successfully (demo mode)'
    };
  }

  restoreWallet(privateKey, name = 'restored') {
    // DEMO MODE: In production, this should derive the address from the privateKey
    // For now, we generate a new address and set some balance to simulate restoration
    const address = 'soulvan_' + this.generateRandomHex(SOULVAN_ADDRESS_LENGTH);
    
    const wallet = {
      name,
      address,
      privateKey,
      balance: Math.floor(Math.random() * 1000),
      createdAt: Date.now()
    };

    this.wallets.set(address, wallet);
    this.currentWallet = address;

    return {
      success: true,
      address,
      message: 'Wallet restored successfully (demo mode - replace with real key derivation)'
    };
  }

  getBalance(address = null) {
    const addr = address || this.currentWallet;
    
    if (!addr) {
      throw new Error('No wallet selected');
    }

    const wallet = this.wallets.get(addr);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return {
      address: addr,
      balance: wallet.balance,
      currency: 'SOULVAN'
    };
  }

  send(toAddress, amount) {
    if (!this.currentWallet) {
      throw new Error('No wallet selected');
    }

    const wallet = this.wallets.get(this.currentWallet);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Simulate transaction
    wallet.balance -= amount;

    return {
      success: true,
      txHash: this.generateRandomHex(64),
      from: this.currentWallet,
      to: toAddress,
      amount,
      message: 'Transaction sent successfully (demo mode)'
    };
  }

  getCurrentWallet() {
    if (!this.currentWallet) {
      return null;
    }

    const wallet = this.wallets.get(this.currentWallet);
    return wallet ? {
      address: wallet.address,
      name: wallet.name,
      balance: wallet.balance
    } : null;
  }

  generateRandomHex(length) {
    let result = '';
    const chars = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

module.exports = { SoulvanWallet };
