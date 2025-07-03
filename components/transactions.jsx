import { useEffect, useState } from "react";
import { auth, db } from "../config/config";
import { doc, getDoc } from "firebase/firestore";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        const data = userData?.transactions || [];
        // Sort by most recent
        const sorted = [...data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(sorted);
      } catch (err) {
        // Optionally handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="adminPaymentInterface">
      <div className="request-table">
        <h2 style={{ color: "#9e5fff" }}>
          Transaction History
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
                  No transactions yet.
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
                  <td>
                    {new Date(t.date).toLocaleString()}
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

export default Transactions;
