import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import { AuthContextProvider } from "./context/AuthContext";
// import { ChatContextProvider } from "./context/ChatContext";

import Home from './newDesign/Home'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <AuthContextProvider>
  //   <ChatContextProvider>
  //     <React.StrictMode>
  //       <App />
  //     </React.StrictMode>
  //   </ChatContextProvider>
  // </AuthContextProvider>
  <Home/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
