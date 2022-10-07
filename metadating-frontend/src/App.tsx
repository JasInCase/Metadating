import React from 'react';
import { Routes, Route, Router, Link, BrowserRouter } from "react-router-dom";
import FormPage from './Pages/FormPage';
import ConversationPage from './Pages/ConversationPage';
import { Home } from '@mui/icons-material';
import { Switch } from '@mui/material';
import LoginPage from './Pages/LoginPage';
// import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />}></Route>
        <Route path="/conversation" element={<ConversationPage />}></Route>
        <Route path="/login" element={<LoginPage/>}> </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
