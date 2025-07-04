import React, { useEffect, useState } from "react";
import "../styles/crypto.css";
import { auth } from "../config/config";
import { onAuthStateChanged } from "firebase/auth";
import { PurchaseModal } from "../config/Hooks/purchaseModal";

const CRYPTOS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", style: { background: "linear-gradient(135deg, #f7931a, #ffb347)" } },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", style: { background: "linear-gradient(135deg, #627eea, #a29bfe)" } },
  { id: "solana", symbol: "SOL", name: "Solana", style: { background: "linear-gradient(135deg, #fc466b, #3f5efb)" } },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum", style: { background: "linear-gradient(135deg, #ff4b1f, #1fddff)" } },
  { id: "pepe", symbol: "PEPE", name: "Pepe Coin", style: { background: "linear-gradient(135deg, #ff0080, #7928ca)" } },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol", style: { background: "linear-gradient(135deg, #00c6ff, #0072ff)" } },
  { id: "ethereum-classic", symbol: "ETC", name: "Ethereum Classic", style: { background: "linear-gradient(135deg, #f7971e, #ffd200)", color: "black" } },
];

const STOCKS = [
  { symbol: "AAPL", name: "Apple Inc", price: 194.12, change: -0.83, style: { background: "linear-gradient(135deg, #4568dc, #b06ab3)" } },
  { symbol: "TSLA", name: "Tesla Inc", price: 278.43, change: 1.72, style: { background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" } },
  { symbol: "MSFT", name: "Microsoft", price: 366.85, change: -2.15, style: { background: "linear-gradient(135deg, #00b09b, #96c93d)" } },
  { symbol: "AMZN", name: "Amazon", price: 128.59, change: 0.39, style: { background: "linear-gradient(135deg, #ff9966, #ff5e62)" } },
  { symbol: "GOOGL", name: "Alphabet Inc", price: 122.71, change: 0.91, style: { background: "linear-gradient(135deg, #8e2de2, #4a00e0)" } },
];

const MarketComponent = ({ type = "market" }) => {
  const [cryptoData, setCryptoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [userId, setUserId] = useState(null);

  const useCrypto = type === "crypto" || type === "market";
  const useStock = type === "stock" || type === "market";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!useCrypto) return;

    const fetchCrypto = async () => {
      try {
        setLoading(true);
        const ids = CRYPTOS.map(c => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!res.ok) throw new Error("Crypto API error");
        const json = await res.json();
        setCryptoData(json);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch crypto prices");
      } finally {
        setLoading(false);
      }
    };

    fetchCrypto();
  }, [type]);

  const displayedItems = [
    ...(useCrypto
      ? CRYPTOS.map(c => ({
          ...c,
          price: cryptoData[c.id]?.usd,
          change: cryptoData[c.id]?.usd_24h_change,
          type: "crypto",
        }))
      : []),
    ...(useStock
      ? STOCKS.map(s => ({
          ...s,
          type: "stock",
        }))
      : []),
  ];

  return (
    <div className="cryptoComponent">
      <p className="market-p">Market Opportunities</p>
      <h1 className="explpore-m">
        {type === "crypto"
          ? "Explore Cryptocurrencies"
          : type === "stock"
          ? "Explore Stocks"
          : "Explore Markets"}
      </h1>

      <div className="market-items">
        {loading && useCrypto ? (
          <p style={{ padding: "2rem", fontWeight: "bold" }}>Loading market prices...</p>
        ) : error ? (
          <p style={{ color: "red", padding: "2rem" }}>{error}</p>
        ) : (
          <div className="scrollables">
            {displayedItems.map(({ symbol, name, price, change, style, type, id }) => {
              const formattedPrice =
                typeof price === "number"
                  ? `$${price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}`
                  : "N/A";

              const formattedChange =
                typeof change === "number"
                  ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
                  : "—";

              const changeColor =
                typeof change === "number"
                  ? change > 0
                    ? "#0f0"
                    : change < 0
                    ? "#f00"
                    : "#ccc"
                  : "#ccc";

              return (
                <div
                  key={symbol}
                  className="marketItem"
                  style={{ ...style, color: style.color || "#fff", cursor: "pointer" }}
                  onClick={() =>
                    price &&
                    setSelectedAsset({ id: id || symbol.toLowerCase(), symbol, name, price, type })
                  }
                >
                  <h1>{symbol}</h1>
                  <div className="boldItemsMrkt">
                    <p>{name}</p>
                    <p>{formattedPrice}</p>
                  </div>
                  <div className="lightItemsMrkt">
                    <p>{type === "stock" ? "Equity" : "24h Change"}</p>
                    <p style={{ color: changeColor }}>{formattedChange}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedAsset && (
        <PurchaseModal
          asset={selectedAsset}
          userId={userId}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
};

export default MarketComponent;
