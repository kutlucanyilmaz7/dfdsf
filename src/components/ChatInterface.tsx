import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Wallet, MessageSquare, Zap } from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, User } from '../types';
import { ThinkingAnimation, WritingAnimation } from './ThinkingWriting';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function ChatInterface() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetch('/api/user', {
      headers: { 'x-user-id': userId || 'default' }
    })
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, isWriting]);

  const handleSend = async () => {
    if (!input.trim() || isThinking || isWriting) return;
    if (user && user.credits <= 0) return alert(t('credits') + ' bitti! Lütfen paket satın alın.');

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId || 'default'
        },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('API Error');

      setIsThinking(false);
      setIsWriting(true);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                assistantContent += content;
                
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  const others = prev.slice(0, -1);
                  return [...others, { role: 'assistant', content: assistantContent }];
                });
              } catch (e) {}
            }
          }
        }
      }

      setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);

    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
      setIsWriting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="h-16 border-b border-zinc-100 flex justify-between items-center px-6 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-none font-medium">
            CroopsAI 1.0
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-600 gap-1.5 px-3 py-1 shadow-sm">
            <Wallet className="w-3.5 h-3.5 text-primary" />
            {user?.credits ?? 0} {t('credits')}
          </Badge>
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
             {user?.firstName ? (
               <span className="text-xs font-bold text-zinc-600">{user.firstName[0]}{user.lastName[0]}</span>
             ) : (
               <UserIcon className="w-4 h-4 text-zinc-400" />
             )}
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-10 px-4 space-y-8 pb-32">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-zinc-900">{t('welcome')}</h2>
              <p className="text-zinc-500">CroopsAI ile AI gücünü keşfedin.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={cn(
                "flex gap-4 group",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' ? "bg-zinc-900 border-zinc-900 text-white" : "bg-primary border-primary text-white"
              )}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              </div>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm",
                msg.role === 'user' ? "bg-zinc-100 text-zinc-900" : "bg-white border border-zinc-100 text-zinc-800"
              )}>
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isThinking && <ThinkingAnimation />}
          {isWriting && <WritingAnimation />}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-10">
        <div className="max-w-3xl mx-auto relative group">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t('welcome')}
            className="pr-12 py-7 bg-white border-zinc-200 focus:border-primary focus:ring-primary/10 transition-all rounded-2xl shadow-xl shadow-zinc-200/50 text-zinc-900"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isThinking || isWriting}
            size="icon"
            className="absolute right-2 top-2 h-10 w-10 rounded-xl shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[11px] text-zinc-400 text-center mt-4">
          {t('footer_disclaimer')}
        </p>
      </div>
    </div>
  );
}
