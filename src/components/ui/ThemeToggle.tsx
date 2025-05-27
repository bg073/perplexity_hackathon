import { useState, useEffect } from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { motion } from 'framer-motion';
import { Theme } from '../../types';
import { Button } from './Button';

export default function ThemeToggle() {
  const { theme, setTheme } = useChatStore();
  const [mounted, setMounted] = useState(false);

  // Ensure this component only renders client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const icons = [
    { value: 'light' as Theme, icon: Sun },
    { value: 'dark' as Theme, icon: Moon },
    { value: 'system' as Theme, icon: Laptop },
  ];

  return (
    <div className="flex items-center space-x-1 bg-muted/30 p-1 rounded-lg">
      {icons.map(({ value, icon: Icon }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          className={`relative rounded-md p-1.5 h-8 w-8 ${
            theme === value 
              ? 'bg-background text-foreground' 
              : 'hover:bg-muted/50 text-muted-foreground'
          }`}
          onClick={() => setTheme(value)}
        >
          <Icon className="h-4 w-4" />
          {theme === value && (
            <motion.div
              layoutId="theme-active-pill"
              className="absolute inset-0 bg-background rounded-md z-[-1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </Button>
      ))}
    </div>
  );
}