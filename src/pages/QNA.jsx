import React, { useState, useEffect } from 'react';

function QNA() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample Q&A data - in real app, this would come from Firebase
  const sampleQuestions = [
    {
      id: 1,
      title: 'Forerunner 245와 카카오톡 연동 문제',
      question: '안녕하세요! Forerunner 245를 사용하고 있는데 카카오톡 알림이 간헐적으로만 와요. 설정은 다 맞게 한 것 같은데 왜 그럴까요?',
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
          content: 'Garmin Connect 앱의 알림 설정에서 카카오톡을 한 번 끄고 다시 켜보세요. 그리고 워치를 재부팅해보시면 해결될 거예요!',
          author: '테크헬퍼',
          date: '2024-01-16',
          likes: 7
        }
      ]
    },
    {
      id: 2,
      title: 'Venu 2에서 카카오톡 답장 기능 사용법',
      question: 'Venu 2에서 카카오톡 메시지에 답장을 보낼 수 있다고 하는데, 어떻게 설정하나요? 안드로이드 폰 사용 중입니다.',
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
      question: '아이폰 사용자인데 가민 워치로 카카오톡 알림을 받고 싶어요. 어떻게 설정해야 할까요?',
      author: '아이폰유저',
      date: '2024-01-13',
      category: 'setup',
      likes: 3,
      answers: [
        {
          id: 4,
          content: 'iOS 설정 > 알림 > 카카오톡에서 알림 허용을 켜고, Garmin Connect 앱에서도 카카오톡 알림을 활성화하세요. iOS는 안드로이드보다 제약이 좀 있어요.',
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

  useEffect(() => {
    setQuestions(sampleQuestions);
  }, []);

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (newQuestionTitle.trim() && newQuestion.trim()) {
      const newQ = {
        id: Date.now(),
        title: newQuestionTitle,
        question: newQuestion,
        author: '익명사용자',
        date: new Date().toISOString().split('T')[0],
        category: 'general',
        likes: 0,
        answers: []
      };
      setQuestions([newQ, ...questions]);
      setNewQuestionTitle('');
      setNewQuestion('');
      setShowForm(false);
    }
  };

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
            <button 
              onClick={() => setShowForm(!showForm)}
              className="btn btn-accent"
            >
              ✏️ 질문하기
            </button>
          </div>
        </div>

        {/* New Question Form */}
        {showForm && (
          <div className="card fade-in" style={{ border: '2px solid var(--accent-color)' }}>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: 'var(--spacing-md)' }}>
              ✏️ 새 질문 작성
            </h3>
            <form onSubmit={handleSubmitQuestion}>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
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
        )}

        {/* Questions List */}
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {filteredQuestions.length === 0 ? (
            <div className="card text-center">
              <h3>아직 질문이 없습니다</h3>
              <p>첫 번째 질문을 올려보세요!</p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <div key={question.id} className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
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
                    <span>👤 {question.author}</span>
                    <span>📅 {formatDate(question.date)}</span>
                  </div>
                </div>

                {/* Question Content */}
                <div className="chat-section" style={{ margin: 'var(--spacing-md) 0' }}>
                  <div className="chat-header">
                    <div className="chat-avatar">❓</div>
                    <div className="chat-user">{question.author}</div>
                  </div>
                  <div className="chat-messages">
                    <div className="chat-bubble user" style={{ marginLeft: 0, maxWidth: '100%' }}>
                      {question.question}
                    </div>
                  </div>
                </div>

                {/* Answers */}
                {question.answers.length > 0 && (
                  <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h4 style={{ 
                      color: 'var(--text-primary)', 
                      marginBottom: 'var(--spacing-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}>
                      💡 답변 ({question.answers.length}개)
                    </h4>
                    {question.answers.map(answer => (
                      <div key={answer.id} className="chat-section" style={{ margin: 'var(--spacing-sm) 0' }}>
                        <div className="chat-header">
                          <div className="chat-avatar">💬</div>
                          <div className="chat-user">{answer.author}</div>
                          <span style={{ 
                            fontSize: 'var(--font-size-xs)', 
                            color: 'var(--text-secondary)' 
                          }}>
                            {formatDate(answer.date)}
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
                    <span>👍 {question.likes}</span>
                    <span>💬 {question.answers.length}개 답변</span>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                    💬 답변하기
                  </button>
                </div>
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
    </div>
  );
}

export default QNA;