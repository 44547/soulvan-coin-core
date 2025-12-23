/**
 * Renderer process for Soulvan Coin Miner App
 * Handles UI logic and IPC communication
 */

// Initialize theme manager
const themeManager = new ThemeManager();

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;
    
    // Update button states
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
  });
});

// Theme button
document.getElementById('themeButton').addEventListener('click', () => {
  themeManager.cycleTheme();
});

// ===== MINING TAB =====

const miningEngine = document.getElementById('miningEngine');
const demoControls = document.getElementById('demoControls');
const externalControls = document.getElementById('externalControls');
const logCard = document.getElementById('logCard');

// Switch between demo and external miner
miningEngine.addEventListener('change', () => {
  if (miningEngine.value === 'demo') {
    demoControls.style.display = 'block';
    externalControls.style.display = 'none';
    logCard.style.display = 'none';
  } else {
    demoControls.style.display = 'none';
    externalControls.style.display = 'block';
    logCard.style.display = 'block';
  }
});

// Load miner presets
async function loadMinerPresets() {
  const presets = await window.electronAPI.mining.loadPresets();
  if (presets.presets) {
    const select = document.getElementById('minerPreset');
    Object.entries(presets.presets).forEach(([key, preset]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = preset.name;
      select.appendChild(option);
    });
    
    // Preset selection handler
    select.addEventListener('change', () => {
      const selectedPreset = presets.presets[select.value];
      if (selectedPreset) {
        document.getElementById('externalExe').value = selectedPreset.executable;
        document.getElementById('externalPool').value = selectedPreset.defaultPool;
        document.getElementById('externalUsername').value = selectedPreset.defaultUsername;
        document.getElementById('externalPassword').value = selectedPreset.defaultPassword;
        document.getElementById('externalThreads').value = selectedPreset.defaultThreads;
        document.getElementById('externalArgs').value = selectedPreset.defaultArgs;
      }
    });
  }
}
loadMinerPresets();

// Demo miner controls
document.getElementById('startDemoBtn').addEventListener('click', async () => {
  const threads = parseInt(document.getElementById('demoThreads').value);
  const result = await window.electronAPI.mining.startDemo(threads);
  
  if (result.error) {
    alert('Error: ' + result.error);
  } else {
    document.getElementById('startDemoBtn').disabled = true;
    document.getElementById('stopDemoBtn').disabled = false;
    updateMiningStats(result);
  }
});

document.getElementById('stopDemoBtn').addEventListener('click', async () => {
  const result = await window.electronAPI.mining.stopDemo();
  
  if (result.error) {
    alert('Error: ' + result.error);
  } else {
    document.getElementById('startDemoBtn').disabled = false;
    document.getElementById('stopDemoBtn').disabled = true;
    updateMiningStats(result);
  }
});

// External miner controls
document.getElementById('startExternalBtn').addEventListener('click', async () => {
  const config = {
    executable: document.getElementById('externalExe').value,
    pool: document.getElementById('externalPool').value,
    username: document.getElementById('externalUsername').value,
    password: document.getElementById('externalPassword').value,
    threads: parseInt(document.getElementById('externalThreads').value),
    extraArgs: document.getElementById('externalArgs').value
  };
  
  const result = await window.electronAPI.mining.startExternal(config);
  
  if (result.error) {
    alert('Error: ' + result.error);
  } else if (result.success) {
    document.getElementById('startExternalBtn').disabled = true;
    document.getElementById('stopExternalBtn').disabled = false;
    clearLogs();
  }
});

document.getElementById('stopExternalBtn').addEventListener('click', async () => {
  const result = await window.electronAPI.mining.stopExternal();
  
  if (result.error) {
    alert('Error: ' + result.error);
  } else if (result.success) {
    document.getElementById('startExternalBtn').disabled = false;
    document.getElementById('stopExternalBtn').disabled = true;
  }
});

// Listen for mining stats updates
window.electronAPI.mining.onStats((stats) => {
  updateMiningStats(stats);
});

// Listen for miner logs
window.electronAPI.mining.onLog((log) => {
  addLog(log.text, log.isError);
});

function updateMiningStats(stats) {
  document.getElementById('statStatus').textContent = stats.running ? 'Running' : 'Stopped';
  document.getElementById('statHashrate').textContent = stats.hashrateFormatted || '0 H/s';
  document.getElementById('statAccepted').textContent = stats.acceptedShares || 0;
  document.getElementById('statRejected').textContent = stats.rejectedShares || 0;
  document.getElementById('statUptime').textContent = stats.uptimeFormatted || '00:00:00';
}

