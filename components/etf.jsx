import React, { useEffect, useState } from "react";
import "../styles/etf.css";

const generateDummyETFs = (count) => {
  const assets = ["Equity", "Bond", "Commodity"];
  const etfs = [];
  for (let i = 1; i <= count; i++) {
    etfs.push({
      id: i,
      name: `ETF ${i}`,
      ticker: `ETF${i}`,
      class: assets[i % assets.length],
      return1Y: +(Math.random() * 20 - 10).toFixed(2), // -10% to +10%
      ter: +(Math.random() * 0.5).toFixed(2),
      holdings: Math.floor(Math.random() * 5000),
      aum: `$${(Math.random() * 100).toFixed(2)}B`,
      range52w: [+(Math.random() * 100).toFixed(2), +(100 + Math.random() * 100).toFixed(2)],
      dividend: +(Math.random() * 5).toFixed(2),
    });
  }
  return etfs;
};

const FILTERS = {
  ucits: ["UCITS Only", "Non-UCITS"],
  assetClass: ["Equity", "Bond", "Commodity"],
  dividend: ["> 2%", "< 2%", "0%"],
};

const Etf = () => {
  const [data, setData] = useState(generateDummyETFs(400));
  const [filters, setFilters] = useState({ ucits: "UCITS Only", assetClass: "", dividend: "" });
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev =>
        prev.map(etf => ({
          ...etf,
          return1Y: +(etf.return1Y + (Math.random() - 0.5)).toFixed(2),
          dividend: +(etf.dividend + (Math.random() - 0.25)).toFixed(2),
        }))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const filtered = data.filter((etf) => {
    const divFilter = filters.dividend;
    const passDividend =
      !divFilter ||
      (divFilter === "> 2%" && etf.dividend > 2) ||
      (divFilter === "< 2%" && etf.dividend < 2) ||
      (divFilter === "0%" && etf.dividend === 0);

    return (
      (!filters.assetClass || etf.class === filters.assetClass) &&
      passDividend
    );
  });

  const handleFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="etf-component">
      <h2 className="etf-title">ETF Overview</h2>

      <div className="etf-filters">
        <select onChange={e => handleFilter("assetClass", e.target.value)}>
          <option value="">Asset Classes</option>
          {FILTERS.assetClass.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select onChange={e => handleFilter("dividend", e.target.value)}>
          <option value="">Dividend Yield</option>
          {FILTERS.dividend.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="etf-table">
        <div className="etf-row etf-head">
          <span>Logo</span>
          <span>Ticker</span>
          <span>Class</span>
          <span>Return 1Y</span>
          <span>TER</span>
          <span># Holdings</span>
          <span>AUM</span>
          <span>52W Range</span>
          <span>Dividend</span>
        </div>

        {filtered.slice(0, visibleCount).map(etf => (
          <div key={etf.id} className="etf-row">
            <span className="etf-logo" style={{
              background: `linear-gradient(135deg, hsl(${Math.random()*360}, 100%, 60%), hsl(${Math.random()*360}, 100%, 40%))`
            }}>{etf.ticker.slice(0, 3)}</span>
            <span>{etf.ticker}</span>
            <span>{etf.class}</span>
            <span style={{ color: etf.return1Y >= 0 ? 'limegreen' : 'crimson' }}>{etf.return1Y}%</span>
            <span>{etf.ter}%</span>
            <span>{etf.holdings}</span>
            <span>{etf.aum}</span>
            <span>{etf.range52w[0]} - {etf.range52w[1]}</span>
            <span>{etf.dividend}%</span>
          </div>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <button className="etf-load-more" onClick={() => setVisibleCount(visibleCount + 10)}>
          Show More
        </button>
      )}
    </div>
  );
};

export default Etf;
