import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const HistorySidebar = ({ onSelectHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete('http://localhost:5000/api/history');
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="history-sidebar">
      <div className="sidebar-header">
        <h3>AI Image Generator</h3>
        <div className="sidebar-actions">
          <button onClick={fetchHistory} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
          </button>
          <button onClick={clearHistory} className="clear-btn">
            Clear
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : history.length === 0 ? (
        <div className="empty-history">No history yet</div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div 
              key={item._id} 
              className="history-item"
              onClick={() => onSelectHistory(item)}
            >
              <div className="history-prompt">{item.text}</div>
              <img 
                src={item.imageUrl} 
                alt={item.text} 
                className="history-thumbnail"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;