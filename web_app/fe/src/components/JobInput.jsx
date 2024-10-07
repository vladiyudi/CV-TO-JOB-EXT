import React from 'react';
import ShinyButton from './ui/shiny-button';

export const JobInput = ({ job, setJob }) => {
  return (
    <div className="input-container ">
      <label htmlFor="job" className="input-label  rajdhani-regular flex justify-end">
        Job Description
      </label>
      <div className="input-wrapper">
        <textarea
          id="job"
          value={job}
          onChange={(e) => setJob(e.target.value)}
          placeholder="Caputre job description with Chrome Extension or enter it manually..."
          className="input-textarea rajdhani-light"
          required
        />
      </div>
      <div className="upload-button-container flex justify-end rajdhani-light">
        <ShinyButton>Chrome Extenstion</ShinyButton>  
      </div>
    </div>
  );
};