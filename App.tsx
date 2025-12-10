import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import PropertiesBar from './components/PropertiesBar';
import CanvasBoard from './components/CanvasBoard';
import AiPanel from './components/AiPanel';
import { ToolType, DrawingElement } from './types';
import { PRESET_COLORS, STROKE_SIZES } from './constants';
import { getCanvasBlob } from './utils/drawUtils';

const App: React.FC = () => {
  const [tool, setTool] = useState<ToolType>(ToolType.PENCIL);
  const [color, setColor] = useState<string>(PRESET_COLORS[0]);
  const [size, setSize] = useState<number>(STROKE_SIZES[1]);
  const [history, setHistory] = useState<DrawingElement[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingElement[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const handleUndo = () => {
    if (history.length === 0) return;
    const lastElement = history[history.length - 1];
    setRedoStack(prev => [lastElement, ...prev]);
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextElement = redoStack[0];
    setHistory(prev => [...prev, nextElement]);
    setRedoStack(prev => prev.slice(1));
  };

  const handleClear = () => {
    if (history.length === 0) return;
    // Removed window.confirm for faster, touch-friendly erasure.
    // Undo is available if they clear by mistake.
    setHistory([]);
    setRedoStack([]);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const blob = await getCanvasBlob(canvasRef.current);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-board-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, redoStack]);

  return (
    <div className="relative w-screen h-screen bg-slate-50 overflow-hidden font-sans">

      {/* Top Bar */}
      <PropertiesBar
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onDownload={handleDownload}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
      />

      {/* Left Toolbar */}
      <Toolbar currentTool={tool} setTool={setTool} />

      {/* Main Canvas Area */}
      <CanvasBoard
        tool={tool}
        color={color}
        size={size}
        canvasRef={canvasRef}
        history={history}
        setHistory={setHistory}
        redoStack={redoStack}
        setRedoStack={setRedoStack}
      />

      {/* AI Assistant */}
      <AiPanel
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        canvasRef={canvasRef}
      />

      {/* Empty State Hint */}
      {history.length === 0 && !isAiOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-center">
          <h1 className="text-4xl font-bold mb-2">Gemini Omni-Board</h1>
          <p className="text-lg">Pick a tool and start creating.</p>
        </div>
      )}
    </div>
  );
};

export default App;