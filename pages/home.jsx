import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/home.css"
import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import logo from "../images/logo.jpg";
import tradeChart from "../images/tradeimage.webp";
import crypto from "../images/crypto2x.jpg";
import Hero from "../components/hero";
import Advantages from "../components/advantages";
import CryptoSpotlight from "../components/cryptospotlight";
import Features from "../components/features";
import Trust from "../components/trust";
const Home = () => {

  return (
    <div className="home-page-container">
      <NavBar />
      <Hero/>
      <CryptoSpotlight/>
      <Features/>
      <Trust/>
      <Advantages/>
      <Footer />
    </div>
  );
};

export default Home;
