import React, { useState, useEffect, useCallback } from 'react';
import { qnaService } from '../services/firebaseService';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';
import QNAToFAQConverter from '../components/QNAToFAQConverter';

function QNA() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('troubleshoot');
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Answer functionality state
  const [showAnswerForm, setShowAnswerForm] = useState({});
  const [newAnswers, setNewAnswers] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState({});
  
  // QNA to FAQ conversion state
  const [showConverter, setShowConverter] = useState(null);

  const { user, isAdmin } = useAuth();

  // Sample Q&A data - in real app, this would come from Firebase
  const sampleQuestions = [
    {
      id: 1,
      title: 'Forerunner 245 알림 설정 문제',
      question: '안녕하세요! Forerunner 245를 사용하고 있는데 스마트폰 알림이 간헐적으로만 와요. 설정은 다 맞게 한 것 같은데 왜 그럴까요?',
      author: '러닝맨123',
      date: '2024-01-15',
      category: 'troubleshoot',
      likes: 5,
      answers: [
        {
          id: 1,
          content: '저도 같은 문제가 있었는데 배터리 절약 모드를 확인해보세요. 절약 모드가 켜져 있으면 알림이 제한될 수 있어요.',
          author: '가민러버',
          date: '2024-01-15',
          likes: 3
        },
        {
          id: 2,
          content: 'Garmin Connect 앱의 알림 설정에서 앱을 한 번 끄고 다시 켜보세요. 그리고 워치를 재부팅해보시면 해결될 거예요!',
          author: '테크헬퍼',
          date: '2024-01-16',
          likes: 7
        }
      ]
    },
    {
      id: 2,
      title: 'Venu 2에서 메시지 답장 기능 사용법',
      question: 'Venu 2에서 메시지에 답장을 보낼 수 있다고 하는데, 어떻게 설정하나요? 안드로이드 폰 사용 중입니다.',
      author: '스마트워치초보',
      date: '2024-01-14',
      category: 'features',
      likes: 8,
      answers: [
        {
          id: 3,
          content: 'Garmin Connect 앱 > 디바이스 설정 > 알림 및 앱 > 텍스트 답장에서 미리 답장 메시지를 설정할 수 있어요. 워치에서 알림을 받으면 답장 옵션이 나타납니다.',
          author: 'Venu사용자',
          date: '2024-01-14',
          likes: 12
        }
      ]
    },
    {
      id: 3,
      title: 'iOS에서 가민 워치 알림 설정',
      question: '아이폰 사용자인데 가민 워치로 메신저 알림을 받고 싶어요. 어떻게 설정해야 할까요?',
      author: '아이폰유저',
      date: '2024-01-13',
      category: 'setup',
      likes: 3,
      answers: [
        {
          id: 4,
          content: 'iOS 설정 > 알림에서 원하는 앱들의 알림 허용을 켜고, Garmin Connect 앱에서도 해당 앱 알림을 활성화하세요. iOS는 안드로이드보다 제약이 좀 있어요.',
          author: '가민iOS전문가',
          date: '2024-01-13',
          likes: 6
        }
      ]
    }
  ];

  const categories = [
    { value: 'all', label: '전체', icon: '📋' },
    { value: 'setup', label: '설정', icon: '🛠️' },
    { value: 'features', label: '기능', icon: '⚙️' },
    { value: 'troubleshoot', label: '문제해결', icon: '🚨' },
    { value: 'tips', label: '팁', icon: '💡' }
  ];

  // Load questions from Firebase
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const questionsData = await qnaService.getQuestions(selectedCategory);
      setQuestions(questionsData);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('질문을 불러오는데 실패했습니다.');
      
      // Fallback to sample data if Firebase fails
      const sampleQuestions = [
        {
          id: 1,
          title: 'Forerunner 245 알림 설정 문제',
          question: '안녕하세요! Forerunner 245를 사용하고 있는데 스마트폰 알림이 간헐적으로만 와요.',
          authorName: '러닝맨123',
          category: 'troubleshoot',
          likes: 5,
          answers: [],
          answerCount: 2,
          createdAt: { toDate: () => new Date('2024-01-15') }
        }
      ];
      setQuestions(sampleQuestions);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Submit new question
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (!newQuestionTitle.trim() || !newQuestion.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      
      const questionData = {
        title: newQuestionTitle.trim(),
        question: newQuestion.trim(),
        category: newQuestionCategory
      };

      await qnaService.createQuestion(questionData, user);
      
      // Reset form
      setNewQuestionTitle('');
      setNewQuestion('');
      setNewQuestionCategory('troubleshoot');
      setShowForm(false);
      
      // Reload questions
      await loadQuestions();
      
      alert('질문이 성공적으로 등록되었습니다!');
    } catch (err) {
      console.error('Error submitting question:', err);
      alert('질문 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle like on question
  const handleLikeQuestion = async (questionId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await qnaService.toggleLikeQuestion(questionId, user.uid);
      await loadQuestions(); // Reload to update like count
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId, questionAuthor) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // Check if user is author or admin
    const isAuthor = user.uid === questionAuthor;
    
    if (!isAuthor && !isAdmin) {
      alert('질문을 삭제할 권한이 없습니다.');
      return;
    }

    if (!confirm('정말로 이 질문을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await qnaService.deleteQuestion(questionId, user.uid, isAdmin);
      await loadQuestions(); // Reload to remove deleted question
      alert('질문이 삭제되었습니다.');
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('질문 삭제에 실패했습니다.');
    }
  };

  // Submit answer
  const handleSubmitAnswer = async (questionId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const answerContent = newAnswers[questionId]?.trim();
    if (!answerContent) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    // Create temp answer for optimistic update
    const tempAnswer = {
      id: `temp-${Date.now()}`,
      content: answerContent,
      author: user.uid,
      authorName: user.displayName || user.email || '익명 사용자',
      authorPhoto: user.photoURL,
      createdAt: { toDate: () => new Date() },
      likes: 0,
      likedBy: [],
      isActive: true
    };

    try {
      setSubmittingAnswer(prev => ({ ...prev, [questionId]: true }));
      
      // Optimistic update - add answer immediately to UI
      setQuestions(prevQuestions => 
        prevQuestions.map(q => {
          if ((q.docId || q.id) === questionId) {
            return {
              ...q,
              answers: [...(q.answers || []), tempAnswer],
              answerCount: (q.answerCount || 0) + 1
            };
          }
          return q;
        })
      );

      // Clear form immediately
      setNewAnswers(prev => ({ ...prev, [questionId]: '' }));
      setShowAnswerForm(prev => ({ ...prev, [questionId]: false }));
      
      // Actually submit to Firebase
      const answerId = await qnaService.createAnswer(questionId, {
        content: answerContent
      }, user);

      // Update the temporary answer with real ID from Firebase
      setQuestions(prevQuestions => 
        prevQuestions.map(q => {
          if ((q.docId || q.id) === questionId) {
            return {
              ...q,
              answers: q.answers.map(answer => 
                answer.id === tempAnswer.id 
                  ? { ...answer, id: answerId }
                  : answer
              )
            };
          }
          return q;
        })
      );
      
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('답변 등록에 실패했습니다.');
      
      // Rollback optimistic update on error
      setQuestions(prevQuestions => 
        prevQuestions.map(q => {
          if ((q.docId || q.id) === questionId) {
            return {
              ...q,
              answers: q.answers.filter(answer => answer.id !== tempAnswer.id),
              answerCount: Math.max((q.answerCount || 0) - 1, 0)
            };
          }
          return q;
        })
      );
    } finally {
      setSubmittingAnswer(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Toggle answer form
  const toggleAnswerForm = (questionId) => {
    setShowAnswerForm(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Handle FAQ conversion success
  const handleFAQConversionSuccess = () => {
    alert('✅ QNA가 FAQ로 성공적으로 변환되었습니다!');
    setShowConverter(null);
  };

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays}일 전`;
    return dateString;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">💬 질문과 답변</h1>
          <p className="page-subtitle">
            커뮤니티와 함께 문제를 해결해보세요
          </p>
        </div>
      </div>

      <div className="container">
        {/* Action Bar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`btn ${selectedCategory === category.value ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: 'var(--font-size-sm)' }}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              {/* Debug admin status */}
              {user && (
                <span style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  color: 'var(--text-secondary)',
                  background: isAdmin ? '#d4edda' : '#f8d7da',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  Admin: {isAdmin ? '✅' : '❌'}
                </span>
              )}
              <button 
                onClick={() => setShowForm(!showForm)}
                className="btn btn-accent"
              >
                ✏️ 질문하기
              </button>
            </div>
          </div>
        </div>

        {/* New Question Form */}
        {showForm && (
          <ProtectedRoute>
            <div className="card fade-in" style={{ border: '2px solid var(--accent-color)' }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: 'var(--spacing-md)' }}>
                ✏️ 새 질문 작성
              </h3>
              <form onSubmit={handleSubmitQuestion}>
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: 'var(--spacing-sm)'
                    }}
                  >
                    <option value="troubleshoot">문제해결</option>
                    <option value="features">기능</option>
                    <option value="setup">설정</option>
                    <option value="tips">팁</option>
                  </select>
                  <input
                    type="text"
                    placeholder="질문 제목을 입력하세요..."
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <textarea
                  placeholder="질문 내용을 자세히 적어주세요..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button type="submit" className="btn btn-primary">
                  📝 질문 등록
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
          </ProtectedRoute>
        )}

        {/* Questions List */}
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {loading ? (
            <div className="card text-center">
              <h3>질문을 불러오는 중...</h3>
              <p>잠시만 기다려주세요.</p>
            </div>
          ) : error ? (
            <div className="card text-center" style={{ borderColor: '#ff6b35' }}>
              <h3 style={{ color: '#ff6b35' }}>오류가 발생했습니다</h3>
              <p>{error}</p>
              <button 
                onClick={loadQuestions} 
                className="btn btn-primary"
                style={{ marginTop: 'var(--spacing-md)' }}
              >
                다시 시도
              </button>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="card text-center">
              <h3>아직 질문이 없습니다</h3>
              <p>첫 번째 질문을 올려보세요!</p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <div key={question.docId || question.id} className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                {/* Question Header */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h3 style={{ 
                    color: 'var(--primary-color)', 
                    marginBottom: 'var(--spacing-sm)' 
                  }}>
                    {question.title}
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    <span>👤 {question.authorName || question.author}</span>
                    <span>📅 {formatDate(question.createdAt?.toDate ? question.createdAt.toDate() : question.date)}</span>
                  </div>
                </div>

                {/* Question Content */}
                <div className="chat-section" style={{ margin: 'var(--spacing-md) 0' }}>
                  <div className="chat-header">
                    <div className="chat-avatar">❓</div>
                    <div className="chat-user">{question.authorName || question.author}</div>
                  </div>
                  <div className="chat-messages">
                    <div className="chat-bubble user" style={{ marginLeft: 0, maxWidth: '100%' }}>
                      {question.question}
                    </div>
                  </div>
                </div>

                {/* Like Button and Stats */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-md)', 
                  marginTop: 'var(--spacing-md)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: 'var(--spacing-md)'
                }}>
                  <button
                    onClick={() => handleLikeQuestion(question.docId || question.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: 'var(--font-size-sm)' }}
                    disabled={!user}
                  >
                    👍 좋아요 ({question.likes || 0})
                  </button>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    💬 답변 {question.answerCount || question.answers?.length || 0}개
                  </span>
                </div>

                {/* Answers */}
                {(question.answers?.length > 0 || question.answerCount > 0) && (
                  <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h4 style={{ 
                      color: 'var(--text-primary)', 
                      marginBottom: 'var(--spacing-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}>
                      💡 답변 ({question.answers?.length || 0}개)
                    </h4>
                    {question.answers?.map((answer, index) => (
                      <div key={answer.id || `answer-${index}`} className="chat-section" style={{ margin: 'var(--spacing-sm) 0' }}>
                        <div className="chat-header">
                          <div className="chat-avatar">💬</div>
                          <div className="chat-user">{answer.authorName || answer.author}</div>
                          <span style={{ 
                            fontSize: 'var(--font-size-xs)', 
                            color: 'var(--text-secondary)' 
                          }}>
                            {formatDate(answer.date || answer.createdAt?.toDate?.())}
                          </span>
                        </div>
                        <div className="chat-messages">
                          <div className="chat-bubble" style={{ maxWidth: '100%' }}>
                            {answer.content}
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end',
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--text-secondary)'
                        }}>
                          👍 {answer.likes}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Question Actions */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: 'var(--spacing-md)',
                  paddingTop: 'var(--spacing-md)',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)'
                  }}>
                    <button
                      onClick={() => handleLikeQuestion(question.docId || question.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      disabled={!user}
                    >
                      👍 {question.likes || 0}
                    </button>
                    <span>💬 {question.answers?.length || 0}개 답변</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button 
                      onClick={() => toggleAnswerForm(question.docId || question.id)}
                      className="btn btn-secondary" 
                      style={{ fontSize: 'var(--font-size-sm)' }}
                    >
                      💬 답변하기
                    </button>
                    {user && isAdmin && (
                      <button 
                        onClick={() => setShowConverter(question)}
                        className="btn btn-accent"
                        style={{ 
                          fontSize: 'var(--font-size-sm)',
                          backgroundColor: '#28a745',
                          borderColor: '#28a745',
                          color: 'white'
                        }}
                      >
                        📚 FAQ로 변환
                      </button>
                    )}
                    {user && (user.uid === question.author || isAdmin) && (
                      <button 
                        onClick={() => handleDeleteQuestion(question.docId || question.id, question.author)}
                        className="btn btn-outline"
                        style={{ 
                          fontSize: 'var(--font-size-sm)',
                          color: '#ff6b35',
                          borderColor: '#ff6b35'
                        }}
                      >
                        🗑️ 삭제
                      </button>
                    )}
                  </div>
                </div>

                {/* Answer Form */}
                {user && showAnswerForm[question.docId || question.id] && (
                  <ProtectedRoute>
                  <div style={{ 
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ 
                      marginBottom: 'var(--spacing-md)',
                      color: 'var(--primary-color)',
                      fontSize: 'var(--font-size-md)'
                    }}>
                      💬 답변 작성
                    </h4>
                    <textarea
                      value={newAnswers[question.docId || question.id] || ''}
                      onChange={(e) => setNewAnswers(prev => ({
                        ...prev,
                        [question.docId || question.id]: e.target.value
                      }))}
                      placeholder="도움이 되는 답변을 작성해주세요..."
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        marginBottom: 'var(--spacing-md)'
                      }}
                    />
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button
                        onClick={() => handleSubmitAnswer(question.docId || question.id)}
                        disabled={submittingAnswer[question.docId || question.id]}
                        className="btn btn-primary"
                        style={{ fontSize: 'var(--font-size-sm)' }}
                      >
                        {submittingAnswer[question.docId || question.id] ? '📤 등록 중...' : '📝 답변 등록'}
                      </button>
                      <button
                        onClick={() => toggleAnswerForm(question.docId || question.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: 'var(--font-size-sm)' }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                  </ProtectedRoute>
                )}
              </div>
            ))
          )}
        </div>

        {/* Community Guidelines */}
        <div className="chat-section" style={{ marginTop: 'var(--spacing-2xl)' }}>
          <div className="chat-header">
            <div className="chat-avatar">📝</div>
            <div className="chat-user">커뮤니티 가이드</div>
          </div>
          <div className="chat-messages">
            <div className="chat-bubble">
              질문할 때는 사용 중인 가민 모델과 스마트폰 기종을 함께 적어주세요! 📱⌚
            </div>
            <div className="chat-bubble">
              문제 상황을 구체적으로 설명해주시면 더 정확한 답변을 받을 수 있어요! 🎯
            </div>
            <div className="chat-bubble">
              다른 분들의 질문에도 답변해주시면 모두에게 도움이 됩니다! 🤝
            </div>
          </div>
        </div>
      </div>

      {/* QNA to FAQ Converter Modal */}
      {showConverter && (
        <QNAToFAQConverter
          question={showConverter}
          onClose={() => setShowConverter(null)}
          onSuccess={handleFAQConversionSuccess}
        />
      )}
    </div>
  );
}

export default QNA;