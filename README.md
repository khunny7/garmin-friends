# 🟡 Garmin Friends

가민과 카카오톡을 연결하는 정보 허브 웹사이트

## 📱 프로젝트 소개

Garmin Friends는 가민(Garmin) 제품 사용자들을 위한 종합 정보 사이트입니다. 카카오톡과의 연동 방법, 자주 묻는 질문, 커뮤니티 Q&A, 그리고 다양한 가민 제품 정보를 제공합니다.

### 🎯 주요 기능

- **🏠 홈**: 사이트 소개 및 주요 기능 안내
- **❓ FAQ**: 가민 제품과 카카오톡 연동 관련 자주 묻는 질문
- **💬 Q&A**: 사용자 커뮤니티 질문과 답변
- **⌚ 가민 정보**: 다양한 가민 제품의 상세 정보와 카카오톡 연동 기능

### 🎨 디자인 컨셉

- **카카오톡 디자인 언어**: 친숙한 카카오톡 UI/UX 패턴 적용
- **가민 브랜드 컬러**: 가민의 브랜드 아이덴티티 반영
- **채팅 스타일 인터페이스**: 카카오톡과 유사한 대화형 UI
- **모바일 퍼스트**: 반응형 디자인으로 모든 기기 지원

## 🛠️ 기술 스택

- **Frontend**: React 19 + Vite 7
- **Routing**: React Router DOM
- **Styling**: CSS3 with Custom Properties (CSS Variables)
- **Database**: Firebase Firestore (계획)
- **Hosting**: Firebase Hosting
- **Fonts**: Noto Sans KR

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── pages/           # 페이지 컴포넌트
│   ├── Home.jsx     # 홈 페이지
│   ├── FAQ.jsx      # FAQ 페이지
│   ├── QNA.jsx      # Q&A 페이지
│   └── GarminInfo.jsx # 가민 제품 정보 페이지
├── firebase.js      # Firebase 설정
├── App.jsx          # 메인 앱 컴포넌트
├── App.css          # 앱 스타일
├── index.css        # 글로벌 스타일
└── main.jsx         # 앱 진입점
```

## 🔥 Firebase 설정

### Hosting 배포

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (선택사항 - 이미 설정됨)
firebase init

# 빌드 후 배포
npm run build
firebase deploy
```

### Firestore 설정

1. Firebase Console에서 Firestore Database 생성
2. `src/firebase.js`에서 Firebase 설정 업데이트
3. Firestore 규칙 및 인덱스는 이미 설정됨 (`firestore.rules`, `firestore.indexes.json`)

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary (가민 블루)**: `#007CC0`
- **Secondary (카카오 옐로우)**: `#FFEB3B`  
- **Accent (가민 오렌지)**: `#FF6B35`
- **Chat Background**: `#B2DFDB`
- **Chat Bubble**: `#FEE500`

### 타이포그래피

- **폰트**: Noto Sans KR
- **크기**: 반응형 스케일 적용
- **무게**: 300, 400, 500, 700

### 컴포넌트

- **카드 스타일**: 둥근 모서리 + 그림자
- **버튼**: 3가지 스타일 (Primary, Secondary, Accent)
- **채팅 버블**: 카카오톡 스타일 메시지 버블
- **네비게이션**: 스티키 헤더 + 이모지 아이콘

## 📱 주요 페이지

### 🏠 홈 페이지
- 사이트 소개
- 주요 기능 카드
- 최신 업데이트
- 빠른 시작 가이드

### ❓ FAQ 페이지  
- 카테고리별 필터링
- 검색 기능
- 펼침/접힘 아코디언 스타일
- 태그 시스템

### 💬 Q&A 페이지
- 질문 작성/조회
- 카테고리별 분류
- 채팅 스타일 답변
- 좋아요 시스템

### ⌚ 가민 정보 페이지
- 제품 카테고리별 필터
- 상세 정보 모달
- 카카오톡 연동 기능 설명
- 구매 가이드

## 🔮 향후 계획

- [ ] Firebase Authentication 연동
- [ ] 실시간 Q&A 업데이트
- [ ] 사용자 프로필 시스템
- [ ] 좋아요/북마크 기능
- [ ] 댓글 시스템
- [ ] 관리자 패널
- [ ] 검색 기능 고도화
- [ ] PWA 지원
- [ ] 다크 모드 지원

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 만듭니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새 기능 추가'`)
4. 브랜치에 푸시합니다 (`git push origin feature/새기능`)
5. Pull Request를 만듭니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

- 이슈: [GitHub Issues](https://github.com/khunny7/garmin-friends/issues)
- 이메일: [프로젝트 관리자에게 문의]

---

**Garmin Friends** - 가민과 카카오톡을 연결하는 스마트한 방법 🟡⌚💬
