import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import React, { useContext } from "react";
  import { AuthContext } from "./context/AuthContext";
  import HomePage from "./pages/HomePage";
  import "./style.scss";
  import SignUp from './pages/SignUp.js'
   import LoginPage from "./pages/LoginPage";
  



  function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <>
      <Router>
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
