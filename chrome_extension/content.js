console.log('Content script loaded');

function scrapeJobDescription() {
  const possibleSelectors = [
    '.description__text',
    '.job-description',
    '#job-description',
    '[data-test="job-description"]',
    'div[class*="description"]',
    'div[id*="description"]',
    '.show-more-less-html__markup',
    '[data-testid="job-details"]',
    '.jobs-description__content',
    '.jobs-box__html-content',
    '.jobs-description-content__text'
  ];

  for (const selector of possibleSelectors) {
    console.log(`Trying selector: ${selector}`);
    const element = document.querySelector(selector);
    if (element) {
      console.log('Found job description element:', element);
      const text = element.innerText.trim();
      if (text.length > 100) {
        console.log('Found substantial job description');
        return text;
      } else {
        console.log('Found element but content too short, continuing search');
      }
    }
  }

  console.log('Could not find job description with any selector');
  return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === 'ping') {
    sendResponse({action: 'pong'});
  } else if (request.action === 'scrapeJobDescription') {
    try {
      const jobDescription = scrapeJobDescription();
      if (jobDescription) {
        sendResponse({success: true, jobDescription: jobDescription});
      } else {
        sendResponse({success: false, error: 'No job description found'});
      }
    } catch (error) {
      console.error('Error scraping job description:', error);
      sendResponse({success: false, error: 'Error scraping job description'});
    }
  }
  return true;
});