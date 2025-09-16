import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import QNA from './pages/QNA';
import GarminInfo from './pages/GarminInfo';
import './App.css';

// Navigation component
function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/faq', label: 'FAQ', icon: '❓' },
    { path: '/qna', label: 'Q&A', icon: '💬' },
    { path: '/garmin', label: '가민 정보', icon: '⌚' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>🟡 Garmin Friends</h2>
        <p>가민 × 카카오톡</p>
      </div>
      <ul className="nav-menu">
        {navItems.map(item => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 Garmin Friends. 카카오톡과 가민을 연결하는 정보 허브</p>
        <p>Built with React + Vite • Hosted on Firebase</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/qna" element={<QNA />} />
            <Route path="/garmin" element={<GarminInfo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
