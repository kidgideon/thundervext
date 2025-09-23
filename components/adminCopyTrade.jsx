import { useEffect, useState } from "react";
import { db } from "../config/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const AdminCopyTrade = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const snap = await getDocs(collection(db, "copiedTrades"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const sorted = [...list].sort(
          (a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()
        );

        setTrades(sorted);
      } catch (err) {
        console.error("Error fetching trades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  const toggleTradeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "copiedTrades", id), { tradeStatus: newStatus });
      setTrades((prev) =>
        prev.map((t) => (t.id === id ? { ...t, tradeStatus: newStatus } : t))
      );
    } catch (err) {
      console.error("Error updating trade:", err);
    }
  };

  return (
    <div className="adminCopyTrade-interface">
      <div className="adminCopyTrade-table">
        <h2>Copied Trades Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Trader</th>
              <th>Copier</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  Loading...
                </td>
              </tr>
            ) : trades.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No trade copied yet.
                </td>
              </tr>
            ) : (
              trades.map((t) => (
                <tr key={t.id}>
                  <td>{t.traderName || "Unknown"}</td>
                  <td>{t.copierName || "Unknown"}</td>
                  <td>{t.tradeAmount ? `$${t.tradeAmount}` : "-"}</td>
                  <td>
                    <span
                      className={`adminCopyTrade-status ${
                        t.tradeStatus === "active" ? "active" : "inactive"
                      }`}
                    >
                      {t.tradeStatus}
                    </span>
                  </td>
                  <td>
                    {t.createdAt
                      ? new Date(t.createdAt.toDate()).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="adminCopyTrade-deactivate"
                      onClick={() => toggleTradeStatus(t.id, t.tradeStatus)}
                    >
                      {t.tradeStatus === "active" ? "Pause" : "Resume"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCopyTrade;
