'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WorldTheme, ChatMessage } from '@/types/tutor';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  CornerDownRight,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface SocraticChatDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  worldTheme: WorldTheme;
  currentTopicTitle: string;
  currentTaskContext?: string;
  studentName?: string;
  onRequestHintDirectly?: () => void;
}

let chatCounter = 1;
function getNextMessageId(prefix: string): string {
  chatCounter += 1;
  return `${prefix}-${chatCounter}`;
}

export function SocraticChatDrawer({
  isOpen,
  onToggle,
  worldTheme,
  currentTopicTitle,
  currentTaskContext,
  studentName = 'Саша',
  onRequestHintDirectly,
}: SocraticChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Привет, ${studentName}! Я Архимед, твой персональный наставник. Если в задаче что-то непонятно — спрашивай смело! Мы разберём всё по кусочкам на понятных примерах.`,
      timestamp: 1,
      theme: worldTheme,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: getNextMessageId('user'),
      role: 'user',
      text: text.trim(),
      timestamp: chatCounter,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          currentTopicTitle,
          currentTaskContext,
          worldTheme,
          studentName,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: getNextMessageId('assistant'),
        role: 'assistant',
        text: data.text || 'Отличный вопрос! Давай посмотрим вместе...',
        timestamp: chatCounter,
        theme: worldTheme,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId('error'),
          role: 'assistant',
          text: 'Связь немного прервалась, но не переживай! Попробуй отправить сообщение ещё раз.',
          timestamp: chatCounter,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'С чего начать решение?',
    `Объясни на примере ${worldTheme === 'minecraft' ? 'блоков Minecraft' : worldTheme === 'space' ? 'космического корабля' : 'музыкального ритма'}!`,
    'Я сомневаюсь в ответе, как себя проверить?',
  ];

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all border border-emerald-400/30 group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <span>Спросить Архимеда</span>
        </button>
      )}

      {/* Drawer Container */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-card border border-border/80 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-border/60 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  Архимед
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Репетитор
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                  Тема: {currentTopicTitle}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                title={isExpanded ? 'Свернуть' : 'Развернуть'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggle}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                title="Закрыть диалог"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick theme banner */}
          <div className="px-4 py-1.5 bg-muted/15 border-b border-border/30 text-[11px] text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Объяснения адаптированы под: <b>{worldTheme.toUpperCase()}</b>
            </span>
            {onRequestHintDirectly && (
              <button
                onClick={onRequestHintDirectly}
                className="text-xs text-primary hover:underline flex items-center gap-0.5"
              >
                <Lightbulb className="w-3 h-3" />
                Подсказка к задаче
              </button>
            )}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-muted/50 border border-border/50 text-foreground'
                        : 'bg-primary text-primary-foreground font-medium rounded-br-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-muted/40 border border-border/40 text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Архимед размышляет...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-border/40 bg-muted/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                disabled={isLoading}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-muted border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-border/60 bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Задай вопрос или напиши свою мысль..."
                disabled={isLoading}
                className="flex-1 bg-muted/40 border border-border/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