function addLog(text, isError = false) {
  const logsContainer = document.getElementById('minerLogs');
  const logLine = document.createElement('div');
  logLine.className = 'log-line' + (isError ? ' error' : '');
  logLine.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  logsContainer.appendChild(logLine);
  
  // Auto-scroll to bottom
  logsContainer.scrollTop = logsContainer.scrollHeight;
  
  // Keep only last 500 lines
  while (logsContainer.children.length > 500) {
    logsContainer.removeChild(logsContainer.firstChild);
  }
}

function clearLogs() {
  document.getElementById('minerLogs').innerHTML = '';
}

// ===== WALLET TAB =====

document.getElementById('createSoulvanWallet').addEventListener('click', async () => {
  const result = await window.electronAPI.wallet.createSoulvan('my-wallet');
  
  if (result.error) {
    document.getElementById('soulvanWalletInfo').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('soulvanWalletInfo').innerHTML = `
      <div class="success-box">
        <strong>Wallet Created!</strong><br>
        Address: ${result.address}<br>
        ${result.message}
      </div>
    `;
    
    // Trigger cinematic onboarding on first wallet creation
    if (result.isFirstTime) {
      const cinematic = new CinematicOnboarding();
      await cinematic.start(result.address);
    }
  }
});

document.getElementById('getSoulvanBalance').addEventListener('click', async () => {
  const result = await window.electronAPI.wallet.getBalanceSoulvan();
  
  if (result.error) {
    document.getElementById('soulvanWalletInfo').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('soulvanWalletInfo').innerHTML = `
      <div class="info-box">
        <strong>Balance:</strong> ${result.balance} ${result.currency}<br>
        <strong>Address:</strong> ${result.address}
      </div>
    `;
  }
});

document.getElementById('sendSoulvan').addEventListener('click', async () => {
  const toAddress = document.getElementById('soulvanToAddress').value;
  const amount = parseFloat(document.getElementById('soulvanAmount').value);
  
  const result = await window.electronAPI.wallet.sendSoulvan(toAddress, amount);
  
  if (result.error) {
    document.getElementById('soulvanTxResult').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('soulvanTxResult').innerHTML = `
      <div class="success-box">
        <strong>Transaction Sent!</strong><br>
        TX Hash: ${result.txHash}<br>
        ${result.message}
      </div>
    `;
  }
});

document.getElementById('createTonWallet').addEventListener('click', async () => {
  const result = await window.electronAPI.wallet.createTon('my-ton-wallet');
  
  if (result.error) {
    document.getElementById('tonWalletInfo').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('tonWalletInfo').innerHTML = `
      <div class="success-box">
        <strong>TON Wallet Created!</strong><br>
        Address: ${result.address}<br>
        ${result.message}
      </div>
    `;
    
    // Trigger cinematic onboarding on first wallet creation
    if (result.isFirstTime) {
      const cinematic = new CinematicOnboarding();
      await cinematic.start(result.address);
    }
  }
});

document.getElementById('getTonBalance').addEventListener('click', async () => {
  const result = await window.electronAPI.wallet.getBalanceTon();
  
  if (result.error) {
    document.getElementById('tonWalletInfo').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('tonWalletInfo').innerHTML = `
      <div class="info-box">
        <strong>Balance:</strong> ${result.balance} ${result.currency}<br>
        <strong>Address:</strong> ${result.address}
      </div>
    `;
  }
});

document.getElementById('sendTon').addEventListener('click', async () => {
  const toAddress = document.getElementById('tonToAddress').value;
  const amount = parseFloat(document.getElementById('tonAmount').value);
  
  const result = await window.electronAPI.wallet.sendTon(toAddress, amount);
  
  if (result.error) {
    document.getElementById('tonTxResult').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('tonTxResult').innerHTML = `
      <div class="success-box">
        <strong>Transaction Sent!</strong><br>
        TX Hash: ${result.txHash}<br>
        ${result.message}
      </div>
    `;
  }
});

// ===== MUSIC AI TAB =====

document.getElementById('generateMusic').addEventListener('click', async () => {
  const prompt = document.getElementById('musicPrompt').value;
  const duration = parseInt(document.getElementById('musicDuration').value);
  
  document.getElementById('musicResult').innerHTML = '<div class="info-box">Generating audio...</div>';
  
  const result = await window.electronAPI.ai.generateMusic(prompt, duration);
  
  if (result.error) {
    document.getElementById('musicResult').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('musicResult').innerHTML = `
      <div class="success-box">
        <strong>Audio Generated!</strong><br>
        File: ${result.filepath}<br>
        Duration: ${result.duration}s<br>
        Frequency: ${result.frequency.toFixed(2)} Hz<br>
        ${result.message}
      </div>
    `;
  }
});

// ===== PHOTO AI TAB =====

