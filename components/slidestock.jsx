import "../styles/sliding.css";

const SlideStocks = () => {
  const fakeStocks = [
    { symbol: "AAPL", price: "192.15", change: "+0.21%" },
    { symbol: "TSLA", price: "223.45", change: "-0.47%" },
    { symbol: "AMZN", price: "134.78", change: "+1.05%" },
    { symbol: "GOOGL", price: "2680.12", change: "+0.32%" },
    { symbol: "MSFT", price: "309.85", change: "+0.18%" },
    { symbol: "NVDA", price: "118.92", change: "-1.20%" },
    { symbol: "META", price: "250.65", change: "+2.12%" },
    { symbol: "NFLX", price: "408.55", change: "-0.67%" },
    { symbol: "BTC", price: "63,400", change: "+0.91%" },
    { symbol: "ETH", price: "3,255", change: "+1.18%" },
    { symbol: "SOL", price: "112.23", change: "-0.44%" },
    { symbol: "BNB", price: "505.02", change: "+0.07%" },
    { symbol: "XRP", price: "0.643", change: "-0.18%" },
    { symbol: "DOGE", price: "0.072", change: "+0.55%" },
    { symbol: "ADA", price: "0.358", change: "+1.25%" },
    { symbol: "LTC", price: "88.50", change: "-0.91%" },
    { symbol: "DOT", price: "6.25", change: "+0.12%" },
    { symbol: "AVAX", price: "18.65", change: "+0.33%" },
    { symbol: "MATIC", price: "0.842", change: "-0.08%" },
    { symbol: "SHIB", price: "0.00000821", change: "+0.14%" },
    { symbol: "SNAP", price: "14.62", change: "-0.25%" },
    { symbol: "UBER", price: "44.70", change: "+1.02%" },
    { symbol: "LYFT", price: "10.34", change: "-0.91%" },
    { symbol: "DIS", price: "87.50", change: "+0.66%" },
    { symbol: "INTC", price: "34.20", change: "+0.24%" },
    { symbol: "AMD", price: "98.60", change: "-0.55%" },
    { symbol: "CRM", price: "202.12", change: "+0.41%" },
    { symbol: "ORCL", price: "115.87", change: "+0.37%" },
    { symbol: "SHOP", price: "64.92", change: "-1.08%" },
    { symbol: "BABA", price: "78.44", change: "-0.91%" },
    { symbol: "T", price: "15.26", change: "+0.12%" },
    { symbol: "VZ", price: "34.45", change: "+0.25%" },
    { symbol: "PYPL", price: "60.31", change: "-0.78%" },
    { symbol: "SQ", price: "66.04", change: "+1.44%" },
    { symbol: "ROKU", price: "72.19", change: "-0.67%" },
    { symbol: "ZM", price: "59.88", change: "+0.19%" },
    { symbol: "COIN", price: "151.33", change: "+1.91%" },
    { symbol: "PLTR", price: "17.68", change: "+0.84%" },
    { symbol: "TWLO", price: "56.25", change: "-0.12%" },
    { symbol: "SOFI", price: "9.34", change: "+0.55%" },
    { symbol: "RBLX", price: "30.77", change: "-0.43%" },
    { symbol: "F", price: "12.31", change: "+0.28%" },
    { symbol: "GM", price: "35.92", change: "-0.67%" },
    { symbol: "NIO", price: "7.92", change: "+0.38%" },
    { symbol: "XPEV", price: "8.13", change: "-0.29%" },
    { symbol: "LI", price: "25.43", change: "+0.91%" },
    { symbol: "BYND", price: "11.56", change: "+0.08%" },
    { symbol: "CVNA", price: "35.02", change: "-1.32%" },
    { symbol: "RIVN", price: "12.25", change: "+0.77%" },
    { symbol: "LCID", price: "4.45", change: "-0.04%" },
  ];

  const renderedStocks = [...fakeStocks, ...fakeStocks]; // duplicate for looping

  return (
    <div className="sliding-stocks-component">
      <div className="sliding-track">
        {renderedStocks.map((stock, index) => (
          <div className="stock-item" key={stock.symbol + index}>
            <span className="stock-symbol">{stock.symbol}</span>
            <span className="stock-price">${stock.price}</span>
            <span
              className={`stock-change ${
                stock.change.startsWith("+") ? "positive" : "negative"
              }`}
            >
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideStocks;
