# 🏃‍♂️ Garmin Friends

Garmin friend - KakaoTalk FAQs and Garmin related information

## 🚀 Firebase Configuration

This project has been configured with Firebase for real-time database, authentication, and hosting capabilities.

### Firebase Configuration Details

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA-9knkYwOfGjjZhJZV5NCvN5eafBf9_Wo",
  authDomain: "garmin-friends.firebaseapp.com",
  projectId: "garmin-friends",
  storageBucket: "garmin-friends.firebasestorage.app",
  messagingSenderId: "379717147009",
  appId: "1:379717147009:web:090359a228ca41f7d67080"
};
```

### 📁 Project Structure

- `index.html` - Main application with Firebase integration
- `firebase-config.js` - Modular Firebase configuration
- `firebase.json` - Firebase hosting configuration
- `package.json` - Node.js dependencies and scripts
- `demo.html` - Configuration demonstration page

### 🛠️ Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**
   ```bash
   firebase login
   ```

4. **Initialize Firebase** (optional, already configured)
   ```bash
   firebase init
   ```

5. **Serve Locally**
   ```bash
   npm start
   # or
   firebase serve
   ```

6. **Deploy to Firebase Hosting**
   ```bash
   npm run deploy
   # or
   firebase deploy
   ```

### 🔧 Firebase Services Configured

- **🔐 Authentication** - User login and management
- **🗄️ Firestore Database** - Real-time document database
- **📦 Cloud Storage** - File storage and management
- **🌐 Hosting** - Web application deployment

### 📱 Features

- 📱 KakaoTalk Integration Ready
- ⌚ Garmin Device Information
- ❓ Frequently Asked Questions
- 👥 Community Support
- 🔄 Real-time Data Synchronization

### 🔗 URLs

- **Live Demo**: `https://garmin-friends.firebaseapp.com`
- **Firebase Console**: `https://console.firebase.google.com/project/garmin-friends`

### 🧪 Testing

Open `demo.html` in your browser to see the Firebase configuration demonstration and validation.
