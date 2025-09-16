import React, { useState, useEffect, useCallback } from 'react';
import { faqService } from '../services/firebaseService';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAdmin } = useAuth();

  const categories = [
    { value: 'all', label: '전체', icon: '📋' },
    { value: 'connection', label: '연결/페어링', icon: '🔗' },
    { value: 'notification', label: '알림', icon: '🔔' },
    { value: 'features', label: '기능', icon: '⚙️' },
    { value: 'setup', label: '설정', icon: '🛠️' },
    { value: 'troubleshoot', label: '문제해결', icon: '🚨' }
  ];

  // Load FAQs from Firebase
  const loadFaqs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let faqData;
      if (selectedCategory === 'all') {
        faqData = await faqService.getAll();
      } else {
        faqData = await faqService.getByCategory(selectedCategory);
      }
      
      setFaqs(faqData);
      setFilteredFaqs(faqData);
    } catch (err) {
      console.error('Error loading FAQs:', err);
      setError('FAQ를 불러오는데 실패했습니다.');
      
      // Fallback to sample data if Firebase fails
      const sampleFaqs = [
        {
          id: 1,
          category: 'connection',
          question: '가민 워치에서 스마트폰 알림을 어떻게 받나요?',
          answer: '1. Garmin Connect 앱을 설치합니다.\n2. 앱에서 알림 설정으로 이동합니다.\n3. 원하는 앱들을 활성화합니다.\n4. 워치에서 알림을 허용합니다.',
          tags: ['연결', '설정', '알림'],
          isActive: true
        }
      ];
      setFaqs(sampleFaqs);
      setFilteredFaqs(sampleFaqs);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  useEffect(() => {
    let filtered = faqs;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredFaqs(filtered);
  }, [faqs, selectedCategory, searchTerm]);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">❓ 자주 묻는 질문</h1>
          <p className="page-subtitle">
            가민 워치 사용에 관한 자주 묻는 질문들
          </p>
        </div>
      </div>

      <div className="container">
        {/* Search and Filter Section */}
        <div className="card">
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <input
              type="text"
              placeholder="FAQ 검색... (예: 알림, 연결, 설정)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
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
        </div>

        {/* FAQ List */}
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {loading ? (
            <div className="card text-center">
              <h3>FAQ를 불러오는 중...</h3>
              <p>잠시만 기다려주세요.</p>
            </div>
          ) : error ? (
            <div className="card text-center" style={{ borderColor: '#ff6b35' }}>
              <h3 style={{ color: '#ff6b35' }}>오류가 발생했습니다</h3>
              <p>{error}</p>
              <button 
                onClick={loadFaqs} 
                className="btn btn-primary"
                style={{ marginTop: 'var(--spacing-md)' }}
              >
                다시 시도
              </button>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="card text-center">
              <h3>검색 결과가 없습니다</h3>
              <p>다른 키워드로 검색해보시거나 카테고리를 변경해보세요.</p>
            </div>
          ) : (
            filteredFaqs.map(faq => (
              <div key={faq.id} className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div 
                  onClick={() => toggleExpanded(faq.id)}
                  style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: expandedItems.has(faq.id) ? 'var(--spacing-md)' : '0'
                  }}
                >
                  <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>
                    {faq.question}
                  </h3>
                  <span style={{ 
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--text-secondary)',
                    transform: expandedItems.has(faq.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}>
                    ⌄
                  </span>
                </div>
                
                {expandedItems.has(faq.id) && (
                  <div className="fade-in">
                    <div style={{ 
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'var(--background-secondary)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--spacing-md)'
                    }}>
                      <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
                        {faq.answer}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                      {faq.tags.map(tag => (
                        <span 
                          key={tag}
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            backgroundColor: 'var(--secondary-color)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: '500'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Help Section */}
        <div className="chat-section" style={{ marginTop: 'var(--spacing-2xl)' }}>
          <div className="chat-header">
            <div className="chat-avatar">🤔</div>
            <div className="chat-user">FAQ 도움말</div>
          </div>
          <div className="chat-messages">
            <div className="chat-bubble">
              원하는 답변을 찾지 못하셨나요? 💭
            </div>
            <div className="chat-bubble">
              Q&A 섹션에서 새로운 질문을 올려보세요!
            </div>
            <div className="chat-bubble">
              커뮤니티가 도와드릴 거예요! 🤝
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;