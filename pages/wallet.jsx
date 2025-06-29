import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../config/config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardNav from "../components/dashboardNav";
import SmartProfile from "../components/profiles";
import CopyTraders from "../components/copyTraders";
import Etf from "../components/etf";
import "../styles/wallet.css";

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Wait for auth to be ready
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          if (!("walletBalance" in data)) {
            await setDoc(userRef, { walletBalance: 0 }, { merge: true });
            setBalance(0);
          } else {
            setBalance(data.walletBalance);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loadChannels = async () => {
    const snap = await getDocs(collection(db, "paymentChannels"));
    const chs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setChannels(chs);
    setShowAddModal(true);
  };

// Inside your component...
const submitPayment = async () => {
  if (!amount || !proof) {
    toast.error("Fill all fields");
    return;
  }

  if (!userId) {
    toast.error("User not authenticated");
    return;
  }

  if (!(proof instanceof File) || proof.size === 0) {
    toast.error("Invalid proof file");
    return;
  }

  try {
    setSubmitting(true);
    const toastId = toast.loading("Uploading proof...");

    const storageRef = ref(storage, `proofs/${userId}-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, proof);

    // Track progress (optional)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        toast.message(`Uploading: ${progress}%`, { id: toastId });
      },
      (error) => {
        console.error("Upload error:", error);
        toast.error("Upload failed", { id: toastId });
        setSubmitting(false);
      },
      async () => {
        // On complete
        const proofURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Upload complete, file URL:", proofURL);

        const paymentData = {
          userId,
          amount: parseFloat(amount),
          proofImageUrl: proofURL,
          channel: selectedChannel,
          status: "pending",
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, "paymentRequests"), paymentData);

        toast.success("Payment request submitted", { id: toastId });

        // Reset state
        setShowSubmitModal(false);
        setSelectedChannel(null);
        setAmount("");
        setProof(null);
      }
    );
  } catch (err) {
    console.error("SubmitPayment Error: ", err.code, err.message);
    toast.error("Submission failed");
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="wallet-interface">
      <DashboardNav />
      <div className="area">
        <div className="wallet-interface-user-balance-area">
          <div className="wallet-top">
            <p>Your Total Value</p>
            <p>USD</p>
          </div>
          <hr className="bar" />
          <div className="wallet-actual-balanec">
            <p>${balance !== null ? balance : "..."}</p>
            <button onClick={loadChannels}>Add Funds</button>
          </div>
        </div>

        <SmartProfile />
        <CopyTraders />
        <Etf />
      </div>

      {/* Modal 1 - Choose Channel */}
      {showAddModal && (
        <motion.div className="wallet-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="wallet-modal" initial={{ y: 100 }} animate={{ y: 0 }}>
            <h3>Select a Payment Channel</h3>
            {channels.map((channel) => (
              <div key={channel.id} className="wallet-channel-card">
                <p>
                  <strong>{channel.name}</strong> ({channel.network})
                </p>
                <p style={{ fontSize: "13px" }}>{channel.address}</p>
                <button
                  onClick={() => {
                    setSelectedChannel(channel);
                    setShowAddModal(false);
                    setShowSubmitModal(true);
                  }}
                >
                  I paid with this
                </button>
              </div>
            ))}
            <button className="wallet-modal-close" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Modal 2 - Submit Proof */}
      {showSubmitModal && (
        <motion.div className="wallet-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="wallet-modal" initial={{ y: 100 }} animate={{ y: 0 }}>
            <h3>Submit Payment</h3>
            <p>
              Channel: <strong>{selectedChannel?.name}</strong> ({selectedChannel?.network})
            </p>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={(e) => setProof(e.target.files[0])} />
            <button disabled={submitting} onClick={submitPayment}>
              {submitting ? "Submitting..." : "Send"}
            </button>
            <button className="wallet-modal-close" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Wallet;
