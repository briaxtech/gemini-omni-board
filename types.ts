export enum ToolType {
  PENCIL = 'pencil',
  ERASER = 'eraser',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
  STAR = 'star',
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
  is3D?: boolean; // 3D effect flag
  imageUrl?: string; // For template images
  image?: HTMLImageElement; // Loaded image object
}

export interface AiMessage {
  role: 'user' | 'model';
  text: string;
}
