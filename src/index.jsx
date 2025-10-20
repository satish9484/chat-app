import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import Loader from './components/loader/index';

import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

// import Home from './newDesign/Home';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={<Loader isSuspense />}>
    <ThemeProvider>
      <AuthContextProvider>
        <ChatContextProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </ChatContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
    {/* <Home /> */}
  </Suspense>
);
