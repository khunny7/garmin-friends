import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileSettings from './ProfileSettings';

function UserProfile() {
  const { user, logout, isAdmin } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="user-profile" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px'
    }}>
      <img 
        src={user.photoURL} 
        alt={user.displayName}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%'
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '500' }}>
          {user.displayName}
          {isAdmin && <span style={{ 
            marginLeft: '8px', 
            padding: '2px 6px', 
            backgroundColor: '#ff6b35', 
            color: 'white', 
            fontSize: '11px', 
            borderRadius: '10px' 
          }}>
            관리자
          </span>}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {user.email}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button 
          onClick={() => setShowSettings(true)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#e3f2fd',
            border: '1px solid var(--primary-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'var(--primary-color)'
          }}
        >
          ⚙️ 설정
        </button>
        <button 
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          로그아웃
        </button>
      </div>

      {showSettings && (
        <ProfileSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default UserProfile;