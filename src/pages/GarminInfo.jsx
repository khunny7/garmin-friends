import React, { useState } from 'react';

function GarminInfo() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { value: 'all', label: '전체', icon: '📱' },
    { value: 'running', label: '러닝', icon: '🏃' },
    { value: 'fitness', label: '피트니스', icon: '💪' },
    { value: 'outdoor', label: '아웃도어', icon: '🏔️' },
    { value: 'golf', label: '골프', icon: '⛳' },
    { value: 'smart', label: '스마트워치', icon: '⌚' }
  ];

  const products = [
    {
      id: 1,
      name: 'Forerunner 965',
      category: 'running',
      image: '🏃‍♂️',
      price: '₩749,000',
      features: [
        '컬러 터치스크린 디스플레이',
        '내장 GPS 및 멀티 위성 시스템',
        '30가지 이상 스포츠 앱',
        '최대 23일 스마트워치 모드 배터리',
        '스마트 알림 지원',
        '음악 저장 및 재생'
      ],
      description: '진정한 러너를 위한 프리미엄 GPS 러닝 워치입니다. 고급 러닝 다이나믹스와 성능 모니터링을 제공합니다.',
      smartFeatures: [
        '메신저 알림',
        '미리 설정된 답장 전송 (Android)',
        '통화 알림',
        '캘린더 이벤트 알림'
      ]
    },
    {
      id: 2,
      name: 'Venu 3',
      category: 'smart',
      image: '⌚',
      price: '₩599,000',
      features: [
        '밝은 AMOLED 디스플레이',
        '음성 통화 기능',
        '휠체어 모드',
        '최대 14일 배터리 수명',
        '수면 점수 및 코칭',
        '30가지 이상 스포츠 앱'
      ],
      description: '건강과 라이프스타일을 위한 올인원 스마트워치입니다. 통화 기능과 건강 모니터링이 뛰어납니다.',
      smartFeatures: [
        '전체 메시지 확인',
        '음성 답장 (Android)',
        '이모티콘 답장',
        'SNS 알림 (인스타그램, 페이스북 등)'
      ]
    },
    {
      id: 3,
      name: 'fēnix 7X Sapphire Solar',
      category: 'outdoor',
      image: '🏔️',
      price: '₩1,199,000',
      features: [
        '멀티밴드 GPS',
        '사파이어 크리스탈 렌즈',
        '솔라 충전',
        '최대 28일 배터리 수명',
        '100m 방수',
        '토포 맵 사전 설치'
      ],
      description: '극한의 모험을 위한 프리미엄 멀티스포츠 GPS 워치입니다. 견고함과 성능을 모두 갖췄습니다.',
      smartFeatures: [
        '스마트 알림',
        '긴급상황 연락처 알림',
        '날씨 정보',
        '캘린더 동기화'
      ]
    },
    {
      id: 4,
      name: 'Vivoactive 5',
      category: 'fitness',
      image: '💪',
      price: '₩399,000',
      features: [
        '밝은 AMOLED 디스플레이',
        '30가지 이상 스포츠 모드',
        '안전 및 추적 기능',
        '최대 11일 배터리 수명',
        '휠체어 모드',
        'Body Battery 에너지 모니터링'
      ],
      description: '액티브한 라이프스타일을 위한 GPS 스마트워치입니다. 피트니스와 웰니스 기능이 균형있게 구성되어 있습니다.',
      smartFeatures: [
        '메시지 알림',
        '기본 답장 템플릿',
        '통화 거부/수락',
        '음악 조절'
      ]
    },
    {
      id: 5,
      name: 'Approach S70',
      category: 'golf',
      image: '⛳',
      price: '₩899,000',
      features: [
        '컬러 터치스크린',
        '전 세계 43,000개 골프 코스 맵',
        'Virtual Caddie',
        '그린 컨투어 라인',
        '샷 추적',
        '스마트 알림'
      ],
      description: '프리미엄 GPS 골프 워치로 코스에서의 모든 순간을 더욱 스마트하게 만들어줍니다.',
      smartFeatures: [
        '라운드 중 메시지 확인',
        '스코어 공유',
        '통화 알림',
        '일정 확인'
      ]
    },
    {
      id: 6,
      name: 'Lily 2 Active',
      category: 'smart',
      image: '🌸',
      price: '₩499,000',
      features: [
        '세련된 메탈 베젤',
        '패턴 렌즈',
        '여성 건강 추적',
        '최대 9일 배터리',
        '안전 추적 기능',
        '스마트 알림'
      ],
      description: '스타일과 건강을 모두 중시하는 여성을 위한 소형 스마트워치입니다.',
      smartFeatures: [
        '스마트 알림',
        '기본 답장 기능',
        '통화 알림',
        '일정 관리'
      ]
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">⌚ 가민 제품 정보</h1>
          <p className="page-subtitle">
            다양한 가민 제품과 스마트 기능을 알아보세요
          </p>
        </div>
      </div>

      <div className="container">
        {/* Category Filter */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>카테고리별 제품 보기</h3>
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

        {/* Products Grid */}
        <div className="grid grid-2" style={{ marginTop: 'var(--spacing-lg)' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="card" 
              style={{ cursor: 'pointer' }}
              onClick={() => openProductDetail(product)}
            >
              <div className="text-center" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-sm)' }}>
                  {product.image}
                </div>
                <h3 className="card-title">{product.name}</h3>
                <p style={{ 
                  color: 'var(--accent-color)', 
                  fontSize: 'var(--font-size-lg)', 
                  fontWeight: '600',
                  margin: '0'
                }}>
                  {product.price}
                </p>
              </div>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--spacing-md)',
                lineHeight: 1.5
              }}>
                {product.description}
              </p>
              
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  color: 'var(--primary-color)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  🔹 주요 기능 (3가지)
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  fontSize: 'var(--font-size-sm)'
                }}>
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index} style={{ 
                      padding: 'var(--spacing-xs) 0',
                      color: 'var(--text-secondary)'
                    }}>
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  marginBottom: 'var(--spacing-sm)',
                  background: 'var(--secondary-color)',
                  color: 'var(--text-primary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-block'
                }}>
                  📱 스마트 기능
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  fontSize: 'var(--font-size-sm)'
                }}>
                  {product.smartFeatures.slice(0, 2).map((feature, index) => (
                    <li key={index} style={{ 
                      padding: 'var(--spacing-xs) 0',
                      color: 'var(--text-secondary)'
                    }}>
                      💬 {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%' }}>
                자세히 보기 →
              </button>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-md)'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xl)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>
                  {selectedProduct.name}
                </h2>
                <button 
                  onClick={closeProductDetail}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 'var(--font-size-xl)',
                    cursor: 'pointer',
                    padding: 'var(--spacing-sm)'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div className="text-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-sm)' }}>
                  {selectedProduct.image}
                </div>
                <p style={{ 
                  color: 'var(--accent-color)', 
                  fontSize: 'var(--font-size-xl)', 
                  fontWeight: '700'
                }}>
                  {selectedProduct.price}
                </p>
              </div>
              
              <p style={{ 
                fontSize: 'var(--font-size-lg)',
                lineHeight: 1.6,
                marginBottom: 'var(--spacing-lg)'
              }}>
                {selectedProduct.description}
              </p>
              
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ color: 'var(--primary-color)' }}>🔹 전체 기능</h3>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 'var(--spacing-sm)'
                }}>
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index} style={{ 
                      padding: 'var(--spacing-sm)',
                      backgroundColor: 'var(--background-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="chat-section">
                <div className="chat-header">
                  <div className="chat-avatar">📱</div>
                  <div className="chat-user">스마트 기능 가이드</div>
                </div>
                <div className="chat-messages">
                  <div className="chat-bubble">
                    이 제품으로 사용할 수 있는 스마트 기능들이에요! 💬
                  </div>
                  {selectedProduct.smartFeatures.map((feature, index) => (
                    <div key={index} className="chat-bubble user">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="chat-section" style={{ marginTop: 'var(--spacing-2xl)' }}>
          <div className="chat-header">
            <div className="chat-avatar">💡</div>
            <div className="chat-user">구매 가이드</div>
          </div>
          <div className="chat-messages">
            <div className="chat-bubble">
              어떤 가민 워치를 선택해야 할지 고민이세요? 🤔
            </div>
            <div className="chat-bubble">
              • 러닝/마라톤: Forerunner 시리즈 추천<br/>
              • 일상/피트니스: Venu, Vivoactive 시리즈<br/>
              • 아웃도어: fēnix 시리즈<br/>
              • 골프: Approach 시리즈
            </div>
            <div className="chat-bubble">
              스마트 기능을 중요하게 생각한다면 Venu 3나 Forerunner 965를 추천해요! 📱⌚
            </div>
          </div>
        </div>

        {/* Comparison Guide */}
        <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: 'var(--spacing-md)' }}>
            📊 카테고리별 추천 제품
          </h3>
          <div className="grid grid-3">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🏃‍♂️</div>
              <h4>러닝 특화</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Forerunner 965<br/>
                고급 러닝 분석과 훈련 기능
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>⌚</div>
              <h4>스마트워치</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Venu 3<br/>
                최고의 스마트 기능
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🏔️</div>
              <h4>아웃도어</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                fēnix 7X<br/>
                극한 환경 대응 능력
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GarminInfo;