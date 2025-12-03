// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  });
});

// TON Connect functionality
let tonConnectUI;
let tonConnector;

async function initTonConnect() {
  try {
    // Initialize TonConnect with manifest URL
    const manifestUrl = 'https://raw.githubusercontent.com/44547/soulvan-coin-core/main/apps/soulvancoin-miner-app/src/tonconnect-manifest.json';
    
    tonConnector = new TonConnectSDK.TonConnect({
      manifestUrl: manifestUrl
    });

    // Listen for status changes
    tonConnector.onStatusChange((wallet) => {
      if (wallet) {
        showTonConnected(wallet.account.address);
      } else {
        showTonDisconnected();
      }
    });

    // Check if already connected
    const currentWallet = tonConnector.wallet;
    if (currentWallet) {
      showTonConnected(currentWallet.account.address);
    }
  } catch (error) {
    console.error('Failed to initialize TonConnect:', error);
    showTonStatus('Failed to initialize TonConnect: ' + error.message, 'error');
  }
}

function showTonConnected(address) {
  const statusDiv = document.getElementById('ton-status');
  const addressDiv = document.getElementById('ton-address');
  const connectBtn = document.getElementById('ton-connect-btn');
  
  statusDiv.style.display = 'block';
  statusDiv.className = 'status success';
  statusDiv.textContent = 'TON Wallet Connected!';
  
  addressDiv.style.display = 'block';
  addressDiv.innerHTML = '<strong>Connected Address:</strong><br>' + address;
  
  connectBtn.textContent = 'Disconnect TON Wallet';
}

function showTonDisconnected() {
  const statusDiv = document.getElementById('ton-status');
  const addressDiv = document.getElementById('ton-address');
  const connectBtn = document.getElementById('ton-connect-btn');
  
  statusDiv.style.display = 'none';
  addressDiv.style.display = 'none';
  connectBtn.textContent = 'Connect TON Wallet';
}

function showTonStatus(message, type) {
  const statusDiv = document.getElementById('ton-status');
  statusDiv.style.display = 'block';
  statusDiv.className = `status ${type}`;
  statusDiv.textContent = message;
}

// TON Connect button handler
document.getElementById('ton-connect-btn').addEventListener('click', async () => {
  try {
    if (tonConnector.wallet) {
      // Disconnect
      await tonConnector.disconnect();
      showTonDisconnected();
    } else {
      // Connect
      showTonStatus('Opening wallet connection...', 'info');
      const walletsList = await tonConnector.getWallets();
      
      if (walletsList.length === 0) {
        showTonStatus('No TON wallets found. Please install a TON wallet extension.', 'error');
        return;
      }
      
      // Connect to the first available wallet
      await tonConnector.connect(walletsList[0]);
    }
  } catch (error) {
    console.error('TON Connect error:', error);
    showTonStatus('Connection failed: ' + error.message, 'error');
  }
});

// Initialize TON Connect when page loads
window.addEventListener('load', () => {
  if (typeof TonConnectSDK !== 'undefined') {
    initTonConnect();
  } else {
    console.error('TonConnectSDK not loaded. Please check your internet connection or reload the page.');
    const statusDiv = document.getElementById('ton-status');
    if (statusDiv) {
      statusDiv.style.display = 'block';
      statusDiv.className = 'status error';
      statusDiv.textContent = 'Failed to load TON Connect SDK. Please check your internet connection and reload the page.';
    }
  }
});

// Bitcoin verification
document.getElementById('btc-verify-btn').addEventListener('click', async () => {
  const address = document.getElementById('btc-address').value.trim();
  const message = document.getElementById('btc-message').value.trim();
  const signature = document.getElementById('btc-signature').value.trim();
  const statusDiv = document.getElementById('btc-status');

  if (!address || !message || !signature) {
    statusDiv.style.display = 'block';
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Please fill in all fields';
    return;
  }

  try {
    statusDiv.style.display = 'block';
    statusDiv.className = 'status info';
    statusDiv.textContent = 'Verifying signature...';

    const result = await window.api.auth.btcVerify(address, message, signature);

    if (result.success) {
      statusDiv.className = 'status success';
      statusDiv.textContent = `✓ Signature Verified (${result.method} format)`;
    } else {
      statusDiv.className = 'status error';
      statusDiv.textContent = `✗ Verification Failed: ${result.error || 'Invalid signature'}`;
    }
  } catch (error) {
    statusDiv.style.display = 'block';
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Error: ' + error.message;
  }
});

// Payments - Generate Exchange Links
document.getElementById('generate-links-btn').addEventListener('click', async () => {
  const fromCoin = document.getElementById('from-coin').value;
  const amount = document.getElementById('amount').value.trim();
  const toAddress = document.getElementById('to-address').value.trim();
  const refundAddress = document.getElementById('refund-address').value.trim();

  if (!toAddress) {
    alert('Please enter a TON payout address');
    return;
  }

  try {
    const result = await window.api.payments.swapLinks(
      fromCoin,
      amount,
      'ton',
      toAddress,
      refundAddress
    );

    if (result.success && result.links) {
      const linksContainer = document.getElementById('links-container');
      linksContainer.innerHTML = '';

      result.links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = `Exchange via ${link.name}`;
        a.addEventListener('click', async (e) => {
          e.preventDefault();
          await window.api.payments.openExternal(link.url);
        });
        li.appendChild(a);
        linksContainer.appendChild(li);
      });

      document.getElementById('swap-links').style.display = 'block';
    } else {
      alert('Failed to generate links: ' + (result.error || 'Unknown error'));
    }
  } catch (error) {
    alert('Error generating links: ' + error.message);
  }
});

// Hide logo if image doesn't exist
document.getElementById('logo').addEventListener('error', function() {
  this.style.display = 'none';
});
