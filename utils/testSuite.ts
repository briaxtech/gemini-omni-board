import { TOOLS, PRESET_COLORS } from '../constants';
import { ToolType, DrawingElement } from '../types';
import { drawElement } from './drawUtils';

export const runTestSuite = async (): Promise<{ success: boolean; message: string }> => {
  console.group('🚀 Omni-Board System Check & Stress Test');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`%c✅ PASS: ${message}`, 'color: #10B981');
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // 1. Configuration Integrity
    assert(TOOLS.length === 5, 'Tool definitions loaded');
    assert(TOOLS.some(t => t.id === ToolType.PENCIL), 'Pencil tool configured');
    assert(PRESET_COLORS.length >= 8, 'Color palette loaded');

    // 2. Runtime Environment
    assert(typeof window !== 'undefined', 'Browser environment detected');
    assert(!!document.getElementById('root'), 'Root mount point exists');
    
    // 3. Canvas Capabilities
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    assert(!!ctx, 'Canvas 2D Context supported');
    
    if (ctx) {
        // 4. Stress Test: Render Performance
        console.groupCollapsed('🔥 Running Stress Test (1000 Elements)...');
        const startTime = performance.now();
        
        const dummyElements: DrawingElement[] = [];
        for(let i=0; i<1000; i++) {
            dummyElements.push({
                id: `stress-${i}`,
                tool: ToolType.PENCIL,
                color: PRESET_COLORS[i % PRESET_COLORS.length],
                size: 2,
                points: [{x: Math.random() * 800, y: Math.random() * 600}, {x: Math.random() * 800, y: Math.random() * 600}]
            });
        }
        
        dummyElements.forEach(el => drawElement(ctx, el));
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.groupEnd();
        
        console.log(`Stress Test Duration: ${duration.toFixed(2)}ms`);
        assert(duration < 1000, `Rendering 1000 elements took < 1s (${duration.toFixed(2)}ms)`);
    }

    const result = {
        success: failed === 0,
        message: failed === 0 
            ? `System Operational. Stress Test Passed.` 
            : `System Degraded. ${failed} checks failed.`
    };
    
    console.log(`%c\n${result.message}`, `font-weight: bold; color: ${result.success ? '#10B981' : '#EF4444'}`);
    return result;

  } catch (e) {
    console.error('Test Suite Exception:', e);
    return { success: false, message: 'Test Suite Exception Occurred' };
  } finally {
    console.groupEnd();
  }
};