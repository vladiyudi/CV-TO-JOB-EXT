document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('loginButton');
  const captureButton = document.getElementById('captureButton');
  const matchButton = document.getElementById('matchButton');
  const loginSection = document.getElementById('loginSection');
  const actionSection = document.getElementById('actionSection');
  const statusDiv = document.getElementById('status');

  const WEBAPP_URL = 'http://localhost:5173'; // Frontend URL
  const API_URL = 'http://localhost:8080'; // Backend URL

  function updateUI(isLoggedIn) {
    loginSection.style.display = isLoggedIn ? 'none' : 'block';
    actionSection.style.display = isLoggedIn ? 'block' : 'none';
    statusDiv.textContent = '';
  }

  chrome.storage.local.get(['isLoggedIn'], function(result) {
    updateUI(result.isLoggedIn);
  });

  loginButton.addEventListener('click', function() {
    statusDiv.textContent = 'Initiating login process...';
    chrome.runtime.sendMessage({action: 'login'}, function(response) {
      if (response && response.success) {
        statusDiv.textContent = 'Login tab opened. Please complete the login process in the new tab.';
      } else {
        statusDiv.textContent = 'Failed to initiate login: ' + (response ? response.error : 'Unknown error');
      }
    });
  });

  captureButton.addEventListener('click', function() {
    statusDiv.textContent = 'Checking content script...';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      if (tab.url.startsWith('https://www.linkedin.com/jobs/')) {
        pingContentScript(tab, function(pong) {
          if (pong) {
            statusDiv.textContent = 'Content script ready. Capturing job description...';
            sendMessageToContentScript(tab);
          } else {
            statusDiv.textContent = 'Error: Content script not accessible. Please refresh the page and try again.';
          }
        });
      } else {
        statusDiv.textContent = 'Error: Please navigate to a LinkedIn job page before capturing.';
      }
    });
  });

  function pingContentScript(tab, callback) {
    chrome.tabs.sendMessage(tab.id, {action: 'ping'}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        callback(false);
      } else {
        callback(response && response.action === 'pong');
      }
    });
  }

  function sendMessageToContentScript(tab) {
    chrome.tabs.sendMessage(tab.id, {action: 'scrapeJobDescription'}, function(response) {
      if (chrome.runtime.lastError) {
        statusDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (response && response.success && response.jobDescription) {
        const firstTwoLines = response.jobDescription.split('\n').slice(0, 2).join('\n');
        statusDiv.textContent = 'Scraping complete: ' + firstTwoLines + '...';
        chrome.runtime.sendMessage({
          action: 'sendToWebapp',
          jobDescription: response.jobDescription
        }, function(sendResponse) {
          if (sendResponse && sendResponse.success) {
            statusDiv.textContent += '\nJob description sent to webapp successfully.';
          } else {
            statusDiv.textContent += '\nFailed to send job description to webapp: ' + (sendResponse ? sendResponse.error : 'Unknown error');
          }
        });
      } else {
        statusDiv.textContent = 'Failed to scrape job description: ' + (response ? response.error : 'Unknown error');
      }
    });
  }

  matchButton.addEventListener('click', function() {
    statusDiv.textContent = 'Redirecting to webapp for CV matching...';
    chrome.runtime.sendMessage({action: 'matchCV'}, function(response) {
      if (response && response.success) {
        window.close(); // Close the popup after redirecting
      } else {
        statusDiv.textContent = 'Failed to initiate CV matching: ' + (response ? response.error : 'Unknown error');
      }
    });
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "loginStatus") {
      if (request.status === "success") {
        chrome.storage.local.set({isLoggedIn: true}, function() {
          updateUI(true);
          statusDiv.textContent = 'Logged in successfully!';
        });
      } else {
        statusDiv.textContent = 'Login failed: ' + (request.error || 'Unknown error');
      }
    }
  });
});