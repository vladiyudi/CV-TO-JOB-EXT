document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('loginButton');
  const captureButton = document.getElementById('captureButton');
  const matchButton = document.getElementById('matchButton');
  const menuButton = document.querySelector('.menu-button');
  const loginSection = document.getElementById('loginSection');
  const actionSection = document.getElementById('actionSection');
  const statusDiv = document.getElementById('status');
  const jobDescriptionTextarea = document.getElementById('jobDescription');
  const introText = document.querySelector('.intro-text');

  function updateUI(isLoggedIn) {
    loginSection.style.display = isLoggedIn ? 'none' : 'flex';
    actionSection.style.display = isLoggedIn ? 'flex' : 'none';
    statusDiv.textContent = '';
    jobDescriptionTextarea.value = '';
    updateButtonHighlight();
  }

  function updateButtonHighlight() {
    if (jobDescriptionTextarea.value.trim() === '') {
      captureButton.classList.add('highlighted');
      matchButton.classList.remove('highlighted');
    } else {
      captureButton.classList.remove('highlighted');
      matchButton.classList.add('highlighted');
    }
  }

  chrome.storage.local.get(['isLoggedIn'], function(result) {
    updateUI(result.isLoggedIn);
  });

  loginButton.addEventListener('click', function() {
    updateStatus('Initiating login process...', 'info');
    chrome.runtime.sendMessage({action: 'login'}, function(response) {
      if (response && response.success) {
        updateStatus('Login tab opened. Please complete the login process.', 'info');
      } else {
        updateStatus('Failed to initiate login. Please try again.', 'error');
      }
    });
  });

  captureButton.addEventListener('click', function() {
    updateStatus('Checking LinkedIn page...', 'info');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      if (tab.url.startsWith('https://www.linkedin.com/jobs/')) {
        pingContentScript(tab, function(pong) {
          if (pong) {
            updateStatus('Capturing job description...', 'info');
            sendMessageToContentScript(tab);
          } else {
            updateStatus('Please refresh the LinkedIn page and try again.', 'error');
          }
        });
      } else {
        updateStatus('Please navigate to a LinkedIn job page before capturing.', 'error');
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
        updateStatus(chrome.runtime.lastError.message, 'error');
        return;
      }
      if (response && response.success && response.jobDescription) {
        jobDescriptionTextarea.value = response.jobDescription;
        updateStatus('Job description captured successfully.', 'success');
        updateButtonHighlight();
        
        chrome.runtime.sendMessage({
          action: 'sendToWebapp',
          jobDescription: response.jobDescription
        }, function(sendResponse) {
          if (sendResponse && sendResponse.success) {
            updateStatus('Ready to tailor your CV!', 'success');
          } else {
            updateStatus('Failed to process job description. Please try again.', 'error');
          }
        });
      } else {
        updateStatus('Failed to capture job description. Please try again.', 'error');
      }
    });
  }

  matchButton.addEventListener('click', function() {
    updateStatus('Opening Super CV webapp...', 'info');
    chrome.runtime.sendMessage({action: 'openWebapp'}, function(response) {
      if (response && response.success) {
        window.close(); // Close the popup after redirecting
      } else {
        updateStatus('Failed to open Super CV webapp. Please try again.', 'error');
      }
    });
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "loginStatus") {
      if (request.status === "success") {
        chrome.storage.local.set({isLoggedIn: true}, function() {
          updateUI(true);
          updateStatus('Logged in successfully! You can now use Super CV.', 'success');
        });
      } else {
        updateStatus('Login failed. Please try again.', 'error');
      }
    }
  });

  function updateStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    introText.style.display = message ? 'none' : 'block';
  }

  jobDescriptionTextarea.addEventListener('input', updateButtonHighlight);
});