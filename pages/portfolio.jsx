import "../styles/portfolio.css";
import { useEffect, useState } from "react";
import { auth, db } from "../config/config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DashboardNav from "../components/dashboardNav";
import SmartProfile from "../components/profiles";
import CopyTraders from "../components/copyTraders";
import GeoHeatMap from "../components/heatmap";
import Transactions from "../components/transactions";
import TradePanel from "../components/userTradePanel";

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
  const [livePrices, setLivePrices] = useState({});

  // Fetch user assets
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
          if (Array.isArray(data.assets)) {
            setAssets(data.assets);
          } else {
            setAssets([]);
          }
        } else {
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

  // Fetch live crypto prices
  useEffect(() => {
    const cryptoIds = assets
      .filter(a => a.type === "crypto" && a.id)
      .map(a => a.id.toLowerCase());

    if (cryptoIds.length === 0) return;

    const fetchPrices = async () => {
      try {
        const idsParam = cryptoIds.join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd`
        );
        const json = await res.json();
        setLivePrices(json);
      } catch (err) {
        console.error("Failed to fetch live crypto prices:", err);
      }
    };

    fetchPrices();
  }, [assets]);

  return (
    <div className="portfolio-interface-area">
      <div className="area">
        <DashboardNav />
        <div className="market-items">
          <p className="market-p">Your Investments</p>
          <h1 className="explpore-m">Stocks and Crypto Portfolio</h1>
          <div className="scrollables">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : assets.length === 0 ? (
              <p style={{ color: "gray", fontStyle: "italic" }}>You have no assets yet.</p>
            ) : (
              assets.map((asset, index) => {
                const { name, symbol, unit, price, type, total, id } = asset;

                const gradient = [
                  "linear-gradient(135deg, #1f4037, #99f2c8)",
                  "linear-gradient(135deg, #000428, #004e92)",
                  "linear-gradient(135deg, #614385, #516395)",
                  "linear-gradient(135deg, #396afc, #2948ff)",
                  "linear-gradient(135deg, #e53935, #e35d5b)",
                  "linear-gradient(135deg, #0f2027, #2c5364)",
                ][index % 6];

                // Get live price
                const livePrice =
                  type === "crypto" && id && livePrices[id?.toLowerCase()]
                    ? livePrices[id.toLowerCase()].usd
                    : price;

                const totalValue = livePrice * unit;
                const cost = price * unit;
                const profit = totalValue - cost;
                const profitPercent = cost !== 0 ? ((profit / cost) * 100).toFixed(2) : "N/A";

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
                      <p>${livePrice.toLocaleString()}</p>
                    </div>
                    <div className="lightItemsMrkt">
                      <p>{type?.toUpperCase() || "N/A"}</p>
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

        <Transactions />
        <CopyTraders />
        <SmartProfile />
        <GeoHeatMap />
        <TradePanel/>
      </div>
    </div>
  );
};

export default Portfolio;
