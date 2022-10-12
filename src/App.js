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

    
    // <React.Fragment>
    //   {/* <Register/> */}
    //   <Login />
    // </React.Fragment>

    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/">
    //       <Route
    //         index
    //         element={
    // // <ProtectedRoute>
    // <Home />
    // // </ProtectedRoute>
    //         }
    //       />
    //       <Route path="login" element={<Login />} />
    //       <Route path="register" element={<Register />} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>

  
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

          {/* <Navigate to="/" replace={true} /> */}

          {/* <Route path="/" element={<Navigate replace to="/home" />} /> */}
        </Routes>
      </Router>
  
  );
}

export default App;
