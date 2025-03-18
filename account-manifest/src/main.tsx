import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@coinbase/onchainkit/styles.css';
import App from './App.tsx';
// biome-ignore lint/style/useNodejsImportProtocol: not using node.js modules
// biome-ignore lint/correctness/noNodejsModules: https://github.com/wevm/wagmi/issues/270#issuecomment-1075473815
import { Buffer } from 'buffer';

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
