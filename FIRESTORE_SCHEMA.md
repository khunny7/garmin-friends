# Firestore Collections Schema

## Collections Overview

### 1. users
Stores user profile information and permissions.

**Document ID**: User's Firebase Auth UID

**Fields**:
- `uid`: string - Firebase Auth UID
- `email`: string - User's email address
- `displayName`: string - User's display name from Google
- `photoURL`: string - User's profile photo URL from Google
- `isAdmin`: boolean - Whether user has admin privileges (default: false)
- `createdAt`: timestamp - When the user account was created
- `lastLogin`: timestamp - Last login time

**Sample Document**:
```javascript
{
  uid: "abc123def456",
  email: "user@example.com",
  displayName: "홍길동",
  photoURL: "https://lh3.googleusercontent.com/...",
  isAdmin: false,
  createdAt: timestamp,
  lastLogin: timestamp
}
```

### 2. faqs
Stores frequently asked questions and answers.

**Document ID**: Auto-generated

**Fields**:
- `id`: number - Sequential ID for ordering
- `category`: string - FAQ category (connection, notification, features, setup, troubleshoot)
- `question`: string - The question text
- `answer`: string - The answer text (supports markdown/newlines)
- `tags`: array[string] - Tags for search functionality
- `createdAt`: timestamp - When FAQ was created
- `updatedAt`: timestamp - Last update time
- `createdBy`: string - UID of user who created (admin)
- `isActive`: boolean - Whether FAQ is visible (default: true)

**Sample Document**:
```javascript
{
  id: 1,
  category: "connection",
  question: "가민 워치에서 스마트폰 알림을 어떻게 받나요?",
  answer: "1. Garmin Connect 앱을 설치합니다.\n2. 앱에서 알림 설정으로 이동합니다.\n3. 원하는 앱들을 활성화합니다.\n4. 워치에서 알림을 허용합니다.",
  tags: ["연결", "설정", "알림"],
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: "admin_uid",
  isActive: true
}
```

### 3. qna
Stores community questions and their answers.

**Document ID**: Auto-generated

**Fields**:
- `id`: number - Sequential ID for ordering
- `title`: string - Question title
- `question`: string - Full question text
- `category`: string - Question category (troubleshoot, features, setup, etc.)
- `author`: string - UID of user who asked
- `authorName`: string - Display name of author (denormalized for performance)
- `authorPhoto`: string - Author's photo URL (denormalized)
- `createdAt`: timestamp - When question was posted
- `updatedAt`: timestamp - Last update time
- `likes`: number - Number of likes (default: 0)
- `likedBy`: array[string] - UIDs of users who liked
- `isActive`: boolean - Whether question is visible (default: true)
- `answerCount`: number - Number of answers (denormalized for performance)

**Sample Document**:
```javascript
{
  id: 1,
  title: "Forerunner 245 알림 설정 문제",
  question: "안녕하세요! Forerunner 245를 사용하고 있는데 스마트폰 알림이 간헐적으로만 와요. 설정은 다 맞게 한 것 같은데 왜 그럴까요?",
  category: "troubleshoot",
  author: "user_uid_123",
  authorName: "러닝맨123",
  authorPhoto: "https://lh3.googleusercontent.com/...",
  createdAt: timestamp,
  updatedAt: timestamp,
  likes: 5,
  likedBy: ["uid1", "uid2", "uid3"],
  isActive: true,
  answerCount: 2
}
```

### 4. answers
Stores answers to QNA questions as a subcollection.

**Collection Path**: `qna/{questionId}/answers`
**Document ID**: Auto-generated

**Fields**:
- `id`: number - Sequential ID within the question
- `content`: string - Answer text
- `author`: string - UID of user who answered
- `authorName`: string - Display name of author (denormalized)
- `authorPhoto`: string - Author's photo URL (denormalized)
- `createdAt`: timestamp - When answer was posted
- `updatedAt`: timestamp - Last update time
- `likes`: number - Number of likes (default: 0)
- `likedBy`: array[string] - UIDs of users who liked
- `isActive`: boolean - Whether answer is visible (default: true)

**Sample Document**:
```javascript
{
  id: 1,
  content: "저도 같은 문제가 있었는데 배터리 절약 모드를 확인해보세요. 절약 모드가 켜져 있으면 알림이 제한될 수 있어요.",
  author: "user_uid_456",
  authorName: "가민러버",
  authorPhoto: "https://lh3.googleusercontent.com/...",
  createdAt: timestamp,
  updatedAt: timestamp,
  likes: 3,
  likedBy: ["uid4", "uid5"],
  isActive: true
}
```

## Indexes Required

### faqs collection:
- `category` (single field)
- `isActive` (single field)
- `createdAt` (single field)
- `category, isActive` (composite)

### qna collection:
- `category` (single field)
- `isActive` (single field)
- `createdAt` (single field)
- `category, isActive, createdAt` (composite)
- `author` (single field)

### answers subcollection:
- `isActive` (single field)
- `createdAt` (single field)
- `isActive, createdAt` (composite)

## Security Rules Summary

1. **users**: Read access for authenticated users, write access only for own profile (except isAdmin field)
2. **faqs**: Read access for all, write access only for admins
3. **qna**: Read access for all, write access for authenticated users (own content only)
4. **answers**: Read access for all, write access for authenticated users (own content only)

Admin users can read/write all collections and manage user roles.