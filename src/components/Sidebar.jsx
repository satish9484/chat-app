import React, { useState } from 'react';
import Chats from './Chats';
import Navbar from './Navbar';
import Search from './Search';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = term => {
    setSearchTerm(term);
  };

  return (
    <div className="sidebar">
      <Navbar />
      <Search onSearchChange={handleSearchChange} />
      <Chats searchTerm={searchTerm} />
    </div>
  );
};

export default Sidebar;
