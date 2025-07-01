import React from "react";
import WorldMap from "react-svg-worldmap";
import "../styles/heat.css";

// Simulate activity for most of the world (only a few shown here, extend it)
const countries = [
  { code: "US", name: "United States" },
  { code: "NG", name: "Nigeria" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "DE", name: "Germany" },
  { code: "RU", name: "Russia" },
  { code: "JP", name: "Japan" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "ZA", name: "South Africa" },
  { code: "AR", name: "Argentina" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "AU", name: "Australia" },
  { code: "EG", name: "Egypt" },
  { code: "KE", name: "Kenya" },
  { code: "KR", name: "South Korea" },
  { code: "TR", name: "Turkey" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "PL", name: "Poland" },
  { code: "UA", name: "Ukraine" },
  { code: "NL", name: "Netherlands" },
  { code: "CH", name: "Switzerland" },
];

const generateHeatData = () =>
  countries.map((c) => ({
    country: c.code,
    value: Math.floor(Math.random() * 1000) + 100, // Every region gets data
  }));

const GeoHeatMap = () => {
  return (
    <div className="geo-map-container">
      <h2 className="geo-map-title">🌍 Global Crypto Trade Activity</h2>
      <WorldMap
        color="#a23cf4"
        backgroundColor="#ffffff"
        data={generateHeatData()}
        valueSuffix=" traders"
        size="responsive"
        frame
        tooltipBgColor="#000"
        tooltipTextColor="#fff"
        tooltipFontSize="300px"
      />
    </div>
  );
};

export default GeoHeatMap;
