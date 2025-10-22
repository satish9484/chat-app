import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import Loader from './components/loader/index';

import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

function Root() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // simulate init work — replace with real init logic
    const t = setTimeout(() => setAppReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!appReady) return <Loader isLoading />; //

  return (
    <Suspense fallback={<Loader isLoading />}>
      <ThemeProvider>
        <AuthContextProvider>
          <ChatContextProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </ChatContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </Suspense>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
