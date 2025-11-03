from flask import Flask, request, jsonify, Response, send_from_directory, stream_with_context
import os
import re
import json
import time
import threading
import requests
from pathlib import Path

app = Flask(__name__)

# ---- Config ----
RPC_URL = os.getenv("SOULVAN_RPC_URL", "http://127.0.0.1:12345")
RPC_USER = os.getenv("SOULVAN_RPC_USER", "rpcuser")
RPC_PASS = os.getenv("SOULVAN_RPC_PASS", "rpcpass")
GATEWAY_PORT = int(os.getenv("GATEWAY_PORT", "5050"))
POLL_INTERVAL = int(os.getenv("STATS_POLL_INTERVAL", "5"))
DASHBOARD_DIR = Path(os.getenv("DASHBOARD_DIR", str(Path(__file__).resolve().parents[2] / "web" / "mining-dashboard")))
CONFIG_PATH = Path(__file__).parent / "config.json"
DEFAULT_TON = os.getenv("SOULVAN_TON_ADDRESS", "")
DEFAULT_FEE = os.getenv("SOULVAN_FEE_ADDRESS", DEFAULT_TON)
ALLOW_MUTATING_BLOCKCHAIN_RPC = os.getenv("ALLOW_MUTATING_BLOCKCHAIN_RPC", "false").lower() in ("1","true","yes")

# ---- Helpers ----
def is_valid_ton_address(addr: str) -> bool:
    if not isinstance(addr, str): return False
    if not (addr.startswith("EQ") or addr.startswith("UQ")): return False
    if not (48 <= len(addr) <= 60): return False
    return re.fullmatch(r"[A-Za-z0-9_-]+", addr) is not None

def load_config():
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r") as f:
            data = json.load(f)
    else:
        data = {}
    data.setdefault("tonAddress", DEFAULT_TON)
    data.setdefault("feeAddress", DEFAULT_FEE or data.get("tonAddress", ""))
    return data

def save_config(cfg):
    with open(CONFIG_PATH, "w") as f:
        json.dump(cfg, f, indent=2)

def rpc(method, params=None):
    payload = {"jsonrpc": "2.0", "id": 0, "method": method, "params": params or []}
    try:
        r = requests.post(RPC_URL, json=payload, auth=(RPC_USER, RPC_PASS), timeout=30)
        r.raise_for_status()
        return r.json()
    except requests.RequestException as e:
        return {"jsonrpc": "2.0", "id": 0, "error": {"code": -32603, "message": str(e)}}

# ---- Stats polling ----
latest_stats = {"blockchainInfo": None, "miningInfo": None, "networkInfo": None}
stats_lock = threading.Lock()

def poll_stats():
    while True:
        try:
            bc = rpc("getblockchaininfo")
            mi = rpc("getmininginfo")
            ni = rpc("getnetworkinfo")
            with stats_lock:
                latest_stats["blockchainInfo"] = bc.get("result")
                latest_stats["miningInfo"] = mi.get("result")
                latest_stats["networkInfo"] = ni.get("result")
        except Exception as e:
            print(f"Stats polling error: {e}")
        time.sleep(POLL_INTERVAL)

threading.Thread(target=poll_stats, daemon=True).start()

# ---- API Endpoints ----
@app.route("/")
def index():
    if DASHBOARD_DIR.exists():
        return send_from_directory(DASHBOARD_DIR, "index.html")
    return jsonify({"status": "Soulvan Gateway API", "version": "2.0.0"})

@app.route("/<path:path>")
def serve_dashboard(path):
    if DASHBOARD_DIR.exists():
        return send_from_directory(DASHBOARD_DIR, path)
    return "Not Found", 404

@app.route("/api/config", methods=["GET"])
def get_config():
    cfg = load_config()
    return jsonify(cfg)

@app.route("/api/config", methods=["POST"])
def update_config():
    data = request.get_json()
    cfg = load_config()
    
    if "tonAddress" in data:
        if not is_valid_ton_address(data["tonAddress"]):
            return jsonify({"error": "Invalid TON address"}), 400
        cfg["tonAddress"] = data["tonAddress"]
    
    if "feeAddress" in data:
        if not is_valid_ton_address(data["feeAddress"]):
            return jsonify({"error": "Invalid fee address"}), 400
        cfg["feeAddress"] = data["feeAddress"]
    
    save_config(cfg)
    return jsonify(cfg)

@app.route("/api/stats", methods=["GET"])
def get_stats():
    with stats_lock:
        return jsonify(latest_stats)

@app.route("/api/stats/stream", methods=["GET"])
def stream_stats():
    def generate():
        while True:
            with stats_lock:
                data = json.dumps(latest_stats)
            yield f"data: {data}\n\n"
            time.sleep(POLL_INTERVAL)
    return Response(stream_with_context(generate()), mimetype="text/event-stream")

@app.route("/api/rpc", methods=["POST"])
def proxy_rpc():
    data = request.get_json()
    method = data.get("method", "")
    
    # Block mutating methods unless explicitly allowed
    if not ALLOW_MUTATING_BLOCKCHAIN_RPC:
        mutating_methods = ["sendrawtransaction", "generate", "generatetoaddress", "invalidateblock"]
        if method in mutating_methods:
            return jsonify({"error": "Mutating blockchain RPC methods are disabled"}), 403
    
    params = data.get("params", [])
    result = rpc(method, params)
    return jsonify(result)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "version": "2.0.0"})

# ---- Main ----
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=GATEWAY_PORT, debug=False)
