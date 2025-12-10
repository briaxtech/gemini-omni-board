export enum ToolType {
  PENCIL = 'pencil',
  ERASER = 'eraser',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  tool: ToolType;
  color: string;
  size: number;
  points: Point[]; // For pencil/eraser
  startPoint?: Point; // For shapes
  endPoint?: Point; // For shapes
}

export interface AiMessage {
  role: 'user' | 'model';
  text: string;
}
