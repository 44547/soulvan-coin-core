# soulvan-coin-core

Release: **v2.0.0**

This repository contains the core of Soulvan Coin. This release (2.0.0) focuses on stability and developer ergonomics.

## What's new in 2.0.0
- **Mining Gateway API** - Production-ready HTTP gateway with blockchain/mining endpoints
- **CLI Tools** - Node.js command-line interface for miners
- **TON Wallet Integration** - Support for TON blockchain addresses
- **Docker Support** - Containerized deployment with docker-compose
- **Test Suite** - Pytest-based testing infrastructure
- **API Key Authentication** - Secure access control for sensitive operations
- Improved modular structure
- Migration guide and breaking-change documentation

See `CHANGELOG.md` for full details.

## Quick Start

### Run with Docker

```bash
docker compose up --build -d
```

### Run Locally

```bash
cd tools/mining
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export SOULVAN_RPC_URL="http://127.0.0.1:8332"
python soulvan_mining_api.py
```

See [`tools/mining/README.md`](tools/mining/README.md) for detailed documentation.

## Components

### Mining Tools (`tools/mining/`)

Complete mining infrastructure including:
- **Gateway API** (`soulvan_mining_api.py`) - Flask-based HTTP gateway with:
  - Blockchain endpoints (`/blockchain/info`, `/blockchain/besthash`, `/block/byheight/<n>`)
  - Mining endpoints (`/mining/info`, `/mining/template`, `/mining/submit`)
  - Real-time stats streaming
  - TON address configuration
  - API key authentication
- **CLI Tool** (`soulvan-miner-cli.js`) - Node.js command-line interface
- **Test Suite** (`test_api.py`) - Pytest-based tests
- **Docker Support** - Containerized deployment

See [`tools/mining/README.md`](tools/mining/README.md) for details.

## About Soulvan Coin

Soulvan Coin: A Scalable, Secure, and Decentralized Future for Digital Currency. Soulvan Coin is a next-generation cryptocurrency built on the foundational principles of decentralization, peer-to-peer exchange, and open participation. Inspired by the Bitcoin protocol.
