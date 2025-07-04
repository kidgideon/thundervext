import { toast } from "sonner";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config";

export const usePurchaseAsset = () => {
  const purchase = async ({ userId, asset, unit }) => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.error("User not found");
      return;
    }

    const userData = userSnap.data();
    const price = asset.price;
    const totalCost = unit * price;

    if (userData.walletBalance < totalCost) {
      toast.error("Insufficient balance");

      await updateDoc(userRef, {
        transactions: arrayUnion({
          date: new Date().toISOString(),
          status: "declined",
          type: "investment",
          text: `Failed to invest in ${asset.name} due to insufficient funds.`,
        }),
        notifications: arrayUnion({
          date: new Date().toISOString(),
          text: `Investment in ${asset.name} failed. Insufficient balance.`,
          link: "/wallet",
          read: false,
        }),
      });

      return;
    }

    const toastId = toast.loading("Processing purchase...");

    try {
      const assetEntry = {
        id: asset.id || asset.symbol,
        name: asset.name,
        symbol: asset.symbol,
        type: asset.type,
        price,
        unit,
        total: totalCost,
        date: new Date().toISOString(),
      };

      const updatedBalance = userData.walletBalance - totalCost;

      await updateDoc(userRef, {
        walletBalance: updatedBalance,
        assets: arrayUnion(assetEntry),
        transactions: arrayUnion({
          date: new Date().toISOString(),
          status: "success",
          type: "investment",
          text: `You successfully invested in ${asset.name}`,
        }),
        notifications: arrayUnion({
          date: new Date().toISOString(),
          text: `You successfully invested in ${asset.name}`,
          link: "/portfolio",
          read: false,
        }),
      });

      toast.success("Successfully invested in " + asset.name, { id: toastId });
    } catch (err) {
      toast.error("Purchase failed due to an unexpected error.", { id: toastId });
      console.error("Purchase error:", err);
    }
  };

  return { purchase };
};
