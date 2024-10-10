// const WEBAPP_URL = 'http://localhost:8000'; 
// const API_URL = 'http://localhost:8080';

const WEBAPP_URL = 'https://supercv.online'; 
const API_URL = 'https://supercv.online';

function createLoginUrl(email, name, picture) {
  const url = new URL(`${WEBAPP_URL}/login`);
  url.searchParams.append('extensionLogin', 'true');
  url.searchParams.append('email', email);
  url.searchParams.append('name', name);
  if (picture) {
    url.searchParams.append('picture', picture);
  }
  return url.toString();
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message to popup:', chrome.runtime.lastError);
    }
  });
}

function findOrCreateWebappTab() {
  return new Promise((resolve) => {
    const url = new URL(WEBAPP_URL);
    url.searchParams.append('refreshJob', 'true');
    url.searchParams.append('timestamp', Date.now()); 

    chrome.tabs.query({url: `${WEBAPP_URL}/*`}, function(tabs) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        resolve({success: false, error: chrome.runtime.lastError.message});
        return;
      }
      if (tabs.length > 0) {
        // Webapp tab exists, update and focus it
        chrome.tabs.update(tabs[0].id, {active: true, url: url.toString()}, function(tab) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({success: false, error: chrome.runtime.lastError.message});
          } else {
            resolve({success: true, newTabCreated: false, tabId: tab.id});
          }
        });
      } else {
        // Webapp tab doesn't exist, create a new one
        chrome.tabs.create({url: url.toString()}, function(tab) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({success: false, error: chrome.runtime.lastError.message});
          } else {
            resolve({success: true, newTabCreated: true, tabId: tab.id});
          }
        });
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'login') {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        sendMessageToPopup({ action: "loginStatus", status: "error", error: chrome.runtime.lastError.message });
        return;
      }
      
      if (!token) {
        sendResponse({ success: false, error: 'Failed to obtain auth token' });
        sendMessageToPopup({ action: "loginStatus", status: "error", error: 'Failed to obtain auth token' });
        return;
      }

      // Fetch user info from Google
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(userInfo => {
        const loginUrl = createLoginUrl(userInfo.email, userInfo.name, userInfo.picture);
        chrome.tabs.create({ url: loginUrl }, (tab) => {
          sendResponse({ success: true });
        });
      })
      .catch(error => {
        console.error('Error during authentication:', error);
        sendResponse({ success: false, error: error.toString() });
        sendMessageToPopup({ action: "loginStatus", status: "error", error: error.toString() });
      });
    });
    return true; // Indicates we wish to send a response asynchronously
  }

  if (request.action === 'sendToWebapp') {
    fetch(`${API_URL}/api/job-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription: request.jobDescription }),
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: data.message || 'Failed to send job description to webapp' });
      }
    })
    .catch(error => {
      console.error('Error sending job description:', error);
      sendResponse({ success: false, error: error.toString() });
    });
    return true;
  }

  if (request.action === 'openWebapp') {
    findOrCreateWebappTab().then(result => {
      sendResponse(result);
    });
    return true;
  }
});

// Listen for messages from the webapp
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "loginApproved" || request.action === "loginComplete") {
      chrome.storage.local.set({ isLoggedIn: true }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error setting login status:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true });
          sendMessageToPopup({ action: "loginStatus", status: "success" });
        }
      });
    } else if (request.action === "logout") {
      chrome.storage.local.set({ isLoggedIn: false }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error setting logout status:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true });
          sendMessageToPopup({ action: "loginStatus", status: "loggedOut" });
        }
      });
    }
    return true;
  }
);

// Listen for changes to the user's login state
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.isLoggedIn) {
    if (changes.isLoggedIn.newValue) {
      console.log("User logged in");
    } else {
      console.log("User logged out");
    }
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https://www.linkedin.com/jobs/')) {
    chrome.tabs.sendMessage(tabId, { action: 'initContentScript' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending initContentScript message:', chrome.runtime.lastError);
        // Don't throw an error, just log it
      } else if (response && response.success) {
        console.log('Content script initialized successfully');
      }
    });
  }
});
