import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import App from './App';
import Game from './components/GameScreen';
import BackgroundMusic from './components/BackgroundMusic';  // Asegúrate de que el path sea correcto

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <BackgroundMusic />
            <App />
          </>
        } />
        <Route path="/game/:level" element={
          <>
            <BackgroundMusic />
            <Game />
          </>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

