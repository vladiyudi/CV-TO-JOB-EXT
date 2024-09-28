import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CVInput } from './components/CVInput';
import { JobInput } from './components/JobInput';
import EditableCV from './components/EditableCV';
import Login from './components/Login';
import './styles.css';

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
const EXTENSION_ID = import.meta.env.VITE_CHROME_EXTENSION_ID;

axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/api/user`);
        setIsAuthenticated(!!response.data);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const MainApp = () => {
  const [cv, setCV] = useState('');
  const [job, setJob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenCV, setRewrittenCV] = useState('');
  const editableCVRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (rewrittenCV) {
      editableCVRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rewrittenCV]);

  useEffect(() => {
    const fetchJobDescription = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/api/job-description`);
        if (response.data.jobDescription) {
          setJob(response.data.jobDescription);
        }
      } catch (error) {
        console.error('Error fetching job description:', error);
      }
    };

    const fetchCVText = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/api/cv-text`);
        if (response.data.cvText) {
          setCV(response.data.cvText);
        }
      } catch (error) {
        console.error('Error fetching CV text:', error);
      }
    };

    fetchJobDescription();
    fetchCVText();

    // Set up listener for Chrome extension messages
    if (chrome && chrome.runtime && chrome.runtime.onMessageExternal) {
      chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
        if (sender.id === EXTENSION_ID) {
          if (request.action === 'updateJobDescription') {
            handleJobChange(request.jobDescription);
            sendResponse({ success: true });
          } else if (request.action === 'matchCVToJob') {
            handleSubmit();
            sendResponse({ success: true });
          }
        }
      });
    }

    return () => {
      // Clean up listener if necessary
      if (chrome && chrome.runtime && chrome.runtime.onMessageExternal) {
        chrome.runtime.onMessageExternal.removeListener();
      }
    };
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiEndpoint}/matchJobCv`, { 
        cv, 
        job
      });
      console.log('response.data.rewrittenCV', response.data);
      setRewrittenCV(response.data.rewrittenCV);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${apiEndpoint}/api/logout`);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCVChange = async (newCV) => {
    setCV(newCV);
    try {
      await axios.post(`${apiEndpoint}/api/cv-text`, { cvText: newCV });
    } catch (error) {
      console.error('Error saving CV text:', error);
    }
  };

  const handleJobChange = async (newJob) => {
    setJob(newJob);
    try {
      await axios.post(`${apiEndpoint}/api/job-description`, { jobDescription: newJob });
    } catch (error) {
      console.error('Error saving job description:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="app-title">CV Job Matcher</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="button-container">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="match-button"
        >
          {isLoading ? 'Processing...' : 'Match CV to Job'}
        </button>
      </div>
      <div className="input-container-wrapper">
        <CVInput cv={cv} setCV={handleCVChange} />
        <JobInput job={job} setJob={handleJobChange} />
      </div>
      <div className="editable-cv-wrapper" ref={editableCVRef}>
        <h2 className="section-title">CV Editor (A4 Format)</h2>
        <EditableCV initialCV={rewrittenCV} apiEndpoint={apiEndpoint} />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;