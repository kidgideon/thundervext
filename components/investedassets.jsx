import "../styles/assets.css";

const InvestedAssets = () => {
  const assets = [
    {
      name: "Bitcoin (BTC)",
      value: "$67,312",
      percentage: "89%",
      description: "The original crypto asset and top store of value.",
    },
    {
      name: "Ethereum (ETH)",
      value: "$3,158",
      percentage: "74%",
      description: "Smart contract platform powering DeFi and NFTs.",
    },
    {
      name: "Solana (SOL)",
      value: "$145",
      percentage: "61%",
      description: "High-speed blockchain for scalable dApps.",
    },
    {
      name: "BNB",
      value: "$580",
      percentage: "54%",
      description: "Utility token powering Binance and its ecosystem.",
    },
    {
      name: "Cardano (ADA)",
      value: "$0.48",
      percentage: "49%",
      description: "Research-driven blockchain focused on sustainability.",
    },
    {
      name: "Polkadot (DOT)",
      value: "$7.40",
      percentage: "41%",
      description: "Interoperable blockchain network for Web3.",
    },
    {
      name: "Avalanche (AVAX)",
      value: "$29.10",
      percentage: "38%",
      description: "Fast, low-cost smart contract platform.",
    },
    {
      name: "Chainlink (LINK)",
      value: "$14.87",
      percentage: "35%",
      description: "Oracle solution bridging blockchains to real-world data.",
    },
    {
      name: "Ripple (XRP)",
      value: "$0.62",
      percentage: "33%",
      description: "Cross-border payment protocol for financial institutions.",
    },
    {
      name: "Litecoin (LTC)",
      value: "$92.50",
      percentage: "28%",
      description: "Bitcoin’s lightweight, faster-processing cousin.",
    },
     {
      name: "Zustang (ZUZ)",
      value: "$30.62",
      percentage: "55%",
      description: "Never under the chart with zuz.",
    },
        {
      name: "Thompsons Coin (TC)",
      value: "$78.62",
      percentage: "45%",
      description: "Trade like a boss, Cross border effieciency ",
    },
  ];

  return (
    <div className="invested-assets-container">
      <div className="tradersTop">
        <h1>Invested Assets</h1>
        <p>These are the most invested assests in our platform as of today</p>
      </div>
      <div className="invested-assets-grid">
        {assets.map((asset, index) => (
          <div className="asset-card" key={index}>
            <div className="asset-header">
              <p className="asset-name">{asset.name}</p>
              <p className="asset-value">{asset.value}</p>
            </div>
            <div className="asset-footer">
              <div className="asset-bar">
                <div
                  className="asset-fill"
                  style={{ width: asset.percentage }}
                ></div>
              </div>
              <p className="asset-percent">{asset.percentage} of investors</p>
            </div>
            <div className="asset-hover-info">
              <p>{asset.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestedAssets;
