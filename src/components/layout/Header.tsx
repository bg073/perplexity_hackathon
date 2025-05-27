import React from 'react';
import { Menu, Maximize, Minimize, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { useChatStore } from '../../store/chatStore';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { toggleSidebar, sidebarOpen } = useChatStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex">
            <motion.div 
              className="flex items-center gap-2 font-bold text-lg"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-glow">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                NeoAI
              </span>
            </motion.div>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;