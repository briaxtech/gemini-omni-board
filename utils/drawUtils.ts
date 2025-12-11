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

  // Draw Image (Template)
  if (element.imageUrl && element.image) {
    // If we have a stored image object, use it.
    // We assume the image is loaded.
    const img = element.image;
    // Center the image at the first point (which acts as position)
    const pos = element.points[0];
    if (pos) {
      // Default size or scaled? For now, fixed size or based on stroke size/logic
      // Let's make templates a fixed reasonable size, e.g., 300x300
      const w = 300;
      const h = 300;
      ctx.drawImage(img, pos.x - w / 2, pos.y - h / 2, w, h);
    }
    return;
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

    if (element.is3D) {
      // Draw 3D Cube (approximate isometric-ish extrusion)
      const depth = width * 0.4;
      const dx = depth * 0.5; // shift x
      const dy = -depth * 0.5; // shift y (upwards)

      // Front face
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);

      // Connectors
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(startPoint.x + dx, startPoint.y + dy); // Top-left

      ctx.moveTo(startPoint.x + width, startPoint.y);
      ctx.lineTo(startPoint.x + width + dx, startPoint.y + dy); // Top-right

      ctx.moveTo(startPoint.x, startPoint.y + height);
      ctx.lineTo(startPoint.x + dx, startPoint.y + height + dy); // Bottom-left

      ctx.moveTo(startPoint.x + width, startPoint.y + height);
      ctx.lineTo(startPoint.x + width + dx, startPoint.y + height + dy); // Bottom-right

      // Back face (partial/lines)
      ctx.moveTo(startPoint.x + dx, startPoint.y + dy);
      ctx.lineTo(startPoint.x + width + dx, startPoint.y + dy); // Top back
      ctx.lineTo(startPoint.x + width + dx, startPoint.y + height + dy); // Right back
      ctx.lineTo(startPoint.x + dx, startPoint.y + height + dy); // Bottom back
      ctx.lineTo(startPoint.x + dx, startPoint.y + dy); // Close back
    } else {
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      return;
    }

  } else if (tool === ToolType.CIRCLE && startPoint && endPoint) {
    const radius = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
    );

    if (element.is3D) {
      // Sphere effect
      // We can't easily do a gradient stroke, but we can draw lat/long lines or a gradient fill if we were filling.
      // For stroke-only, let's draw a "wireframe sphere" look
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Equator
      ctx.beginPath();
      ctx.ellipse(startPoint.x, startPoint.y, radius, radius * 0.4, 0, 0, 2 * Math.PI);
      ctx.stroke();

      // Meridian
      ctx.beginPath();
      ctx.ellipse(startPoint.x, startPoint.y, radius * 0.4, radius, 0, 0, 2 * Math.PI);
    } else {
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
    }

  } else if (tool === ToolType.TRIANGLE && startPoint && endPoint) {
    // Isosceles triangle points
    const topX = (startPoint.x + endPoint.x) / 2;
    const topY = startPoint.y;
    const botLeftX = startPoint.x;
    const botLeftY = endPoint.y;
    const botRightX = endPoint.x;
    const botRightY = endPoint.y;

    if (element.is3D) {
      // Pyramid
      // Base (perspectived rectangle/rhombus? Or just the triangle base?)
      // Let's do a square-based pyramid logic or just extrude the triangle.
      // Simplest clear 3D triangle is a Tetrahedron-like shape.

      // Draw base triangle front
      ctx.moveTo(botLeftX, botLeftY);
      ctx.lineTo(botRightX, botRightY);
      ctx.lineTo(topX, topY);
      ctx.lineTo(botLeftX, botLeftY);

      // Side face logic?
      // Let's draw a central "peak" that gives depth.
      // Or just an outline of a side.
      // Let's try drawing a line from Top to a "back" point.
      const depthX = (endPoint.x - startPoint.x) * 0.3;
      const depthY = -(endPoint.y - startPoint.y) * 0.2;

      ctx.lineTo(topX + depthX, topY + depthY); // Side edge
      ctx.lineTo(botRightX, botRightY); // Connect to bottom right

    } else {
      ctx.moveTo(botLeftX, botLeftY);
      ctx.lineTo(botRightX, botRightY);
      ctx.lineTo(topX, topY);
      ctx.closePath();
    }
  } else if (tool === ToolType.STAR && startPoint && endPoint) {
    // 5-point star
    const outerRadius = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
    const innerRadius = outerRadius * 0.4;
    const cx = startPoint.x;
    const cy = startPoint.y;

    // Star logic
    for (let i = 0; i < 5; i++) {
      // Outer point
      ctx.lineTo(
        cx + Math.cos((18 + i * 72) * Math.PI / 180) * outerRadius,
        cy - Math.sin((18 + i * 72) * Math.PI / 180) * outerRadius
      );
      // Inner point
      ctx.lineTo(
        cx + Math.cos((54 + i * 72) * Math.PI / 180) * innerRadius,
        cy - Math.sin((54 + i * 72) * Math.PI / 180) * innerRadius
      );
    }
    ctx.closePath();

    if (element.is3D) {
      // Simple extrusion effect: duplicates the star shifted and connects points
      ctx.stroke(); // Draw front star first

      const depth = 10;
      // This is complex to draw perfectly in 3D without filling, 
      // effectively we'd just stick to the 2D star for now unless we want a full shadow.
      // Let's leave Star as 2D for now or add a simple shadow offset.
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fill();
    }
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
