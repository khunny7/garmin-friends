import React, { useState } from 'react';
import { faqService } from '../services/firebaseService';
import { useAuth } from '../hooks/useAuth';

function QNAToFAQConverter({ question, onClose, onSuccess }) {
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState(question.title || '');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState(question.category || 'troubleshoot');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FAQ categories
  const categories = [
    { value: 'connection', label: '연결/페어링', icon: '📱' },
    { value: 'notification', label: '알림', icon: '🔔' },
    { value: 'features', label: '기능', icon: '⚙️' },
    { value: 'troubleshoot', label: '문제해결', icon: '🔧' },
    { value: 'setup', label: '설정', icon: '🛠️' }
  ];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setFaqAnswer(answer.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      setError('질문과 답변을 모두 입력해주세요.');
      return;
    }

    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await faqService.convertFromQNA(
        { 
          ...question, 
          docId: question.docId || question.id,
          title: faqQuestion,
          category: faqCategory
        },
        selectedAnswer ? { ...selectedAnswer, content: faqAnswer } : { content: faqAnswer },
        user
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error converting to FAQ:', err);
      setError('FAQ 변환에 실패했습니다.');
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
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <h2 style={{
          marginBottom: '1.5rem',
          color: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📝➡️📚 FAQ로 변환하기
        </h2>

        <form onSubmit={handleSubmit}>
          {/* FAQ Question */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              FAQ 질문 *
            </label>
            <input
              type="text"
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
              placeholder="FAQ에 표시될 질문을 입력하세요"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          {/* Category Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              카테고리 *
            </label>
            <select
              value={faqCategory}
              onChange={(e) => setFaqCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Answer Selection */}
          {question.answers?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}>
                답변 선택 (선택사항)
              </label>
              <div style={{
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {question.answers.map(answer => (
                  <div
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      backgroundColor: selectedAnswer?.id === answer.id ? '#e3f2fd' : 'transparent'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <strong style={{ color: 'var(--primary-color)' }}>
                        {answer.authorName || answer.author}
                      </strong>
                      <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)'
                      }}>
                        👍 {answer.likes || 0}
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}>
                      {answer.content.length > 150 
                        ? `${answer.content.substring(0, 150)}...`
                        : answer.content}
                    </p>
                  </div>
                ))}
              </div>
              <small style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                답변을 선택하면 해당 내용이 FAQ 답변으로 사용됩니다.
              </small>
            </div>
          )}

          {/* FAQ Answer */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              FAQ 답변 *
            </label>
            <textarea
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              placeholder="FAQ에 표시될 답변을 입력하세요"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required
            />
            <small style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>
              위에서 답변을 선택했다면 자동으로 내용이 입력됩니다. 필요시 수정하세요.
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
              {loading ? '⏳ 변환 중...' : '📚 FAQ로 변환'}
            </button>
          </div>
        </form>

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

export default QNAToFAQConverter;