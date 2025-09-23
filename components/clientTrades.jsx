import { useEffect, useState } from "react";
import { db, auth } from "../config/config";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ClientsCopiedTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAuth;

    const fetchUserTrades = async (uid) => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) {
          setTrades([]);
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        const copiedIds = userData?.copiedTrades || [];

        if (copiedIds.length === 0) {
          setTrades([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "copiedTrades"),
          where("__name__", "in", copiedIds.slice(0, 10)) // Firestore "in" query limit = 10
        );

        const snap = await getDocs(q);
        let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // sort by createdAt, newest first
        list.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

        setTrades(list);
      } catch (err) {
        console.error("Error fetching client trades:", err);
        setTrades([]);
      } finally {
        setLoading(false);
      }
    };

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserTrades(user.uid);
      } else {
        setTrades([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth && unsubscribeAuth();
  }, []);

  return (
    <div className="adminCopyTrade-interface">
      <div className="adminCopyTrade-table">
        <h2>Your Copied Trades</h2>
        <table>
          <thead>
            <tr>
              <th>Trader</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                  Loading...
                </td>
              </tr>
            ) : trades.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                  You haven’t copied any trades yet.
                </td>
              </tr>
            ) : (
              trades.map((t) => (
                <tr key={t.id}>
                  <td>{t.traderName || "Unknown"}</td>
                  <td>{t.tradeAmount ? `$${t.tradeAmount}` : "-"}</td>
                  <td>
                    <span
                      className={`adminCopyTrade-status ${
                        t.tradeStatus === "active"
                          ? "active"
                          : t.tradeStatus === "inactive"
                          ? "paused"
                          : "ended"
                      }`}
                    >
                      {t.tradeStatus === "active"
                        ? "Trade is Active"
                        : t.tradeStatus === "inactive"
                        ? "Trade Paused"
                        : "Trade Ended"}
                    </span>
                  </td>
                  <td>
                    {t.createdAt
                      ? new Date(t.createdAt.toDate()).toLocaleString()
                      : "—"}
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

export default ClientsCopiedTrades;
