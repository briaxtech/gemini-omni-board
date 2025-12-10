import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error: any) {
  console.error("Application crashed:", error);
  document.body.innerHTML = `
    <div style="padding: 2rem; color: #ef4444; font-family: system-ui, sans-serif;">
      <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Something went wrong</h1>
      <p>The application failed to start.</p>
      <pre style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; overflow: auto;">${error.message || JSON.stringify(error)}</pre>
    </div>
  `;
}