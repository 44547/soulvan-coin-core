#!/usr/bin/env bash
set -euo pipefail

echo "=== Soulvan Coin Quick Start ==="
echo ""

# Setup environment
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Please edit .env with your configuration"
fi

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
cd tools/mining
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r requirements.txt
cd ../..

# Install Node.js dependencies
echo ""
echo "Installing Node.js dependencies..."
cd tools/mining
if [ ! -d "node_modules" ]; then
  npm install --silent
fi
cd ../..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start the gateway:"
echo "  cd tools/mining"
echo "  source .venv/bin/activate"
echo "  python soulvan_mining_api.py"
echo ""
echo "To test:"
echo "  curl -s http://localhost:8080/health | jq"
echo "  ./scripts/soulvan-cli.sh 'soulvan.version' '{}' | jq ."
echo ""
