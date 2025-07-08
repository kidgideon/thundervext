import { useEffect, useState } from "react";
import { db } from "../config/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const AdminTransactionDetails = ({ username }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!username) return;

      try {
        // First find user by username
        const q = query(collection(db, "users"), where("username", "==", username));
        const snap = await getDocs(q);

        if (snap.empty) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        const userDoc = snap.docs[0];
        const userData = userDoc.data();

        const txns = userData?.transactions || [];

        const sorted = [...txns].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(sorted);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [username]);

  return (
    <div className="adminPaymentInterface">
      <div className="request-table">
        <h2 style={{ color: "#9e5fff" }}>
          Transaction History for @{username}
        </h2>
        <table>
          <thead>
            <tr>
              <th>Text</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                  No transactions found for @{username}.
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.text}</td>
                  <td>{t.type}</td>
                  <td>
                    <span className={`status ${t.status}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{new Date(t.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactionDetails;
