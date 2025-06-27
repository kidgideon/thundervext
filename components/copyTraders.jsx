import "../styles/copy.css";
import { useEffect, useState } from "react";
import { db } from "../config/config";
import { collection, getDocs } from "firebase/firestore";

const CopyTraders = () => {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "traders"));
        const fetchedTraders = [];
        querySnapshot.forEach((doc) => {
          fetchedTraders.push(doc.data());
        });
        setTraders(fetchedTraders);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch traders:", error);
      }
    };

    fetchTraders();
  }, []);

  const SkeletonLoader = () => (
    <div className="trader skeleton">
      <div className="traders-image skeleton-img" />
      <div className="traders-name">
        <div className="skeleton-line short" />
        <div className="skeleton-line shorter" />
      </div>
      <div className="return-on-investment">
        <div className="skeleton-line short" />
        <div className="skeleton-line short" />
      </div>
      <div className="return-label">
        <div className="skeleton-line tiny" />
        <div className="skeleton-line tiny" />
      </div>
    </div>
  );

  return (
    <div className="copyTraders">
      <div className="tradersTop">
        <h1>CopyTrader™</h1>
        <p>Mirror the portfolio of other crypto investors</p>
      </div>

      <div className="traders">
        <div className="scrollables">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonLoader key={i} />)
            : traders.map((trader, index) => (
                <div className="trader" key={index}>
                  <div className="traders-image">
                    <img src={trader.picture} alt={`${trader.firstName} ${trader.lastName}`} />
                  </div>

                  <div className="traders-name">
                    <p className="traders-name-bold">
                      {trader.firstName} {trader.lastName}
                    </p>
                    <p className="username">@{trader.username}</p>
                  </div>

                  <div className="return-on-investment">
                    <h1 className="green">{trader.profit}%</h1>
                    <h1 className="red">{trader.risk}%</h1>
                  </div>

                  <div className="return-label">
                    <p>Profit</p>
                    <p>Loss</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CopyTraders;
