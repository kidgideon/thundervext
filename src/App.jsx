import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Signup from '../pages/signup';
import Login from '../pages/login';
import { Toaster } from 'sonner'; // ✅ import added here
import Dashboard from '../pages/dashboard';
import ForgotPassword from '../pages/forgot';
import Market from '../pages/market';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors /> {/* ✅ Sonner toaster here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/reset-pwd" element={<ForgotPassword/>} />
        <Route path="/market" element={<Market/>} />
      </Routes>
    </Router>
  );
}

export default App;
