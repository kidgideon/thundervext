import { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../config/config";
import AdminNavbar from "../components/adminNavbar";
import { toast } from "sonner";

const AdminFunding = () => {
  const [form, setForm] = useState({
    amount: "",
    targetUsername: "",
    adminUsername: "",
    transactionType: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFund = async () => {
    const { amount, targetUsername, adminUsername, transactionType, description } = form;

    if (!amount || !targetUsername || !adminUsername || !transactionType) {
      toast.error("Fill all required fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Processing funding...");

    try {
      const q = query(collection(db, "users"), where("username", "==", targetUsername));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("User not found");
        toast.dismiss(toastId);
        setSubmitting(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);
      const userData = userDoc.data();

      const newBalance = (userData.walletBalance || 0) + Number(amount);

      await updateDoc(userRef, {
        walletBalance: newBalance,
        transactions: arrayUnion({
          date: new Date().toISOString(),
          status: "success",
          type: transactionType,
          text: `$${amount} funded by ${adminUsername}: ${description || "No description"}`,
        }),
        notifications: arrayUnion({
          date: new Date().toISOString(),
          text: `$${amount} was funded to your account by Admin (${adminUsername}).`,
          link: "/wallet",
          read: false,
        }),
      });

      toast.success("User funded successfully");
      setForm({
        amount: "",
        targetUsername: "",
        adminUsername: "",
        transactionType: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Funding failed");
    } finally {
      toast.dismiss(toastId);
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="area">
        <div className="add-payment-channels">
          <h2 style={{ marginBottom: 20 }}>
            <i className="fa-solid fa-money-bill-wave"></i>
          </h2>

          <input
            type="number"
            name="amount"
            placeholder="Amount to fund"
            value={form.amount}
            onChange={handleChange}
          />
          <input
            type="text"
            name="targetUsername"
            placeholder="Target User's Username"
            value={form.targetUsername}
            onChange={handleChange}
          />
          <input
            type="text"
            name="adminUsername"
            placeholder="Admin Username"
            value={form.adminUsername}
            onChange={handleChange}
          />
          <input
            type="text"
            name="transactionType"
            placeholder="Transaction Type (e.g. bonus, topup)"
            value={form.transactionType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Optional Description"
            value={form.description}
            onChange={handleChange}
          />
          <button
            className="buttonAdmin"
            onClick={handleFund}
            disabled={submitting}
          >
            {submitting ? "Funding..." : "Fund User Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFunding;
