# Soulvan Mining Tools

Mining gateway and CLI tools for Soulvan Coin v2.0.0.

## Components

### 1. Mining Gateway API (`soulvan_mining_api.py`)

Flask-based HTTP gateway providing RESTful access to Soulvan node RPC with mining-specific endpoints.

**Features:**
- Blockchain endpoints (`/blockchain/info`, `/blockchain/besthash`)
- Block query by height (`/block/byheight/<height>`)
- Mining endpoints (`/mining/info`, `/mining/template`, `/mining/submit`)
- Simple RPC endpoint (`/rpc`) with support for custom `soulvan.*` methods
- Root-level convenience endpoints (`/health`, `/config`)
- Real-time stats streaming via Server-Sent Events
- TON wallet address configuration
- API key authentication support
- Security controls for mutating operations

### 2. CLI Tool (`soulvan-miner-cli.js`)

Node.js command-line interface for interacting with the mining gateway.

**Commands:**
- `health` - Health check
- `mining info` - Get mining information
- `blockchain info` - Get blockchain information
- `block info <height>` - Get block details at specific height
- `template` - Get block template for mining
- `rpc2 <method>` - Call RPC methods (e.g., `rpc2 soulvan.version`)

## Installation

### Python Gateway

```bash
cd tools/mining
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
```

### Node.js CLI

```bash
cd tools/mining
npm install
```

## Configuration

Use the provided `.env.example` as a template:

```bash
cp .env.example .env
# Edit .env with your configuration
```

Or set environment variables before running:

```bash
export SOULVAN_RPC_URL="http://127.0.0.1:8332"
export SOULVAN_RPC_USER="bitcoinrpc"
export SOULVAN_RPC_PASS="yourpass"
export SOULVAN_TON_ADDRESS="UQCgJ8yDL7dToXb8JbB2FPxIqaXyA3xRNimb0Qy0CzpdSIMt"
export SOULVAN_FEE_ADDRESS="UQCgJ8yDL7dToXb8JbB2FPxIqaXyA3xRNimb0Qy0CzpdSIMt"
export SOULVAN_API_KEY="your-secret-key"
export GATEWAY_PORT=8080
```

## Running the Gateway

```bash
python soulvan_mining_api.py
```

The gateway will start on port 8080 (or the port specified in `GATEWAY_PORT`).

## Using the CLI

```bash
# Health check
./soulvan-miner-cli.js health

# Get mining info
./soulvan-miner-cli.js mining info

# Get blockchain info
./soulvan-miner-cli.js blockchain info

# Get block info at specific height
./soulvan-miner-cli.js block info 800000

# Get block template
./soulvan-miner-cli.js template

# Call custom RPC method
./soulvan-miner-cli.js rpc2 soulvan.version
```

## API Endpoints

### Root Level (Convenience)

- `GET /health` - Health check
- `GET /config` - Get current configuration
- `PUT /config` - Update configuration (requires API key)

### Blockchain

- `GET /blockchain/info` - Get blockchain information
- `GET /blockchain/besthash` - Get best block hash
- `GET /block/byheight/<height>?verbosity=<0|1|2>` - Get block by height

### Mining

- `GET /mining/info` - Get mining information
- `GET /mining/template` - Get block template (requires API key)
- `POST /mining/submit` - Submit mined block (requires API key)

### RPC

- `POST /rpc` - JSON-RPC 2.0 endpoint (requires API key)
  - Supports standard Bitcoin Core RPC methods
  - Supports custom `soulvan.*` methods (e.g., `soulvan.version`)

### Configuration (Legacy)

- `GET /api/config` - Get current configuration
- `POST|PUT /api/config` - Update configuration (requires API key)

### Stats

- `GET /api/stats` - Get current stats snapshot
- `GET /api/stats/stream` - Server-sent events stream of stats

### Health (Legacy)

- `GET /api/health` - Health check

### Download

- `GET /download/app` - Download the packaged distribution zip file
  - Returns `soulvan-coin-core.zip` from `build/distributions/`
  - Returns 404 with hint if file doesn't exist (run `./gradlew distZip` to generate)

## Testing

Run the test suite:

```bash
# From repository root
PYTHONPATH=. pytest -q tools/mining/tests

# or with coverage
pytest --cov=soulvan_mining_api tools/mining/tests
```

## Docker

Build and run with Docker:

```bash
# From repository root
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

## Security

- Set `SOULVAN_API_KEY` to require authentication for sensitive endpoints
- `ALLOW_MUTATING_BLOCKCHAIN_RPC=true` must be set to enable block submission
- By default, mutating operations are disabled for security

## Example Usage

```bash
# Health check
curl -s http://127.0.0.1:8080/health | jq

# Get configuration
curl -s http://127.0.0.1:8080/config | jq

# Update configuration (with API key)
curl -sX PUT http://127.0.0.1:8080/config \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: $SOULVAN_API_KEY" \
  -d '{"tonAddress":"EQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","feeAddress":"EQyyyy..."}' | jq

# Get blockchain info
curl -s http://127.0.0.1:8080/blockchain/info | jq

# Get best block hash
curl -s http://127.0.0.1:8080/blockchain/besthash | jq

# Get block at height 800000 with full verbosity
curl -s "http://127.0.0.1:8080/block/byheight/800000?verbosity=2" | jq

# Get mining info
curl -s http://127.0.0.1:8080/mining/info | jq

# Get block template (with API key)
curl -s http://127.0.0.1:8080/mining/template \
  -H "X-API-Key: your-secret-key" | jq

# Submit block (with API key)
curl -s -X POST http://127.0.0.1:8080/mining/submit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"block":"020000000001..."}' | jq

# Call custom RPC method
curl -s http://127.0.0.1:8080/rpc \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: $SOULVAN_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"soulvan.version"}' | jq

# Download distribution package
curl -O http://127.0.0.1:8080/download/app
# Or check if artifact exists
curl -s http://127.0.0.1:8080/download/app | jq
```

## License

MIT
