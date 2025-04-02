import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './App.tsx';
import './index.css';
import '@coinbase/onchainkit/styles.css';

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// polyfill Buffer for client to fix wagmi errors
if (!window.Buffer) {
  window.Buffer = Buffer;
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
