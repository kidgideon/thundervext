import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  deleteField,
  setDoc,
} from "firebase/firestore";
import AdminTransactionDetails from "../components/adminTransactions";
import { toast } from "sonner";
import { db } from "../config/config";
import AdminNavbar from "../components/adminNavbar";
import "../styles/manageUsers.css";

const stockOptions = [
  "Bitcoin", "Ethereum", "Tesla", "Apple", "Google", "Amazon", "Solana", "Dogecoin", "SPY", "NVDA",
];

const ManageUser = () => {
  const { username } = useParams();
  const [userDocId, setUserDocId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    type: "profit",
    stock: "",
    description: "",
  });
  const [notifText, setNotifText] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const toastId = toast.loading("Fetching user...");
      try {
        const q = query(collection(db, "users"), where("username", "==", username));
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new Error("User not found");

        const docSnap = snapshot.docs[0];
        setUserDocId(docSnap.id);
        setUserData(docSnap.data());

        toast.success("User loaded", { id: toastId });
      } catch (err) {
        toast.error("Error loading user", { id: toastId });
        console.error(err);
      }
    };

    fetchUser();
  }, [username]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { amount, type, stock, description } = form;
    if (!amount || !type || !description) {
      toast.error("Fill all fields");
      return;
    }

    const numericAmount = parseFloat(amount);
    const isLoss = type === "loss";
    const isProfit = type === "profit";

    const toastId = toast.loading("Processing...");

    try {
      const userRef = doc(db, "users", userDocId);
      const dataUpdate = {};

      // Update walletBalance
      const updatedBalance = isLoss
        ? (userData.walletBalance || 0) - numericAmount
        : (userData.walletBalance || 0) + numericAmount;
      dataUpdate.walletBalance = updatedBalance;

      // Update PnL only for profit or loss
      if (isProfit || isLoss) {
        const currentPnl = userData.pnl || 0;
        const newPnl = isLoss ? currentPnl - numericAmount : currentPnl + numericAmount;
        dataUpdate.pnl = newPnl;
      }

      // Add transaction
      const txText = `${description}${stock ? ` (${stock})` : ""}`;
      const transaction = {
        date: new Date().toISOString(),
        status: "success",
        text: txText,
        type,
      };

      // Notification
      const notification = {
        text: txText,
        read: false,
        date: new Date().toISOString(),
        link: "/wallet",
      };

      await updateDoc(userRef, {
        ...dataUpdate,
        transactions: arrayUnion(transaction),
        notifications: arrayUnion(notification),
      });

      toast.success("Transaction successful", { id: toastId });
      setForm({ amount: "", type: "profit", stock: "", description: "" });
    } catch (err) {
      toast.error("Transaction failed", { id: toastId });
      console.error(err);
    }
  };

  const sendNotification = async () => {
    if (!notifText.trim()) {
      toast.error("Notification text required");
      return;
    }

    const toastId = toast.loading("Sending notification...");
    try {
      await updateDoc(doc(db, "users", userDocId), {
        notifications: arrayUnion({
          text: notifText,
          read: false,
          date: new Date().toISOString(),
          link: "/wallet",
        }),
      });
      toast.success("Notification sent", { id: toastId });
      setNotifText("");
    } catch (err) {
      toast.error("Failed to send notification", { id: toastId });
    }
  };

  const deleteAsset = async (index) => {
    if (!window.confirm("Delete this asset?")) return;

    const newAssets = [...userData.assets];
    newAssets.splice(index, 1);

    try {
      await updateDoc(doc(db, "users", userDocId), {
        assets: newAssets,
      });
      setUserData((prev) => ({ ...prev, assets: newAssets }));
      toast.success("Asset deleted");
    } catch (err) {
      toast.error("Failed to delete asset");
    }
  };

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="area">
       
          <h2 className="x-mgu21-header">
            Manage <span className="x-mgu21-user">@{username}</span>
          </h2>

          {userData && (
            <>
              <div className="x-mgu21-balance">
                <strong><i class="fa-solid fa-wallet"></i></strong> ${Number(userData.walletBalance || 0).toLocaleString()}
              </div>
              <div className="x-mgu21-assets">
                <h4>Assets:</h4>
                <div className="x-mgu21-assets-scroll">
                  {userData.assets && userData.assets.length > 0 ? (
                    userData.assets.map((asset, i) => (
                      <div className="x-mgu21-asset-card" key={i}>
                        <div>
                          <strong>{asset.name}</strong> ({asset.symbol})<br />
                          <small>Unit: {asset.unit} • Total: ${asset.total}</small>
                        </div>
                        <button onClick={() => deleteAsset(i)}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No assets</p>
                  )}
                </div>
              </div>

              <div className="x-mug21-spread-area">
                    <div className="x-mgu21-form">
                <h4>Send Transaction</h4>
                <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleFormChange} />
                <select name="type" value={form.type} onChange={handleFormChange}>
                  <option value="profit">Profit</option>
                  <option value="loss">Loss</option>
                  <option value="topup">Topup</option>
                  <option value="bonus">Bonus</option>
                  <option value="charges">Charges</option>
                </select>
                <select name="stock" value={form.stock} onChange={handleFormChange}>
                  <option value="">-- Optional Stock --</option>
                  {stockOptions.map((stock, i) => (
                    <option key={i} value={stock}>{stock}</option>
                  ))}
                </select>
                <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleFormChange} />
                <button onClick={handleSubmit}><i className="fas fa-paper-plane"></i> Send</button>
              </div>

              <div className="x-mgu21-manual-notif">
                <h4>Send Manual Notification</h4>
                <textarea
                  rows="3"
                  placeholder="Enter notification text..."
                  value={notifText}
                  onChange={(e) => setNotifText(e.target.value)}
                />
                <button onClick={sendNotification}><i className="fas fa-bell"></i> Notify</button>
              </div>
              </div>
            </>
          )}

         <AdminTransactionDetails username={username}/>

        </div>
    </div>
  );
};

export default ManageUser;
