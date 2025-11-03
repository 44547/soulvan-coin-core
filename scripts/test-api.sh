#!/usr/bin/env bash
set -euo pipefail

GATEWAY_URL="${SOULVAN_GATEWAY_URL:-http://localhost:8080}"
API_KEY="${SOULVAN_API_KEY:-devkey1}"

echo "=== Testing Soulvan Gateway API ==="
echo "Gateway URL: $GATEWAY_URL"
echo ""

# Health check
echo "1. Health check:"
curl -s "$GATEWAY_URL/health" | jq .
echo ""

# RPC help
echo "2. RPC help method:"
curl -s -X POST "$GATEWAY_URL/rpc" \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: $API_KEY" \
  --data '{"jsonrpc":"2.0","id":"1","method":"help","params":{}}' | jq .
echo ""

# Mining info
echo "3. Mining info:"
curl -s "$GATEWAY_URL/mining/info" | jq .
echo ""

# Blockchain info
echo "4. Blockchain info:"
curl -s "$GATEWAY_URL/blockchain/info" | jq .
echo ""

# Custom soulvan.version
echo "5. Soulvan version:"
curl -s -X POST "$GATEWAY_URL/rpc" \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: $API_KEY" \
  --data '{"jsonrpc":"2.0","id":"1","method":"soulvan.version","params":{}}' | jq .
echo ""

# CLI tests
echo "=== Testing CLI ==="
echo ""

if [ -f "tools/mining/soulvan-miner-cli.js" ]; then
  echo "6. CLI health check:"
  cd tools/mining && ./soulvan-miner-cli.js health && cd ../..
  echo ""
  
  echo "7. CLI mining info:"
  cd tools/mining && ./soulvan-miner-cli.js mining info && cd ../..
  echo ""
  
  echo "8. CLI blockchain info:"
  cd tools/mining && ./soulvan-miner-cli.js blockchain info && cd ../..
  echo ""
  
  echo "9. CLI RPC call:"
  cd tools/mining && ./soulvan-miner-cli.js rpc2 soulvan.version && cd ../..
  echo ""
fi

echo "=== Tests Complete ==="
