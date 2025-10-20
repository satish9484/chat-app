import React, { useState } from 'react';

const Chat = () => {
  const [text, setText] = useState('');
  const handleChange = e => setText(e.target.value);

  return (
    <div className="flex flex-col h-full max-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Modern Professional Header */}
      <div className="flex-shrink-0 w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                Professional Chat
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Secure messaging platform
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4.5 19.5a15 15 0 01-1.5-7c0-8.284 6.716-15 15-15s15 6.716 15 15a15 15 0 01-1.5 7"
                />
              </svg>
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container with Modern Design */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 space-y-6">
        {/* Incoming Message */}
        <div className="flex items-start space-x-3 max-w-2xl">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-600 max-w-md">
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <span>John Doe</span>
              <span>•</span>
              <span>2 min ago</span>
            </div>
          </div>
        </div>

        {/* Outgoing Message */}
        <div className="flex items-start space-x-3 max-w-2xl ml-auto justify-end">
          <div className="flex flex-col space-y-1 items-end">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl rounded-tr-md px-4 py-3 shadow-lg max-w-md">
              <p className="text-white text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <span>2 min ago</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Delivered</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">ME</span>
            </div>
          </div>
        </div>

        {/* Another Incoming Message */}
        <div className="flex items-start space-x-3 max-w-2xl">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-600 max-w-md">
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                That sounds great! Let's schedule a meeting for next week to
                discuss the project details.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <span>John Doe</span>
              <span>•</span>
              <span>1 min ago</span>
            </div>
          </div>
        </div>

        {/* Outgoing Message with Image */}
        <div className="flex items-start space-x-3 max-w-2xl ml-auto justify-end">
          <div className="flex flex-col space-y-1 items-end">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl rounded-tr-md px-4 py-3 shadow-lg max-w-md">
              <p className="text-white text-sm leading-relaxed mb-3">
                Perfect! Here's the design mockup I was working on:
              </p>
              <div className="bg-white/20 rounded-lg p-3 mb-2">
                <div className="w-full h-32 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-md flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-white/80 text-xs mt-2">design-mockup.png</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Just now</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sent</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">ME</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Input Container */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              value={text}
              name="text"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              placeholder="Type your message..."
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            </button>
          </div>
          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

// Nav Bar
