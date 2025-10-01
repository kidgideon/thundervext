import { useEffect, useState } from "react";
import { db } from "../config/config";
import {collection,getDocs,addDoc,updateDoc,doc,query,where,getDoc,arrayUnion,serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";
import "../styles/ais.css";

const Ais = () => {
  const [ais, setAis] = useState([]);
  const [loadingAi, setLoadingAi] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 🔹 Get logged in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUserId(user.uid);

        // Fetch wallet balance for this user
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setWalletBalance(userSnap.data().walletBalance || 0);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Fetch AI robots
  useEffect(() => {
    const fetchAis = async () => {
      const snapshot = await getDocs(collection(db, "robots"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAis(list);
    };
    fetchAis();
  }, []);

  // 🔹 Handle trade
  const handleTradeAutomatically = async (ai) => {
    if (!walletBalance || !currentUserId) return;

    const tradePrice = parseFloat(ai.tradePrice) || 0;
    if (walletBalance < tradePrice) {
      toast.error(`You need at least $${tradePrice} to trade with this AI.`);
      return;
    }

    setLoadingAi(ai.id);
    const toastId = toast.loading("Opening AI trade session...");

    try {
      const userRef = doc(db, "users", currentUserId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error("User not found");
      const userData = userSnap.data();

      // 1. Create AI trade record
      await addDoc(collection(db, "aiTrades"), {
        userId: currentUserId,
        userName: `${userData.firstName} ${userData.lastName}`,
        aiId: ai.id,
        aiName: ai.name,
        tradePrice: tradePrice,
        profit: ai.profit,
        loss: ai.loss,
        status: "active",
        createdAt: serverTimestamp(),
      });

      // 2. Deduct balance + log transactions
      await updateDoc(userRef, {
        walletBalance: walletBalance - tradePrice,
        transactions: arrayUnion({
          type: "ai-trade",
          text: `You started an AI trade session with ${ai.name}`,
          status: "success",
          date: new Date().toISOString(),
        }),
        notifications: arrayUnion({
          text: `AI Trade session opened with ${ai.name}`,
          date: new Date().toISOString(),
          read: false,
          link: "/wallet",
        }),
      });

      // 3. Notify admins
      const adminSnap = await getDocs(
        query(collection(db, "users"), where("isAdmin", "==", true))
      );
      adminSnap.forEach(async (docSnap) => {
        await updateDoc(doc(db, "users", docSnap.id), {
          notifications: arrayUnion({
            text: `${userData.firstName} ${userData.lastName} opened an AI trade with ${ai.name}.`,
            date: new Date().toISOString(),
            read: false,
            link: "/admin",
          }),
        });
      });

      // 4. Update UI
      setWalletBalance(walletBalance - tradePrice);
      toast.success("AI trade started successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to start AI trade", { id: toastId });
    } finally {
      setLoadingAi(null);
    }
  };

  return (
    <div className="ais-interface-bv-88">
      <h2>Available AI Traders</h2>
      <div className="ais-scrollable-bv-88">
        {ais.map((ai) => (
          <div key={ai.id} className="ai-card-bv-88">
            <img src={ai.imageUrl} alt={ai.name} />
            <h3>{ai.name}</h3>

            <div className="profit-loss-bv-88">
              <p style={{ display: "flex", flexDirection: "column" }}>
                <span className="profit-xxx">{ai.profit}%</span>
                <span style={{ color: "grey" }}>Profit</span>
              </p>
              <p style={{ display: "flex", flexDirection: "column" }}>
                <span className="loss-xxx">{ai.loss}%</span>
                <span style={{ color: "grey" }}>Loss</span>
              </p>
            </div>

            <p>Trade Price: ${ai.tradePrice}</p>

            <button
              onClick={() => handleTradeAutomatically(ai)}
              disabled={loadingAi === ai.id}
            >
              {loadingAi === ai.id ? "Opening trade..." : "Trade Automatically"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ais;
