import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/config";
import { toast } from "sonner";
import DashboardNav from "../components/dashboardNav";
import styles from "../styles/userProfile.module.css";
import CopyTraders from "../components/copyTraders";

const bioOptions = [
  "Legendary Trader with unmatched market foresight",
  "Crypto and Stocks Dominator | 10x Vision",
  "AI-Powered Trading Expert",
  "Swing Trading Specialist with years of results",
  "Early adopter of blockchain revolution",
  "From $1K to $1M - The grind never stops",
  "DeFi Expert | Yield Farming King",
  "Options & Futures Strategist",
  "Global Top 1% Ranked Copy Trader",
  "Tech Stocks Veteran & Market Analyst",
];

const allBadges = [
  { label: "Top 1% Global", icon: "fa-trophy", color: "#ffd700" },
  { label: "Verified", icon: "fa-badge-check", color: "#4f46e5" },
  { label: "AI Guru", icon: "fa-brain", color: "#a23cf4" },
  { label: "Market Wizard", icon: "fa-magic", color: "#f59e42" },
  { label: "1000+ Followers", icon: "fa-users", color: "#10b981" },
  { label: "Risk Master", icon: "fa-shield-alt", color: "#6366f1" },
  { label: "Early Adopter", icon: "fa-rocket", color: "#a23cf4" },
  { label: "Copy Trading Star", icon: "fa-star", color: "#facc15" },
  { label: "NFT Pioneer", icon: "fa-gem", color: "#e879f9" },
  { label: "DeFi Legend", icon: "fa-coins", color: "#34d399" },
  { label: "Hedge Fund Skills", icon: "fa-chart-line", color: "#0ea5e9" },
  { label: "Options King", icon: "fa-cogs", color: "#a3e635" },
];

const generateRecentActivities = () => {
  const assets = ["BTC", "ETH", "AAPL", "TSLA", "SOL", "GOOG", "AMZN", "SPY", "DOGE"];
  const notes = [
    "Closed 10x leveraged position",
    "Beat the market by 200%",
    "NFT flip: +$12,000",
    "Bought the dip at perfect timing",
    "Sold just before crash",
    "Earned $8K from options",
    "Arbitrage profit: +$3,500",
    "Massive DeFi gain",
    "Sniped token pre-pump",
  ];
  const actions = ["Buy", "Sell"];

  return Array.from({ length: 10 }, (_, i) => {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    return {
      type: actions[Math.floor(Math.random() * actions.length)],
      asset,
      amount: (Math.random() * 10 + 1).toFixed(2),
      value: `$${(Math.random() * 30000 + 5000).toFixed(2)}`,
      date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      note: notes[Math.floor(Math.random() * notes.length)],
    };
  });
};

