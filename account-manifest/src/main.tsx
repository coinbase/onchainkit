import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@coinbase/onchainkit/styles.css';
import App from './App.tsx';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
