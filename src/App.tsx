import React, { useEffect, useState } from 'react';
import ChatContainer from './components/chat/ChatContainer';
import MessageInput from './components/chat/MessageInput';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Background from './components/Background';
import { useChatStore } from './store/chatStore';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/Button';

function App() {
  const { sidebarOpen, setSidebarOpen, setTheme } = useChatStore();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Set initial theme based on system preference
  useEffect(() => {
    setTheme('system');
    setIsMounted(true);
  }, [setTheme]);

  // Determine if screen is mobile (smaller than md)
  const isMobile = window.innerWidth < 768;

  const handleHamburgerClick = () => {
    if (isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Background particles */}
      <Background />

      {/* Sidebar toggle button (hamburger) - always visible */}
      <button
        className="fixed top-4 left-4 z-50 flex flex-col items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:scale-110 transition-transform duration-200 focus:outline-none border border-white/10 backdrop-blur-md"
        style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
        onClick={handleHamburgerClick}
        aria-label="Toggle sidebar"
      >
        {/* Futuristic animated hamburger icon */}
        <span className="block w-6 h-0.5 bg-white rounded-full mb-1 transition-all duration-300"></span>
        <span className="block w-6 h-0.5 bg-white rounded-full mb-1 transition-all duration-300"></span>
        <span className="block w-6 h-0.5 bg-white rounded-full transition-all duration-300"></span>
      </button>

      {/* Responsive Sidebar: sidebar on desktop, overlay on mobile */}
      <Sidebar sidebarCollapsed={sidebarCollapsed} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Chat area */}
          <ChatContainer />

          {/* Message input */}
          <MessageInput />
        </main>
      </div>
    </div>
  );
}


export default App;