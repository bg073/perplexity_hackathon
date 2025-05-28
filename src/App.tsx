import React, { useEffect, useState } from 'react';
import ChatContainer from './components/chat/ChatContainer';
import MessageInput from './components/chat/MessageInput';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Background from './components/Background';
import { useChatStore } from './store/chatStore';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/Button';
import FactCheckVisualizer from './components/FactCheckVisualizer';

function App() {
  const { sidebarOpen, setSidebarOpen, setTheme } = useChatStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Set initial theme based on system preference
  useEffect(() => {
    setTheme('system');
    setIsMounted(true);
  }, [setTheme]);

  const [showFactCheck, setShowFactCheck] = useState(false);

  if (!isMounted) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Background />
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          onClick={() => setShowFactCheck(v => !v)}
        >
          {showFactCheck ? 'Back to Chat' : 'Try Fact-Check AI'}
        </Button>
      </div>
      {showFactCheck ? (
        <div className="w-full h-full flex items-center justify-center bg-[#181f2a]">
          <FactCheckVisualizer />
        </div>
      ) : (
        <>
          <Sidebar />
          <Sidebar isMobile={true} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-hidden flex flex-col">
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
              <ChatContainer />
              <MessageInput />
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;