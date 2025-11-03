#!/usr/bin/env bash
set -euo pipefail

# Soulvan CLI - RPC client wrapper
# Usage: ./scripts/soulvan-cli.sh <method> <params_json>
# Example: ./scripts/soulvan-cli.sh "fees.getrecommendation" '{"currency":"BTC"}'

GATEWAY_URL="${SOULVAN_GATEWAY_URL:-http://127.0.0.1:8080}"
API_KEY="${SOULVAN_API_KEY:-}"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <method> [params_json]"
  echo "Example: $0 'fees.getrecommendation' '{\"currency\":\"BTC\"}'"
  exit 1
fi

METHOD="$1"
PARAMS="${2:-{}}"

# Build the JSON-RPC request
REQUEST=$(cat <<EOF
{
  "jsonrpc": "2.0",
  "id": "$(date +%s)",
  "method": "$METHOD",
  "params": $PARAMS
}
EOF
)

# Make the RPC call
if [ -n "$API_KEY" ]; then
  curl -s -X POST "$GATEWAY_URL/rpc" \
    -H 'Content-Type: application/json' \
    -H "X-API-Key: $API_KEY" \
    --data "$REQUEST"
else
  curl -s -X POST "$GATEWAY_URL/rpc" \
    -H 'Content-Type: application/json' \
    --data "$REQUEST"
fi
