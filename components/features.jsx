import { motion } from 'framer-motion';
import styles from "../styles/land.module.css";

const Features = () => {
  const features = [
    {
      icon: "fas fa-chart-line",
      title: "Advanced Analytics",
      description: "Real-time market data, advanced charting tools with 100+ technical indicators, AI-powered market insights, and customizable dashboards. Get professional-grade analysis tools that help you make informed investment decisions with confidence."
    },
    {
      icon: "fas fa-robot",
      title: "AI Portfolio Management",
      description: "Automated portfolio rebalancing powered by machine learning algorithms. Our AI continuously monitors your investments, adjusts allocations based on market conditions, and implements risk management strategies to optimize your returns."
    },
    {
      icon: "fas fa-bolt",
      title: "Lightning-Fast Execution",
      description: "Sub-second order execution with institutional-grade infrastructure. Zero-fee stock and ETF trading, competitive crypto spreads, and advanced order types including limit, stop-loss, and algorithmic trading strategies."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Bank-Level Security",
      description: "Multi-signature cold storage, advanced encryption protocols, 2FA authentication, and insurance coverage up to $250M. Your assets are protected by the same security standards used by major financial institutions."
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Mobile-First Platform",
      description: "Full-featured mobile apps for iOS and Android with real-time notifications, biometric authentication, and offline chart analysis. Trade anywhere, anytime with our award-winning mobile platform."
    },
    {
      icon: "fas fa-globe",
      title: "Global Market Access",
      description: "Access to 180+ countries, major stock exchanges worldwide, 200+ cryptocurrencies, thousands of ETFs, commodities, and forex markets. Diversify your portfolio across global markets with ease."
    }
  ];

  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>
            Platform <span className={styles.gradientText}>Features</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Experience the future of trading with cutting-edge technology, 
            advanced analytics, and institutional-grade tools designed for 
            modern investors and traders of all levels.
          </p>
        </motion.div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={styles.featureCard}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 40px rgba(162, 60, 244, 0.2)",
                scale: 1.02 
              }}
            >
              <motion.div 
                className={styles.featureIcon}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <i className={feature.icon}></i>
              </motion.div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
