import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CVInput } from './components/CVInput';
import { JobInput } from './components/JobInput';
import EditableCV from './components/EditableCV';
import Login from './components/Login';
import './styles.css';
import ShinyButton from "@/components/ui/shiny-button";
import Ripple from "@/components/ui/ripple";
import SelectTemplate from './components/SelectTemplate';
import ShowInfo from './components/assets/StepOneInfo';
import NextStepButton from './components/assets/NextStepButton';

axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`/api/user`);
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
  const cvJSON = useRef(null);
  const [cv, setCV] = useState('');
  const [job, setJob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [rewrittenCV, setRewrittenCV] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('cleanDesign');
  const editableCVRef = useRef(null);
  const selectTemplateRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (rewrittenCV) {
      editableCVRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rewrittenCV]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user`);
        if (response.data && response.data.selectedTemplate) {
          setSelectedTemplate(response.data.selectedTemplate);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchCVText();
    
    const params = new URLSearchParams(location.search);
    if (params.get('refreshJob') === 'true') {
      fetchJobDescription();
      // Remove the query parameter after fetching
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  const fetchJobDescription = async () => {
    setIsJobLoading(true);
    try {
      const response = await axios.get(`/api/job-description`);
      if (response.data.jobDescription) {
        setJob(response.data.jobDescription);
      }
    } catch (error) {
      console.error('Error fetching job description:', error);
    } finally {
      setIsJobLoading(false);
    }
  };

  const fetchCVText = async () => {
    try {
      const response = await axios.get(`/api/cv-text`);
      if (response.data.cvText) {
        setCV(response.data.cvText);
      }
    } catch (error) {
      console.error('Error fetching CV text:', error);
    }
  };

  const handleGenerateCvJob = async () => {
    selectTemplateRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsLoading(true);
    try {
      const response = await axios.post(`/matchJobCv`, { 
        cv, 
        job,
        templateName: selectedTemplate,
      
      });
      cvJSON.current = response.data.cvJSON;
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
     selectTemplateRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`/api/logout`);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleShowPDFPreview = async () => {
    try{
      
      const response = await axios.post(`/generatePdfPreview`, { cvJSON: cvJSON.current, templateName: selectedTemplate });
      setRewrittenCV(response.data.cvHTML);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    }
  }

  const handleCVChange = async (newCV) => {
    setCV(newCV);
    try {
      await axios.post(`/api/cv-text`, { cvText: newCV });
    } catch (error) {
      console.error('Error saving CV text:', error);
    }
  };

  const handleJobChange = async (newJob) => {
    setJob(newJob);
    try {
      await axios.post(`/api/job-description`, { jobDescription: newJob });
    } catch (error) {
      console.error('Error saving job description:', error);
    }
  };

  const handleTemplateSelect = async (templateName) => {
    setSelectedTemplate(templateName);
    try {
      await axios.post(`/api/selected-template`, { templateName });
    } catch (error) {
      console.error('Error saving selected template:', error);
    }
  };

  return (
    <div className="app-container">
      <Ripple/>
      <div className="header">
        <h1 className="app-title rajdhani-regular">Apply to a Dream Job in a steps:</h1>
        <ShinyButton onClick={handleLogout} className="rajdhani-light">Logout</ShinyButton>
      </div>
      <div className="input-container-wrapper">
        <CVInput cv={cv} setCV={handleCVChange} />
        <JobInput job={job} setJob={handleJobChange} isLoading={isJobLoading} />
      </div>
        <NextStepButton handleSubmit={ handleGenerateCvJob} isLoading={isLoading} text={'CV to Job'}/>
        <ShowInfo info={'Step 1: Match CV to Job description'}/>
      <div ref={selectTemplateRef}>
        <SelectTemplate onTemplateSelect={handleTemplateSelect} initialTemplate={selectedTemplate} />
      </div>
      <NextStepButton handleSubmit={ handleShowPDFPreview} isLoading={isLoading} text="Choose Template"/>
      <ShowInfo info={'Step 2: Choose template for new CV. Try as many as you want'}/>
      <div className="editable-cv-wrapper" ref={editableCVRef}>
        <h2 className="section-title rajdhani-regular">CV Editor (A4 Format)</h2>
        <EditableCV initialCV={rewrittenCV} selectedTemplate={selectedTemplate} />
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