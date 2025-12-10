import React from 'react';
import { TOOLS } from '../constants';
import { ToolType } from '../types';

interface ToolbarProps {
  currentTool: ToolType;
  setTool: (tool: ToolType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ currentTool, setTool }) => {
  return (
    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 rounded-full p-2 flex flex-col gap-3 border border-white/20 z-20">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setTool(tool.id)}
          className={`p-3 rounded-full transition-all duration-300 group relative ${currentTool === tool.id
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-100 ring-2 ring-indigo-100'
            : 'text-slate-400 hover:bg-slate-100/50 hover:text-slate-600'
            }`}
          title={tool.label}
        >
          <tool.icon size={22} strokeWidth={currentTool === tool.id ? 2.5 : 2} />
          {/* Tooltip */}
          <span className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
            {tool.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;