const CopyTraderProfile = () => {
  const { username } = useParams();
  const [trader, setTrader] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fakeTrades, setFakeTrades] = useState([]);

  // Generate display-only data
  const [badges] = useState(() =>
    allBadges.sort(() => 0.5 - Math.random()).slice(0, 5 + Math.floor(Math.random() * 5))
  );
  const [bio] = useState(() =>
    bioOptions[Math.floor(Math.random() * bioOptions.length)]
  );
  const [recent] = useState(() => generateRecentActivities());
  const [followers] = useState(() =>
    Array.from({ length: Math.floor(Math.random() * 9000 + 1000) })
  );
  const [following] = useState(() =>
    Array.from({ length: Math.floor(Math.random() * 200 + 10) })
  );
  const [level] = useState("Elite");
  const [totalTrades] = useState(Math.floor(Math.random() * 1000 + 100));
  const [profitValue] = useState(
    parseFloat((Math.random() * 60000 + 10000).toFixed(2))
  );

  useEffect(() => {
    const fetchTrader = async () => {
      const toastId = toast.loading("Loading trader profile...");
      try {
        const q = query(collection(db, "traders"), where("username", "==", username));
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new Error("Trader not found");
        const data = snapshot.docs[0].data();
        setTrader(data);
        toast.success("Trader loaded");
      } catch (err) {
        toast.error("Could not load trader.");
        console.error("Error loading trader:", err);
      } finally {
        toast.dismiss(toastId);
      }
    };

    const fetchUserWallet = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setWalletBalance(userSnap.data().walletBalance || 0);
      }
    };

    fetchTrader();
    fetchUserWallet();
    // fetchUserWallet if needed...
  }, [username]);

  const handleCopyTrade = () => {
    if (!walletBalance || walletBalance < 10000) {
      toast.error("You need at least $10,000 in your wallet to copy this trader.");
      return;
    }
    setFakeTrades(generateRecentActivities());
    setShowModal(true);
  };

  if (!trader) return null;

  return (
    <div className={styles.userProfileArea}>
      <DashboardNav />
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img
              src={trader.picture || "/default-avatar.png"}
              alt="Trader"
              className={styles.avatar}
            />
            <div>
              <h2 className={styles.name}>
                {trader.firstName} {trader.lastName}
                <span className={styles.verified} title="Verified">
                  <i className="fas fa-badge-check"></i>
                </span>
              </h2>
              <div className={styles.username}>@{trader.username}</div>
              <div className={styles.bio}>{bio}</div>
              <div className={styles.meta}>
                <span>
                  <i className="fas fa-chart-line"></i> Profit: {trader.profit || 0}%
                </span>
                <span>
                  <i className="fas fa-dollar-sign"></i> Total Value: $
                  {profitValue.toLocaleString()}
                </span>
                <span>
                  <i className="fas fa-exclamation-triangle"></i> Risk: {trader.risk || 0}%
                </span>
              </div>
              <button onClick={handleCopyTrade} className={styles.copyTradeButton}>
                <i className="fas fa-copy"></i> Copy Trade
              </button>
            </div>
          </div>

          <div className={styles.badges}>
            {badges.map((badge, i) => (
              <span
                key={i}
                className={styles.badge}
                style={{ background: badge.color + "22", color: badge.color }}
              >
                <i className={`fas ${badge.icon}`}></i> {badge.label}
              </span>
            ))}
          </div>

          <div className={styles.statsGrid}>
            <div>
              <div className={styles.statValue}>
                ${profitValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className={styles.statLabel}>Portfolio Value</div>
            </div>
            <div>
              <div className={styles.statValue}>{totalTrades}</div>
              <div className={styles.statLabel}>Total Trades</div>
            </div>
            <div>
              <div className={styles.statValue}>{followers.length}</div>
              <div className={styles.statLabel}>Followers</div>
            </div>
            <div>
              <div className={styles.statValue}>{following.length}</div>
              <div className={styles.statLabel}>Following</div>
            </div>
            <div>
              <div className={styles.statValue}>{level}</div>
              <div className={styles.statLabel}>Account Level</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className={styles.recentActivity}>
          <h3>
            <i className="fas fa-history"></i> Recent Activity
          </h3>
          <div className={styles.activityTableWrapper}>
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Value</th>
                  <th>Date</th>
                  <th>Highlight</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t, i) => (
                  <tr key={i}>
                    <td className={t.type === "Buy" ? styles.buy : styles.sell}>{t.type}</td>
                    <td>{t.asset}</td>
                    <td>{t.amount}</td>
                    <td>{t.value}</td>
                    <td>{t.date}</td>
                    <td style={{ color: "#a23cf4", fontWeight: 600 }}>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CopyTraders />

       {showModal && (
  <div className={styles.copyTradeModal}>
    <div className={styles.modalContent}>
      <h3>Live Trades from @{trader.username}</h3>
      <ul className={styles.tradeSequence}>
        {fakeTrades.map((t, i) => (
          <li key={i}>
            <strong>{t.type}</strong> {t.amount} {t.asset} — {t.value} on {t.date}{" "}
            <span style={{ color: "#a23cf4" }}>{t.note}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => setShowModal(false)} className={styles.modalCloseBtn}>
        Close
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default CopyTraderProfile;
