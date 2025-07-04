import { motion } from "framer-motion";
import { useState } from "react";
import {usePurchaseAsset} from "../Hooks/usePurchaseAssets"

const modalStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "400px",
  color: "#000",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.6)",
  zIndex: 999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const PurchaseModal = ({ asset, onClose, userId }) => {
  const [unit, setUnit] = useState(1);
  const { purchase } = usePurchaseAsset();

  const handleBuy = async () => {
    if (!unit || unit <= 0) return;
    await purchase({ userId, asset, unit });
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <motion.div
        style={modalStyle}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#a23cf4" }}>Buy {asset.name}</h2>
        <p>Price per unit: ${asset.price.toFixed(2)}</p>
        <input
          type="number"
          value={unit}
          onChange={(e) => setUnit(Number(e.target.value))}
          placeholder="Enter units"
          style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
        />
        <button
          onClick={handleBuy}
          style={{
            marginTop: "1rem",
            padding: "0.7rem",
            width: "100%",
            background: "#a23cf4",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Confirm Purchase
        </button>
      </motion.div>
    </div>
  );
};
