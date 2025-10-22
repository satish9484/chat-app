import React, { useContext, useEffect } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { AuthContext } from './context/AuthContext.js';
import AdminPage from './pages/AdminPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUp from './pages/SignUp.jsx';
import './style.scss';
import { initViewportSystem } from './utils/viewportUtils.js';

function App() {
  const { currentUser } = useContext(AuthContext);

  // Initialize viewport system for adaptive layout
  useEffect(() => {
    const cleanup = initViewportSystem();

    // Cleanup on unmount
    return cleanup;
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
