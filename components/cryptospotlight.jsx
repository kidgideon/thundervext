import { motion } from 'framer-motion';
import styles from "../styles/land.module.css";

const CryptoSpotlight = () => {
  const cryptoData = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$43,247.82', change: '+5.2%', positive: true, icon: '₿' },
    { name: 'Ethereum', symbol: 'ETH', price: '$2,892.35', change: '+3.8%', positive: true, icon: 'Ξ' },
    { name: 'Solana', symbol: 'SOL', price: '$89.42', change: '-1.2%', positive: false, icon: 'S' },
    { name: 'Cardano', symbol: 'ADA', price: '$0.48', change: '+7.5%', positive: true, icon: 'A' },
    { name: 'Polygon', symbol: 'MATIC', price: '$0.87', change: '+4.2%', positive: true, icon: 'M' },
    { name: 'Chainlink', symbol: 'LINK', price: '$14.23', change: '+2.8%', positive: true, icon: 'L' },
  ];

  const features = [
    "Advanced charting with 100+ indicators",
    "Sub-second order execution",
    "DeFi yield farming opportunities", 
    "Automated dollar-cost averaging",
    "Portfolio rebalancing algorithms",
    "24/7 customer support"
  ];

  return (
    <section id="trading" className={`${styles.section} ${styles.cryptoSpotlight}`}>
      <div className={styles.container}>
        <div className={styles.cryptoContent}>
          {/* Left Column - Content */}
          <motion.div 
            className={styles.cryptoText}
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>
              Crypto Trading <span className={styles.gradientText}>Redefined</span>
            </h2>
            <p className={styles.cryptoDescription}>
              Trade over 200+ cryptocurrencies with advanced order types, 
              competitive spreads, and institutional-grade security. Access 
              spot trading, futures, options, DeFi opportunities, NFT marketplace, 
              and yield farming all in one comprehensive platform.
            </p>
            
            <div className={styles.cryptoFeatures}>
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className={styles.cryptoFeature}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <i className="fas fa-check-circle"></i>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.a 
              href="/signup" 
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(162, 60, 244, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
             <i class="fa-solid fa-money-bill-trend-up"></i>
              Start Trading Crypto
            </motion.a>
          </motion.div>

          {/* Right Column - Enhanced Crypto Prices */}
          <motion.div 
            className={styles.cryptoPrices}
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className={styles.pricesHeader}>
              <h3 className={styles.pricesTitle}>
                <i className="fas fa-chart-bar"></i> Live Prices
              </h3>
              <div className={styles.liveIndicator}>
                <i className="fas fa-circle" style={{color: '#10b981', fontSize: '8px'}}></i> Real-time
              </div>
            </div>

            <div>
              {cryptoData.map((crypto, index) => (
                <motion.div 
                  key={index} 
                  className={styles.priceItem}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <div className={styles.cryptoInfo}>
                    <div className={styles.cryptoIcon}>{crypto.icon}</div>
                    <div>
                      <div className={styles.cryptoName}>{crypto.name}</div>
                      <div className={styles.cryptoSymbol}>{crypto.symbol}</div>
                    </div>
                  </div>
                  
                  <div className={styles.priceData}>
                    <div className={styles.cryptoPrice}>{crypto.price}</div>
                    <div className={`${styles.priceChange} ${crypto.positive ? styles.positive : styles.negative}`}>
                      <i className={`fas fa-arrow-${crypto.positive ? 'up' : 'down'}`}></i>
                      <span>{crypto.change}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className={styles.cryptoSummary}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.summaryValue}>200+</div>
              <div className={styles.summaryLabel}>
                <i className="fas fa-coins"></i> Cryptocurrencies Available
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CryptoSpotlight;
