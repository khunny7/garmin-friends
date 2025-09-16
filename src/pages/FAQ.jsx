import React, { useState, useEffect } from 'react';

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Sample FAQ data - in real app, this would come from Firebase
  const sampleFaqs = [
    {
      id: 1,
      category: 'connection',
      question: '가민 워치를 카카오톡과 어떻게 연결하나요?',
      answer: '1. Garmin Connect 앱을 설치합니다.\n2. 앱에서 알림 설정으로 이동합니다.\n3. 카카오톡을 활성화합니다.\n4. 워치에서 알림을 허용합니다.',
      tags: ['연결', '설정', '카카오톡']
    },
    {
      id: 2,
      category: 'notification',
      question: '카카오톡 알림이 워치에 오지 않아요',
      answer: '다음 사항을 확인해보세요:\n• 스마트폰의 카카오톡 알림이 켜져 있는지 확인\n• Garmin Connect 앱에서 카카오톡 알림이 활성화되어 있는지 확인\n• 워치와 스마트폰이 연결되어 있는지 확인\n• 방해금지 모드가 꺼져 있는지 확인',
      tags: ['알림', '문제해결', '연결']
    },
    {
      id: 3,
      category: 'features',
      question: '워치에서 카카오톡 메시지에 답장할 수 있나요?',
      answer: '일부 가민 워치 모델에서는 미리 설정된 답장을 보낼 수 있습니다. Venu 2, Forerunner 945, fēnix 7 시리즈 등에서 지원합니다. Android 휴대폰에서만 가능하며, iOS는 지원하지 않습니다.',
      tags: ['답장', '기능', '호환성']
    },
    {
      id: 4,
      category: 'setup',
      question: 'Garmin Connect 앱 설정 방법을 알려주세요',
      answer: '1. 앱스토어에서 Garmin Connect 다운로드\n2. 가민 계정 생성 또는 로그인\n3. 워치를 페어링 모드로 설정\n4. 앱에서 "디바이스 추가" 선택\n5. 화면 안내에 따라 페어링 완료\n6. 개인 정보 및 활동 목표 설정',
      tags: ['설정', '앱', '페어링']
    },
    {
      id: 5,
      category: 'troubleshoot',
      question: '워치가 계속 연결이 끊어져요',
      answer: '연결 문제 해결 방법:\n• 블루투스를 껐다 켜기\n• Garmin Connect 앱 재시작\n• 워치 재부팅 (전원 버튼 길게 누르기)\n• 앱에서 디바이스 제거 후 재연결\n• 스마트폰과 워치 거리 확인 (10m 이내 유지)',
      tags: ['연결', '문제해결', '블루투스']
    },
    {
      id: 6,
      category: 'features',
      question: '어떤 앱의 알림을 받을 수 있나요?',
      answer: '가민 워치에서 받을 수 있는 알림:\n• 카카오톡, 문자메시지\n• 전화\n• 이메일 (Gmail, 네이버 등)\n• SNS (인스타그램, 페이스북 등)\n• 캘린더\n• 기타 스마트폰 알림 설정된 앱들',
      tags: ['알림', '앱', '호환성']
    }
  ];

  const categories = [
    { value: 'all', label: '전체', icon: '📋' },
    { value: 'connection', label: '연결/페어링', icon: '🔗' },
    { value: 'notification', label: '알림', icon: '🔔' },
    { value: 'features', label: '기능', icon: '⚙️' },
    { value: 'setup', label: '설정', icon: '🛠️' },
    { value: 'troubleshoot', label: '문제해결', icon: '🚨' }
  ];

  useEffect(() => {
    // Simulate loading from Firebase
    setFaqs(sampleFaqs);
    setFilteredFaqs(sampleFaqs);
  }, []);

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
            가민과 카카오톡 관련 자주 묻는 질문들
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
          {filteredFaqs.length === 0 ? (
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