# Soulvan Gateway API

A Flask-based HTTP gateway for the Soulvan Coin RPC node.

## Features

- RESTful API proxy to Soulvan node RPC
- Real-time stats streaming (SSE)
- TON address configuration management
- Mining dashboard serving
- Security controls for mutating blockchain operations

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

Environment variables:
- `SOULVAN_RPC_URL`: Node RPC endpoint (default: http://127.0.0.1:12345)
- `SOULVAN_RPC_USER`: RPC username (default: rpcuser)
- `SOULVAN_RPC_PASS`: RPC password (default: rpcpass)
- `GATEWAY_PORT`: Gateway HTTP port (default: 5050)
- `STATS_POLL_INTERVAL`: Stats polling interval in seconds (default: 5)
- `DASHBOARD_DIR`: Dashboard static files directory
- `SOULVAN_TON_ADDRESS`: Default TON address
- `SOULVAN_FEE_ADDRESS`: Default fee address
- `ALLOW_MUTATING_BLOCKCHAIN_RPC`: Allow mutating RPC methods (default: false)

## Running

```bash
python gateway/api/gateway.py
```

Or with custom configuration:

```bash
export SOULVAN_RPC_URL="http://localhost:8332"
export GATEWAY_PORT="8080"
python gateway/api/gateway.py
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration (TON addresses)
- `GET /api/stats` - Get current blockchain/mining/network stats
- `GET /api/stats/stream` - Server-sent events stream of stats
- `POST /api/rpc` - Proxy RPC calls to node

## Security

By default, mutating blockchain RPC methods (sendrawtransaction, generate, etc.) are blocked.
Set `ALLOW_MUTATING_BLOCKCHAIN_RPC=true` to enable them.
