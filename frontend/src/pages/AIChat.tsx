import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import type { ChatMessage } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Bot,
  Send,
  User,
  Trash2,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_1',
      sender: 'assistant',
      text: "### 🛡️ Hello! I am your ScamShield AI Security Advisor\n\nAsk me anything about suspicious emails, fake UPI handles, job scams, domain checks, or online cybersecurity recovery steps.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "Is it safe to scan a QR code to receive money?",
    "Why do fraudsters ask for OTPs during bank calls?",
    "How can I spot a fake job offer on Telegram?",
    "What steps should I take if I lost money to a UPI scam?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(currentInput, messages);
      const aiMsg: ChatMessage = {
        id: `m_${Date.now() + 1}`,
        sender: 'assistant',
        text: res.reply || 'Protect your personal credentials and avoid clicking unverified links.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">AI Security Advisor</h1>
            <p className="text-xs text-gray-400">Powered by ScamShield Neural Engine • Real-time Threat Guidance</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-gray-400 hover:text-red-400 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages Area */}
      <GlassCard hoverEffect={false} className="flex-1 overflow-y-auto p-4 space-y-4 border-blue-500/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-4 space-y-1 relative group ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white/5 border border-white/10 text-gray-200'
            }`}>
              <div className="text-xs leading-relaxed prose prose-invert max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.text)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 transition-all"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
              <span>ScamShield AI Advisor is reasoning...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </GlassCard>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => { setInput(p); }}
            className="text-[11px] px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-gray-300 whitespace-nowrap transition-all cursor-pointer shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask AI Security Advisor anything..."
          className="glass-input flex-1 px-4 py-3 rounded-2xl text-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
