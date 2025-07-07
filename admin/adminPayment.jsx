import { useEffect, useState } from "react";
import { db } from "../config/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import AdminNavbar from "../components/adminNavbar";
import "../styles/payment.css";
import { toast } from "sonner";

const Payment = () => {
  const [channels, setChannels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [inputs, setInputs] = useState({ address: "", name: "", netwok: "" });
  const [editingChannelId, setEditingChannelId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [userMap, setUserMap] = useState({});

  // Fetch channels real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "paymentChannels"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChannels(data);
    });
    return () => unsub();
  }, []);

  // Fetch requests real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "paymentRequests"), (snap) => {
      const data = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
      setRequests(data);
    });
    return () => unsub();
  }, []);

  // Preload users once to map names
  useEffect(() => {
    getDocs(collection(db, "users")).then((snap) => {
      const map = {};
      snap.docs.forEach((doc) => {
        const d = doc.data();
        map[doc.id] = `${d.firstName || ""} ${d.lastName || ""}`;
      });
      setUserMap(map);
    });
  }, []);

  const handleAddOrEditChannel = async () => {
    const { address, name, netwok } = inputs;
    if (!address || !name || !netwok) {
      toast.error("Fill all fields");
      return;
    }

    const toastId = toast.loading(
      editingChannelId ? "Updating channel..." : "Adding channel..."
    );
    try {
      if (editingChannelId) {
        // Edit mode
        await updateDoc(doc(db, "paymentChannels", editingChannelId), inputs);
        toast.success("Payment channel updated", { id: toastId });
        setEditingChannelId(null);
      } else {
        // Add mode
        await addDoc(collection(db, "paymentChannels"), inputs);
        toast.success("Payment channel added", { id: toastId });
      }
      setInputs({ address: "", name: "", netwok: "" });
    } catch {
      toast.error("Failed to save", { id: toastId });
    }
  };

  // Handle status for both fund and withdraw requests
  const handleStatus = async (request, status) => {
    const toastId = toast.loading("Updating request...");
    const userRef = doc(db, "users", request.userId);
    const requestRef = doc(db, "paymentRequests", request.id);

    try {
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      let notif = {};
      let trans = {};
      let updatedData = {
        notifications: [...(userData.notifications || [])],
        transactions: [...(userData.transactions || [])],
      };

      if (request.type === "withdraw") {
        // Withdraw logic
        notif = {
          date: new Date().toISOString(),
          text:
            status === "success"
              ? `Your withdrawal of $${request.amount} was approved.`
              : `Your withdrawal request of $${request.amount} was declined.`,
          link: "/wallet",
          read: false,
        };
        trans = {
          text: `$${request.amount} withdrawal ${status === "success" ? "approved" : "declined"}`,
          date: new Date().toISOString(),
          status,
          type: "withdraw",
        };

        if (status === "success") {
          // Deduct from walletBalance, but never below zero
          updatedData.walletBalance = Math.max(
            (userData.walletBalance || 0) - Number(request.amount),
            0
          );
        }
      } else {
        // Funding logic (default)
        notif = {
          date: new Date().toISOString(),
          text:
            status === "success"
              ? `Your funding of $${request.amount} was successful.`
              : `Your payment request of $${request.amount} was declined.`,
          link: "/wallet",
          read: false,
        };
        trans = {
          text: `$${request.amount} ${status === "success" ? "funded successfully" : "failed"}`,
          date: new Date().toISOString(),
          status,
          type: "funded",
        };

        if (status === "success") {
          updatedData.walletBalance =
            (userData.walletBalance || 0) + Number(request.amount);
        }
      }

      updatedData.notifications.push(notif);
      updatedData.transactions.push(trans);

      await updateDoc(userRef, updatedData);
      await updateDoc(requestRef, { status });

      toast.success("Request updated", { id: toastId });
    } catch (err) {
      toast.error("Failed to update", { id: toastId });
    }
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  // When clicking a payment channel, load its info into the form for editing
  const handleEditChannel = (channel) => {
    setInputs({
      address: channel.address || "",
      name: channel.name || "",
      netwok: channel.netwok || "",
    });
    setEditingChannelId(channel.id);
  };

  return (
    <div className="adminPaymentInterface">
      <AdminNavbar />

      <div className="area">
        <div className="add-payment-channels">
          <div className="payment-channel-form">
            <i className="fa-solid fa-money-bill"></i>
          </div>
          <input
            type="text"
            placeholder="Payment Address"
            value={inputs.address}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, address: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Payment Name"
            value={inputs.name}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Payment Network"
            value={inputs.netwok}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, netwok: e.target.value }))
            }
          />
          <button className="buttonAdmin" onClick={handleAddOrEditChannel}>
            {editingChannelId ? "Update Channel" : "Add Payment Channel"}
          </button>
          {editingChannelId && (
            <button
              className="buttonAdmin"
              style={{
                background: "#e5e7eb",
                color: "#25124b",
                marginLeft: 8,
              }}
              onClick={() => {
                setEditingChannelId(null);
                setInputs({ address: "", name: "", netwok: "" });
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="existing-payment-channels">
          {channels.map((c, i) => (
            <div
              className="payment-channel"
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => handleEditChannel(c)}
              title="Click to edit"
            >
              <i className="fa-solid fa-credit-card"></i>
              <div className="name-div-dmin">
                <p>{c.name}</p>
              </div>
              <div className="address-div-admin">
                <p>
                  <strong>Address:</strong>
                </p>
                <p>{c.address}</p>
              </div>
              <div className="name-div-dmin">
                <p>{c.netwok}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="payment-requests">
          <h2>payment requests</h2>
          <div className="filter-buttons">
            {["all", "pending", "success", "declined"].map((f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="request-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Channel/Method</th>
                  <th>Status</th>
                  <th>Proof/Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, i) => (
                  <tr key={i}>
                    <td>{userMap[req.userId] || "Unknown"}</td>
                    <td>${req.amount}</td>
                    <td>
                      {req.type === "withdraw"
                        ? req.method === "wallet"
                          ? "Wallet"
                          : "Bank Transfer"
                        : req.channel?.name || "—"}
                    </td>
                    <td>
                      <span className={`status ${req.status}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.type === "withdraw" ? (
                        <span style={{ fontSize: "0.95em" }}>
                          {req.paymentDetails}
                        </span>
                      ) : req.proofImageUrl ? (
                        <a
                          href={req.proofImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {req.status === "pending" && (
                        <>
                          <button
                            className="accept-btn"
                            onClick={() => handleStatus(req, "success")}
                          >
                            Accept
                          </button>
                          <button
                            className="decline-btn"
                            onClick={() => handleStatus(req, "declined")}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
