import React, { useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ShinyButton from "@/components/ui/shiny-button";

export const CVInput = ({ cv, setCV }) => {
  const fileInputRef = useRef(null);

  useEffect(() => {
    const workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url);
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc.toString();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        setCV(fullText.trim());
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  return (
    <div className="input-container">
      <label htmlFor="cv" className="input-label rajdhani-regular">
        CV Content
      </label>
    
      <div className="input-wrapper">
        <textarea
          id="cv"
          value={cv}
          onChange={(e) => setCV(e.target.value)}
          placeholder="Upload CV PDF or enter it manually..."
          className="input-textarea rajdhani-light"
          required
        />
      </div>
      <div className="upload-button-container">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <ShinyButton
          onClick={() => fileInputRef.current.click()}
          className="upload-button rajdhani-regular"
        >
          Upload PDF
        </ShinyButton>
      </div>
    </div>
  );
};