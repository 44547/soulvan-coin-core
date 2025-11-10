#!/bin/bash

# Start the Soulvan Coin node

# Load configuration
source ./src/config/config.ts

# Start the node
node ./src/main.ts &

# Wait for the node to initialize
sleep 5

# Output the status
echo "Soulvan Coin node has been started."