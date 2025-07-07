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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardNav from "../components/dashboardNav";
import SmartProfile from "../components/profiles";
import CopyTraders from "../components/copyTraders";
import Etf from "../components/etf";
import Transactions from "../components/transactions";
import "../styles/wallet.css";

const WITHDRAW_METHODS = [
  { label: "Wallet", value: "wallet" },
  { label: "Bank Transfer", value: "bank" },
];

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

  // Withdraw state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState(WITHDRAW_METHODS[0].value);
  const [withdrawDetails, setWithdrawDetails] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

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

  const submitPayment = async () => {
    if (!amount || !proof) {
      toast.error("Please fill in both amount and proof.");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "image/bmp",
    ];
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"];

    const fileType = proof?.type;
    const fileName = proof?.name?.toLowerCase() || "";

    const isValidImage =
      proof instanceof File &&
      proof.size > 0 &&
      allowedTypes.includes(fileType) &&
      allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidImage) {
      toast.error("Only valid image files (JPG, PNG, GIF, WEBP, BMP) are allowed.");
      return;
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading("Uploading proof...");

      const storageRef = ref(storage, `proofs/${userId}-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, proof);

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
          const proofURL = await getDownloadURL(uploadTask.snapshot.ref);

          const paymentData = {
            userId,
            amount: parseFloat(amount),
            proofImageUrl: proofURL,
            channel: selectedChannel,
            status: "pending",
            type: "fund",
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
      console.error("SubmitPayment Error:", err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Withdraw logic
  const submitWithdraw = async () => {
    if (!withdrawAmount || !withdrawDetails) {
      toast.error("Please fill in both amount and payment details.");
      return;
    }
    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }
    try {
      setSubmitting(true);
      const toastId = toast.loading("Submitting withdrawal request...");
      const paymentData = {
        userId,
        amount: parseFloat(withdrawAmount),
        method: withdrawMethod,
        paymentDetails: withdrawDetails,
        status: "pending",
        type: "withdraw",
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "paymentRequests"), paymentData);
      toast.success("Withdrawal request submitted", { id: toastId });

      // Reset state
      setShowWithdrawModal(false);
      setWithdrawMethod(WITHDRAW_METHODS[0].value);
      setWithdrawDetails("");
      setWithdrawAmount("");
    } catch (err) {
      console.error("Withdraw Error:", err);
      toast.error("Withdrawal failed. Please try again.");
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
            <p>
              $
              {balance !== null
                ? Number(balance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "..."}
            </p>
            <div className="action-butoonsfunds">
              <button onClick={loadChannels}>Add Funds</button>
              <button onClick={() => setShowWithdrawModal(true)}>Withdraw</button>
            </div>
          </div>
        </div>
        <Transactions />
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
            <input
              placeholder="payment proof"
              type="file"
              accept=".png, .jpg, .jpeg, .webp, .gif, .bmp"
              onChange={(e) => setProof(e.target.files[0])}
            />
            <button disabled={submitting} onClick={submitPayment}>
              {submitting ? "Submitting..." : "Send"}
            </button>
            <button className="wallet-modal-close" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Modal 3 - Withdraw */}
      {showWithdrawModal && (
        <motion.div className="wallet-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="wallet-modal" initial={{ y: 100 }} animate={{ y: 0 }}>
            <h3>Withdraw Funds</h3>
            <div >
              <label className="walletSeelction-Method">
                <div>
               <input
                  type="radio"
                  name="withdrawMethod"
                  value="wallet"
                  checked={withdrawMethod === "wallet"}
                  onChange={() => setWithdrawMethod("wallet")}
                />{" "}
               <p>Wallet</p> 
                </div>
              </label>
              <label className="walletSeelction-Method">
                <div>
                 <input
                  type="radio"
                  name="withdrawMethod"
                  value="bank"
                  checked={withdrawMethod === "bank"}
                  onChange={() => setWithdrawMethod("bank")}
                />{" "}
                <p> Bank Transfer</p>
                </div> 
              </label>
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <textarea
              placeholder={
                withdrawMethod === "wallet"
                  ? "Enter your wallet address"
                  : "Enter your bank details"
              }
              value={withdrawDetails}
              onChange={(e) => setWithdrawDetails(e.target.value)}
              style={{ minHeight: 60, marginBottom: 12 }}
            />
            <button disabled={submitting} onClick={submitWithdraw}>
              {submitting ? "Submitting..." : "Send Withdrawal"}
            </button>
            <button className="wallet-modal-close" onClick={() => setShowWithdrawModal(false)}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Wallet;
