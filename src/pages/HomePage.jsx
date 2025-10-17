import React from 'react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import '../style.scss';

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
