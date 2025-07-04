import "../styles/crypto.css";
import DashboardNav from "../components/dashboardNav";
import CopyTraders from "../components/copyTraders";
import InvestedAssets from "../components/investedassets";
import SmartProfile from "../components/profiles";
import MarketComponent from "../components/marketComponent";

const Crypto = () => {
    return (
        <div className="user-market-page">
             <DashboardNav />
            <div className="market">
              <MarketComponent type="crypto"/>
                 <CopyTraders />
                <SmartProfile />
                <InvestedAssets />
            </div>
        </div>
    );
};

export default Crypto;
