import "../styles/portfolio.css";
import { useEffect, useState } from "react";
import { auth, db } from "../config/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DashboardNav from "../components/dashboardNav";
import SmartProfile from "../components/profiles";
import CopyTraders from "../components/copyTraders";
import GeoHeatMap from "../components/heatmap";
import Transactions from "../components/transactions";

const SkeletonCard = () => (
  <div className="marketItem skeleton">
    <div className="skeleton-title shimmer" />
    <div className="skeleton-line shimmer" />
    <div className="skeleton-line short shimmer" />
  </div>
);

const Portfolio = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAssets([]);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          if (!Array.isArray(data.assets)) {
            await setDoc(userRef, { assets: [] }, { merge: true });
            setAssets([]);
          } else {
            setAssets(data.assets);
            console.log("Loaded assets:", data.assets);
          }
        } else {
          await setDoc(userRef, { assets: [] }, { merge: true });
          setAssets([]);
        }
      } catch (err) {
        console.error("Failed to load assets:", err);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="portfolio-interface-area">
      <div className="area">
        <DashboardNav />
        <div className="market-items">
          <p className="market-p">Investment Opportunities</p>
          <h1 className="explpore-m">Stocks and Crypto Portfolio</h1>
          <div className="scrollables">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : assets.length === 0 ? (
              <p style={{ color: "gray", fontStyle: "italic" }}>You have no assets yet.</p>
            ) : (
              assets.map((asset, index) => {
                const {
                  name,
                  symbol,
                  totalQuantity,
                  averageBuyPrice,
                  currentMarketPrice,
                  assetType,
                } = asset;

                const quantity = parseFloat(totalQuantity);
                const buyPrice = parseFloat(averageBuyPrice);
                const marketPrice = parseFloat(currentMarketPrice);

                console.log(`Asset ${index + 1}: ${symbol}`);
                console.log("  quantity:", quantity, typeof quantity);
                console.log("  buyPrice:", buyPrice, typeof buyPrice);
                console.log("  marketPrice:", marketPrice, typeof marketPrice);

                const valid =
                  !isNaN(quantity) && !isNaN(buyPrice) && !isNaN(marketPrice);

                const totalValue = valid ? quantity * marketPrice : 0;
                const totalCost = valid ? quantity * buyPrice : 0;
                const profit = totalValue - totalCost;
                const profitPercent =
                  valid && totalCost !== 0
                    ? ((profit / totalCost) * 100).toFixed(2)
                    : "N/A";

                const gradient = [
                  "linear-gradient(135deg, #1f4037, #99f2c8)",
                  "linear-gradient(135deg, #000428, #004e92)",
                  "linear-gradient(135deg, #614385, #516395)",
                  "linear-gradient(135deg, #396afc, #2948ff)",
                  "linear-gradient(135deg, #e53935, #e35d5b)",
                  "linear-gradient(135deg, #0f2027, #2c5364)",
                ][index % 6];

                return (
                  <div
                    key={index}
                    className="marketItem"
                    style={{
                      background: gradient,
                      color: "white",
                      borderRadius: "15px",
                      padding: "20px",
                      width: "250px",
                      marginRight: "20px",
                    }}
                  >
                    <h1>{symbol}</h1>
                    <div className="boldItemsMrkt">
                      <p>{name}</p>
                      <p>{valid ? `$${marketPrice.toLocaleString()}` : "$N/A"}</p>
                    </div>
                    <div className="lightItemsMrkt">
                      <p>{assetType?.toUpperCase() || "N/A"}</p>
                      <p style={{ color: profit >= 0 ? "#7CFC00" : "#FF6347" }}>
                        {profitPercent !== "N/A" ? `${profit >= 0 ? "+" : ""}${profitPercent}%` : "N/A"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <Transactions/>
        <CopyTraders/>
        <SmartProfile/>
        <GeoHeatMap/>
      </div>
    </div>
  );
};

export default Portfolio;
