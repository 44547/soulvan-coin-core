# Soulvan Coin Scripts

Utility scripts for building, testing, and running Soulvan Coin.

## Scripts

### bootstrap_gradle_wrapper.sh
Bootstrap the Gradle wrapper for the project.

```bash
./scripts/bootstrap_gradle_wrapper.sh
```

Installs Gradle if needed and generates the Gradle wrapper with version 8.9 (or `$GRADLE_VERSION`).

### setup.sh
Complete project setup - builds and installs the distribution.

```bash
./scripts/setup.sh
```

Runs:
1. Bootstrap Gradle wrapper (if needed)
2. `./gradlew clean build`
3. `./gradlew installDist`

### quickstart.sh
Quick start for development - sets up Python/Node.js environment.

```bash
./scripts/quickstart.sh
```

Runs:
1. Creates `.env` from `.env.example`
2. Sets up Python virtual environment
3. Installs Python dependencies
4. Installs Node.js dependencies

### soulvan-cli.sh
CLI wrapper for making RPC calls to the gateway.

```bash
./scripts/soulvan-cli.sh <method> <params_json>
```

Examples:
```bash
# Get version
./scripts/soulvan-cli.sh "soulvan.version" "{}"

# Get music preferences
./scripts/soulvan-cli.sh "soulvan.music.preferences" "{}" | jq .

# Generate a trap beat
./scripts/soulvan-cli.sh "soulvan.music.beat" '{"genre":"trap","mood":"epic","tempo":140}' | jq .

# Generate complete track with vocals
./scripts/soulvan-cli.sh "soulvan.music.generate" '{"genre":"afrobeats","mood":"uplifting","tempo":128,"lyrics":"Ride the chain, feel the flame","vocal_style":"female pop","language":"en"}' | jq .

# Synthesize vocals only
./scripts/soulvan-cli.sh "soulvan.music.vocals" '{"lyrics":"Your lyrics here","style":"male rap","language":"en"}' | jq .
```

Environment variables:
- `SOULVAN_GATEWAY_URL` - Gateway URL (default: http://127.0.0.1:8080)
- `SOULVAN_API_KEY` - API key for authentication

### test-api.sh
Test the gateway API endpoints.

```bash
./scripts/test-api.sh
```

Runs a series of tests:
1. Health check
2. RPC help method
3. Mining info
4. Blockchain info
5. Custom soulvan.version
6. CLI tests

## Usage

### First Time Setup

```bash
# Quick start (Python/Node.js environment)
./scripts/quickstart.sh

# Or full setup (includes Gradle build)
./scripts/setup.sh
```

### Running the Gateway

```bash
cd tools/mining
source .venv/bin/activate
python soulvan_mining_api.py
```

### Testing

```bash
# Run API tests
./scripts/test-api.sh

# Run Python tests
cd tools/mining
source .venv/bin/activate
PYTHONPATH=../.. pytest -q tests/
```

### Making RPC Calls

```bash
# Using the CLI wrapper
export SOULVAN_API_KEY="your-api-key"
./scripts/soulvan-cli.sh "soulvan.version" "{}" | jq .

# Or directly with curl
curl -s -X POST http://localhost:8080/rpc \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: your-api-key' \
  --data '{"jsonrpc":"2.0","id":"1","method":"soulvan.version","params":{}}' | jq .
```

## Development Workflow

1. **Setup**: Run `./scripts/quickstart.sh`
2. **Start Gateway**: `cd tools/mining && source .venv/bin/activate && python soulvan_mining_api.py`
3. **Test**: `./scripts/test-api.sh` in another terminal
4. **Build**: `./scripts/setup.sh` when building distributions
