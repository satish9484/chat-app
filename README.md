# 💬 Modern Chat Application

A sophisticated real-time chat application built with React and Firebase, featuring advanced messaging capabilities, admin dashboard, and modern UI/UX design.

![Chat App Screenshot](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Chat+Application+Interface)

## ✨ Key Features

### 🔐 Authentication & Security

- **User Registration & Login** - Secure authentication with Firebase Auth
- **Password Reset** - Email-based password recovery system
- **Protected Routes** - Secure access control for authenticated users
- **Session Management** - Persistent login state with automatic logout

### 💬 Real-Time Messaging

- **Instant Messaging** - Real-time chat using Firebase Firestore
- **Message History** - Persistent message storage and retrieval
- **User Presence** - Online/offline status indicators
- **Message Timestamps** - Real-time message timestamps
- **Chat Rooms** - Multiple conversation support

### 🎨 Modern UI/UX

- **Dark/Light Mode** - Toggle between themes with persistent preferences
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Modern SCSS Architecture** - Organized styling with variables, mixins, and utilities
- **Smooth Animations** - Enhanced user experience with CSS transitions
- **Toast Notifications** - User feedback with react-toastify

### 📱 Mobile Experience

- **Mobile-Optimized** - Touch-friendly interface for mobile devices
- **Responsive Sidebar** - Collapsible navigation for mobile screens
- **Viewport Adaptation** - Dynamic layout adjustments based on screen size
- **Touch Gestures** - Intuitive mobile interactions

### 👑 Admin Dashboard

- **User Management** - Comprehensive user administration tools
- **Chat Monitoring** - Real-time chat oversight and moderation
- **System Analytics** - Usage statistics and performance metrics
- **Admin Settings** - Configuration and system management
- **Dashboard Overview** - Key metrics and system health monitoring

### 🔧 Developer Experience

- **Modern React Architecture** - Functional components with hooks
- **Context API** - Global state management for auth, theme, and chat
- **Component Organization** - Modular, reusable component structure
- **ESLint & Prettier** - Code quality and formatting standards
- **Husky Pre-commit Hooks** - Automated code quality checks

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: SCSS with modern architecture
- **State Management**: React Context API
- **Notifications**: React Toastify
- **Build Tools**: Create React App
- **Code Quality**: ESLint, Prettier, Husky

## 🚀 Installation & Setup

### Prerequisites

- Node.js (>=16.0.0)
- npm (>=8.0.0)
- Firebase project setup

### Environment Setup

1. Clone the repository

```bash
git clone <repository-url>
cd chat-app
```

2. Install dependencies

```bash
npm install
```

3. Create Firebase project and configure environment variables

```bash
# Create .env file in root directory
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## 📖 Usage

### For Regular Users

1. **Register/Login** - Create an account or sign in
2. **Start Chatting** - Begin conversations with other users
3. **Customize Theme** - Toggle between dark and light modes
4. **Mobile Access** - Use the responsive interface on any device

### For Administrators

1. **Access Admin Panel** - Navigate to `/admin` route
2. **Monitor Users** - View user activity and manage accounts
3. **Oversee Chats** - Monitor conversations and moderate content
4. **View Analytics** - Access system statistics and performance metrics

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin dashboard components
│   ├── loader/          # Loading components
│   └── ...              # Chat, sidebar, navbar, etc.
├── context/             # React Context providers
│   ├── AuthContext.js   # Authentication state
│   ├── ChatContext.js   # Chat state management
│   └── ThemeContext.js  # Theme state management
├── pages/               # Main application pages
├── scss/               # SCSS styling architecture
│   ├── foundation/     # Variables, mixins, functions
│   ├── layout/         # Page structure styles
│   ├── utilities/      # Helper classes
│   └── components/     # Component-specific styles
├── utils/              # Utility functions
└── firebase.js         # Firebase configuration
```

## 🎯 Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start with custom port and environment
- `npm run build` - Build for production
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Check linting without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting
- `npm run clean` - Clean dependencies and reinstall

## 🔥 Firebase Configuration

The application uses Firebase for:

- **Authentication** - User login/registration
- **Firestore** - Real-time database for messages
- **Storage** - File uploads and media

Make sure to configure Firebase Security Rules appropriately for production use.

---

