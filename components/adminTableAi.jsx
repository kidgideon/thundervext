import { useEffect, useState } from "react";
import { db } from "../config/config";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "../styles/admintradestable.css";

const AdminTradesTable = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTrade, setUpdatingTrade] = useState(null);

  // Fetch all trades
  const fetchTrades = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "aiTrades"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTrades(list);
    } catch (err) {
      console.error("Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const updateTradeStatus = async (tradeId, newStatus) => {
    setUpdatingTrade(tradeId);
    try {
      await updateDoc(doc(db, "aiTrades", tradeId), {
        status: newStatus,
      });
      setTrades((prev) =>
        prev.map((t) => (t.id === tradeId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Error updating trade:", err);
    } finally {
      setUpdatingTrade(null);
    }
  };

  if (loading) return <p>Loading all trades...</p>;

  if (!trades.length) {
    return <p className="no-trades-msg">No trades available</p>;
  }

  return (
    <div className="trades-table-container">
      <h3>All AI Trades (Admin)</h3>
      <div className="table-responsive">
        <table className="trades-table">
          <thead>
            <tr>
              <th>User</th>
              <th>AI Name</th>
              <th>Trade Price</th>
              <th>Status</th>
              <th>Date Started</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.userName}</td>
                <td>{trade.aiName}</td>
                <td>${trade.tradePrice}</td>
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
                <td>
                  {trade.status === "active" && (
                    <>
                      <button
                        disabled={updatingTrade === trade.id}
                        onClick={() =>
                          updateTradeStatus(trade.id, "paused")
                        }
                      >
                        {updatingTrade === trade.id ? "Updating..." : "Pause"}
                      </button>
                      <button
                        disabled={updatingTrade === trade.id}
                        onClick={() =>
                          updateTradeStatus(trade.id, "ended")
                        }
                      >
                        End
                      </button>
                    </>
                  )}

                  {trade.status === "paused" && (
                    <>
                      <button
                        disabled={updatingTrade === trade.id}
                        onClick={() =>
                          updateTradeStatus(trade.id, "active")
                        }
                      >
                        Resume
                      </button>
                      <button
                        disabled={updatingTrade === trade.id}
                        onClick={() =>
                          updateTradeStatus(trade.id, "ended")
                        }
                      >
                        End
                      </button>
                    </>
                  )}

                  {trade.status === "ended" && <em>Trade closed</em>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTradesTable;
