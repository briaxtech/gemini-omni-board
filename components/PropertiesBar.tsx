import React from 'react';
import { PRESET_COLORS, STROKE_SIZES } from '../constants';
import { Undo, Redo, Trash2, Download, Sparkles, Box } from 'lucide-react';

interface PropertiesBarProps {
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
  onToggleAi: () => void;
  onToggle3D: () => void;
  is3DMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const PropertiesBar: React.FC<PropertiesBarProps> = ({
  color,
  setColor,
  size,
  setSize,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  onToggleAi,
  onToggle3D,
  is3DMode,
  canUndo,
  canRedo
}) => {
  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col md:flex-row items-center gap-3 w-[95%] md:w-auto max-w-4xl transition-all">

      {/* Main Tools Pill */}
      <div className="flex items-center gap-1.5 p-2 bg-white/90 backdrop-blur-xl shadow-2xl shadow-black/5 rounded-full border border-white/20">

        {/* Colors */}
        <div className="flex items-center gap-1.5 px-2 border-r border-slate-200/50">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-indigo-600 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
          <div className="relative group mx-0.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 hover:border-indigo-400 transition-all flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-inner">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="opacity-0 w-full h-full cursor-pointer absolute top-0 left-0"
                title="Color personalizado"
              />
            </div>
          </div>
        </div>

        {/* Stroke Size */}
        <div className="flex items-center gap-1.5 px-2 border-r border-slate-200/50">
          {STROKE_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-full bg-slate-800 transition-all ${size === s ? 'opacity-100 bg-indigo-600 shadow-sm' : 'opacity-10 hover:opacity-30'
                }`}
              style={{ width: s + 10, height: s + 10, minWidth: 16, minHeight: 16 }}
              title={`Grosor ${s}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 px-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100/80 rounded-full disabled:opacity-30 transition-all active:scale-95"
            title="Deshacer"
          >
            <Undo size={20} className="stroke-[1.5]" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100/80 rounded-full disabled:opacity-30 transition-all active:scale-95"
            title="Rehacer"
          >
            <Redo size={20} className="stroke-[1.5]" />
          </button>

          <div className="w-px h-6 bg-slate-200/50 mx-1"></div>

          {/* 3D Toggle */}
          <button
            onClick={onToggle3D}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 hover:shadow-sm ${is3DMode ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-200' : 'text-slate-600 hover:bg-slate-100/80'}`}
            title="Modo 3D"
          >
            <Box size={20} className="stroke-[1.5]" />
          </button>

          <div className="w-px h-6 bg-slate-200/50 mx-1"></div>

          <button
            onClick={onClear}
            className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50/80 rounded-full transition-all active:scale-95 hover:shadow-sm"
            title="Borrar todo"
          >
            <Trash2 size={20} className="stroke-[1.5]" />
          </button>
          <button
            onClick={onDownload}
            className="w-10 h-10 flex items-center justify-center text-indigo-500 hover:bg-indigo-50/80 rounded-full transition-all active:scale-95 hover:shadow-sm"
            title="Descargar"
          >
            <Download size={20} className="stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* AI Button - Floating Separately on Mobile if needed, or joined */}
      <div className="flex-shrink-0">
        <button
          onClick={onToggleAi}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-xl shadow-xl shadow-indigo-500/10 rounded-full border border-white/20 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95 group"
        >
          <Sparkles size={18} className="group-hover:animate-pulse" />
          <span className="font-semibold text-sm">IA Mágica</span>
        </button>
      </div>
    </div>
  );
};

export default PropertiesBar;