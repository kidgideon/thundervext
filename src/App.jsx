import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Signup from '../pages/signup';
import Login from '../pages/login';
import { Toaster } from 'sonner'; // ✅ import added here
import Dashboard from '../pages/dashboard';
import ForgotPassword from '../pages/forgot';
import Market from '../pages/market';
import Stocks from '../pages/stocks';
import Crypto from '../pages/crypto';
import NFT from '../pages/nft';
import Wallet from '../pages/wallet';

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
        <Route path="/stocks" element={<Stocks/>} />
        <Route path="/crypto" element={<Crypto/>} />
        <Route path="/nft" element={<NFT/>} />
        <Route path="/wallet" element={<Wallet/>} />
      </Routes>
    </Router>
  );
}

export default App;
