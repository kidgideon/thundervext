import { useEffect, useState } from "react";
import { db } from "../config/config";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/tradestable.css";

const UserTradesTable = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Watch for logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setTrades([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's trades
  const fetchTrades = async (uid) => {
    if (!uid) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "aiTrades"),
        where("userId", "==", uid)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTrades(list);
    } catch (err) {
      console.error("Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchTrades(currentUserId);
    }
  }, [currentUserId]);

  if (loading) return <p>Loading trades...</p>;

  if (!trades.length) {
    return <p className="no-trades-msg">No active trades</p>;
  }

  return (
    <div className="trades-table-container">
      <h3>Your AI Trades</h3>
      <div className="table-responsive">
        <table className="trades-table">
          <thead>
            <tr>
              <th>AI Name</th>
              <th>Trade Price</th>
              <th>Profit %</th>
              <th>Loss %</th>
              <th>Status</th>
              <th>Date Started</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.aiName}</td>
                <td>${trade.tradePrice}</td>
                <td className="profit">{trade.profit}%</td>
                <td className="loss">{trade.loss}%</td>
                <td>
                  <span className={`status ${trade.status}`}>
                    {trade.status}
                  </span>
                </td>
                <td>
                  {trade.createdAt?.toDate
                    ? trade.createdAt.toDate().toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTradesTable;
