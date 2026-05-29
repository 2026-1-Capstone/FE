import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Upload from './components/Upload';
import Register from './components/Register';
import Generate from './components/Generate';
import Review from './components/Review';
import Download from './components/Download';


function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Routes>
          <Route path="/upload" element={<Upload />} />
          <Route path="/register" element={<Register />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/review" element={<Review />} />
          <Route path="/download" element={<Download />} />
          <Route path="*" element={<Upload />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
