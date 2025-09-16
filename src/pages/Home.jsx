import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page">
      {/* Hero Section */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">🟡 Garmin Friends</h1>
          <p className="page-subtitle">
            카카오톡과 가민을 연결하는 정보 허브
          </p>
          <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
            가민 제품 정보, FAQ, 사용자 질문답변을 한 곳에서 만나보세요
          </p>
        </div>
      </div>

      <div className="container">
        {/* Welcome Chat Section */}
        <div className="chat-section fade-in">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div className="chat-user">Garmin Bot</div>
          </div>
          <div className="chat-messages">
            <div className="chat-bubble">
              안녕하세요! Garmin Friends에 오신 것을 환영합니다! 👋
            </div>
            <div className="chat-bubble">
              가민 제품에 대한 궁금한 점이나 카카오톡 연동 관련 정보를 찾고 계신가요?
            </div>
            <div className="chat-bubble">
              아래 메뉴를 통해 원하는 정보를 찾아보세요!
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-2" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Link to="/faq" className="feature-card">
            <span className="feature-icon">❓</span>
            <h3 className="feature-title">자주 묻는 질문</h3>
            <p className="feature-description">
              가민 제품과 카카오톡 연동에 대한 자주 묻는 질문들을 모아놨어요.
              빠른 답변을 찾아보세요!
            </p>
          </Link>

          <Link to="/qna" className="feature-card">
            <span className="feature-icon">💬</span>
            <h3 className="feature-title">질문과 답변</h3>
            <p className="feature-description">
              커뮤니티에서 나눈 실제 질문과 답변들을 확인하고,
              새로운 질문도 올려보세요!
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

          <div className="feature-card">
            <span className="feature-icon">🔗</span>
            <h3 className="feature-title">카카오톡 연동</h3>
            <p className="feature-description">
              가민 디바이스와 카카오톡을 연동하는 방법을 단계별로 설명합니다.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3 className="feature-title">모바일 앱</h3>
            <p className="feature-description">
              Garmin Connect 앱과 카카오톡의 효율적인 사용법을 안내합니다.
            </p>
          </div>
        </div>

        {/* Latest Updates Section */}
        <div className="card" style={{ marginTop: 'var(--spacing-2xl)' }}>
          <div className="card-header">
            <h3 className="card-title">📢 최신 업데이트</h3>
          </div>
          <div className="grid grid-2">
            <div>
              <h4>🆕 신규 FAQ 추가</h4>
              <p>가민 Forerunner 시리즈와 카카오톡 알림 설정 관련 FAQ가 추가되었습니다.</p>
              <small style={{ color: 'var(--text-secondary)' }}>2024.01.15</small>
            </div>
            <div>
              <h4>🔧 사이트 개선</h4>
              <p>모바일 환경에서의 사용성이 개선되었고, 검색 기능이 추가되었습니다.</p>
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