import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="py-6 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white animate-pulse-slow">
          <Bot size={16} />
        </div>
        
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">AI Assistant</span>
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
          
          <div className="typing-indicator mt-2 text-primary">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TypingIndicator;