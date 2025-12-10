import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { AiMessage } from '../types';
import { analyzeDrawing, generateIdea } from '../services/geminiService';
import { getCanvasBlob } from '../utils/drawUtils';

interface AiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const AiPanel: React.FC<AiPanelProps> = ({ isOpen, onClose, canvasRef }) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    { role: 'model', text: "¡Hola Koki! Soy Pepito, tu asistente creativo. ¿Qué vamos a dibujar hoy?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || !canvasRef.current) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // Analyze current canvas state
      const blob = await getCanvasBlob(canvasRef.current);
      if (blob) {
        const responseText = await analyzeDrawing(blob, userText);
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Koki, no pude ver tu dibujo. ¿Intentamos de nuevo?" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Uy Koki, me mareé un poco. Inténtalo otra vez." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetIdea = async () => {
    setIsLoading(true);
    try {
      const idea = await generateIdea();
      setMessages(prev => [...prev, { role: 'model', text: `💡 ¡Koki, prueba esto!: ${idea}` }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Estoy pensando Koki... dame un segundo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-30 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2 text-indigo-700 font-bold">
          <Sparkles size={20} />
          <span>Pepito</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100'
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 size={14} className="animate-spin text-indigo-600" />
              Pensando...
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-2 flex gap-2 overflow-x-auto border-t border-slate-100 bg-white">
        <button
          onClick={handleGetIdea}
          disabled={isLoading}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full hover:bg-amber-100 transition-colors border border-amber-200"
        >
          <Lightbulb size={12} />
          Dame una idea
        </button>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pregunta sobre tu dibujo..."
            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;