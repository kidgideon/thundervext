import { useEffect, useState } from "react";
import { auth, db } from "../config/config";
import { doc, getDoc } from "firebase/firestore";

const TradePanel = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [pnl, setPnl] = useState(0);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          const balance = userData.walletBalance || 0;
          const pnlValue = userData.pnl || 0;
          const assets = userData.assets || [];

          const investedTotal = assets.reduce((sum, asset) => sum + (asset.total || 0), 0);

          setWalletBalance(balance);
          setPnl(pnlValue);
          setTotalInvested(investedTotal);
        }
      } catch (err) {
        console.error("Error fetching user portfolio:", err);
      }
    };

    fetchPortfolioData();
  }, []);

  const portfolioValue = walletBalance + totalInvested;

  return (
    <div className="tradePanel">
      <div className="availableBalance">
        <p className="mainValue">
          ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="subText">Cash Available</p>
      </div>

      <div className="totalInvested">
        <p className="mainValue">
          ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="subText">Total Invested</p>
      </div>

      <div className="profitLoss">
        <p className={`mainValue ${pnl < 0 ? "pnl-loss" : "pnl-profit"}`}>
          {pnl >= 0 ? "+" : "-"}${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="subText">Profit/Loss</p>
      </div>

      <div className="overallPortfolioBalance">
        <p className="mainValue ovalueBal">
          ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="subText">Portfolio Value</p>
      </div>
    </div>
  );
};

export default TradePanel;
