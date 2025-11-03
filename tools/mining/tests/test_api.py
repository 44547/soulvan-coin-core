"""
Tests for Soulvan Mining API
"""
import pytest
import json
from unittest.mock import patch, MagicMock
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from soulvan_mining_api import app, is_valid_ton_address, jrpc_result, jrpc_error


@pytest.fixture
def client():
    """Create a test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert data['version'] == '2.0.0'


def test_ton_address_validation():
    """Test TON address validation"""
    # Valid addresses
    assert is_valid_ton_address("UQCgJ8yDL7dToXb8JbB2FPxIqaXyA3xRNimb0Qy0CzpdSIMt") == True
    assert is_valid_ton_address("EQCgJ8yDL7dToXb8JbB2FPxIqaXyA3xRNimb0Qy0CzpdSIMt") == True
    
    # Invalid addresses
    assert is_valid_ton_address("invalid") == False
    assert is_valid_ton_address("") == False
    assert is_valid_ton_address("TQCgJ8yDL7dToXb8JbB2FPxIqaXyA3xRNimb0Qy0CzpdSIMt") == False
    assert is_valid_ton_address(None) == False
    assert is_valid_ton_address(123) == False


def test_jrpc_helpers():
    """Test JSON-RPC helper functions"""
    # Test jrpc_result
    result = jrpc_result({"blocks": 100}, 1)
    assert result['jsonrpc'] == '2.0'
    assert result['result'] == {"blocks": 100}
    assert result['id'] == 1
    
    # Test jrpc_error
    error = jrpc_error(-32600, "Invalid Request", 2)
    assert error['jsonrpc'] == '2.0'
    assert error['error']['code'] == -32600
    assert error['error']['message'] == "Invalid Request"
    assert error['id'] == 2


@patch('soulvan_mining_api.rpc')
def test_blockchain_info_endpoint(mock_rpc, client):
    """Test blockchain info endpoint"""
    mock_rpc.return_value = {
        "result": {
            "chain": "main",
            "blocks": 800000,
            "headers": 800000
        }
    }
    
    response = client.get('/blockchain/info')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'result' in data
    assert data['result']['blocks'] == 800000


@patch('soulvan_mining_api.rpc')
def test_mining_info_endpoint(mock_rpc, client):
    """Test mining info endpoint"""
    mock_rpc.return_value = {
        "result": {
            "blocks": 800000,
            "difficulty": 1000000,
            "networkhashps": 5000000000
        }
    }
    
    response = client.get('/mining/info')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'result' in data
    assert data['result']['blocks'] == 800000


def test_index_endpoint(client):
    """Test index endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'status' in data or 'Soulvan' in response.data.decode()


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
