import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = ({ apiEndpoint }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);


  console.log('apiEndpoint', apiEndpoint);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if this is a login attempt from the Chrome extension
    const urlParams = new URLSearchParams(location.search);
    const extensionLogin = urlParams.get('extensionLogin');
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const picture = urlParams.get('picture');
    const authSuccess = urlParams.get('authSuccess');

    console.log('Login component mounted. authSuccess:', authSuccess);

    if (extensionLogin === 'true' && email && name) {
      handleExtensionLogin(email, name, picture);
    }

    if (authSuccess === 'true') {
      checkAuth();
    }
  }, [location]);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/api/user`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Auth check response:', response.data)
      console.log('Response headers:', response.headers);
      if (response.data) {
        console.log('User authenticated, navigating to main page');

        navigate('/');
      } else {
        console.log('Authentication failed');
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      console.error('Error response:', error.response);
      setError('Failed to check authentication status');
    }
  };

  const sendMessageToExtension = (message) => {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(import.meta.env.VITE_CHROME_EXTENSION_ID, message);
    }
  };

  const handleExtensionLogin = async (email, name, picture) => {
    try {
      const response = await axios.post(`${apiEndpoint}/api/auth/google`, {
        email,
        name,
        picture
      });
      if (response.data.success) {
        sendMessageToExtension({ action: "loginComplete", status: "success" });
        navigate('/');
      } else {
        console.error('Login failed:', response.data.message);
        sendMessageToExtension({ action: "loginComplete", status: "error", error: response.data.message });
      }
    } catch (error) {
      console.error('Error during login:', error);
      sendMessageToExtension({ action: "loginComplete", status: "error", error: error.message });
    }
  };

  const handleGoogleLogin = () => {
    console.log('Initiating Google login...');
    window.location.href = `${apiEndpoint}/auth/google`;
  };

  return (
    <div className="login-container">
      <h1>CV Job Matcher</h1>
      <h2>Login</h2>
      <img 
        src="/googleLogin.png" 
        alt="Login with Google"
        onClick={handleGoogleLogin} 
        className="google-login-button"
      />
    </div>
  );
};

export default Login;