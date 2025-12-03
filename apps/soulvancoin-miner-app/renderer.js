window.addEventListener('DOMContentLoaded', () => {
  const versionElement = document.getElementById('version');
  const startButton = document.getElementById('startMining');
  
  if (versionElement) {
    versionElement.textContent = `Version: ${window.versions.app}`;
  }
  
  if (startButton) {
    startButton.addEventListener('click', () => {
      alert('Mining functionality coming soon!');
    });
  }
});
