import { create } from 'zustand';
import { Message, Conversation, Theme } from '../types';
import { generateId } from '../lib/utils';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isTyping: boolean;
  theme: Theme;
  sidebarOpen: boolean;
  suggestedPrompts: string[];
  
  // Actions
  setActiveConversation: (id: string) => void;
  createNewConversation: () => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  setIsTyping: (value: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  deleteConversation: (id: string) => void;
}

// Predefined example conversations
const exampleMessages: Message[] = [
  {
    id: generateId(),
    content: "Hello! How can I help you today?",
    role: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: generateId(),
    content: "I'm looking for information about quantum computing. Can you explain the basics?",
    role: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: generateId(),
    content: "Quantum computing uses quantum bits or 'qubits' that can exist in multiple states simultaneously, unlike classical bits which are either 0 or 1. This quantum property of superposition, along with entanglement, allows quantum computers to perform certain calculations exponentially faster than classical computers. While still in early stages, quantum computers show promise for cryptography, optimization problems, and simulating quantum systems that are impossible for classical computers to model efficiently.",
    role: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
];

const suggestedPromptsList = [
  "Explain how AI image generation works",
  "What will technology look like in 2050?",
  "Help me write a short story about time travel",
  "Design a sustainable smart home system"
];

const initialConversations: Conversation[] = [
  {
    id: generateId(),
    title: "Quantum Computing Basics",
    messages: [...exampleMessages],
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    updatedAt: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: generateId(),
    title: "New Chat",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// AI responses for simulating assistant behavior
const aiResponses = [
  "I'm analyzing your request and finding the most relevant information for you.",
  "That's an interesting question! Here's what I know about this topic.",
  "I've processed your request and have some insights to share.",
  "Based on my knowledge, I can provide the following information.",
  "I understand what you're asking. Let me explain this concept for you.",
  "Great question! I'm happy to help you understand this better.",
  "I've analyzed multiple sources to give you the most accurate answer.",
  "Let me think about this from different perspectives to give you a comprehensive response.",
  "I've considered various approaches to your question. Here's what I think would work best.",
  "I'm examining this topic in detail to provide you with a thorough explanation."
];

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: initialConversations,
  activeConversationId: initialConversations[0].id,
  isTyping: false,
  theme: 'system',
  sidebarOpen: true,
  suggestedPrompts: suggestedPromptsList,
  
  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },
  
  createNewConversation: () => {
    const newId = generateId();
    const newConversation: Conversation = {
      id: newId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: newId,
    }));
  },
  
  addMessage: (content, role) => {
    const { activeConversationId, conversations } = get();
    
    if (!activeConversationId) return;
    
    const newMessage: Message = {
      id: generateId(),
      content,
      role,
      timestamp: new Date(),
    };
    
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversationId) {
        // Update conversation title if it's the first message
        let title = conv.title;
        if (conv.messages.length === 0 && role === 'user') {
          title = content.length > 30 ? content.substring(0, 30) + '...' : content;
        }
        
        return {
          ...conv,
          title,
          messages: [...conv.messages, newMessage],
          updatedAt: new Date(),
        };
      }
      return conv;
    });
    
    set({ conversations: updatedConversations });
    
    // Simulate AI response if user sent a message
    if (role === 'user') {
      set({ isTyping: true });
      
      // Simulate typing delay
      setTimeout(() => {
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        get().addMessage(randomResponse, 'assistant');
        set({ isTyping: false });
      }, 1500 + Math.random() * 1500);
    }
  },
  
  setIsTyping: (value) => {
    set({ isTyping });
  },
  
  setTheme: (theme) => {
    set({ theme });
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
  
  deleteConversation: (id) => {
    set((state) => {
      const filtered = state.conversations.filter(c => c.id !== id);
      let newActive = state.activeConversationId;
      if (state.activeConversationId === id) {
        newActive = filtered.length > 0 ? filtered[0].id : null;
      }
      return {
        conversations: filtered,
        activeConversationId: newActive,
      };
    });
  }
}));