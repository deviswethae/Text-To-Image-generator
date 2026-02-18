import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import HistorySidebar from './HistorySidebar';

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate', { 
        prompt
      });
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setPrompt(item.text);
    setImageUrl(item.imageUrl);
  };

  return (
   
    <div className="generator-container">
         <HistorySidebar onSelectHistory={handleHistorySelect} />
      <div className="main-content">
        <div className="prompt-input-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={5}
          />
          
          <div className="action-buttons">
            <button 
              onClick={generateImage} 
              disabled={isLoading}
              className="generate-btn"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i> Generate Image
                </>
              )}
            </button>
            
            {imageUrl && (
              <a 
                href={imageUrl} 
                download={`generated-${Date.now()}.png`}
                className="download-btn"
              >
                <i className="fas fa-download"></i> Download
              </a>
            )}
          </div>
        </div>
        
        {imageUrl && (
          <div className="image-result">
            <img src={imageUrl} alt="Generated from prompt" />
          </div>
        )}
      </div>
      
      
    </div>
  );
};

export default ImageGeneration;