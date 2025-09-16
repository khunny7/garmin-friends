import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService, faqService, qnaService } from '../services/firebaseService';
import ProtectedRoute from '../components/ProtectedRoute';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAdmin } = useAuth();

  // Load data based on active tab
  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [activeTab, isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'users': {
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
          break;
        }
        case 'faqs': {
          const faqsData = await faqService.getAll();
          setFaqs(faqsData);
          break;
        }
        case 'questions': {
          const questionsData = await qnaService.getQuestions();
          setQuestions(questionsData);
          break;
        }
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (uid, currentStatus) => {
    try {
      await userService.updateAdminStatus(uid, !currentStatus);
      await loadData(); // Reload users
      alert(`관리자 권한이 ${!currentStatus ? '부여' : '해제'}되었습니다.`);
    } catch (err) {
      console.error('Error updating admin status:', err);
      alert('관리자 권한 변경에 실패했습니다.');
    }
  };

  const handleDeleteFaq = async (docId) => {
    if (!confirm('이 FAQ를 삭제하시겠습니까?')) return;
    
    try {
      await faqService.delete(docId);
      await loadData(); // Reload FAQs
      alert('FAQ가 삭제되었습니다.');
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      alert('FAQ 삭제에 실패했습니다.');
    }
  };

  const tabs = [
    { id: 'users', label: '사용자 관리', icon: '👥' },
    { id: 'faqs', label: 'FAQ 관리', icon: '❓' },
    { id: 'questions', label: 'Q&A 관리', icon: '💬' }
  ];

  return (
    <ProtectedRoute adminOnly>
      <div className="page">
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">🛠️ 관리자 패널</h1>
            <p className="page-subtitle">
              사용자, FAQ, Q&A를 관리합니다
            </p>
          </div>
        </div>

        <div className="container">
          {/* Tab Navigation */}
          <div className="card">
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            {loading ? (
              <div className="card text-center">
                <h3>데이터를 불러오는 중...</h3>
              </div>
            ) : error ? (
              <div className="card text-center" style={{ borderColor: '#ff6b35' }}>
                <h3 style={{ color: '#ff6b35' }}>오류가 발생했습니다</h3>
                <p>{error}</p>
                <button onClick={loadData} className="btn btn-primary">
                  다시 시도
                </button>
              </div>
            ) : (
              <>
                {/* Users Management */}
                {activeTab === 'users' && (
                  <div className="card">
                    <h3>사용자 관리</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'var(--spacing-md)' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>사용자</th>
                            <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>이메일</th>
                            <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>가입일</th>
                            <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>관리자</th>
                            <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>액션</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.uid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: 'var(--spacing-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                  <img 
                                    src={user.photoURL} 
                                    alt={user.displayName}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                                  />
                                  {user.displayName}
                                </div>
                              </td>
                              <td style={{ padding: 'var(--spacing-sm)' }}>{user.email}</td>
                              <td style={{ padding: 'var(--spacing-sm)' }}>
                                {user.createdAt?.toDate?.()?.toLocaleDateString?.() || 'N/A'}
                              </td>
                              <td style={{ padding: 'var(--spacing-sm)' }}>
                                <span style={{
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  backgroundColor: user.isAdmin ? '#ff6b35' : '#e0e0e0',
                                  color: user.isAdmin ? 'white' : '#666',
                                  fontSize: '12px'
                                }}>
                                  {user.isAdmin ? '관리자' : '일반사용자'}
                                </span>
                              </td>
                              <td style={{ padding: 'var(--spacing-sm)' }}>
                                <button
                                  onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                                  className={`btn ${user.isAdmin ? 'btn-secondary' : 'btn-accent'}`}
                                  style={{ fontSize: '12px', padding: '4px 8px' }}
                                >
                                  {user.isAdmin ? '관리자 해제' : '관리자 권한 부여'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* FAQ Management */}
                {activeTab === 'faqs' && (
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                      <h3>FAQ 관리</h3>
                      <button className="btn btn-primary">+ 새 FAQ 추가</button>
                    </div>
                    {faqs.map(faq => (
                      <div key={faq.docId} className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h4>{faq.question}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                              카테고리: {faq.category} | ID: {faq.id}
                            </p>
                            <p style={{ marginTop: 'var(--spacing-sm)' }}>{faq.answer.substring(0, 100)}...</p>
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>
                              수정
                            </button>
                            <button 
                              onClick={() => handleDeleteFaq(faq.docId)}
                              className="btn btn-secondary" 
                              style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#ff6b35', color: 'white' }}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Questions Management */}
                {activeTab === 'questions' && (
                  <div className="card">
                    <h3>Q&A 관리</h3>
                    {questions.map(question => (
                      <div key={question.docId} className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h4>{question.title}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                              작성자: {question.authorName} | 카테고리: {question.category} | 
                              좋아요: {question.likes} | 답변: {question.answerCount}개
                            </p>
                            <p style={{ marginTop: 'var(--spacing-sm)' }}>{question.question.substring(0, 100)}...</p>
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>
                              보기
                            </button>
                            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#ff6b35', color: 'white' }}>
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AdminPanel;