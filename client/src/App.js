import React from 'react';
import Navbar from './components/Navbar';
import ImageGeneration from './components/ImageGeneration';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <ImageGeneration />
    </div>
  );
}

export default App;