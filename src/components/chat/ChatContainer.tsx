import React, { useRef, useEffect } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import { useChatStore } from '../../store/chatStore';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const { conversations, activeConversationId, isTyping, sidebarOpen, setSidebarOpen } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );
  
  // Scroll to bottom when messages change or when typing indicator appears/disappears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isTyping]);
  
  if (!activeConversation) {
    return <div>No conversation selected</div>;
  }
  
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Elegant Back to Chats button for mobile/small screens when sidebar is closed */}
      {!sidebarOpen && (
        <div className="p-4 flex items-center">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md backdrop-blur text-white font-medium text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none border border-white/10"
            style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Back to chats"
          >
            {/* Modern menu icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="drop-shadow-md">Back to chats</span>
          </button>
        </div>
      )}
      {activeConversation.messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            className="flex flex-col items-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-6 animate-float">
              <Bot className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to the AI Assistant</h2>
            <p className="text-muted-foreground mb-6">
              Ask me anything about science, technology, arts, history, or how I can help with your tasks.
            </p>
          </motion.div>
        </div>
      ) : (
        <>
          {activeConversation.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatContainer;