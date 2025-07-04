import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/home.css"
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import logo from "../images/logo.jpg";
import tradeChart from "../images/tradeimage.webp";
import crypto from "../images/crypto2x.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="x-prt780-wrapper">
      <NavBar />

      {/* Hero Section */}
      <motion.section
        className="x-prt780-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={logo}
          alt="Thundervext Logo"
          className="x-prt780-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          INVEST SMARTER WITH{" "}
          <span className="x-prt780-highlight">THUNDERVEXT</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Access stocks, crypto & tools used by global traders — all in one platform.
        </motion.p>
        <motion.button
          className="x-prt780-cta"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/signup")}
        >
          Get Started
        </motion.button>
        <motion.img
          src={tradeChart}
          alt="Trading chart"
          className="x-prt780-chart"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.section>

      {/* Highlight Section */}
      <motion.section
        className="x-prt780-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="x-prt780-section-inner">
          <h2>Diversify with Confidence</h2>
          <p>Trade 100+ cryptos, 7,000+ stocks & manage your portfolio from anywhere.</p>
          <div className="x-prt780-btn-group">
            <motion.button
              className="x-prt780-secondary"
              whileHover={{ scale: 1.07 }}
              onClick={() => navigate("/signup")}
            >
              Explore Assets
            </motion.button>
            <motion.button
              className="x-prt780-secondary outline"
              whileHover={{ scale: 1.07 }}
              onClick={() => navigate("/about")}
            >
              Why Thundervext?
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Crypto Section */}
      <motion.section
        className="x-prt780-crypto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="x-prt780-crypto-img"
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img src={crypto} alt="Crypto" />
        </motion.div>
        <motion.div
          className="x-prt780-crypto-text"
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2>Seamless Crypto Trading</h2>
          <p>
            Buy, hold and manage over 70 cryptoassets. Low fees, fast execution
            and high security.
          </p>
          <motion.button
            className="x-prt780-secondary"
            whileHover={{ scale: 1.07 }}
            onClick={() => navigate("/signup")}
          >
            Invest in Crypto
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="x-prt780-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="x-prt780-features">
          <h2>All-in-One Platform</h2>
          <div className="x-prt780-feature-grid">
            {[
              {
                title: "Real-Time Analytics",
                desc: "Track your investments with live charts, profit/loss, and instant alerts.",
                icon: "fa-chart-line",
              },
              {
                title: "Auto Portfolio Rebalancing",
                desc: "Keep your portfolio optimized with smart, automated rebalancing.",
                icon: "fa-rotate",
              },
              {
                title: "Instant Deposits & Withdrawals",
                desc: "Move funds in and out with lightning speed and zero hassle.",
                icon: "fa-bolt",
              },
              {
                title: "24/7 Support",
                desc: "Get help anytime from our expert team, day or night.",
                icon: "fa-headset",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="x-prt780-feature-card"
                whileHover={{ scale: 1.04 }}
              >
                <i className={`fa-solid ${f.icon}`} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trust Section */}
      <motion.section
        className="x-prt780-trust"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2>Why Thundervext?</h2>
        <div className="x-prt780-trust-grid">
          {[
            ["Global Reach", "Active in 100+ countries"],
            ["Secure", "Your assets are protected"],
            ["Established", "In fintech since 2007"],
            ["Trusted", "Used by 35M+ traders"],
          ].map(([title, desc], i) => (
            <motion.div
              className="x-prt780-card"
              key={i}
              whileHover={{ scale: 1.04 }}
            >
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Home;
