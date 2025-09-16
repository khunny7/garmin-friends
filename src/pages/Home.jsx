import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page">
      {/* Hero Section */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">가민 커넥트 친구 만들기</h1>
          <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
            가민 커넥트 친구 만들기 카카오톡 오픈 채팅방을 위한 웹사이트 입니다. 자주 묻는 질문들, 질문과 답변, 가민 제품 정보 등을 위해 만들었습니다.
            그리고 가민 유저들끼리 서로 친구 등록을 할수 있도록 도와줍니다.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Welcome Chat Section */}
        <div className="chat-section fade-in">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div className="chat-user">Garmin Community</div>
          </div>
          <div className="chat-messages">
            <div className="chat-bubble">
              안녕하세요! 가민 커넥트 친구 만들기 커뮤니티에 오신 것을 환영합니다! 👋
            </div>
            <div className="chat-bubble">
              가민 제품 사용법, 운동 팁, 그리고 다른 가민 사용자들과의 소통을 원하시나요?
            </div>
            <div className="chat-bubble">
              아래 메뉴를 통해 커뮤니티에 참여하고 정보를 찾아보세요!
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-2" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Link to="/faq" className="feature-card">
            <span className="feature-icon">❓</span>
            <h3 className="feature-title">자주 묻는 질문</h3>
            <p className="feature-description">
              가민 제품 사용법과 커뮤니티 관련 자주 묻는 질문들을 모아놨어요.
              빠른 답변을 찾아보세요!
            </p>
          </Link>

          <Link to="/qna" className="feature-card">
            <span className="feature-icon">💬</span>
            <h3 className="feature-title">질문과 답변</h3>
            <p className="feature-description">
              가민 사용자들과 경험을 나누고 궁금한 점을 함께 해결해보세요.
              새로운 친구도 만들어보세요!
            </p>
          </Link>
        </div>

        <div className="grid grid-3">
          <Link to="/garmin" className="feature-card">
            <span className="feature-icon">⌚</span>
            <h3 className="feature-title">가민 제품 정보</h3>
            <p className="feature-description">
              다양한 가민 제품들의 기능과 특징을 자세히 알아보세요.
            </p>
          </Link>

          {/* <div className="feature-card">
            <span className="feature-icon">🏃‍♂️</span>
            <h3 className="feature-title">운동 팁 & 경험</h3>
            <p className="feature-description">
              가민과 함께하는 운동 팁과 다른 사용자들의 경험담을 공유합니다.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">�</span>
            <h3 className="feature-title">커뮤니티 모임</h3>
            <p className="feature-description">
              지역별 가민 사용자 모임과 함께 운동할 친구들을 찾아보세요.
            </p>
          </div> */}
        </div>

        {/* Latest Updates Section */}
        <div className="card" style={{ marginTop: 'var(--spacing-2xl)' }}>
          <div className="card-header">
            <h3 className="card-title">📢 커뮤니티 소식</h3>
          </div>
          <div className="grid grid-2">
            
            <div>
              <h4>🔧 사이트 개선</h4>
              <p>모바일 환경에서의 사용성이 개선되었고, 커뮤니티 검색 기능이 추가되었습니다.</p>
              <small style={{ color: 'var(--text-secondary)' }}>2024.01.10</small>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>빠른 시작</h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/faq" className="btn btn-primary">FAQ 보기</Link>
            <Link to="/qna" className="btn btn-secondary">질문하기</Link>
            <Link to="/garmin" className="btn btn-accent">제품 정보</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;