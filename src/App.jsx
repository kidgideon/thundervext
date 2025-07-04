import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Signup from '../pages/signup';
import Login from '../pages/login';
import { Toaster } from 'sonner';
import Dashboard from '../pages/dashboard';
import ForgotPassword from '../pages/forgot';
import Market from '../pages/market';
import Stocks from '../pages/stocks';
import Crypto from '../pages/crypto';
import NFT from '../pages/nft';
import Wallet from '../pages/wallet';
import Portfolio from '../pages/portfolio';
import Settings from '../pages/settings';
import ProtectedRoute from '../config/Hooks/protectedRoute';
import AdminHome from '../admin/adminHome';
import Payment from '../admin/adminPayment';
import AdminTraders from '../admin/adminTraders';
import Activites from '../admin/adminActivities';
import AdminSettings from '../admin/adminSettings';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-pwd" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
        <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
        <Route path="/crypto" element={<ProtectedRoute><Crypto /></ProtectedRoute>} />
        <Route path="/etf" element={<ProtectedRoute><NFT /></ProtectedRoute>} />
         <Route path="/admin/home" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
          <Route path="/admin/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
           <Route path="/admin/traders" element={<ProtectedRoute><AdminTraders /></ProtectedRoute>} />
            <Route path="/admin/activities" element={<ProtectedRoute><Activites /></ProtectedRoute>} />
               <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
export default App;