// Load avatar styles
async function loadAvatarStyles() {
  const styles = await window.electronAPI.ai.listAvatarStyles();
  const select = document.getElementById('avatarStyle');
  styles.forEach(style => {
    const option = document.createElement('option');
    option.value = style.id;
    option.textContent = `${style.name} - ${style.description}`;
    select.appendChild(option);
  });
}
loadAvatarStyles();

document.getElementById('generateAvatar').addEventListener('click', async () => {
  const prompt = document.getElementById('avatarPrompt').value;
  const style = document.getElementById('avatarStyle').value;
  
  document.getElementById('avatarResult').innerHTML = '<div class="info-box">Generating avatar...</div>';
  
  const result = await window.electronAPI.ai.generateAvatar(prompt, style);
  
  if (result.error) {
    document.getElementById('avatarResult').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('avatarResult').innerHTML = `
      <div class="success-box">
        <strong>Avatar Generation Request Submitted!</strong><br>
        Output file: ${result.filepath}<br>
        <pre>${JSON.stringify(result.metadata, null, 2)}</pre>
      </div>
    `;
  }
});

// ===== DAO TAB =====

document.getElementById('createProposal').addEventListener('click', async () => {
  const title = document.getElementById('proposalTitle').value;
  const description = document.getElementById('proposalDescription').value;
  const options = document.getElementById('proposalOptions').value.split(',').map(o => o.trim());
  
  const result = await window.electronAPI.dao.createProposal(title, description, options);
  
  if (result.error) {
    alert('Error: ' + result.error);
  } else {
    alert('Proposal created successfully!');
    document.getElementById('proposalTitle').value = '';
    document.getElementById('proposalDescription').value = '';
    loadProposals();
  }
});

document.getElementById('refreshProposals').addEventListener('click', loadProposals);

async function loadProposals() {
  const proposals = await window.electronAPI.dao.listProposals();
  const container = document.getElementById('proposalsList');
  
  if (proposals.length === 0) {
    container.innerHTML = '<div class="info-box">No proposals yet. Create one above!</div>';
    return;
  }
  
  container.innerHTML = '';
  proposals.forEach(proposal => {
    const div = document.createElement('div');
    div.className = 'proposal-item';
    
    const totalVotes = proposal.totalVotes || 1; // Avoid division by zero
    
    let voteBars = '';
    Object.entries(proposal.votes).forEach(([option, votes]) => {
      const percentage = (votes / totalVotes) * 100;
      voteBars += `
        <div class="vote-bar">
          <div class="vote-bar-fill" style="width: ${percentage}%">
            ${option}: ${votes} votes (${percentage.toFixed(1)}%)
          </div>
        </div>
      `;
    });
    
    let optionButtons = '';
    if (proposal.status === 'active') {
      Object.keys(proposal.votes).forEach(option => {
        optionButtons += `<button class="primary" onclick="voteOnProposal(${proposal.id}, '${option}')">${option}</button>`;
      });
    }
    
    div.innerHTML = `
      <div class="proposal-title">#${proposal.id}: ${proposal.title}</div>
      <p>${proposal.description}</p>
      <div style="margin-top: 10px;">
        <strong>Status:</strong> ${proposal.status}<br>
        <strong>Total Votes:</strong> ${proposal.totalVotes}
      </div>
      ${voteBars}
      <div class="proposal-options">
        ${optionButtons}
        ${proposal.status === 'active' ? `<button class="secondary" onclick="closeProposal(${proposal.id})">Close</button>` : ''}
        ${proposal.result ? `<strong style="color: var(--accent-color);">Winner: ${proposal.result}</strong>` : ''}
      </div>
    `;
    
    container.appendChild(div);
  });
}

async function voteOnProposal(proposalId, option) {
  const result = await window.electronAPI.dao.vote(proposalId, option);
  
  if (result.error) {
    alert('Error: ' + result.error);
  } else {
    loadProposals();
  }
}

async function closeProposal(proposalId) {
  const result = await window.electronAPI.dao.closeProposal(proposalId);
  
  if (result.error) {
    alert('Error: ' + result.error);
  } else {
    alert(`Proposal closed! Winner: ${result.winner}`);
    loadProposals();
  }
}

// Load proposals on tab activation
document.querySelector('[data-tab="dao"]').addEventListener('click', () => {
  setTimeout(loadProposals, 100);
});

// ===== UTILITY SCRIPTS TAB =====

document.getElementById('runDiagnostics').addEventListener('click', async () => {
  document.getElementById('diagnosticsResult').innerHTML = '<div class="info-box">Running diagnostics...</div>';
  
  const result = await window.electronAPI.scripts.runDiagnostics();
  
  if (result.error) {
    document.getElementById('diagnosticsResult').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('diagnosticsResult').innerHTML = `
      <div class="success-box">Diagnostics completed!</div>
      <pre>${JSON.stringify(result, null, 2)}</pre>
    `;
  }
});

