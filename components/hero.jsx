import { motion } from 'framer-motion';
import styles from "../styles/land.module.css";

const Hero = () => {
  const chartData = [40, 65, 45, 80, 60, 90, 75, 95, 70, 85];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          {/* Left Column - Content */}
          <motion.div 
            className={styles.heroText}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className={styles.heroTitle}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Invest Smarter with{' '}
              <span className={styles.gradientText}>Gainovia</span>
            </motion.h1>
            
            <motion.p 
              className={styles.heroSubtitle}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Trade crypto, stocks, and ETFs in one powerful platform. 
              Experience real-time analytics, automated portfolio rebalancing, 
              instant transactions, and advanced risk management tools designed 
              for both beginners and professional traders.
            </motion.p>

            <motion.div 
              className={styles.heroButtons}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.a 
                href="/signup" 
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(162, 60, 244, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-rocket"></i>
                Get Started Free
              </motion.a>
              
              <motion.a 
                href="#" 
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-play"></i>
                Watch Demo
              </motion.a>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div 
              className={styles.statsGrid}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div 
                className={styles.statItem}
                whileHover={{ scale: 1.05 }}
              >
                <span className={styles.statValue}>$2.5B+</span>
                <span className={styles.statLabel}>Assets Under Management</span>
              </motion.div>
              <motion.div 
                className={styles.statItem}
                whileHover={{ scale: 1.05 }}
              >
                <span className={styles.statValue}>500K+</span>
                <span className={styles.statLabel}>Active Traders Worldwide</span>
              </motion.div>
              <motion.div 
                className={styles.statItem}
                whileHover={{ scale: 1.05 }}
              >
                <span className={styles.statValue}>180+</span>
                <span className={styles.statLabel}>Countries Supported</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Enhanced Dashboard Preview */}
          <motion.div 
            className={styles.dashboardPreview}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Dashboard Header */}
            <div className={styles.dashboardHeader}>
              <h3 className={styles.dashboardTitle}>
                <i className="fas fa-chart-line"></i> Portfolio Overview
              </h3>
              <div className={styles.trendIndicator}>
                <i className="fas fa-trending-up"></i>
                <span>+12.5%</span>
              </div>
            </div>

            {/* Portfolio Value */}
            <div>
              <div className={styles.portfolioValue}>$47,382.51</div>
              <div className={styles.portfolioLabel}>Total Portfolio Value</div>
            </div>

            {/* Enhanced Chart */}
            <div className={styles.chartContainer}>
              {chartData.map((height, index) => (
                <motion.div 
                  key={index}
                  className={styles.chartBar}
                  style={{ height: `${height}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                ></motion.div>
              ))}
            </div>

            {/* Enhanced Assets List */}
            <div className={styles.assetsList}>
              {[
                { name: 'Bitcoin', symbol: 'BTC', amount: '0.0234 BTC', price: '$1,247.82', change: '+5.2%', icon: '₿', iconClass: styles.btcIcon },
                { name: 'Ethereum', symbol: 'ETH', amount: '2.45 ETH', price: '$4,892.35', change: '+3.8%', icon: 'Ξ', iconClass: styles.ethIcon },
                { name: 'S&P 500 ETF', symbol: 'SPY', amount: '25 Shares', price: '$11,250.00', change: '+2.1%', icon: 'S', iconClass: styles.spyIcon }
              ].map((asset, index) => (
                <motion.div 
                  key={index}
                  className={styles.assetItem}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <div className={styles.assetInfo}>
                    <div className={`${styles.assetIcon} ${asset.iconClass}`}>{asset.icon}</div>
                    <div className={styles.assetDetails}>
                      <h4>{asset.name}</h4>
                      <div className={styles.assetAmount}>{asset.amount}</div>
                    </div>
                  </div>
                  <div className={styles.assetValue}>
                    <div className={styles.assetPrice}>{asset.price}</div>
                    <div className={`${styles.assetChange} ${styles.positive}`}>
                      <i className="fas fa-arrow-up"></i> {asset.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
