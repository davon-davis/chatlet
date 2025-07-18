import { useState, useEffect, useCallback } from 'react';

export type Message = { from: 'user' | 'bot'; text: string };

const STORAGE_KEY = 'chatlet_conversation';

export function useChat(welcome: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // load from localStorage or start with welcome
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ from: 'bot', text: welcome }]);
    }
  }, [welcome]);

  // persist whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    // add user message
    setMessages((m) => [...m, { from: 'user', text }]);
    setIsTyping(true);

    // prepare payload for proxy
    const payload = {
      messages: messages
        .concat({ from: 'user', text })
        .map((m) => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const { message } = await res.json();
      setMessages((m) => [...m, { from: 'bot', text: message.content }]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: '⚠️ Failed to fetch.' }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  return { messages, isTyping, sendMessage };
}
