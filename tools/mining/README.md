# Soulvan Mining Tools

Mining gateway and CLI tools for Soulvan Coin v2.0.0.

## Components

### 1. Mining Gateway API (`soulvan_mining_api.py`)

Flask-based HTTP gateway providing RESTful access to Soulvan node RPC with mining-specific endpoints.

**Features:**
- Blockchain endpoints (`/blockchain/info`, `/blockchain/besthash`)
- Block query by height (`/block/byheight/<height>`)
- Mining endpoints (`/mining/info`, `/mining/template`, `/mining/submit`)
- Real-time stats streaming via Server-Sent Events
- TON wallet address configuration
- API key authentication support
- Security controls for mutating operations

### 2. CLI Tool (`soulvan-miner-cli.js`)

Node.js command-line interface for interacting with the mining gateway.

**Commands:**
- `info` - Get mining information
- `block info <height>` - Get block details at specific height
- `template` - Get block template for mining

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

Set environment variables before running:

```bash
export SOULVAN_RPC_URL="http://127.0.0.1:8332"
export SOULVAN_RPC_USER="bitcoinrpc"
export SOULVAN_RPC_PASS="yourpass"
export SOULVAN_TON_ADDRESS="UQCgJ8yDL7dToXb8JbB2FPxIqaXyA3xRNimb0Qy0CzpdSIMt"
export SOULVAN_FEE_ADDRESS="UQCgJ8yDL7dToXb8JbB2FPxIqaXyA3xRNimb0Qy0CzpdSIMt"
export SOULVAN_API_KEY="your-secret-key"  # Optional
export GATEWAY_PORT=5050
```

## Running the Gateway

```bash
python soulvan_mining_api.py
```

The gateway will start on port 5050 (or the port specified in `GATEWAY_PORT`).

## Using the CLI

```bash
# Get mining info
node soulvan-miner-cli.js info

# Get block info at specific height
node soulvan-miner-cli.js block info 800000

# Get block template
node soulvan-miner-cli.js template
```

## API Endpoints

### Blockchain

- `GET /blockchain/info` - Get blockchain information
- `GET /blockchain/besthash` - Get best block hash
- `GET /block/byheight/<height>?verbosity=<0|1|2>` - Get block by height

### Mining

- `GET /mining/info` - Get mining information
- `GET /mining/template` - Get block template (requires API key)
- `POST /mining/submit` - Submit mined block (requires API key)

### Configuration

- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration (requires API key)

### Stats

- `GET /api/stats` - Get current stats snapshot
- `GET /api/stats/stream` - Server-sent events stream of stats

### Health

- `GET /api/health` - Health check

## Testing

Run the test suite:

```bash
pytest -q
# or with coverage
pytest --cov=soulvan_mining_api test_api.py
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
# Get blockchain info
curl -s http://127.0.0.1:5050/blockchain/info | jq

# Get best block hash
curl -s http://127.0.0.1:5050/blockchain/besthash | jq

# Get block at height 800000 with full verbosity
curl -s "http://127.0.0.1:5050/block/byheight/800000?verbosity=2" | jq

# Get mining info
curl -s http://127.0.0.1:5050/mining/info | jq

# Get block template (with API key)
curl -s http://127.0.0.1:5050/mining/template \
  -H "X-API-Key: your-secret-key" | jq

# Submit block (with API key)
curl -s -X POST http://127.0.0.1:5050/mining/submit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"block":"020000000001..."}' | jq
```

## License

MIT
