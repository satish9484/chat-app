import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.scss";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
 const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (  
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            exact
            path="/"
            element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
  
  );
}

export default App;
