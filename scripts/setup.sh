#!/usr/bin/env bash
set -euo pipefail

echo "=== Soulvan Coin v2.0.0 Setup ==="
echo ""

# Bootstrap Gradle wrapper if needed
if [ ! -f "gradlew" ]; then
  echo "Step 1: Bootstrapping Gradle wrapper..."
  chmod +x scripts/bootstrap_gradle_wrapper.sh
  bash scripts/bootstrap_gradle_wrapper.sh
else
  echo "Step 1: Gradle wrapper already exists ✓"
fi

# Build the project
echo ""
echo "Step 2: Building project..."
./gradlew clean build

# Install distribution
echo ""
echo "Step 3: Installing distribution..."
./gradlew installDist

echo ""
echo "=== Build Complete ==="
echo ""
echo "Available executables:"
echo "  - build/install/soulvan-coin-core/bin/soulvan-coin-core"
echo ""
echo "To run the gateway:"
echo "  cd tools/mining"
echo "  python3 soulvan_mining_api.py"
echo ""
echo "To test the API:"
echo "  curl -s http://localhost:8080/health"
echo ""
echo "To use the CLI:"
echo "  ./scripts/soulvan-cli.sh 'soulvan.version' '{}' | jq ."
echo ""
