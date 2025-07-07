import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Home from '../pages/home';
import Signup from '../pages/signup';
import Login from '../pages/login';
import ForgotPassword from '../pages/forgot';

import Dashboard from '../pages/dashboard';
import Market from '../pages/market';
import Stocks from '../pages/stocks';
import Crypto from '../pages/crypto';
import NFT from '../pages/nft';
import Wallet from '../pages/wallet';
import Portfolio from '../pages/portfolio';
import Settings from '../pages/settings';
import UserProfile from '../pages/profile';
import CopyTraderProfile from '../pages/traderProfile';

import AdminHome from '../admin/adminHome';
import Payment from '../admin/adminPayment';
import AdminTraders from '../admin/adminTraders';
import Activities from '../admin/adminActivities';
import AdminSettings from '../admin/adminSettings';
import ManageUser from '../admin/adminManagUser';


import ProtectedRoute from '../config/Hooks/protectedRoute';
import RoleProtectedRoute from '../config/Hooks/roleProtection';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-pwd" element={<ForgotPassword />} />

        {/* Protected Routes (For Authenticated Users) */}
        <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
        <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
        <Route path="/crypto" element={<ProtectedRoute><Crypto /></ProtectedRoute>} />
        <Route path="/etf" element={<ProtectedRoute><NFT /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><CopyTraderProfile /></ProtectedRoute>} />
        <Route path="/manage/:username" element={<ProtectedRoute><ManageUser /></ProtectedRoute>} />


        {/* Admin Role-Protected Routes */}
        <Route path="/admin/home" element={<RoleProtectedRoute><AdminHome /></RoleProtectedRoute>} />
        <Route path="/admin/payment" element={<RoleProtectedRoute><Payment /></RoleProtectedRoute>} />
        <Route path="/admin/traders" element={<RoleProtectedRoute><AdminTraders /></RoleProtectedRoute>} />
        <Route path="/admin/activities" element={<RoleProtectedRoute><Activities /></RoleProtectedRoute>} />
        <Route path="/admin/settings" element={<RoleProtectedRoute><AdminSettings /></RoleProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
