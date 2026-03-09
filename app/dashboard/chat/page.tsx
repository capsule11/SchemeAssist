"use client";

import { useState, useRef, useEffect } from "react";
import { getCurrentUser, getUserProfile } from "@/lib/appwrite";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: "user" | "model";
  content: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
      { role: "model", content: "Hi there! I am SchemeAssist. ✨\n\nHow can I help you find the right government schemes today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser: any = await getCurrentUser();
        if (currentUser) {
          const profile = await getUserProfile(currentUser.$id);
          setProfileData(profile);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI immediately
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: newMessages,
            profileData: profileData // Pass profile data for personalized answers
        }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch response");

      // Add AI response to UI
      setMessages(prev => [...prev, { role: "model", content: data.reply }]);
      
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
          ...prev, 
          { role: "model", content: `❌ **Error:** ${error.message || "Something went wrong. Please try again."}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-[#111111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-white/10 bg-black/20">
        <div className="p-2 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/20">
            <Bot className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Scheme Advisor</h1>
          <p className="text-sm text-gray-400">Ask me anything about starting a business, grants, or eligibility.</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
                msg.role === 'user' 
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                : 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]'
            }`}>
               {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-a:text-[#FFD700]'
            }`}>
               {msg.role === 'user' ? (
                   <p className="whitespace-pre-wrap">{msg.content}</p>
               ) : (
                   <ReactMarkdown>{msg.content}</ReactMarkdown>
               )}
            </div>
            
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
            <div className="flex gap-4 flex-row">
                 <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700]">
                    <Sparkles className="w-5 h-5" />
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                     <Loader2 className="w-5 h-5 text-[#FFD700] animate-spin" />
                     <span className="text-gray-400 text-sm animate-pulse">Thinking...</span>
                 </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <form onSubmit={handleSend} className="relative flex items-end gap-2 max-w-3xl mx-auto">
           <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="E.g., I'm thinking of starting my own hotel, what schemes can I benefit from?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 resize-none max-h-32 min-h-[56px]"
              rows={1}
              disabled={isLoading}
           />
           <button 
             type="submit"
             disabled={!input.trim() || isLoading}
             className="absolute right-2 bottom-2 p-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             <Send className="w-5 h-5" />
           </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-3 pt-1 border-t border-white/5 max-w-3xl mx-auto">
            Please verify official government links before applying.
        </p>
      </div>
      
    </div>
  );
}
