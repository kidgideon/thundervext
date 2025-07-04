import "../styles/market.css"
import DashboardNav from "../components/dashboardNav";
import CopyTraders from "../components/copyTraders";
import SmartProfile from "../components/profiles";
import InvestedAssets from "../components/investedassets";
import MarketComponent from "../components/marketComponent";
const Market = () => {
return(
   <div className="user-market-page">
        <DashboardNav/>
   <div className="market">
   <MarketComponent type="market"/>
  <CopyTraders/>
  <SmartProfile/>
  <InvestedAssets/>
   </div>
    </div>
)
}

export default Market;