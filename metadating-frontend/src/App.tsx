import React from 'react';
import { Routes, Route, Router, Link, BrowserRouter } from "react-router-dom";
import { Home } from '@mui/icons-material';
import { Switch } from '@mui/material';
import ConversationPage from './Pages/ConversationPage';
import FormPage from './Pages/FormPage';
import HomePage from './Pages/HomePage';
import LaunchPage from "./Pages/LaunchPage";
import LoginPage from './Pages/LoginPage';
import PracticeConversationPage from './Pages/PracticeConversation';
import RealConversationPage from './Pages/RealConversation';
import SignUpPage from './Pages/SignUpPage';
// import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />}>
          {" "}
        </Route>
        <Route path="/login" element={<LoginPage />}>
          {" "}
        </Route>
        <Route path="/signup" element={<SignUpPage />}>
          {" "}
        </Route>
        <Route path="/form" element={<FormPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/conversation" element={<ConversationPage />}></Route>
        <Route
          path="/real-conversation/:id"
          element={<RealConversationPage />}
        ></Route>
        <Route
          path="/practice-conversation/:id"
          element={<PracticeConversationPage />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
