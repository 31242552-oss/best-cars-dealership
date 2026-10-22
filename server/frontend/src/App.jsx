import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dealers from './components/Dealers';
import Dealer from './components/Dealer';
import PostReview from './components/PostReview';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('username');
    if (saved) {
      setUsername(saved);
    }
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header username={username} setUsername={setUsername} />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Dealers username={username} />} />
          <Route path="/dealers" element={<Dealers username={username} />} />
          <Route path="/register" element={<Register setUsername={setUsername} />} />
          <Route path="/login" element={<Login setUsername={setUsername} />} />
          <Route path="/dealer/:id" element={<Dealer username={username} />} />
          <Route path="/postreview/:id" element={<PostReview username={username} />} />
        </Routes>
      </main>

      <footer className="bg-dark text-secondary py-4 mt-auto border-top border-secondary-subtle">
        <div className="container text-center">
          <p className="mb-1 fw-bold text-white">Best Cars Dealership – Full Stack Capstone</p>
          <p className="small mb-2">&copy; 2026 Best Cars Inc. All rights reserved.</p>
          <div className="small">
            <a href="/" className="text-info text-decoration-none mx-2">Home</a> |
            <a href="/about" className="text-info text-decoration-none mx-2">About</a> |
            <a href="/contact" className="text-info text-decoration-none mx-2">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
