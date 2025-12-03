// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;
    
    // Update active button
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Mining Tab Logic
let miners = {};

// Load available miners on startup
async function loadMiners() {
  try {
    miners = await window.electronAPI.getMiners();
    const minerSelect = document.getElementById('minerType');
    
    Object.keys(miners).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = `${miners[key].name} - ${miners[key].description}`;
      minerSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load miners:', error);
    addLog(`Error loading miners: ${error.message}`, 'stderr');
  }
}

// Start mining
document.getElementById('startMining').addEventListener('click', async () => {
  const config = {
    minerType: document.getElementById('minerType').value,
    executablePath: document.getElementById('executablePath').value,
    algorithm: document.getElementById('algorithm').value,
    pool: document.getElementById('pool').value,
    wallet: document.getElementById('wallet').value,
    workerName: document.getElementById('workerName').value,
    threads: document.getElementById('threads').value
  };

  if (!config.minerType) {
    alert('Please select a miner type');
    return;
  }

  if (!config.executablePath) {
    alert('Please provide the executable path');
    return;
  }

  try {
    const result = await window.electronAPI.startMining(config);
    
    if (result.success) {
      document.getElementById('startMining').disabled = true;
      document.getElementById('stopMining').disabled = false;
      addLog('Mining started...', 'stdout');
    } else {
      alert(`Failed to start mining: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Stop mining
document.getElementById('stopMining').addEventListener('click', async () => {
  try {
    const result = await window.electronAPI.stopMining();
    
    if (result.success) {
      document.getElementById('startMining').disabled = false;
      document.getElementById('stopMining').disabled = true;
      addLog('Mining stopped', 'stdout');
    } else {
      alert(`Failed to stop mining: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Add log entry
function addLog(message, type = 'stdout') {
  const logContainer = document.getElementById('logContainer');
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  
  const timestamp = new Date().toLocaleTimeString();
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  logContainer.appendChild(logEntry);
  logContainer.scrollTop = logContainer.scrollHeight;
  
  // Keep only last 500 entries
  while (logContainer.children.length > 500) {
    logContainer.removeChild(logContainer.firstChild);
  }
}

// Update stats display
function updateStats(stats) {
  document.getElementById('hashrate').textContent = `${stats.hashrate.toFixed(2)} ${stats.unit}`;
  document.getElementById('accepted').textContent = stats.accepted;
  document.getElementById('rejected').textContent = stats.rejected;
  
  const hours = Math.floor(stats.uptime / 3600);
  const minutes = Math.floor((stats.uptime % 3600) / 60);
  const seconds = stats.uptime % 60;
  document.getElementById('uptime').textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// Listen to miner events
window.electronAPI.onMinerStart((data) => {
  addLog(`Miner started: ${data.miner} (${data.algorithm})`, 'stdout');
});

window.electronAPI.onMinerLog((data) => {
  addLog(data.line, data.type);
});

window.electronAPI.onMinerStats((data) => {
  updateStats(data);
});

window.electronAPI.onMinerExit((data) => {
  addLog(`Miner exited with code ${data.code}`, 'stderr');
  document.getElementById('startMining').disabled = false;
  document.getElementById('stopMining').disabled = true;
});

window.electronAPI.onMinerError((data) => {
  addLog(`Error: ${data.error}`, 'stderr');
});

// Music AI Tab Logic
document.getElementById('generateMusic').addEventListener('click', async () => {
  const duration = parseInt(document.getElementById('musicDuration').value);
  const frequency = parseInt(document.getElementById('musicFrequency').value);
  
  try {
    const result = await window.electronAPI.generateMusic({
      duration,
      frequency
    });
    
    if (result.success) {
      // Show preview
      const previewContainer = document.getElementById('musicPreview');
      const musicPlayer = document.getElementById('musicPlayer');
      const musicInfo = document.getElementById('musicInfo');
      
      musicPlayer.src = `file://${result.filePath}`;
      musicInfo.innerHTML = `
        <strong>Generated Successfully!</strong><br>
        File: ${result.filePath}<br>
        Duration: ${result.duration}s<br>
        Frequency: ${result.frequency}Hz<br>
        Sample Rate: ${result.sampleRate}Hz
      `;
      
      previewContainer.style.display = 'block';
    } else {
      alert(`Failed to generate music: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Photo AI Tab Logic
let selectedPhotoPath = null;

// Load photo styles
async function loadPhotoStyles() {
  try {
    const result = await window.electronAPI.getPhotoStyles();
    
    if (result.success) {
      const styleSelect = document.getElementById('photoStyle');
      styleSelect.innerHTML = '';
      
      result.styles.forEach(style => {
        const option = document.createElement('option');
        option.value = style;
        option.textContent = style.charAt(0).toUpperCase() + style.slice(1);
        styleSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Failed to load photo styles:', error);
  }
}

// Select photo
document.getElementById('selectPhoto').addEventListener('click', async () => {
  try {
    const result = await window.electronAPI.openFileDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] }
      ]
    });
    
    if (result.success && result.filePaths.length > 0) {
      selectedPhotoPath = result.filePaths[0];
      document.getElementById('processPhoto').disabled = false;
      
      // Show original preview
      const originalPhoto = document.getElementById('originalPhoto');
      originalPhoto.src = `file://${selectedPhotoPath}`;
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Process photo
document.getElementById('processPhoto').addEventListener('click', async () => {
  if (!selectedPhotoPath) {
    alert('Please select a photo first');
    return;
  }
  
  const style = document.getElementById('photoStyle').value;
  
  try {
    const result = await window.electronAPI.processPhoto(selectedPhotoPath, {
      style
    });
    
    if (result.success) {
      // Show preview
      const previewContainer = document.getElementById('photoPreview');
      const processedPhoto = document.getElementById('processedPhoto');
      const photoInfo = document.getElementById('photoInfo');
      
      processedPhoto.src = `file://${result.outputPath}`;
      photoInfo.innerHTML = `
        <strong>${result.message}</strong><br>
        Input: ${result.inputPath}<br>
        Output: ${result.outputPath}<br>
        Style: ${result.style}
      `;
      
      previewContainer.style.display = 'block';
    } else {
      alert(`Failed to process photo: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  loadMiners();
  loadPhotoStyles();
});
