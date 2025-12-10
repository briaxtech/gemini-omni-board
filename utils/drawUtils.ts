import { ToolType, DrawingElement, Point } from '../types';

export const drawElement = (
  ctx: CanvasRenderingContext2D,
  element: DrawingElement
) => {
  const { tool, color, size, points, startPoint, endPoint } = element;

  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;

  // Eraser is essentially drawing with the background color or destination-out
  // For simplicity in a single layer canvas, we assume white background for eraser
  if (tool === ToolType.ERASER) {
    ctx.strokeStyle = '#FFFFFF';
  }

  ctx.beginPath();

  if (tool === ToolType.PENCIL || tool === ToolType.ERASER) {
    if (points.length < 1) return;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
  } else if (tool === ToolType.LINE && startPoint && endPoint) {
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
  } else if (tool === ToolType.RECTANGLE && startPoint && endPoint) {
    const width = endPoint.x - startPoint.x;
    const height = endPoint.y - startPoint.y;
    ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    return; // strokeRect draws immediately
  } else if (tool === ToolType.CIRCLE && startPoint && endPoint) {
    const radius = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
    );
    ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
  }

  ctx.stroke();
};

export const getCanvasBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
};

// Helper to convert Blob to Base64 for Gemini
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g. "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
