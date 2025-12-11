import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Lightbulb, Keyboard, Image as ImageIcon, Gamepad2 } from 'lucide-react';
import { AiMessage } from '../types';
import { analyzeDrawing, generateIdea } from '../services/geminiService';
import { getCanvasBlob } from '../utils/drawUtils';
import VirtualKeyboard from './VirtualKeyboard';

interface AiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onAddTemplate?: (imageUrl: string) => void;
}

const TEMPLATES = [
  { id: 'minecraft', name: 'Minecraft', url: '/templates/minecraft_creeper.png' },
  { id: 'fortnite', name: 'Fortnite', url: '/templates/fortnite_bus.png' },
  { id: 'roblox', name: 'Roblox', url: '/templates/roblox_character.png' },
  { id: 'fallguys', name: 'Fall Guys', url: '/templates/fallguys_bean.png' }, // Verify file names match move commands
  { id: 'rocket', name: 'Rocket L.', url: '/templates/rocket_league_car.png' },
];

const AiPanel: React.FC<AiPanelProps> = ({ isOpen, onClose, canvasRef, onAddTemplate }) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    { role: 'model', text: "¡Hola Koki! Soy Pepito. ¡Vamos a crear algo épico hoy! 🎮🎨" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, showKeyboard, showTemplates]);

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
        setMessages(prev => [...prev, { role: 'model', text: "¡Lag visual, Koki! No veo el dibujo. ¿Probamos de nuevo? 🛸" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "¡Bug en la matrix! Inténtalo otra vez. 🐛" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetIdea = async () => {
    setIsLoading(true);
    try {
      const idea = await generateIdea();
      setMessages(prev => [...prev, { role: 'model', text: `💡 ¡Misión para Koki!: ${idea}` }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Cargando mapa... un segundo Koki. 🗺️" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = (url: string) => {
    if (onAddTemplate) {
      onAddTemplate(url);
      setMessages(prev => [...prev, { role: 'model', text: "¡Template spawneado! ¡A colorear! 🖌️" }]);
      setShowTemplates(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
    } else {
      setInput(prev => prev + key);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 max-w-[90vw] bg-white rounded-3xl shadow-2xl border-4 border-indigo-100 flex flex-col overflow-hidden z-30 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg">
          <div className="p-1.5 bg-indigo-100 rounded-xl">
            <Sparkles size={20} className="text-indigo-600" />
          </div>
          <span>Pepito</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
          <X size={20} />
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
              className={`max-w-[85%] p-3.5 rounded-2xl text-[15px] leading-relaxed font-medium ${msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-200'
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              Procesando jugada...
            </div>
          </div>
        )}

        {/* Templates Grid */}
        {showTemplates && (
          <div className="grid grid-cols-2 gap-2 p-2 bg-slate-100/50 rounded-2xl border border-slate-200 mb-2">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => handleTemplateClick(t.url)}
                className="flex flex-col items-center gap-1 p-2 bg-white rounded-xl shadow-sm hover:ring-2 hover:ring-indigo-400 transition-all active:scale-95"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 overflow-hidden">
                  <img src={t.url} alt={t.name} className="w-full h-full object-contain opacity-70" />
                </div>
                <span className="text-xs font-bold text-slate-600">{t.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-2 flex gap-2 overflow-x-auto border-t border-slate-100 bg-white no-scrollbar">
        <button
          onClick={handleGetIdea}
          disabled={isLoading}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl hover:bg-amber-100 transition-colors border border-amber-200 active:scale-95"
        >
          <Lightbulb size={14} />
          ¡Dame Idea!
        </button>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors border active:scale-95 ${showTemplates ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
        >
          <ImageIcon size={14} />
          Plantillas
        </button>
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors border active:scale-95 ${showKeyboard ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
        >
          <Keyboard size={14} />
          Teclado
        </button>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-100 flex flex-col">
        {showKeyboard && (
          <div className="border-b border-slate-100">
            <VirtualKeyboard onKeyPress={handleKeyPress} onClose={() => setShowKeyboard(false)} />
          </div>
        )}
        <div className="p-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe aquí, crack..."
            className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md active:scale-90"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;