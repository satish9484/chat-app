import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`dark-mode-toggle ${isDarkMode ? 'dark' : ''}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={`dark-mode-icon sun ${isDarkMode ? 'hidden' : ''}`}>
        ☀️
      </span>
      <span className={`dark-mode-icon moon ${!isDarkMode ? 'hidden' : ''}`}>
        🌙
      </span>
    </button>
  );
};

export default DarkModeToggle;
