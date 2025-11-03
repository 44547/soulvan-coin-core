from flask import Flask, request, jsonify, Response, send_from_directory, send_file, stream_with_context
import os
import re
import json
import time
import threading
import requests
from pathlib import Path
from typing import Any, Dict, List, Union

app = Flask(__name__)

# ---- Config ----
RPC_URL = os.getenv("SOULVAN_RPC_URL", "http://127.0.0.1:8332")
RPC_USER = os.getenv("SOULVAN_RPC_USER", "bitcoinrpc")
RPC_PASS = os.getenv("SOULVAN_RPC_PASS", "rpcpass")
GATEWAY_PORT = int(os.getenv("GATEWAY_PORT", "8080"))
POLL_INTERVAL = int(os.getenv("STATS_POLL_INTERVAL", "5"))
DASHBOARD_DIR = Path(os.getenv("DASHBOARD_DIR", str(Path(__file__).resolve().parent / "dashboard")))
CONFIG_PATH = Path(__file__).parent / "config.json"
DEFAULT_TON = os.getenv("SOULVAN_TON_ADDRESS", "")
DEFAULT_FEE = os.getenv("SOULVAN_FEE_ADDRESS", DEFAULT_TON)
ALLOW_MUTATING_BLOCKCHAIN_RPC = os.getenv("ALLOW_MUTATING_BLOCKCHAIN_RPC", "false").lower() in ("1","true","yes")
API_KEY = os.getenv("SOULVAN_API_KEY", "").strip()

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

# Helpers for JSON-RPC 2.0 responses
def jrpc_result(result, _id=0):
    return {"jsonrpc": "2.0", "result": result, "id": _id}

def jrpc_error(code, message, _id=None):
    return {"jsonrpc": "2.0", "error": {"code": code, "message": message}, "id": _id}

def require_apikey():
    if not API_KEY:
        return True
    supplied = request.headers.get("X-API-Key", "")
    return supplied == API_KEY

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
    return jsonify({"status": "Soulvan Mining Gateway API", "version": "2.0.0"})

@app.route("/<path:path>")
def serve_dashboard(path):
    if DASHBOARD_DIR.exists() and not path.startswith("api/") and not path.startswith("blockchain/") and not path.startswith("mining/") and not path.startswith("block/"):
        return send_from_directory(DASHBOARD_DIR, path)
    return "Not Found", 404

# Config endpoints
@app.route("/api/config", methods=["GET"])
def get_config():
    cfg = load_config()
    return jsonify(cfg)

@app.route("/api/config", methods=["POST", "PUT"])
def update_config():
    if not require_apikey():
        return jsonify({"error": "Unauthorized"}), 401
        
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

# Stats endpoints
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

# RPC proxy
@app.route("/api/rpc", methods=["POST"])
def proxy_rpc():
    if not require_apikey():
        return jsonify({"error": "Unauthorized"}), 401
        
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

# Blockchain endpoints
@app.route("/blockchain/info", methods=["GET"])
def blockchain_info():
    result = rpc("getblockchaininfo")
    if "error" in result:
        return jsonify(result), 500
    return jsonify(jrpc_result(result.get("result"), 0))

@app.route("/blockchain/besthash", methods=["GET"])
def blockchain_besthash():
    result = rpc("getbestblockhash")
    if "error" in result:
        return jsonify(result), 500
    return jsonify(jrpc_result(result.get("result"), 0))

@app.route("/block/byheight/<int:height>", methods=["GET"])
def block_by_height(height):
    verbosity = request.args.get("verbosity", "1")
    try:
        verbosity = int(verbosity)
    except ValueError:
        verbosity = 1
    
    # First get block hash by height
    hash_result = rpc("getblockhash", [height])
    if "error" in hash_result:
        return jsonify(hash_result), 500
    
    block_hash = hash_result.get("result")
    if not block_hash:
        return jsonify(jrpc_error(-5, "Block not found")), 404
    
    # Then get block by hash
    block_result = rpc("getblock", [block_hash, verbosity])
    if "error" in block_result:
        return jsonify(block_result), 500
    
    return jsonify(jrpc_result(block_result.get("result"), 0))

