# Soulvan Coin Miner App

A cryptocurrency miner application with integrated login and payment features.

## Features

### Login and Payments

#### TON Connect Login
- Connect your TON wallet using TonConnect protocol
- Secure wallet integration with support for popular TON wallets
- Displays connected wallet address
- Uses manifest from: `src/tonconnect-manifest.json`

#### Bitcoin Login (BIP-322)
- Verify Bitcoin address ownership through message signing
- Supports BIP-322 signature format (preferred)
- Falls back to legacy Bitcoin message format for compatibility
- Simply sign a message with your Bitcoin wallet and paste the signature

#### Payments Flow
Exchange major cryptocurrencies to TON using integrated aggregator links:

**Default TON Payout Address:** `EQATeIt1rlgdbc5OaHnz7hsxi9v2SGjT7ZmQMekaq17x5F7n`

**Note on TON Address Formats:**
- **EQ** (non-bounceable): Preferred by most exchanges and services. This is the default format.
- **UQ** (bounceable): Alternative format that can be used if specifically required by a service.
- Both formats represent the same wallet, just with different bounce flags.

**Supported Coins:**
- Bitcoin (BTC)
- Ethereum (ETH)
- Tether (USDT)
- USD Coin (USDC)
- Tron (TRX)
- Binance Coin (BNB)
- Polygon (MATIC)
- Litecoin (LTC)
- Dogecoin (DOGE)

**Supported Exchanges:**
- ChangeNOW - Widget-based exchange with prefilled parameters
- SimpleSwap - Direct swap with prefilled addresses and amounts
- SideShift - Privacy-focused exchange with settle address

**How to Use:**
1. Navigate to the Payments tab
2. Select your source coin from the dropdown
3. (Optional) Enter amount to exchange
4. Verify or update the TON payout address (defaults to owner's address)
5. (Optional) Enter refund address for failed transactions
6. Click "Generate Exchange Links"
7. Click on any exchange link to open in your browser
8. Complete the swap on the exchange platform

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

## Building

```bash
npm run build
```

## Dependencies

- **@tonconnect/sdk** - TON wallet connection
- **bip322** - Bitcoin BIP-322 signature verification
- **bitcoinjs-message** - Legacy Bitcoin message verification
- **qrcode** - QR code generation (for future features)
- **electron** - Desktop application framework

## Security

- All IPC communication is secured through context isolation
- Preload script exposes only specific API methods
- External URLs are opened in the user's default browser
- No private keys are stored or transmitted

## License

MIT
