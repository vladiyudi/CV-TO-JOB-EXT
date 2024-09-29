import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  // const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  const apiEndpoint = 'https://supercvbackend-47779369171.europe-west3.run.app';



  useEffect(() => {
    // Check if this is a login attempt from the Chrome extension
    const urlParams = new URLSearchParams(window.location.search);
    const extensionLogin = urlParams.get('extensionLogin');
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const picture = urlParams.get('picture');

    if (extensionLogin === 'true' && email && name) {
      handleExtensionLogin(email, name, picture);
    }
  }, []);

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