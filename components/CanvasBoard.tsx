import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ToolType, DrawingElement, Point } from '../types';
import { drawElement } from '../utils/drawUtils';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface CanvasBoardProps {
  tool: ToolType;
  color: string;
  size: number;
  canvasRef: React.RefObject<HTMLCanvasElement>; // Shared ref for parent to access for AI
  history: DrawingElement[];
  setHistory: React.Dispatch<React.SetStateAction<DrawingElement[]>>;
  redoStack: DrawingElement[];
  setRedoStack: React.Dispatch<React.SetStateAction<DrawingElement[]>>;
  is3DMode: boolean;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  tool,
  color,
  size,
  canvasRef,
  history,
  setHistory,
  redoStack,
  setRedoStack,
  is3DMode
}) => {
  // We use two canvases:
  // 1. canvasRef (passed from props) -> The persistent layer where finalized history is drawn
  // 2. tempCanvasRef -> The interaction layer for the current stroke/shape preview
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  // Redraw history function
  const redrawHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background with white first
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    history.forEach(element => drawElement(ctx, element));
  }, [history, canvasRef]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && tempCanvasRef.current) {
        const mainCanvas = canvasRef.current;
        const tempCanvas = tempCanvasRef.current;

        // Only resize if dimensions have changed to avoid unnecessary clearing
        if (mainCanvas.width !== window.innerWidth || mainCanvas.height !== window.innerHeight) {
          mainCanvas.width = window.innerWidth;
          mainCanvas.height = window.innerHeight;
          tempCanvas.width = window.innerWidth;
          tempCanvas.height = window.innerHeight;
          redrawHistory();
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawHistory]);

  // Effect to redraw whenever history changes
  useEffect(() => {
    redrawHistory();
  }, [history, redrawHistory]);

  const getMousePos = (e: React.MouseEvent | MouseEvent): Point => {
    return { x: e.clientX, y: e.clientY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setStartPoint(pos);

    if (tool === ToolType.PENCIL || tool === ToolType.ERASER) {
      setCurrentPoints([pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    const tempCanvas = tempCanvasRef.current;
    if (!tempCanvas) return;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    if (tool === ToolType.PENCIL || tool === ToolType.ERASER) {
      const newPoints = [...currentPoints, pos];
      setCurrentPoints(newPoints);

      const element: DrawingElement = {
        id: 'temp',
        tool,
        color,
        size,
        points: newPoints
      };
      drawElement(ctx, element);
    } else {
      // Shapes
      if (!startPoint) return;
      const element: DrawingElement = {
        id: 'temp',
        tool,
        color,
        size,
        points: [],
        startPoint,
        endPoint: pos,
        is3D: is3DMode // Preview in 3D too
      };
      drawElement(ctx, element);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const pos = getMousePos(e);
    const tempCanvas = tempCanvasRef.current;
    if (tempCanvas) {
      const ctx = tempCanvas.getContext('2d');
      ctx?.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    }

    let newElement: DrawingElement | null = null;

    if (tool === ToolType.PENCIL || tool === ToolType.ERASER) {
      newElement = {
        id: generateId(),
        tool,
        color,
        size,
        points: currentPoints
      };
    } else if (startPoint) {
      newElement = {
        id: generateId(),
        tool,
        color,
        size,
        points: [],
        startPoint,
        endPoint: pos,
        is3D: is3DMode // Capture state
      };
    }

    if (newElement) {
      setHistory(prev => [...prev, newElement!]);
      setRedoStack([]);
    }

    setCurrentPoints([]);
    setStartPoint(null);
  };

  return (
    <div className="absolute inset-0 w-full h-full cursor-crosshair touch-none">
      {/* Persistent Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Interaction Canvas */}
      <canvas
        ref={tempCanvasRef}
        className="absolute inset-0 outline-none"
        style={{ zIndex: 1 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          e.preventDefault(); // Prevent scrolling
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          handleMouseDown(mouseEvent as unknown as React.MouseEvent);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          handleMouseMove(mouseEvent as unknown as React.MouseEvent);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          const mouseEvent = new MouseEvent('mouseup', {});
          handleMouseUp(mouseEvent as unknown as React.MouseEvent);
        }}
      />
    </div>
  );
};

export default CanvasBoard;