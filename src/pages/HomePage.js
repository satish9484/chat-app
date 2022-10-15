import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home_Page = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home_Page;
