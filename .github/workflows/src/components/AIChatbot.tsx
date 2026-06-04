/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

interface AIChatbotProps {
  onOpenAdmission: () => void;
}

export default function AIChatbot({ onOpenAdmission }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Assalamu Alaikum! Welcome to M Hashir Online Quran Academy support. I am **Hashir Bot**, your 24/7 supervisor assistant. How can I help you or your child start their Quranic learning journey today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    { text: "What are the monthly fee plans?", query: "Could you tell me about your courses' monthly fee structures and payment methods?" },
    { text: "Are there certified female teachers?", query: "Do you have certified female scholars and tutors for girls and kids?" },
    { text: "How do 1-on-1 live classes work?", query: "How do the 1-on-1 live classrooms work inside the browser? Do I need Zoom?" },
    { text: "Book a 3-day free trial", query: "Can you help me book a 3-day free trial class for my child?" }
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: 'error_' + Date.now(),
        role: 'assistant',
        content: 'I apologize for the minor interruption. Our servers are syncing class schedules, but please feel free to fill out our direct **Online Admission Form** in the header so Qari Hashir can contact you immediately or contact us via WhatsApp +92 343 0603445!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkly Launcher Button */}
      <div id="ai-chatbot-launcher" className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-emerald-900 text-amber-400 p-4 rounded-full shadow-2xl hover:bg-emerald-800 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-amber-500/70 group flex items-center justify-center cursor-pointer"
          title="Ask M Hashir Academy AI"
        >
          <span className="absolute -top-1 -right-1 bg-amber-500 text-emerald-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
            24/7 AI
          </span>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <span className="flex items-center gap-1.5">
                <Bot className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
              </span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Beautiful Islamic Adorned Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] bg-slate-50 rounded-2xl shadow-2xl border-2 border-emerald-900/50 z-50 flex flex-col overflow-hidden"
          >
            {/* Header with Islamic geometric aesthetic */}
            <div className="bg-emerald-950 text-white px-4 py-4 border-b border-amber-500/40 relative">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-950 via-amber-400 to-emerald-950" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 border border-amber-400/60 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm font-sans tracking-wide">Hashir Assistant</h3>
                    <p className="text-xs text-emerald-400/90 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
                      Online 24/7 Support Desk
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-amber-400 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* In-chat warning alert box for real feel */}
            <div className="bg-amber-50 border-b border-amber-200/60 p-2 text-center text-[11px] text-amber-800 font-medium">
              ✨ Prophetic Knowledge in Your Secure Home • 1-on-1 Certified Teachers
            </div>

            {/* Chat History Pane */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-900/40 flex items-center justify-center shrink-0 text-emerald-900">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-500 flex items-center justify-center shrink-0 text-amber-800 font-bold text-xs font-mono">
                        ME
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-emerald-900 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-emerald-900/10 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {/* Interpret basic inline markdown bold tags simply */}
                        <p className="whitespace-pre-line">
                          {msg.content.split('**').map((chunk, i) => 
                            i % 2 === 1 ? <strong key={i} className="text-amber-600 font-bold">{chunk}</strong> : chunk
                          )}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 self-start px-1 font-mono">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-900">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-white border text-xs sm:text-sm border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                      <span className="flex items-center gap-1.5 font-medium text-gray-500">
                        Hashir Bot is writing answers
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-150">.</span>
                        <span className="animate-bounce delay-300">.</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Starter Suggestions */}
            {messages.length < 3 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Common Inquiries</p>
                <div className="flex flex-wrap gap-1.5">
                  {starterQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q.query)}
                      className="text-[11px] bg-white hover:bg-emerald-50 text-emerald-950 font-medium px-2.5 py-1.5 rounded-lg border border-emerald-800/10 hover:border-emerald-800/20 text-left transition-colors cursor-pointer"
                    >
                      {q.text}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAdmission();
                    }}
                    className="text-[11px] bg-amber-500/15 text-amber-800 hover:bg-amber-500/30 font-bold px-2.5 py-1.5 rounded-lg border border-amber-500/30 text-left flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    🚀 Regular Admission Form
                  </button>
                </div>
              </div>
            )}

            {/* Message Input Box */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about trials, schedule, tajweed..."
                  className="flex-1 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white text-gray-800"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-emerald-950 hover:bg-emerald-900 text-amber-400 p-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