# Mining endpoints
@app.route("/mining/info", methods=["GET"])
def mining_info():
    result = rpc("getmininginfo")
    if "error" in result:
        return jsonify(result), 500
    return jsonify(jrpc_result(result.get("result"), 0))

@app.route("/mining/template", methods=["GET"])
def mining_template():
    if not require_apikey():
        return jsonify(jrpc_error(-1, "Unauthorized")), 401
    
    result = rpc("getblocktemplate", [{"rules": ["segwit"]}])
    if "error" in result:
        return jsonify(result), 500
    return jsonify(jrpc_result(result.get("result"), 0))

@app.route("/mining/submit", methods=["POST"])
def mining_submit():
    if not require_apikey():
        return jsonify(jrpc_error(-1, "Unauthorized")), 401
    
    if not ALLOW_MUTATING_BLOCKCHAIN_RPC:
        return jsonify(jrpc_error(-1, "Block submission is disabled")), 403
    
    data = request.get_json()
    block_hex = data.get("block", "")
    
    if not block_hex:
        return jsonify(jrpc_error(-1, "Missing block hex")), 400
    
    result = rpc("submitblock", [block_hex])
    if "error" in result:
        return jsonify(result), 500
    
    return jsonify(jrpc_result(result.get("result"), 0))

# Root-level endpoints for convenience
@app.route("/health", methods=["GET"])
def health_root():
    return jsonify({"status": "ok", "version": "2.0.0"})

@app.route("/config", methods=["GET"])
def get_config_root():
    cfg = load_config()
    return jsonify(cfg)

@app.route("/config", methods=["PUT", "POST"])
def update_config_root():
    if not require_apikey():
        return jsonify({"error": "Unauthorized"}), 401
        
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

# Simpler RPC endpoint
@app.route("/rpc", methods=["POST"])
def rpc_endpoint():
    if not require_apikey():
        return jsonify(jrpc_error(-1, "Unauthorized")), 401
    
    data = request.get_json()
    method = data.get("method", "")
    params = data.get("params", [])
    req_id = data.get("id", 0)
    
    # Handle custom soulvan.* methods
    if method.startswith("soulvan."):
        if method == "soulvan.version":
            return jsonify(jrpc_result("2.0.0", req_id))
        else:
            return jsonify(jrpc_error(-32601, f"Method not found: {method}", req_id)), 404
    
    # Block mutating methods unless explicitly allowed
    if not ALLOW_MUTATING_BLOCKCHAIN_RPC:
        mutating_methods = ["sendrawtransaction", "generate", "generatetoaddress", "invalidateblock", "submitblock"]
        if method in mutating_methods:
            return jsonify(jrpc_error(-1, "Mutating blockchain RPC methods are disabled", req_id)), 403
    
    result = rpc(method, params)
    if "error" in result:
        return jsonify(jrpc_error(result["error"].get("code", -32603), result["error"].get("message", "RPC error"), req_id)), 500
    
    return jsonify(jrpc_result(result.get("result"), req_id))

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "version": "2.0.0"})

# Download endpoint
@app.route("/download/app", methods=["GET"])
def download_app():
    """
    Download the packaged distribution zip file.
    Looks for build/distributions/soulvan-coin-core.zip in the repository root.
    """
    # Get repository root (3 levels up from this file: tools/mining/soulvan_mining_api.py)
    repo_root = Path(__file__).resolve().parents[2]
    zip_path = repo_root / "build" / "distributions" / "soulvan-coin-core.zip"
    
    if not zip_path.exists():
        return jsonify({
            "error": "artifact_not_found",
            "hint": "Run './gradlew distZip' to generate build/distributions/soulvan-coin-core.zip",
            "expected_path": str(zip_path)
        }), 404
    
    return send_file(
        zip_path,
        mimetype='application/zip',
        as_attachment=True,
        download_name='soulvan-coin-core.zip'
    )

# ---- Main ----
if __name__ == "__main__":
    print(f"Starting Soulvan Mining Gateway on port {GATEWAY_PORT}...")
    print(f"RPC URL: {RPC_URL}")
    print(f"API Key: {'Enabled' if API_KEY else 'Disabled'}")
    app.run(host="0.0.0.0", port=GATEWAY_PORT, debug=False)
