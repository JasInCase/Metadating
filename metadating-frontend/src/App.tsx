import React from 'react';
import { Routes, Route, Router, Link, BrowserRouter } from "react-router-dom";
import ConversationPage from './Pages/ConversationPage';
import FormPage from './Pages/FormPage';
import HomePage from './Pages/HomePage';
import { Home } from '@mui/icons-material';
import { Switch } from '@mui/material';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
// import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}> </Route>
        <Route path="/signup" element={<SignUpPage />}> </Route>
        <Route path="/form" element={<FormPage />}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path="/conversation" element={<ConversationPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
