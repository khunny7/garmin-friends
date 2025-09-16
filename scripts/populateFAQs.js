import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration - make sure this matches your main firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyA-9knkYwOfGjjZhJZV5NCvN5eafBf9_Wo",
  authDomain: "garmin-friends.firebaseapp.com",
  projectId: "garmin-friends",
  storageBucket: "garmin-friends.firebasestorage.app",
  messagingSenderId: "379717147009",
  appId: "1:379717147009:web:090359a228ca41f7d67080"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FAQ data for general Garmin community
const faqsFromChats = [
  {
    id: 1,
    category: 'connection',
    question: '가민 워치를 스마트폰과 처음 연결하는 방법이 궁금해요',
    answer: '1. 스마트폰에서 Garmin Connect 앱을 다운로드하세요\n2. 가민 계정을 생성하거나 기존 계정으로 로그인하세요\n3. 워치의 전원을 켜고 언어를 설정하세요\n4. 앱에서 "디바이스 추가"를 선택하세요\n5. 워치 모델을 선택하고 화면의 지시를 따르세요\n6. 블루투스 페어링을 완료하세요',
    tags: ['연결', '페어링', '처음설정', '블루투스']
  },
  {
    id: 2,
    category: 'notification',
    question: '메신저 알림이 워치에 오지 않아요',
    answer: '다음 사항들을 확인해보세요:\n\n📱 스마트폰 설정:\n• 해당 앱의 알림이 켜져 있는지 확인\n• 방해금지 모드가 꺼져 있는지 확인\n\n⌚ Garmin Connect 앱:\n• 알림 및 앱 설정 → 해당 앱 활성화\n• 스마트 알림이 켜져 있는지 확인\n\n🔄 재시작:\n• 워치와 스마트폰 모두 재시작\n• Garmin Connect 앱 재시작',
    tags: ['알림', '메신저', '문제해결', '설정']
  },
  {
    id: 3,
    category: 'features',
    question: '워치에서 메시지에 답장할 수 있나요?',
    answer: '네, 일부 가민 워치에서 가능합니다!\n\n✅ 지원 모델:\n• Venu 2 시리즈\n• Forerunner 945/955\n• fēnix 7 시리즈\n• Epix Gen 2\n\n📱 요구사항:\n• Android 스마트폰만 지원 (iOS 불가)\n• Garmin Connect 앱 최신 버전\n\n⚙️ 설정방법:\n1. Garmin Connect → 디바이스 설정\n2. 알림 및 앱 → 텍스트 답장\n3. 미리 설정된 답장 메시지 추가',
    tags: ['답장', '기능', 'Android', '호환성']
  },
  {
    id: 4,
    category: 'troubleshoot',
    question: '워치가 자꾸 연결이 끊어져요',
    answer: '연결 문제 해결 단계:\n\n🔄 기본 해결:\n1. 블루투스를 껐다가 다시 켜기\n2. Garmin Connect 앱 완전히 종료 후 재시작\n3. 워치 재부팅 (전원 버튼 15초 길게 누르기)\n\n📏 거리 확인:\n• 워치와 스마트폰 거리 10m 이내 유지\n• 벽이나 장애물이 없는 곳에서 테스트\n\n🔧 고급 해결:\n• 앱에서 디바이스 제거 후 재연결\n• 스마트폰 재시작\n• Garmin Connect 앱 재설치',
    tags: ['연결끊김', '블루투스', '문제해결', '재연결']
  },
  {
    id: 5,
    category: 'features',
    question: '어떤 앱의 알림을 받을 수 있나요?',
    answer: '가민 워치에서 받을 수 있는 알림들:\n\n💬 메신저:\n• 메신저, 라인, 텔레그램\n• WhatsApp, Messenger\n\n📧 커뮤니케이션:\n• 문자메시지 (SMS)\n• 이메일 (Gmail, 네이버메일 등)\n• 전화 착신\n\n📱 소셜미디어:\n• 인스타그램, 페이스북\n• 트위터, 유튜브\n\n📅 기타:\n• 캘린더 일정\n• 뉴스 앱\n• 배달/쇼핑 앱\n\n⚙️ 설정: Garmin Connect → 알림 및 앱에서 개별 설정 가능',
    tags: ['알림', '앱', '호환성', '지원앱']
  },
  {
    id: 6,
    category: 'setup',
    question: 'Garmin Connect 앱 기본 설정 방법을 알려주세요',
    answer: '📱 앱 다운로드 및 설정:\n\n1️⃣ 앱 설치:\n• 앱스토어/플레이스토어에서 "Garmin Connect" 검색\n• 공식 앱 다운로드 (개발자: Garmin Ltd.)\n\n2️⃣ 계정 생성:\n• 가민 계정 생성 또는 기존 계정 로그인\n• 개인정보 입력 (나이, 성별, 키, 몸무게)\n\n3️⃣ 기본 설정:\n• 활동 목표 설정 (걸음 수, 운동 시간)\n• 알림 설정\n• 개인정보 보호 설정\n\n4️⃣ 워치 연결:\n• "디바이스 추가" 선택\n• 워치 모델 선택 후 페어링',
    tags: ['설정', '앱', '계정생성', '기본설정']
  },
  {
    id: 7,
    category: 'troubleshoot',
    question: '배터리가 빨리 닳아요',
    answer: '🔋 배터리 수명 최적화 방법:\n\n⚙️ 설정 조정:\n• 화면 밝기 낮추기\n• 화면 켜짐 시간 단축\n• GPS 정확도 조정 (절약 모드 사용)\n• 심박수 측정 간격 늘리기\n\n📱 알림 관리:\n• 불필요한 앱 알림 끄기\n• 스마트 알림 최소화\n\n🏃‍♂️ 사용 패턴:\n• GPS 활동 추적 시간 줄이기\n• 음악 재생 최소화\n• Wi-Fi 자동 연결 끄기\n\n🔧 유지보수:\n• 정기적인 소프트웨어 업데이트\n• 앱 캐시 정리',
    tags: ['배터리', '절약', '최적화', '설정']
  },
  {
    id: 8,
    category: 'features',
    question: '음성통화를 워치에서 받을 수 있나요?',
    answer: '📞 음성통화 기능:\n\n✅ 지원 기능:\n• 전화 착신 알림 받기\n• 워치에서 통화 거절/수락\n• 미리 설정된 문자로 거절 답장\n\n❌ 지원하지 않는 기능:\n• 워치에서 직접 통화 (스피커/마이크 없음)\n• 전화번호 다이얼링\n\n📱 실제 통화:\n• 수락 시 스마트폰에서 통화\n• 블루투스 이어폰 연결 권장\n\n⚙️ 설정:\nGarmin Connect → 알림 및 앱 → 전화 알림 활성화',
    tags: ['통화', '전화', '알림', '기능제한']
  },
  {
    id: 9,
    category: 'connection',
    question: 'Wi-Fi 연결은 어떻게 하나요?',
    answer: '📶 Wi-Fi 연결 설정:\n\n⌚ 워치에서 설정:\n1. 설정 → 시스템 → Wi-Fi\n2. "Wi-Fi 추가" 선택\n3. 네트워크 선택 또는 직접 입력\n4. 비밀번호 입력\n\n📱 앱에서 설정:\n1. Garmin Connect → 디바이스 설정\n2. 시스템 → Wi-Fi\n3. 네트워크 추가\n\n✅ Wi-Fi 활용:\n• 소프트웨어 업데이트\n• 활동 데이터 동기화\n• Connect IQ 앱 다운로드\n• 음악 스트리밍 (일부 모델)\n\n💡 팁: 안정적인 2.4GHz 네트워크 사용 권장',
    tags: ['Wi-Fi', '무선연결', '동기화', '업데이트']
  },
  {
    id: 10,
    category: 'setup',
    question: '운동 자동 감지 설정은 어떻게 하나요?',
    answer: '🏃‍♂️ 운동 자동 감지 설정:\n\n⌚ 워치 설정:\n1. 설정 → 활동 및 앱\n2. 자동 활동 감지\n3. 원하는 운동 유형 선택\n\n📱 앱 설정:\n1. Garmin Connect → 디바이스 설정\n2. 활동 감지\n3. 각 운동별 온/오프 설정\n\n✅ 지원 운동:\n• 걷기 (10분 이상)\n• 달리기 (10분 이상)\n• 사이클링 (15분 이상)\n• 수영 (일부 모델)\n• 근력 운동 (15분 이상)\n\n⚙️ 민감도 조정:\n• 높음: 짧은 운동도 감지\n• 낮음: 확실한 운동만 감지',
    tags: ['운동감지', '자동추적', '활동', '설정']
  }
];

// Function to populate FAQs
async function populateFAQs() {
  console.log('Starting FAQ population...');
  
  try {
    for (const faq of faqsFromChats) {
      const faqData = {
        ...faq,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: 'system', // You can change this to your admin user ID
        isActive: true
      };
      
      const docRef = await addDoc(collection(db, 'faqs'), faqData);
      console.log(`✅ FAQ ${faq.id} added with ID: ${docRef.id}`);
    }
    
    console.log(`🎉 Successfully added ${faqsFromChats.length} FAQs to the database!`);
  } catch (error) {
    console.error('❌ Error adding FAQs:', error);
  }
}

// Run the population script
populateFAQs();