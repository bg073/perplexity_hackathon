import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useChatStore } from '../../store/chatStore';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, suggestedPrompts } = useChatStore();
  
  // Auto resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    addMessage(message.trim(), 'user');
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleSuggestedPrompt = (prompt: string) => {
    addMessage(prompt, 'user');
  };
  
  return (
    <div className="sticky bottom-0 w-full bg-background/80 backdrop-blur-sm border-t py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Suggested prompts */}
        {!message && (
          <motion.div 
            className="mb-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs group"
                onClick={() => handleSuggestedPrompt(prompt)}
              >
                <Sparkles className="h-3 w-3 mr-1 text-primary group-hover:animate-pulse" />
                {prompt}
              </Button>
            ))}
          </motion.div>
        )}
        
        {/* Message input */}
        <div className="relative">
          <form onSubmit={handleSubmit} className="relative gradient-border">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message the AI assistant..."
              className="w-full p-4 pr-12 resize-none focus:outline-none bg-card/50 dark:bg-card/50 rounded-lg min-h-[56px] max-h-[200px] overflow-y-auto"
              rows={1}
            />
            
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className={`absolute right-2 bottom-2 transition-opacity ${
                !message ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
              }`}
              disabled={!message}
            >
              <SendHorizontal className="h-5 w-5 text-primary" />
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;