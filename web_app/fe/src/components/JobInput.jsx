import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import ShinyButton from './ui/shiny-button';

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const JobInput = ({ job, setJob }) => {
  const [localJob, setLocalJob] = useState(job);

  // Function to save job description to the server
  const saveJobDescription = async (description) => {
    try {
      await axios.post('/api/job-description', { jobDescription: description });
    } catch (error) {
      console.error('Error saving job description:', error);
    }
  };

  // Debounced version of saveJobDescription
  const debouncedSaveJobDescription = useCallback(
    debounce(saveJobDescription, 500),
    []
  );

  // Function to fetch job description from the server
  const fetchJobDescription = async () => {
    try {
      const response = await axios.get('/api/job-description');
      if (response.data.success) {
        setLocalJob(response.data.jobDescription);
        setJob(response.data.jobDescription);
      }
    } catch (error) {
      console.error('Error fetching job description:', error);
    }
  };

  // Fetch job description when component mounts
  useEffect(() => {
    fetchJobDescription();
  }, []);

  // Periodically fetch updates from the server
  useEffect(() => {
    const intervalId = setInterval(fetchJobDescription, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Updated onChange handler
  const handleJobChange = (e) => {
    const newValue = e.target.value;
    setLocalJob(newValue);
    setJob(newValue);
    debouncedSaveJobDescription(newValue);
  };

  return (
    <div className="input-container ">
      <label htmlFor="job" className="input-label  rajdhani-regular flex justify-end">
        Job Description
      </label>
      <div className="input-wrapper">
        <textarea
          id="job"
          value={localJob}
          onChange={handleJobChange}
          placeholder="Capture job description with Chrome Extension or enter it manually..."
          className="input-textarea rajdhani-light"
          required
        />
      </div>
      <div className="upload-button-container flex justify-end rajdhani-light">
        <ShinyButton onClick={() => window.open(`https://chromewebstore.google.com/detail/${import.meta.env.VITE_CHROME_EXTENSION_NAME}/${import.meta.env.VITE_CHROME_EXTENSION_ID}`)}>Chrome Extension</ShinyButton>  
      </div>
    </div>
  );
};