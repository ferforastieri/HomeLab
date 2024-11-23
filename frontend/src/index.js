import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as Sentry from "@sentry/react";

// Inicializar Sentry apenas em produção
if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        environment: process.env.REACT_APP_ENVIRONMENT
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
