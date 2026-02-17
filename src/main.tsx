import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './i18n/config'; // Initialise i18n globalement

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
