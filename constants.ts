import { ToolType } from './types';
import { Pencil, Eraser, Minus, Square, Circle } from 'lucide-react';

export const TOOLS = [
  { id: ToolType.PENCIL, icon: Pencil, label: 'Pencil' },
  { id: ToolType.ERASER, icon: Eraser, label: 'Eraser' },
  { id: ToolType.LINE, icon: Minus, label: 'Line' },
  { id: ToolType.RECTANGLE, icon: Square, label: 'Rectangle' },
  { id: ToolType.CIRCLE, icon: Circle, label: 'Circle' },
];

export const PRESET_COLORS = [
  '#000000', // Black
  '#EF4444', // Red
  '#F59E0B', // Orange
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

export const STROKE_SIZES = [2, 4, 8, 12, 24];