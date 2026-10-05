import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetupScreen from './pages/SetupScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
