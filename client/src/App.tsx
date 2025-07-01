import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateLecturePage from './pages/CreateLecturePage';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CreateLecturePage />} />
      <Route path="/create-lecture" element={<CreateLecturePage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
