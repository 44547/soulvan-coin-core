#!/usr/bin/env python3
"""
Soulvan Gateway API Runner
"""
import sys
from pathlib import Path

# Add gateway to path
gateway_path = Path(__file__).parent
sys.path.insert(0, str(gateway_path))

from api.gateway import app, GATEWAY_PORT

if __name__ == "__main__":
    print(f"Starting Soulvan Gateway on port {GATEWAY_PORT}...")
    app.run(host="0.0.0.0", port=GATEWAY_PORT, debug=False)