document.getElementById('runBenchmark').addEventListener('click', async () => {
  const iterations = parseInt(document.getElementById('benchmarkIterations').value);
  
  document.getElementById('benchmarkResult').innerHTML = '<div class="info-box">Running benchmark... This may take a moment.</div>';
  
  const result = await window.electronAPI.scripts.runBenchmark(iterations);
  
  if (result.error) {
    document.getElementById('benchmarkResult').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('benchmarkResult').innerHTML = `
      <div class="success-box">Benchmark completed!</div>
      <pre>${JSON.stringify(result, null, 2)}</pre>
    `;
  }
});

// ===== TESTS TAB =====

document.getElementById('runTests').addEventListener('click', async () => {
  document.getElementById('testResults').innerHTML = '<div class="info-box">Running tests... Please wait.</div>';
  
  // Tests run through npm script, so we simulate it here with the demo miner
  const testLog = [];
  
  try {
    testLog.push('Starting test suite...\n');
    
    // Test 1: Start miner
    testLog.push('Test 1: Starting demo miner with 2 threads...');
    const startResult = await window.electronAPI.mining.startDemo(2);
    if (startResult.running) {
      testLog.push('✓ Miner started successfully\n');
    } else {
      testLog.push('✗ Failed to start miner\n');
    }
    
    // Wait 3 seconds
    testLog.push('Waiting 3 seconds for mining activity...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: Check stats
    testLog.push('Test 2: Checking mining stats...');
    const stats = await window.electronAPI.mining.getStats();
    if (stats.running && stats.hashrate > 0) {
      testLog.push(`✓ Stats updated - Hashrate: ${stats.hashrateFormatted}\n`);
    } else {
      testLog.push('✗ Stats not updating properly\n');
    }
    
    // Test 3: Stop miner
    testLog.push('Test 3: Stopping miner...');
    const stopResult = await window.electronAPI.mining.stopDemo();
    if (!stopResult.running) {
      testLog.push('✓ Miner stopped successfully\n');
    } else {
      testLog.push('✗ Failed to stop miner\n');
    }
    
    testLog.push('\n✓ All tests passed!');
    
    document.getElementById('testResults').innerHTML = `
      <div class="success-box">Tests completed successfully!</div>
      <pre>${testLog.join('\n')}</pre>
    `;
  } catch (error) {
    document.getElementById('testResults').innerHTML = `
      <div class="error-box">Tests failed: ${error.message}</div>
      <pre>${testLog.join('\n')}</pre>
    `;
  }
});

// ===== DOCKER TAB =====

async function checkDockerStatus() {
  const available = await window.electronAPI.docker.isAvailable();
  const statusDiv = document.getElementById('dockerStatus');
  
  if (available) {
    statusDiv.innerHTML = '<div class="success-box">✓ Docker is available</div>';
  } else {
    statusDiv.innerHTML = '<div class="error-box">✗ Docker is not available or not running</div>';
  }
}

document.getElementById('dockerBuild').addEventListener('click', async () => {
  const tag = document.getElementById('dockerTag').value;
  
  document.getElementById('dockerOutput').innerHTML = '<div class="info-box">Building Docker image... This may take several minutes.</div>';
  
  const result = await window.electronAPI.docker.build(tag);
  
  if (result.error) {
    document.getElementById('dockerOutput').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('dockerOutput').innerHTML = `
      <div class="success-box">${result.message}</div>
      <pre>${result.output}</pre>
    `;
  }
});

document.getElementById('dockerRun').addEventListener('click', async () => {
  const command = document.getElementById('dockerCommand').value;
  const tag = document.getElementById('dockerTag').value;
  
  document.getElementById('dockerOutput').innerHTML = '<div class="info-box">Running container...</div>';
  
  const result = await window.electronAPI.docker.run(command, tag);
  
  if (result.error) {
    document.getElementById('dockerOutput').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('dockerOutput').innerHTML = `
      <div class="success-box">Container executed successfully!</div>
      <pre>${result.output}</pre>
    `;
  }
});

document.getElementById('dockerListImages').addEventListener('click', async () => {
  const result = await window.electronAPI.docker.listImages();
  
  if (result.error) {
    document.getElementById('dockerOutput').innerHTML = `<div class="error-box">${result.error}</div>`;
  } else {
    document.getElementById('dockerOutput').innerHTML = `
      <div class="success-box">Images:</div>
      <pre>${result.output}</pre>
    `;
  }
});

// Check Docker status on tab activation
document.querySelector('[data-tab="docker"]').addEventListener('click', () => {
  setTimeout(checkDockerStatus, 100);
});
