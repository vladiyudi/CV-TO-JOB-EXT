import React from 'react';

export const JobInput = ({ job, setJob }) => {
  return (
    <div className="input-container pb-9">
      <label htmlFor="job" className="input-label  rajdhani-regular">
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
      <div className="upload-button-container">
        {/* Placeholder div to maintain alignment with CVInput */}
      </div>
    </div>
  );
};