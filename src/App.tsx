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
  
  // Set initial theme based on system preference
  useEffect(() => {
    setTheme('system');
    setIsMounted(true);
  }, [setTheme]);
  
  if (!isMounted) return null;
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Background particles */}
      <Background />
      
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile sidebar */}
      <Sidebar isMobile={true} />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Mobile menu toggle - visible when sidebar is closed */}
          {!sidebarOpen && (
            <div className="md:hidden p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
          
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