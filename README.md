# CV Job Matcher

This project consists of a webapp and a Chrome extension that work together to help users match their CV to job descriptions from LinkedIn.

## Setup

### Webapp

1. Navigate to the `web_app` directory.
2. Install dependencies for both frontend and backend:
   ```
   cd be && npm install
   cd ../fe && npm install
   ```
3. Set up environment variables:
   - In `web_app/be/.env`, ensure all required variables are set:
     ```
     OPENAI_API_KEY=your_openai_api_key
     MONGODB_URI=your_mongodb_uri
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     SESSION_SECRET=your_session_secret
     FRONTEND_URL=http://localhost:5173
     CHROME_EXTENSION_ID=your_chrome_extension_id
     PORT=8080
     ```
   - In `web_app/fe/.env`, add your backend API URL:
     ```
     VITE_API_ENDPOINT=http://localhost:8080
     ```

4. Start the backend:
   ```
   cd be && npm start
   ```
5. Start the frontend:
   ```
   cd fe && npm run dev
   ```

### Chrome Extension

1. Navigate to the `chrome_extension` directory.
2. Update the `WEBAPP_URL` and `API_URL` in `popup.js` and `background.js` to match your actual webapp URLs:
   ```javascript
   const WEBAPP_URL = 'http://localhost:5173'; // Frontend URL
   const API_URL = 'http://localhost:8080'; // Backend URL
   ```
3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome_extension` folder
4. Copy the generated extension ID and update the `CHROME_EXTENSION_ID` in your `web_app/be/.env` file.

## Usage

1. Click on the extension icon in Chrome to open the popup.
2. Click "Login with Google" to authenticate.
3. Navigate to a LinkedIn job page.
4. Click "Capture Job Description" in the extension popup to scrape the job details.
5. Click "Match CV to Job" to open the webapp and automatically match your CV to the job description.
6. In the webapp, you can view and edit the matched CV, then generate a PDF.

## Troubleshooting

- If you encounter CORS issues, make sure your webapp's URL is correctly set in the Chrome extension files and that CORS is properly configured in your backend.
- If authentication fails, double-check your Google OAuth credentials and make sure they're correctly set in both the webapp and the Chrome extension.
- Ensure that the CHROME_EXTENSION_ID in the backend .env file matches the ID of your loaded Chrome extension.

For any other issues, please check the console logs in both the Chrome extension and the webapp for error messages.