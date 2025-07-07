import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../config/config";
import { toast } from "sonner";
import DashboardNav from "../components/dashboardNav";
import styles from "../styles/userProfile.module.css";
import CopyTraders from "../components/copyTraders";

const bioOptions = [/* same bios */];
const allBadges = [/* same badges */];

const generateRecentActivities = () => {
  const assets = ["BTC", "ETH", "AAPL", "TSLA", "SOL", "GOOG", "AMZN", "SPY", "DOGE"];
  const notes = [/* same notes */];
  const actions = ["Buy", "Sell"];
  return Array.from({ length: 10 }, (_, i) => ({
    type: actions[Math.floor(Math.random() * actions.length)],
    asset: assets[Math.floor(Math.random() * assets.length)],
    amount: (Math.random() * 10 + 1).toFixed(2),
    value: `$${(Math.random() * 30000 + 5000).toFixed(2)}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
    note: notes[Math.floor(Math.random() * notes.length)],
  }));
};

const CopyTraderProfile = () => {
  const { username } = useParams();
  const [trader, setTrader] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fakeTrades, setFakeTrades] = useState([]);

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
    const fetchData = async () => {
      const toastId = toast.loading("Loading trader profile...");
      try {
        const traderQ = query(collection(db, "traders"), where("username", "==", username));
        const traderSnap = await getDocs(traderQ);
        if (traderSnap.empty) throw new Error("Trader not found");
        setTrader(traderSnap.docs[0].data());
        toast.success("Trader loaded");
      } catch (err) {
        toast.error("Could not load trader.");
      } finally {
        toast.dismiss(toastId);
      }

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setCurrentUserId(user.uid);
          const userSnap = await getDoc(doc(db, "users", user.uid));
          if (userSnap.exists()) {
            setWalletBalance(userSnap.data().walletBalance || 0);
          }
        }
      });
    };
    fetchData();
  }, [username]);

  const handleCopyTrade = async () => {
    if (!walletBalance || !currentUserId || !trader) return;

    const amountToCopy = trader.copyPrice || 10000;
    if (walletBalance < amountToCopy) {
      toast.error(`You need at least $${amountToCopy.toLocaleString()} to copy this trader.`);
      return;
    }

    const toastId = toast.loading("Copying trade...");
    try {
      const userRef = doc(db, "users", currentUserId);

      await updateDoc(userRef, {
        walletBalance: walletBalance - amountToCopy,
        transactions: arrayUnion({
          type: "copy-trade",
          text: `You copied ${trader.username}'s trade`,
          status: "success",
          date: new Date().toISOString(),
        }),
        notifications: arrayUnion({
          text: `You successfully copied ${trader.username}'s trade.`,
          date: new Date().toISOString(),
          read: false,
          link: "/wallet",
        }),
      });

      const adminSnap = await getDocs(query(collection(db, "users"), where("isAdmin", "==", true)));
      adminSnap.forEach(async (docSnap) => {
        await updateDoc(doc(db, "users", docSnap.id), {
          notifications: arrayUnion({
            text: `${username} copied ${trader.username}'s trade.`,
            date: new Date().toISOString(),
            read: false,
            link: "/admin",
          }),
        });
      });

      toast.success("Trade copied successfully", { id: toastId });
      setWalletBalance(walletBalance - amountToCopy);
      setFakeTrades(generateRecentActivities());
      setShowModal(true);
    } catch (err) {
      toast.error("Failed to copy trade", { id: toastId });
    }
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
                <span className={styles.verified}>
                  <i className="fas fa-badge-check"></i>
                </span>
              </h2>
              <div className={styles.username}>@{trader.username}</div>
              <div className={styles.bio}>{bio}</div>
              <div className={styles.meta}>
                <span><i className="fas fa-chart-line"></i> Profit: {trader.profit || 0}%</span>
                <span><i className="fas fa-dollar-sign"></i> Copy Price: ${trader.copyPrice?.toLocaleString() || "10,000"}</span>
                <span><i className="fas fa-exclamation-triangle"></i> Risk: {trader.risk || 0}%</span>
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
              <div className={styles.statValue}>${profitValue.toLocaleString()}</div>
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

        <div className={styles.recentActivity}>
          <h3><i className="fas fa-history"></i> Recent Activity</h3>
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
