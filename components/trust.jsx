import { motion } from 'framer-motion';
import styles from "../styles/land.module.css";

const Trust = () => {
  const metrics = [
    { value: '99.9%', label: 'Uptime Guarantee', description: 'Our servers ensure your trading never stops.' },
    { value: '$250M', label: 'Insurance Coverage', description: 'Your assets are protected against any unforeseen events.' },
    { value: 'Tier 4', label: 'Data Centers', description: 'State-of-the-art security and redundancy for your peace of mind.' },
    { value: '24/7', label: 'Expert Support', description: 'Our team is always here to assist you with any questions.' }
  ];

  return (
    <section id="security" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            You Can <span className={styles.gradientText}>Trust Us</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            We prioritize your security and peace of mind with industry-leading 
            measures, insurance coverage, and a dedicated support team available 
            around the clock.
          </p>
        </div>

        <div className={styles.trustMetrics}>
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              className={styles.metricCard}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricDescription}>{metric.description}</div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className={styles.securitySection}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className={styles.securityContent}>
            {/* Left Column - Security Text */}
            <div className={styles.securityText}>
              <h3>
                Advanced Security <span className={styles.gradientText}>Measures</span>
              </h3>
              <p className={styles.securityDescription}>
                We employ cutting-edge security technologies and protocols to 
                ensure the safety of your funds and personal information. Our 
                multi-layered approach includes:
              </p>
              <div className={styles.securityFeatures}>
                <div className={styles.securityFeature}>
                  <i className="fas fa-check-circle"></i>
                  <span>Multi-signature cold storage</span>
                </div>
                <div className={styles.securityFeature}>
                  <i className="fas fa-check-circle"></i>
                  <span>Two-factor authentication (2FA)</span>
                </div>
                <div className={styles.securityFeature}>
                  <i className="fas fa-check-circle"></i>
                  <span>Advanced encryption protocols</span>
                </div>
                <div className={styles.securityFeature}>
                  <i className="fas fa-check-circle"></i>
                  <span>Regular security audits</span>
                </div>
                <div className={styles.securityFeature}>
                  <i className="fas fa-check-circle"></i>
                  <span>Biometric authentication</span>
                </div>
              </div>
            </div>

            {/* Right Column - Security Visual */}
            <div className={styles.securityVisual}>
              <motion.div 
                className={styles.securityCard}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.securityIcon}>
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className={styles.securityTitle}>Protection</h3>
                <div className={styles.protectedAmount}>$250M</div>
                <div className={styles.protectionDescription}>Insurance Coverage</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Trust;
