import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateLecturePage from "./pages/CreateLecturePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateLecturePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
