import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/stats.css";

const STORAGE_KEY = "aistats_data";

function generateNewDayStats() {
  const revenue = Math.floor(Math.random() * (200000 - 50000 + 1)) + 50000;
  const totalTrades = Math.floor(Math.random() * (50000 - 20000 + 1)) + 20000;

  const activeTrades = Math.floor(totalTrades * 0.87);
  const profitableTrades = Math.floor(totalTrades * 0.76);
  const completedTrades = totalTrades - activeTrades;

  return {
    date: new Date().toDateString(),
    revenue,
    totalTrades,
    activeTrades,
    profitableTrades,
    completedTrades,
  };
}

const Aistats = () => {
  const [stats, setStats] = useState(null);

  // Load from localStorage or create fresh
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        setStats(parsed);
        return;
      }
    }

    const fresh = generateNewDayStats();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setStats(fresh);
  }, []);

  // Simulate gradual increases
  useEffect(() => {
    if (!stats) return;

    const interval = setInterval(() => {
      setStats((prev) => {
        if (!prev) return prev;

        // Increase revenue slightly
        const revenue = prev.revenue + Math.floor(Math.random() * 500 + 50);

        // Increase total trades by 1–5 occasionally
        const addedTrades = Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : 0;
        const totalTrades = prev.totalTrades + addedTrades;

        const activeTrades = Math.floor(totalTrades * 0.87);
        const profitableTrades = Math.floor(totalTrades * 0.76);
        const completedTrades = totalTrades - activeTrades;

        const updated = {
          ...prev,
          revenue,
          totalTrades,
          activeTrades,
          profitableTrades,
          completedTrades,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }, 4000); // every 4s

    return () => clearInterval(interval);
  }, [stats]);

  if (!stats) return null;

  const statItems = [
    {
      label: "Revenue today",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: "fa-solid fa-dollar-sign",
      info: "Total revenue generated today in USD.",
    },
    {
      label: "Active Running Trades",
      value: stats.activeTrades.toLocaleString(),
      icon: "fa-solid fa-chart-pie",
      info: "Currently ongoing trades.",
    },
    {
      label: "Profitable Trades",
      value: stats.profitableTrades.toLocaleString(),
      icon: "fa-solid fa-money-bill-trend-up",
      info: "Trades that are in profit today.",
    },
    {
      label: "Trades Completed",
      value: stats.completedTrades.toLocaleString(),
      icon: "fa-solid fa-circle-check",
      info: "Total trades finished today.",
    },
  ];

  return (
    <div className="stats-interface-x12">
      <div className="stats-box-x12">
        {statItems.map((item, i) => (
          <motion.div
            key={i}
            className="stats-x12"
            whileHover={{ scale: 1.05 }}
          >
            <div className="icon-area-x12">
              <i className={item.icon}></i>
            </div>
            <div className="text-area-x12">
              <p className="smaller-text-x12">{item.label}</p>
              <motion.p
                key={item.value} // triggers re-animation when value changes
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bolder-text-x12"
              >
                {item.value}
              </motion.p>
            </div>

            {/* Hover info overlay */}
            <AnimatePresence>
              <motion.div
                className="hover-info-x12"
                initial={{ y: "100%", opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {item.info}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Aistats;
