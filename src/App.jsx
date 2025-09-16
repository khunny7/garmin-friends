import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import QNA from './pages/QNA';
import GarminInfo from './pages/GarminInfo';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './components/UserProfile';
import LoginButton from './components/LoginButton';
import './App.css';

// Navigation component
function Navigation() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/faq', label: 'FAQ', icon: '❓' },
    { path: '/qna', label: 'Q&A', icon: '💬' },
    { path: '/garmin', label: '가민 정보', icon: '⌚' }
  ];

  // Add admin panel for admin users
  if (isAdmin) {
    navItems.push({ path: '/admin', label: '관리자', icon: '🛠️' });
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>🟡 가민 커넥트 친구 만들기</h2>
        <p>카카오톡 오픈 채팅방, 가민 커넥트 친구 만들기 웹사이트</p>
      </div>
      <ul className="nav-menu">
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
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
        </div>
        
        {/* User authentication section */}
        <div className="nav-auth">
          <AuthStatus />
        </div>
      </ul>
    </nav>
  );
}

// Authentication status component
function AuthStatus() {
  const { user } = useAuth();
  
  return user ? <UserProfile /> : <LoginButton />;
}

// Footer component
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 Garmin Friends. 가민 커뮤니티와 정보 허브</p>
        <p>Built with React + Vite • Hosted on Firebase</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/qna" element={<QNA />} />
              <Route path="/garmin" element={<GarminInfo />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
