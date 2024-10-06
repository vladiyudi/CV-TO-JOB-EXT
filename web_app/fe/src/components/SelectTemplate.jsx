import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BorderBeam from "@/components/ui/shine-border";


export default function SelectTemplate({ onTemplateSelect, initialTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data);
      if (response.data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(response.data[0].name);
        onTemplateSelect(response.data[0].name);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.name);
    onTemplateSelect(template.name);
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Choose a Template</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 p-1">
        {templates.map((template, index) => (
          
          <div
            key={index}
            className={`flex-shrink-0 cursor-pointer transition-all duration-300`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className={`relative w-[335px] h-[465.5px] border border-gray-300 overflow-hidden p-[10px] ${
              selectedTemplate === template.name ? 'ring-4 ring-blue-500' : ''
            }`}>
              <iframe
                srcDoc={template.content}
                title={template.name}
                className="absolute top-[10px] left-[10px] w-[630px] h-[891px] pointer-events-none"
                style={{
                  transform: 'scale(0.5)',
                  transformOrigin: 'top left',
                }}
              />
              
            </div>
            <p className="mt-2 text-center">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
