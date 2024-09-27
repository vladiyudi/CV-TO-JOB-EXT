import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditableCV = ({ initialCV, apiEndpoint }) => {
  const [editedCV, setEditedCV] = useState(initialCV);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 12pt;
                line-height: 1.15;
                margin: 0;
                padding: 20mm;
                width: 170mm;
                height: 257mm;
                box-sizing: border-box;
                overflow-y: auto;
              }
              @page {
                size: A4;
                margin: 0;
              }
              @media print {
                body {
                  width: 210mm;
                  height: 297mm;
                }
              }
            </style>
          </head>
          <body contenteditable="true">${editedCV}</body>
        </html>
      `);
      iframeDocument.close();
      
      iframeDocument.designMode = 'on';
    }
  }, [editedCV]);

  useEffect(() => {
    setEditedCV(initialCV);
  }, [initialCV]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedContent = iframeRef.current.contentDocument.body.innerHTML;
      setEditedCV(updatedContent);

      const response = await axios.post(
        `${apiEndpoint}/generatePdf`,
        { cvHTML: updatedContent },
        {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );

      if (response.headers['content-type'] === 'application/pdf') {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'generated_cv.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        alert('Your CV has been generated and downloaded as a PDF.');
      } else {
        alert('An error occurred while generating the PDF.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="editable-cv-container">
         <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="generate-pdf-button"
      >
        {isLoading ? 'Generating PDF...' : 'Generate PDF from Edited CV'}
      </button>
      <div className="cv-iframe-container">
        <iframe
          ref={iframeRef}
          title="CV Editor"
          className="cv-iframe"
        />
      </div>
   
    </div>
  );
};

export default EditableCV;