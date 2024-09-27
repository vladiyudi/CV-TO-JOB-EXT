import React from 'react';

const PdfToggle = ({ isPdf, onToggle }) => {
  return (
    <div className="flex items-center mb-4">
      <label htmlFor="pdf-toggle" className="mr-2">PDF Mode:</label>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          type="checkbox"
          name="pdf-toggle"
          id="pdf-toggle"
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          checked={isPdf}
          onChange={onToggle}
        />
        <label
          htmlFor="pdf-toggle"
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
        ></label>
      </div>
      <span className="text-sm">{isPdf ? 'On' : 'Off'}</span>
    </div>
  );
};

export default PdfToggle;