import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginButton from './LoginButton';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '20px'
      }}>
        <h2>로그인이 필요합니다</h2>
        <p>이 기능을 사용하려면 Google 계정으로 로그인해주세요.</p>
        <LoginButton />
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '20px'
      }}>
        <h2>접근 권한이 없습니다</h2>
        <p>관리자만 접근할 수 있는 페이지입니다.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;