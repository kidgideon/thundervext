import { motion } from 'framer-motion';
import styles from "../styles/land.module.css";

const Advantages = () => {
  const advantages = [
    {
      title: "Multi-Asset Trading",
      description: "Trade stocks, crypto, ETFs, commodities, forex, and bonds all from one unified platform with seamless portfolio management",
      icon: "fas fa-chart-pie"
    },
    {
      title: "Global Market Access",
      description: "Access to 180+ countries, major exchanges worldwide, and emerging markets with real-time data and local payment methods",
      icon: "fas fa-globe-americas"
    },
    {
      title: "AI-Powered Insights",
      description: "Machine learning algorithms provide personalized investment recommendations, risk analysis, and market trend predictions",
      icon: "fas fa-brain"
    },
    {
      title: "Zero Commission Trading",
      description: "Trade stocks and ETFs with no commission fees, competitive crypto spreads, and transparent pricing with no hidden costs",
      icon: "fas fa-hand-holding-usd"
    },
    {
      title: "Advanced Order Types",
      description: "Stop-loss, take-profit, trailing stops, algorithmic trading, and conditional orders for sophisticated trading strategies",
      icon: "fas fa-cogs"
    },
    {
      title: "Instant Funding",
      description: "Fund your account instantly with bank transfers, crypto deposits, wire transfers, and popular payment methods",
      icon: "fas fa-bolt"
    },
    {
      title: "Professional Tools",
      description: "Advanced charting, technical analysis, backtesting, portfolio analytics, and risk management tools for serious traders",
      icon: "fas fa-tools"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support via live chat, phone, and email with dedicated account managers for premium users",
      icon: "fas fa-headset"
    },
    {
      title: "Educational Resources",
      description: "Comprehensive learning center with tutorials, webinars, market analysis, and trading courses for all skill levels",
      icon: "fas fa-graduation-cap"
    },
     {
      title: "super bonuses",
      description: "Comprehensive learning center with tutorials, webinars, market analysis, and trading courses for all skill levels",
      icon: "fa-solid fa-money-check"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>
            Core <span className={styles.gradientText}>Advantages</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Discover why millions of traders choose Gainovia for their 
            investment journey. From cutting-edge technology to world-class 
            support, we provide everything you need to succeed in global markets.
          </p>
        </motion.div>

        <div className={styles.advantagesGrid}>
          {advantages.map((advantage, index) => (
            <motion.div 
              key={index}
              className={styles.advantageCard}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(162, 60, 244, 0.15)" 
              }}
            >
              <motion.i 
                className={`${advantage.icon} ${styles.advantageIcon}`}
                whileHover={{ rotate: 1 }}
                transition={{ duration: 2 }}
              ></motion.i>
              <h3 className={styles.advantageTitle}>{advantage.title}</h3>
              <p className={styles.advantageDescription}>{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
