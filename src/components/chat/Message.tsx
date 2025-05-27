import React from 'react';
import { Message as MessageType } from '../../types';
import { formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.role === 'assistant';
  
  return (
    <motion.div
      className={`py-6 ${isAI ? 'bg-muted/30' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
          ${isAI 
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' 
            : 'bg-secondary text-foreground'
          }`}
        >
          {isAI ? <Bot size={16} /> : <User size={16} />}
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{isAI ? 'AI Assistant' : 'You'}</span>
            <span className="text-xs text-muted-foreground">{formatDate(message.timestamp)}</span>
          </div>
          
          <div className="prose prose-sm dark:prose-invert mt-1">
            {message.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;