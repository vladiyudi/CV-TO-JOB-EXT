const WEBAPP_URL = 'http://localhost:5173'; // Frontend URL
const API_URL = 'http://localhost:8080'; // Backend URL

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
  chrome.runtime.sendMessage(message);
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
        // Send message to the webapp
        chrome.tabs.query({url: `${WEBAPP_URL}/*`}, function(tabs) {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'updateJobDescription',
              jobDescription: request.jobDescription
            });
          }
        });
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

  if (request.action === 'matchCV') {
    chrome.tabs.create({ url: `${WEBAPP_URL}?autoMatch=true` }, (tab) => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listen for messages from the webapp
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "loginApproved" || request.action === "loginComplete") {
      chrome.storage.local.set({ isLoggedIn: true }, function() {
        sendResponse({ success: true });
        sendMessageToPopup({ action: "loginStatus", status: "success" });
      });
    } else if (request.action === "logout") {
      chrome.storage.local.set({ isLoggedIn: false }, function() {
        sendResponse({ success: true });
        sendMessageToPopup({ action: "loginStatus", status: "loggedOut" });
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