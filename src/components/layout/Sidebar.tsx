import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { truncate, formatDate } from '../../lib/utils';

interface SidebarProps {
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    createNewConversation,
    sidebarOpen,
    setSidebarOpen,
  } = useChatStore();

  // Sort conversations with most recent updates first
  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  if (isMobile && !sidebarOpen) return null;

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          className={`bg-card border-r border-border ${
            isMobile 
              ? 'fixed inset-0 z-50' 
              : 'w-1/4 max-w-xs min-w-[220px] hidden md:flex flex-shrink-0'
          }`}
          initial={isMobile ? { x: '-100%' } : { opacity: 1 }}
          animate={isMobile ? { x: 0 } : { opacity: 1 }}
          exit={isMobile ? { x: '-100%' } : { opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className="flex flex-col h-full">
            {isMobile && (
              <div className="flex justify-end p-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            <div className="p-4">
              <Button
                variant="gradient"
                className="w-full justify-start gap-2"
                onClick={createNewConversation}
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto py-2 px-3">
              <h2 className="text-xs font-semibold text-muted-foreground px-1 mb-2">
                CONVERSATIONS
              </h2>
              <div className="space-y-1">
                {sortedConversations.map((conversation) => (
                  <div key={conversation.id} className="relative group">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left pr-10 ${
                        activeConversationId === conversation.id
                          ? 'bg-accent/50 text-accent-foreground'
                          : ''
                      }`}
                      onClick={() => {
                        setActiveConversation(conversation.id);
                        if (isMobile) setSidebarOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate flex-1">
                          {truncate(conversation.title, 25)}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>
                    </Button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/80 hover:text-white text-destructive"
                      title="Delete chat"
                      onClick={e => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {conversations.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No conversations yet
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="text-xs text-muted-foreground">
                <p>This is a UI demo - responses are simulated.</p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;