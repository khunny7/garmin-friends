import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/firebaseService';

function ProfileSettings({ onClose }) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      setError('표시 이름을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await userService.updateProfile(user.uid, {
        displayName: displayName.trim()
      });
      
      // Update Firebase Auth profile
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(user, {
        displayName: displayName.trim()
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to update user data everywhere
      }, 1500);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <h2 style={{ 
          marginBottom: '1.5rem',
          color: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          👤 프로필 설정
        </h2>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem',
              marginBottom: '1rem' 
            }}>✅</div>
            <h3 style={{ color: 'var(--primary-color)' }}>
              프로필이 업데이트되었습니다!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              잠시 후 페이지가 새로고침됩니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                이메일
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  color: 'var(--text-secondary)'
                }}
              />
              <small style={{ 
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                이메일은 변경할 수 없습니다.
              </small>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                표시 이름 *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="다른 사용자에게 표시될 이름을 입력하세요"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
                maxLength={50}
              />
              <small style={{ 
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                질문과 답변에 이 이름이 표시됩니다.
              </small>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ 저장 중...' : '💾 저장'}
              </button>
            </div>
          </form>
        )}

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;