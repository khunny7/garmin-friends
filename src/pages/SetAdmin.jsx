import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';

function SetAdmin() {
  const { user, userProfile } = useAuth();
  const [setting, setSetting] = useState(false);
  const [message, setMessage] = useState('');

  const setAdminStatus = async (isAdmin) => {
    if (!user) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      setSetting(true);
      setMessage('');
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { isAdmin }, { merge: true });
      
      setMessage(`성공적으로 관리자 권한을 ${isAdmin ? '부여' : '제거'}했습니다. 페이지를 새로고침하세요.`);
    } catch (error) {
      console.error('Error setting admin status:', error);
      setMessage('권한 설정에 실패했습니다: ' + error.message);
    } finally {
      setSetting(false);
    }
  };

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <h2>관리자 권한 설정</h2>
            <p>먼저 로그인해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h2>관리자 권한 설정</h2>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <p><strong>사용자:</strong> {user.email}</p>
            <p><strong>현재 상태:</strong> {userProfile?.isAdmin ? '관리자' : '일반 사용자'}</p>
          </div>
          
          {message && (
            <div style={{ 
              padding: 'var(--spacing-md)', 
              marginBottom: 'var(--spacing-lg)',
              backgroundColor: message.includes('성공') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${message.includes('성공') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: 'var(--radius-md)',
              color: message.includes('성공') ? '#155724' : '#721c24'
            }}>
              {message}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setAdminStatus(true)}
              disabled={setting}
            >
              {setting ? '설정 중...' : '관리자 권한 부여'}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setAdminStatus(false)}
              disabled={setting}
            >
              {setting ? '설정 중...' : '관리자 권한 제거'}
            </button>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            <p><strong>주의:</strong> 이 페이지는 개발/테스트 목적입니다. 권한 변경 후 페이지를 새로고침하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetAdmin;