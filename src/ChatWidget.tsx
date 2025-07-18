import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "./hooks/useChat";

interface ChatWidgetProps {
  brandColor?: string;
  logoUrl?: string;
  welcomeText?: string;
}

export function ChatWidget({
  brandColor = "#4f46e5",
  logoUrl,
  welcomeText = "Hi there! How can I help today?",
}: ChatWidgetProps) {
  const { messages, isTyping, sendMessage } = useChat(welcomeText);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // auto-scroll on new messages or typing change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const txt = draft.trim();
    if (!txt) return;
    sendMessage(txt);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-[500px] w-[350px] border rounded-xl shadow-lg overflow-hidden">
      {/* header */}
      <header className="flex items-center px-4 py-2 bg-white border-b">
        {/* {logoUrl && <img src={logoUrl} alt="logo" className="h-6 mr-2" />} */}
        <h1 className="font-semibold" style={{ color: brandColor }}>
          Chatlet
        </h1>
      </header>

      {/* message list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[75%] ${
                  m.from === "user" ? "text-white" : "bg-white text-gray-800"
                }`}
                style={{
                  backgroundColor: m.from === "user" ? brandColor : undefined,
                }}
              >
                {m.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="px-3 py-2 rounded-lg bg-white text-gray-500 italic">
                typing…
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* input */}
      <form
        onSubmit={onSubmit}
        className="flex items-center p-2 border-t bg-white"
      >
        <input
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring bg-white text-black"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: brandColor }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
